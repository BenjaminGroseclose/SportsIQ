"""Predict a week's games and find edges vs the betting market.

Usage:
    python -m cfb.predict --year 2026 --week 1 [--season-type regular] [--no-refresh]

Writes three CSVs to output/:
    predictions_{year}_wk{week}.csv  - every FBS matchup, predicted winner/margin/total
    edges_{year}_wk{week}.csv        - lined games with signed model-vs-market edge
    rankings_{year}_wk{week}.csv     - every FBS team ranked by model power rating
"""
from __future__ import annotations

import argparse
import json
import math
import pickle

import numpy as np
import pandas as pd

from . import data
from .config import MODEL_DIR, OUTPUT_DIR
from .features import build_matchup_features, neutral_round_robin_features, team_snapshot


def week_slug(year: int, week: int, season_type: str = "regular") -> str:
    prefix = "wk" if season_type == "regular" else "post"
    return f"{year}_{prefix}{week}"


def edge_tier(abs_edge: float) -> str:
    if abs_edge >= 8:
        return "extreme"
    if abs_edge >= 5:
        return "strong"
    if abs_edge >= 3:
        return "moderate"
    if abs_edge >= 1:
        return "lean"
    return "none"


def home_win_prob(pred_margin: float, sigma: float) -> float:
    return 0.5 * (1 + math.erf(pred_margin / (sigma * math.sqrt(2))))


def load_models():
    models = {}
    for name in ("margin_model", "total_model", "resid_model"):
        with open(MODEL_DIR / f"{name}.pkl", "rb") as f:
            models[name] = pickle.load(f)
    with open(MODEL_DIR / "model_meta.json") as f:
        meta = json.load(f)
    return models, meta


def predict_week(
    year: int, week: int, season_type: str = "regular", refresh: bool = True
) -> tuple[pd.DataFrame, pd.DataFrame]:
    models, meta = load_models()

    games = data.get_games(year, season_type, force=refresh)
    games = games[games["week"] == week].copy()
    if games.empty:
        raise SystemExit(f"No FBS games found for {year} {season_type} week {week}.")

    if refresh:
        # Weather rows for upcoming games are forecasts — refetch so the cache
        # build_matchup_features reads is current. Never fatal: a failed fetch
        # just leaves neutral weather features.
        try:
            data.get_weather(year, force=True)
        except Exception as e:  # noqa: BLE001 - degrade, don't block predictions
            print(f"note: weather refresh failed ({e}); using cached/neutral weather")

    df = build_matchup_features(games, year, week, season_type)

    feats = sorted(set(meta["margin_features"] + meta["total_features"]))
    missing = df[feats].isna().any(axis=1)
    if missing.any():
        names = df.loc[missing, ["homeTeam", "awayTeam"]].agg(" vs ".join, axis=1).tolist()
        print(f"note: imputing neutral features for {missing.sum()} games "
              f"with incomplete data: {names}")
    # Diff features impute to 0 (an even matchup). Sum features impute to the
    # slate median (an average game): training drops rows with missing sums, so
    # an all-zero sum row is far outside anything the totals model has seen and
    # extrapolates to nonsense (e.g. negative scores for FBS newcomers).
    for col in feats:
        if col.endswith("_sum"):
            df[col] = df[col].fillna(df[col].median())
    df[feats] = df[feats].fillna(0.0)

    sigma = meta["margin_sigma"]
    df["pred_margin"] = models["margin_model"].predict(df[meta["margin_features"]]).round(1)
    df["pred_total"] = models["total_model"].predict(df[meta["total_features"]]).round(1)
    df["pred_home_points"] = ((df["pred_total"] + df["pred_margin"]) / 2).round(1)
    df["pred_away_points"] = ((df["pred_total"] - df["pred_margin"]) / 2).round(1)
    df["pred_winner"] = np.where(df["pred_margin"] >= 0, df["homeTeam"], df["awayTeam"])
    df["pred_win_by"] = df["pred_margin"].abs()
    df["home_win_prob"] = df["pred_margin"].apply(lambda m: round(home_win_prob(m, sigma), 3))
    df["data_imputed"] = missing.values

    pred_cols = [
        "season", "week", "startDate", "homeTeam", "awayTeam", "neutralSite",
        "pred_winner", "pred_win_by", "pred_margin", "pred_home_points",
        "pred_away_points", "pred_total", "home_win_prob", "data_imputed",
    ]
    predictions = df[pred_cols].sort_values("startDate").reset_index(drop=True)

    lines = data.get_lines(year, week=week, season_type=season_type, force=refresh)
    edges = df.merge(
        lines[["homeTeam", "awayTeam", "provider", "spread", "formattedSpread",
               "overUnder", "homeMoneyline", "awayMoneyline"]],
        on=["homeTeam", "awayTeam"],
        how="inner",
    ).dropna(subset=["spread"])

    # spread is the home handicap (negative = home favored), so the market's
    # implied home margin is -spread. edge = pure model minus market (positive
    # = model likes the home side more than the market). market_edge is the
    # residual model's prediction of the line's error after *seeing* the line;
    # cover_prob is that model's probability that the flagged side covers.
    edges["market_margin"] = -edges["spread"]
    edges["edge"] = (edges["pred_margin"] - edges["market_margin"]).round(1)
    edges["market_edge"] = models["resid_model"].predict(edges[meta["resid_features"]]).round(1)
    edges["cover_prob"] = [
        round(home_win_prob(np.sign(e) * me, meta["resid_sigma"]), 3) if e != 0 else 0.5
        for e, me in zip(edges["edge"], edges["market_edge"])
    ]
    edges["bet_side"] = np.where(
        edges["edge"] > 0,
        edges["homeTeam"] + " " + edges["spread"].map(lambda s: f"{s:+g}"),
        edges["awayTeam"] + " " + (-edges["spread"]).map(lambda s: f"{s:+g}"),
    )
    edges["tier"] = edges["edge"].abs().map(edge_tier)
    edges["total_edge"] = (edges["pred_total"] - edges["overUnder"]).round(1)
    edges["total_side"] = np.where(edges["total_edge"] > 0, "Over", "Under")

    edge_cols = [
        "season", "week", "startDate", "homeTeam", "awayTeam", "pred_winner",
        "pred_margin", "market_margin", "formattedSpread", "provider", "edge",
        "market_edge", "cover_prob", "tier", "bet_side", "pred_total", "overUnder",
        "total_edge", "total_side", "homeMoneyline", "awayMoneyline",
        "home_win_prob", "data_imputed",
    ]
    edges = (
        edges[edge_cols]
        .sort_values("edge", key=lambda s: s.abs(), ascending=False)
        .reset_index(drop=True)
    )
    return predictions, edges


# Snapshot columns behind the CORE features — a team missing any of these
# gets neutral (0) diffs imputed, same as in game predictions, and is flagged.
_RANKING_CORE_COLS = [
    "elo_pre", "talent", "sp_prior", "sp_off_prior", "sp_def_prior",
    "off_ppa", "def_ppa", "off_sr", "def_sr", "off_expl",
]


def power_rankings(year: int, week: int, season_type: str = "regular") -> pd.DataFrame:
    """Rank every FBS team by the margin model's power rating: the average
    predicted margin against the full FBS field on a neutral site, from the
    same point-in-time snapshot the week's game predictions use."""
    models, meta = load_models()

    fbs = data.get_fbs_teams(year)
    snap = team_snapshot(year, week, season_type)
    snap = snap[snap["team"].isin(fbs["team"])].reset_index(drop=True)

    pairs = neutral_round_robin_features(snap)
    feats = meta["margin_features"]
    pairs[feats] = pairs[feats].fillna(0.0)
    pairs["pred"] = models["margin_model"].predict(pairs[feats])

    # A team's rating is its mean margin over the field; averaging the two
    # orientations of each pair cancels any home/away asymmetry in the model.
    as_home = pairs.groupby("homeTeam")["pred"].mean()
    as_away = pairs.groupby("awayTeam")["pred"].mean()
    rating = ((as_home - as_away) / 2).round(2)

    imputed = snap.set_index("team")[_RANKING_CORE_COLS].isna().any(axis=1)
    out = pd.DataFrame({"team": rating.index, "power": rating.values})
    out = out.merge(fbs, on="team", how="left")
    out = out.merge(snap[["team", "elo_pre"]].rename(columns={"elo_pre": "elo"}),
                    on="team", how="left")
    out["data_imputed"] = out["team"].map(imputed).fillna(False)
    out = out.sort_values("power", ascending=False).reset_index(drop=True)
    out.insert(0, "rank", out.index + 1)
    return out[["rank", "team", "conference", "power", "elo", "data_imputed"]]


def _freeze_completed(new: pd.DataFrame, path, completed_keys: set) -> pd.DataFrame:
    """Re-running a week mid-slate must not rewrite picks for games already
    played: the saved CSV row is the frozen pre-kickoff pick, and the retrained
    model has those games in its training set. Keep the old rows for completed
    games and take fresh rows only for games still to be played."""
    if not path.exists() or not completed_keys:
        return new
    old = pd.read_csv(path)
    frozen = old[[k in completed_keys for k in zip(old["homeTeam"], old["awayTeam"])]]
    frozen_keys = set(zip(frozen["homeTeam"], frozen["awayTeam"]))
    live = new[[k not in frozen_keys for k in zip(new["homeTeam"], new["awayTeam"])]]
    if len(frozen):
        print(f"kept {len(frozen)} frozen pre-kickoff rows for already-played games")
    return pd.concat([frozen, live], ignore_index=True)


def run(year: int, week: int, season_type: str = "regular", refresh: bool = True) -> None:
    """Predict a week, write the two CSVs, and print a summary."""
    predictions, edges = predict_week(year, week, season_type, refresh=refresh)

    slug = week_slug(year, week, season_type)
    pred_path = OUTPUT_DIR / f"predictions_{slug}.csv"
    edge_path = OUTPUT_DIR / f"edges_{slug}.csv"

    games = data.get_games(year, season_type)
    wk = games[(games["week"] == week) & games["completed"] & games["homePoints"].notna()]
    completed_keys = set(zip(wk["homeTeam"], wk["awayTeam"]))
    predictions = (
        _freeze_completed(predictions, pred_path, completed_keys)
        .sort_values("startDate")
        .reset_index(drop=True)
    )
    edges = (
        _freeze_completed(edges, edge_path, completed_keys)
        .sort_values("edge", key=lambda s: s.abs(), ascending=False)
        .reset_index(drop=True)
    )

    predictions.to_csv(pred_path, index=False)
    edges.to_csv(edge_path, index=False)

    rankings = power_rankings(year, week, season_type)
    rank_path = OUTPUT_DIR / f"rankings_{slug}.csv"
    rankings.to_csv(rank_path, index=False)

    actionable = edges[edges["tier"] != "none"]
    print(f"\n{len(predictions)} games predicted -> {pred_path}")
    print(f"{len(edges)} lined games, {len(actionable)} with |edge| >= 1 -> {edge_path}")
    print(f"{len(rankings)} teams ranked -> {rank_path}")
    print("\nTop edges:")
    top = edges.head(10)[["homeTeam", "awayTeam", "pred_margin", "formattedSpread",
                          "edge", "cover_prob", "tier", "bet_side"]]
    print(top.to_string(index=False))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--week", type=int, required=True)
    parser.add_argument("--season-type", default="regular", choices=["regular", "postseason"])
    parser.add_argument("--no-refresh", action="store_true",
                        help="use cached games/lines instead of re-fetching")
    args = parser.parse_args()
    run(args.year, args.week, args.season_type, refresh=not args.no_refresh)


if __name__ == "__main__":
    main()
