"""One-command weekly run: detect the current CFB week, predict it, build the report.

Usage:
    python -m cfb.weekly

Figures out the current (or next upcoming) week from the CFBD calendar, then
runs cfb.predict and cfb.report for it. Run it any day of the week — midweek
(Tue-Thu) is best, once the new lines are posted.
"""
from __future__ import annotations

from datetime import datetime, timezone

import pandas as pd

from . import data, predict, report, train


def detect_current_week(now: datetime | None = None) -> tuple[int, int, str]:
    """Return (year, week, season_type) for the week containing `now`, or the
    next upcoming week. January belongs to the prior season (bowls/playoff)."""
    now = now or datetime.now(timezone.utc)
    year = now.year if now.month >= 2 else now.year - 1

    cal = data.get_calendar(year, force=True)
    if cal.empty:
        cal = data.get_calendar(year - 1, force=True)
        year -= 1
    cal = cal.copy()
    cal["start"] = pd.to_datetime(cal["startDate"], utc=True, format="mixed")
    cal["end"] = pd.to_datetime(cal["endDate"], utc=True, format="mixed")
    cal = cal.sort_values("start").reset_index(drop=True)

    current = cal[(cal["start"] <= now) & (now < cal["end"])]
    if len(current):
        row = current.iloc[0]
    elif now < cal["start"].iloc[0]:
        row = cal.iloc[0]  # offseason: next season's opening week
    else:
        row = cal.iloc[-1]  # season over: final (bowl) week
    return int(row["season"]), int(row["week"]), str(row["seasonType"])


def main() -> None:
    year, week, season_type = detect_current_week()
    label = f"{season_type} week {week}, {year}"
    print(f"Detected current slate: {label}\n")

    # In-season retrain: fold the current season's completed games into the
    # training set. Cheap - all historical data is cached; only the current
    # season costs a few API calls.
    extra = [year] if year not in train.DEFAULT_TRAIN_SEASONS else []
    print("Retraining with latest completed games ...")
    train.run_training(extra_seasons=extra, verbose=False)

    predict.run(year, week, season_type, refresh=True)
    report.run(year, week, season_type)
    print(f"\nDone. Report: output/report_{predict.week_slug(year, week, season_type)}.html")


if __name__ == "__main__":
    main()
