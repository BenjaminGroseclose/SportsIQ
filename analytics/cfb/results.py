"""Grade past predicted weeks against final scores and load ranking history.

Everything here reads the CSVs cfb.predict wrote at prediction time — picks
are frozen when they're made — and joins them with final scores from the
cached games data (refreshed on every predict run). Nothing is re-predicted.
"""
from __future__ import annotations

import re

import numpy as np
import pandas as pd

from . import data
from .config import OUTPUT_DIR

_EDGE_COLS = [
    "homeTeam", "awayTeam", "market_margin", "formattedSpread", "edge",
    "tier", "bet_side", "cover_prob", "overUnder", "total_side",
]


def predicted_weeks(year: int) -> list[int]:
    """Regular-season weeks of `year` that have a saved predictions CSV."""
    weeks = []
    for path in OUTPUT_DIR.glob(f"predictions_{year}_wk*.csv"):
        m = re.fullmatch(rf"predictions_{year}_wk(\d+)", path.stem)
        if m:
            weeks.append(int(m.group(1)))
    return sorted(weeks)


def grade_weeks(year: int, upto_week: int | None = None) -> pd.DataFrame:
    """One row per completed game across predicted regular-season weeks up to
    and including `upto_week` (all of them if None): the frozen prediction, the
    line it was graded against, and the actual result. Games not yet played
    drop out via the join with final scores, so a week in progress grades
    partially. Empty frame if nothing is gradable."""
    weeks = predicted_weeks(year)
    if upto_week is not None:
        weeks = [w for w in weeks if w <= upto_week]
    if not weeks:
        return pd.DataFrame()

    games = data.get_games(year, "regular")
    if games.empty:
        return pd.DataFrame()
    finals = games[games["completed"] & games["homePoints"].notna()][
        ["week", "homeTeam", "awayTeam", "homePoints", "awayPoints"]
    ]

    frames = []
    for week in weeks:
        preds = pd.read_csv(OUTPUT_DIR / f"predictions_{year}_wk{week}.csv")
        edge_path = OUTPUT_DIR / f"edges_{year}_wk{week}.csv"
        edges = (
            pd.read_csv(edge_path)[_EDGE_COLS]
            if edge_path.exists()
            else pd.DataFrame(columns=_EDGE_COLS)
        )
        df = preds.merge(finals, on=["week", "homeTeam", "awayTeam"], how="inner")
        frames.append(df.merge(edges, on=["homeTeam", "awayTeam"], how="left"))
    graded = pd.concat(frames, ignore_index=True)
    if graded.empty:
        return graded

    graded["actual_margin"] = graded["homePoints"] - graded["awayPoints"]
    graded["actual_total"] = graded["homePoints"] + graded["awayPoints"]
    graded["actual_winner"] = np.where(
        graded["actual_margin"] > 0, graded["homeTeam"], graded["awayTeam"]
    )
    graded["winner_correct"] = graded["pred_winner"] == graded["actual_winner"]
    graded["margin_abs_err"] = (graded["pred_margin"] - graded["actual_margin"]).abs()
    graded["market_abs_err"] = (graded["market_margin"] - graded["actual_margin"]).abs()

    # ATS: the flagged side covers when the final margin lands on its side of
    # the line (edge and margins all from the home team's perspective).
    line_diff = graded["actual_margin"] - graded["market_margin"]
    graded["ats_result"] = np.select(
        [
            graded["edge"].isna() | (graded["edge"] == 0),
            line_diff == 0,
            np.sign(line_diff) == np.sign(graded["edge"]),
        ],
        ["–", "Push", "Cover"],
        default="Loss",
    )
    total_diff = graded["actual_total"] - graded["overUnder"]
    graded["total_result"] = np.select(
        [
            graded["overUnder"].isna(),
            total_diff == 0,
            (graded["total_side"] == "Over") == (total_diff > 0),
        ],
        ["–", "Push", "Win"],
        default="Loss",
    )
    return graded


def flagged(graded: pd.DataFrame) -> pd.DataFrame:
    """The subset of graded games with a tiered (|edge| >= 1) side."""
    return graded[graded["tier"].notna() & (graded["tier"] != "none")]


def ats_record(games: pd.DataFrame) -> tuple[int, int, int]:
    """(wins, losses, pushes) of the flagged sides in a graded frame."""
    return (
        int((games["ats_result"] == "Cover").sum()),
        int((games["ats_result"] == "Loss").sum()),
        int((games["ats_result"] == "Push").sum()),
    )


def week_summary(graded: pd.DataFrame) -> pd.DataFrame:
    """Per-week accuracy summary, most recent week first."""
    rows = []
    for week, g in graded.groupby("week"):
        w, l, p = ats_record(flagged(g))
        rows.append(
            {
                "week": int(week),
                "games": len(g),
                "winner_correct": int(g["winner_correct"].sum()),
                "winner_acc": g["winner_correct"].mean(),
                "margin_mae": g["margin_abs_err"].mean(),
                "market_mae": g["market_abs_err"].mean(),
                "ats_wins": w,
                "ats_losses": l,
                "ats_pushes": p,
            }
        )
    return pd.DataFrame(rows).sort_values("week", ascending=False).reset_index(drop=True)


def ats_by_tier(graded: pd.DataFrame) -> pd.DataFrame:
    """Cumulative ATS record of flagged sides by edge tier."""
    rows = []
    for tier in ("extreme", "strong", "moderate", "lean"):
        g = graded[graded["tier"] == tier]
        if g.empty:
            continue
        w, l, p = ats_record(g)
        rows.append(
            {
                "tier": tier,
                "bets": len(g),
                "wins": w,
                "losses": l,
                "pushes": p,
                "win_pct": w / (w + l) if (w + l) else np.nan,
            }
        )
    return pd.DataFrame(rows)


def rankings_history(year: int, upto_week: int | None = None) -> pd.DataFrame:
    """Long frame of every saved weekly power ranking for `year` (rank, team,
    conference, power, week). Includes `upto_week` itself; empty if none saved."""
    frames = []
    for path in OUTPUT_DIR.glob(f"rankings_{year}_wk*.csv"):
        m = re.fullmatch(rf"rankings_{year}_wk(\d+)", path.stem)
        if not m:
            continue
        week = int(m.group(1))
        if upto_week is not None and week > upto_week:
            continue
        df = pd.read_csv(path)
        df["week"] = week
        frames.append(df)
    if not frames:
        return pd.DataFrame()
    return pd.concat(frames, ignore_index=True)
