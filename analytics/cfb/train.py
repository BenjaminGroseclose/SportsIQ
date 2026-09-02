"""Train the margin, total, and market-residual models; backtest honestly.

Usage:
    python -m cfb.train [--train-seasons ...] [--eval-seasons 2024 2025]

Three models are produced:
  margin_model  - pure model: predicts home margin from team features only
  total_model   - predicts combined points
  resid_model   - market-aware: sees the closing line and predicts where the
                  market is wrong (residual = actual margin - market margin)

Evaluation is a walk-forward replay: for every week of the eval seasons the
models are refit on all games strictly before that week and tested on that
week alone — exactly how the system runs in production. The final production
models are then fit on everything.
"""
from __future__ import annotations

import argparse
import json
import pickle

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from .config import MODEL_DIR, OUTPUT_DIR
from .features import MARGIN_FEATURES, RESID_FEATURES, TOTAL_FEATURES, build_training_frame

# 2020 is excluded as a target season (COVID: short schedules, opt-outs).
DEFAULT_TRAIN_SEASONS = [2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025]
DEFAULT_EVAL_SEASONS = [2024, 2025]

EDGE_BUCKETS = [(1, 3), (3, 5), (5, 8), (8, 99)]

WEEK_PHASES = [("weeks 1-3", 1, 3), ("weeks 4-8", 4, 8), ("weeks 9+", 9, 99)]


def _new_model():
    return make_pipeline(StandardScaler(), Ridge(alpha=10.0))


def walk_forward(
    seasons: list[int],
    eval_seasons: list[int],
    verbose: bool = True,
    margin_features: list[str] | None = None,
    total_features: list[str] | None = None,
    resid_features: list[str] | None = None,
    frames: dict[int, pd.DataFrame] | None = None,
) -> pd.DataFrame:
    """Replay the eval seasons week by week: fit on everything strictly
    earlier, predict that week. Returns one row per evaluated game with
    pred_margin and (where lined) market_edge.

    Feature lists default to the production sets. `frames` (season -> training
    frame) lets cfb.ablate build the frames once and replay several variants.
    """
    margin_features = margin_features or MARGIN_FEATURES
    total_features = total_features or TOTAL_FEATURES
    resid_features = resid_features or RESID_FEATURES
    log = print if verbose else (lambda *a, **k: None)
    if frames is None:
        frames = {y: build_training_frame([y], quiet=True) for y in seasons}

    out = []
    for year in eval_seasons:
        past = [frames[y] for y in seasons if y < year]
        season_df = frames[year]
        for week in sorted(season_df["week"].unique()):
            pool = pd.concat(past + [season_df[season_df["week"] < week]], ignore_index=True)
            test = season_df[season_df["week"] == week].copy()

            mm = _new_model()
            mm.fit(pool[margin_features], pool["margin"])
            test["pred_margin"] = mm.predict(test[margin_features])

            tm = _new_model()
            tm.fit(pool[total_features], pool["total"])
            test["pred_total"] = tm.predict(test[total_features])

            pool_lined = pool.dropna(subset=["market_margin"]).copy()
            pool_lined["resid"] = pool_lined["margin"] - pool_lined["market_margin"]
            rm = _new_model()
            rm.fit(pool_lined[resid_features], pool_lined["resid"])
            lined_mask = test["market_margin"].notna()
            test.loc[lined_mask, "market_edge"] = rm.predict(
                test.loc[lined_mask, resid_features]
            )
            out.append(test)
        log(f"  replayed {year}: {sum(len(t) for t in out)} games cumulative")
    return pd.concat(out, ignore_index=True)


def ats_backtest(lined: pd.DataFrame) -> list[dict]:
    """Score an edge column against actual outcomes, by |edge| bucket. Works
    for both spread bets (edge/ats_win) and totals bets given the same column
    names."""
    rows = []
    for lo, hi in EDGE_BUCKETS:
        sel = lined[(lined["edge"].abs() >= lo) & (lined["edge"].abs() < hi)]
        if len(sel) == 0:
            continue
        p = float(sel["ats_win"].mean())
        ci = 1.96 * np.sqrt(p * (1 - p) / len(sel))
        rows.append(
            {
                "bucket": f"{lo}-{hi if hi < 99 else '+'} pts",
                "bets": len(sel),
                "ats_wins": int(sel["ats_win"].sum()),
                "ats_win_pct": round(p * 100, 1),
                "ci_low": round((p - ci) * 100, 1),
                "ci_high": round((p + ci) * 100, 1),
            }
        )
    return rows


def run_training(
    train_seasons: list[int] | None = None,
    eval_seasons: list[int] | None = None,
    extra_seasons: list[int] | None = None,
    verbose: bool = True,
) -> dict:
    """Walk-forward evaluate, then fit production models on ALL data.

    extra_seasons: additional seasons whose *completed* games join the final
    production fit (used by cfb.weekly to fold the current season in).
    """
    train_seasons = train_seasons or DEFAULT_TRAIN_SEASONS
    eval_seasons = eval_seasons or DEFAULT_EVAL_SEASONS
    extra_seasons = extra_seasons or []
    log = print if verbose else (lambda *a, **k: None)

    # --- walk-forward evaluation: the production process, replayed ---
    log(f"Walk-forward replay of {eval_seasons} (fit on everything strictly earlier) ...")
    replay = walk_forward(train_seasons, eval_seasons, verbose)

    eval_mae = float(mean_absolute_error(replay["margin"], replay["pred_margin"]))
    winner_acc = float(
        (np.sign(replay["pred_margin"]) == np.sign(replay["margin"])).mean()
    )
    sigma = float((replay["margin"] - replay["pred_margin"]).std())
    log(f"replay: {len(replay)} games, margin MAE {eval_mae:.2f}, "
        f"winner acc {winner_acc:.1%}, sigma {sigma:.1f}")

    mae_by_phase = []
    for label, lo, hi in WEEK_PHASES:
        sel = replay[(replay["week"] >= lo) & (replay["week"] <= hi)]
        if len(sel):
            mae_by_phase.append(
                {"phase": label, "games": len(sel),
                 "mae": round(float(mean_absolute_error(sel["margin"], sel["pred_margin"])), 2)}
            )
    log("by season phase: " + ", ".join(f"{p['phase']} {p['mae']}" for p in mae_by_phase))

    lined = replay.dropna(subset=["market_margin", "market_edge"]).copy()
    market_mae = float(mean_absolute_error(lined["margin"], lined["market_margin"]))
    aware_mae = float(
        mean_absolute_error(lined["margin"], lined["market_margin"] + lined["market_edge"])
    )
    resid_sigma = float(
        (lined["margin"] - lined["market_margin"] - lined["market_edge"]).std()
    )
    log(f"\nmargin MAE on {len(lined)} lined replay games:")
    log(f"  market (closing spread): {market_mae:.2f}")
    log(f"  market + residual model: {aware_mae:.2f}")
    log(f"  pure model:              "
        f"{mean_absolute_error(lined['margin'], lined['pred_margin']):.2f}")

    # --- ATS backtest on the pure model's disagreement (the board's edge) ---
    lined["edge"] = lined["pred_margin"] - lined["market_margin"]
    lined["cover_margin"] = lined["margin"] - lined["market_margin"]
    bets = lined[lined["cover_margin"] != 0].copy()  # drop pushes
    bets["ats_win"] = np.sign(bets["edge"]) == np.sign(bets["cover_margin"])
    buckets = ats_backtest(bets)
    log("\nATS backtest by pure-model |edge| (breakeven at -110 is 52.4%):")
    for b in buckets:
        log(f"  {b['bucket']:>9}: {b['ats_wins']}/{b['bets']} = {b['ats_win_pct']}% "
            f"(95% CI {b['ci_low']}-{b['ci_high']}%)")

    bets_out = OUTPUT_DIR / "backtest_walkforward.csv"
    bets[
        ["season", "week", "homeTeam", "awayTeam", "margin", "market_margin",
         "edge", "market_edge", "cover_margin", "ats_win"]
    ].to_csv(bets_out, index=False)

    # --- totals: replay MAE vs the market number, and O/U hit rate ---
    total_mae = float(mean_absolute_error(replay["total"], replay["pred_total"]))
    t_lined = replay.dropna(subset=["market_total"]).copy()
    market_total_mae = float(
        mean_absolute_error(t_lined["total"], t_lined["market_total"])
    )
    model_total_mae = float(mean_absolute_error(t_lined["total"], t_lined["pred_total"]))
    log(f"\ntotal MAE on {len(t_lined)} totaled replay games:")
    log(f"  market (closing total): {market_total_mae:.2f}")
    log(f"  model:                  {model_total_mae:.2f}")

    t_bets = t_lined[t_lined["total"] != t_lined["market_total"]].copy()  # drop pushes
    t_bets["edge"] = t_bets["pred_total"] - t_bets["market_total"]
    t_bets = t_bets[t_bets["edge"] != 0]
    t_bets["ats_win"] = np.sign(t_bets["edge"]) == np.sign(
        t_bets["total"] - t_bets["market_total"]
    )
    ou_buckets = ats_backtest(t_bets)
    log("O/U backtest by model |total edge| (breakeven at -110 is 52.4%):")
    for b in ou_buckets:
        log(f"  {b['bucket']:>9}: {b['ats_wins']}/{b['bets']} = {b['ats_win_pct']}% "
            f"(95% CI {b['ci_low']}-{b['ci_high']}%)")

    # --- production models: fit on everything available ---
    log(f"\nFitting production models on {train_seasons + extra_seasons} ...")
    full = build_training_frame(train_seasons + extra_seasons, quiet=not verbose)
    log(f"production training games: {len(full)}")

    margin_model = _new_model()
    margin_model.fit(full[MARGIN_FEATURES], full["margin"])
    total_model = _new_model()
    total_model.fit(full[TOTAL_FEATURES], full["total"])
    full_lined = full.dropna(subset=["market_margin"]).copy()
    full_lined["resid"] = full_lined["margin"] - full_lined["market_margin"]
    resid_model = _new_model()
    resid_model.fit(full_lined[RESID_FEATURES], full_lined["resid"])

    for name, model in [
        ("margin_model", margin_model),
        ("total_model", total_model),
        ("resid_model", resid_model),
    ]:
        with open(MODEL_DIR / f"{name}.pkl", "wb") as f:
            pickle.dump(model, f)

    meta = {
        "margin_model": "ridge",
        "train_seasons": train_seasons,
        "extra_seasons": extra_seasons,
        "holdout_season": "–".join(str(y) for y in eval_seasons),
        "eval_scheme": "walk-forward weekly replay",
        "eval_games": len(replay),
        "train_games": len(full),
        "margin_features": MARGIN_FEATURES,
        "total_features": TOTAL_FEATURES,
        "resid_features": RESID_FEATURES,
        "holdout_margin_mae": round(eval_mae, 3),
        "holdout_winner_accuracy": round(winner_acc, 4),
        "margin_sigma": round(sigma, 2),
        "resid_sigma": round(resid_sigma, 2),
        "market_margin_mae": round(market_mae, 3),
        "aware_margin_mae": round(aware_mae, 3),
        "mae_by_phase": mae_by_phase,
        "ats_buckets": buckets,
        "holdout_total_mae": round(total_mae, 3),
        "market_total_mae": round(market_total_mae, 3),
        "lined_total_mae": round(model_total_mae, 3),
        "ou_buckets": ou_buckets,
    }
    with open(MODEL_DIR / "model_meta.json", "w") as f:
        json.dump(meta, f, indent=2)
    log(f"\nsaved models + metadata to {MODEL_DIR}, backtest detail to {bets_out}")
    return meta


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train-seasons", type=int, nargs="+", default=DEFAULT_TRAIN_SEASONS)
    parser.add_argument("--eval-seasons", type=int, nargs="+", default=DEFAULT_EVAL_SEASONS)
    args = parser.parse_args()
    run_training(args.train_seasons, args.eval_seasons)


if __name__ == "__main__":
    main()
