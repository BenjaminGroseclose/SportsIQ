"""Walk-forward feature ablation: replay the eval seasons with and without a
set of margin features and report what changed.

Usage:
    python -m cfb.ablate fpi_prior_diff [more_features ...]
                         [--train-seasons ...] [--eval-seasons 2024 2025]

Both runs use exactly the weekly walk-forward replay cfb.train evaluates
with, so the "with" column reproduces the production evaluation. On ~1,500
replay games a margin-MAE delta under about 0.05 is noise; weigh the
standardized coefficient and the weeks 1-3 phase (where prior-season
features carry the most weight) alongside the headline number.
"""
from __future__ import annotations

import argparse
import warnings

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error

from .features import MARGIN_FEATURES, RESID_FEATURES, build_training_frame
from .train import (
    DEFAULT_EVAL_SEASONS,
    DEFAULT_TRAIN_SEASONS,
    WEEK_PHASES,
    _new_model,
    ats_backtest,
    walk_forward,
)


def summarize(replay: pd.DataFrame) -> dict:
    """Headline replay metrics, mirroring cfb.train's printout."""
    out = {
        "games": len(replay),
        "margin MAE": mean_absolute_error(replay["margin"], replay["pred_margin"]),
        "winner accuracy": float(
            (np.sign(replay["pred_margin"]) == np.sign(replay["margin"])).mean()
        ),
    }
    for label, lo, hi in WEEK_PHASES:
        sel = replay[(replay["week"] >= lo) & (replay["week"] <= hi)]
        out[f"MAE {label}"] = (
            mean_absolute_error(sel["margin"], sel["pred_margin"]) if len(sel) else np.nan
        )
    lined = replay.dropna(subset=["market_margin", "market_edge"]).copy()
    out["lined_games"] = len(lined)
    out["pure MAE (lined)"] = mean_absolute_error(lined["margin"], lined["pred_margin"])
    out["market-aware MAE"] = mean_absolute_error(
        lined["margin"], lined["market_margin"] + lined["market_edge"]
    )
    lined["edge"] = lined["pred_margin"] - lined["market_margin"]
    lined["cover_margin"] = lined["margin"] - lined["market_margin"]
    bets = lined[lined["cover_margin"] != 0].copy()
    bets["ats_win"] = np.sign(bets["edge"]) == np.sign(bets["cover_margin"])
    out["ats"] = {b["bucket"]: b for b in ats_backtest(bets)}
    return out


def _fmt(key: str, v: float) -> str:
    return f"{v:.1%}" if key == "winner accuracy" else f"{v:.3f}"


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("features", nargs="+", help="margin features removed in the 'without' run")
    parser.add_argument("--train-seasons", type=int, nargs="+", default=DEFAULT_TRAIN_SEASONS)
    parser.add_argument("--eval-seasons", type=int, nargs="+", default=DEFAULT_EVAL_SEASONS)
    args = parser.parse_args()
    # Empty week-1 slices and all-NA optional columns trip a pandas concat
    # dtype FutureWarning on every replay week; it is noise here.
    warnings.filterwarnings("ignore", category=FutureWarning)

    unknown = [f for f in args.features if f not in MARGIN_FEATURES]
    if unknown:
        parser.error(f"not margin features: {unknown}\nknown: {MARGIN_FEATURES}")

    print(f"building training frames for {args.train_seasons} ...")
    frames = {y: build_training_frame([y], quiet=True) for y in args.train_seasons}
    all_rows = pd.concat(frames.values(), ignore_index=True)
    for f in args.features:
        nonzero = float((all_rows[f] != 0).mean())
        print(f"  {f}: non-zero in {nonzero:.1%} of {len(all_rows)} training rows")

    without_m = [f for f in MARGIN_FEATURES if f not in args.features]
    without_r = [f for f in RESID_FEATURES if f not in args.features]
    print(f"replaying {args.eval_seasons} without {args.features} ...")
    base = summarize(
        walk_forward(
            args.train_seasons, args.eval_seasons, verbose=False,
            margin_features=without_m, resid_features=without_r, frames=frames,
        )
    )
    print("replaying with the full feature set ...")
    full = summarize(
        walk_forward(args.train_seasons, args.eval_seasons, verbose=False, frames=frames)
    )

    print(f"\n{base['games']} replay games, {base['lined_games']} with a closing line")
    print(f"{'metric':<22}{'without':>10}{'with':>10}{'delta':>9}")
    for key in [k for k in full if k not in ("games", "lined_games", "ats")]:
        print(
            f"{key:<22}{_fmt(key, base[key]):>10}{_fmt(key, full[key]):>10}"
            f"{full[key] - base[key]:>+9.3f}"
        )

    print("\nATS win% by pure-model |edge| (breakeven 52.4%):")
    print(f"{'bucket':<12}{'without':>16}{'with':>16}")
    for bucket in full["ats"]:
        b, w = base["ats"].get(bucket), full["ats"][bucket]
        b_txt = f"{b['ats_win_pct']}% ({b['bets']})" if b else "-"
        print(f"{bucket:<12}{b_txt:>16}{f'{w['ats_win_pct']}% ({w['bets']})':>16}")

    mm = _new_model().fit(all_rows[MARGIN_FEATURES], all_rows["margin"])
    coefs = pd.Series(mm[-1].coef_, index=MARGIN_FEATURES)
    print("\nstandardized margin-model coefficients, full fit on all training seasons:")
    for name, c in coefs.reindex(coefs.abs().sort_values(ascending=False).index).items():
        print(f"  {name:<24}{c:>8.3f}{'   <- ablated' if name in args.features else ''}")


if __name__ == "__main__":
    main()
