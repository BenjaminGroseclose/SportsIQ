"""Point-in-time feature building.

Every feature for a week-W game uses only information available before that
week kicked off: Elo through week W-1, advanced stats through week W-1
(blended with the prior season's full-year numbers early in the year),
prior-season SP+, and preseason information (talent, returning production,
portal movement, coaching changes). This is what keeps the model honest — the
old notebook pipeline trained on end-of-season ratings, which leaks the
outcome of the games being predicted.
"""
from __future__ import annotations

import math
from functools import lru_cache

import numpy as np
import pandas as pd

from . import data

# Weeks of play before current-season stats fully replace prior-season priors.
BLEND_FULL_WEIGHT_WEEKS = 8
REST_CAP_DAYS = 14

ADV_COLS = ["off_ppa", "off_sr", "off_expl", "def_ppa", "def_sr", "def_expl"]
HAVOC_COLS = ["def_havoc", "off_havoc_allowed"]

# Game-level weather features (totals model), encoded so 0 means "typical
# outdoor conditions": wind centered on a normal breeze, cold/precip as
# excesses over none, and indoor games as calm/dry/room-temperature.
WEATHER_FEATURES = ["wx_wind", "wx_cold", "wx_precip", "wx_indoor"]
WIND_NEUTRAL_MPH = 8.0
COLD_BASE_F = 60.0

# Core features: rows missing any of these are dropped from training.
CORE_FEATURES = [
    "elo_diff",
    "talent_diff",
    "sp_prior_diff",
    "sp_off_prior_diff",
    "sp_def_prior_diff",
    "off_ppa_diff",
    "def_ppa_diff",
    "off_sr_diff",
    "def_sr_diff",
    "off_expl_diff",
    "home_field",
]

# Optional features: missing values mean "no information" and are filled with
# 0 (a neutral matchup) — e.g. portal data doesn't exist before 2021, CORE and
# havoc not before 2016.
OPTIONAL_FEATURES = [
    "ret_ppa_diff",
    "portal_net_diff",
    "new_coach_diff",
    "coach_quality_diff",
    "rest_diff",
    "travel_diff",
    "core_prior_diff",
    "core_off_prior_diff",
    "core_def_prior_diff",
    "fpi_prior_diff",
    "def_havoc_diff",
    "off_havoc_allowed_diff",
]

MARGIN_FEATURES = CORE_FEATURES + OPTIONAL_FEATURES

# The market-aware residual model sees everything the margin model sees plus
# the market's own number, and predicts where the line is wrong.
RESID_FEATURES = MARGIN_FEATURES + ["market_margin"]

TOTAL_FEATURES = [
    "off_ppa_sum",
    "def_ppa_sum",
    "off_sr_sum",
    "def_sr_sum",
    "off_expl_sum",
    "sp_off_prior_sum",
    "sp_def_prior_sum",
    "core_off_prior_sum",
    "core_def_prior_sum",
    "home_field",
] + WEATHER_FEATURES

# Totals-only columns that get the same "missing = no information = 0"
# treatment as OPTIONAL_FEATURES (weather is filled inside _add_weather).
_FILL_ZERO = OPTIONAL_FEATURES + ["core_off_prior_sum", "core_def_prior_sum"]


def blend_weight(week: int) -> float:
    """How much the current season's stats count vs the prior season's."""
    return min(max(week - 1, 0) / BLEND_FULL_WEIGHT_WEEKS, 1.0)


def _with_cols(df: pd.DataFrame, cols: list[str]) -> pd.DataFrame:
    """Guard for optional sources that can legitimately be empty (e.g. portal
    before 2021): return an empty frame with the right columns."""
    if df.empty:
        return pd.DataFrame(columns=["team"] + cols)
    return df


def _blend_current_prior(
    prior: pd.DataFrame, cur: pd.DataFrame, cols: list[str], w: float
) -> pd.DataFrame:
    """Blend current-season per-team stats with prior-season ones by weight w.
    Teams missing one side (FBS newcomers etc.) use whichever exists."""
    if w <= 0 or cur.empty:
        return prior
    if prior.empty:
        return cur
    merged = prior.merge(cur, on="team", how="outer", suffixes=("_prior", "_cur"))
    for col in cols:
        prior_vals = merged[f"{col}_prior"]
        cur_vals = merged[f"{col}_cur"]
        blended = w * cur_vals + (1 - w) * prior_vals
        merged[col] = blended.fillna(cur_vals).fillna(prior_vals)
    return merged[["team"] + cols]


def _havoc_rates(
    year: int, week: int | None = None, regular_only: bool = True
) -> pd.DataFrame:
    """Per-team havoc rates aggregated from per-game events/plays. week=W
    limits to regular-season games *before* week W (point-in-time); week=None
    with regular_only means the whole regular season (postseason snapshots);
    regular_only=False means everything (prior-season full-year aggregates)."""
    hv = data.get_havoc(year)
    if not hv.empty and regular_only:
        hv = hv[hv["seasonType"] == "regular"]
        if week is not None:
            hv = hv[hv["week"] < week]
    if hv.empty:
        return pd.DataFrame(columns=["team"] + HAVOC_COLS)
    agg = hv.groupby("team", as_index=False)[
        ["off_events", "off_plays", "def_events", "def_plays"]
    ].sum()
    agg["def_havoc"] = agg["def_events"] / agg["def_plays"].replace(0, np.nan)
    agg["off_havoc_allowed"] = agg["off_events"] / agg["off_plays"].replace(0, np.nan)
    return agg[["team"] + HAVOC_COLS]


def _add_coach_quality_diff(df: pd.DataFrame) -> None:
    """Quality of the incoming coach, zero unless the coach is new this
    season; first-time HCs have no prior record and stay neutral. A 2024-25
    walk-forward ablation kept this (MAE 12.775 -> 12.734, weeks 1-3
    14.27 -> 14.16); a QB-only portal net was tested the same way and hurt."""
    home_cq = df["home_new_coach"] * df["home_coach_prior_wpct"]
    away_cq = df["away_new_coach"] * df["away_coach_prior_wpct"]
    df["coach_quality_diff"] = home_cq.fillna(0.0) - away_cq.fillna(0.0)


def _coach_quality(year: int) -> pd.DataFrame:
    """For each team's year-`year` head coach: career HC win% strictly before
    this season, centered on .500. Gated by the new-coach flag downstream to
    separate proven hires from first-time head coaches (who have no history
    and drop out, imputing to neutral)."""
    hist = data.get_coach_history()
    if hist.empty:
        return pd.DataFrame(columns=["team", "coach_prior_wpct"])
    cur = hist[hist["year"] == year]
    # Mid-season changes give a school two rows; the most games is the primary.
    cur = cur.sort_values("games", ascending=False).drop_duplicates("school")
    prior = hist[hist["year"] < year].groupby("coach")[["wins", "games"]].sum()
    rows = []
    for _, r in cur.iterrows():
        if r["coach"] in prior.index and prior.loc[r["coach"], "games"] > 0:
            wpct = prior.loc[r["coach"], "wins"] / prior.loc[r["coach"], "games"]
            rows.append({"team": r["school"], "coach_prior_wpct": wpct - 0.5})
    return pd.DataFrame(rows, columns=["team", "coach_prior_wpct"])


@lru_cache(maxsize=None)
def team_snapshot(year: int, week: int, season_type: str = "regular") -> pd.DataFrame:
    """One row per team with everything known *before* week `week` of `year`.

    For postseason weeks the snapshot is "through the full regular season":
    latest Elo and full current-season stats, regardless of the week number.
    """
    postseason = season_type == "postseason"
    # Pregame Elo: after last week's games, or prior season's final for week 1.
    if postseason:
        elo = data.get_elo(year)
    elif week >= 2:
        elo = data.get_elo(year, week=week - 1)
    else:
        elo = data.get_elo(year - 1)
    elo = elo.rename(columns={"elo": "elo_pre"})

    # Talent is published preseason; fall back to last year if not out yet.
    talent = data.get_talent(year)
    if talent.empty:
        talent = data.get_talent(year - 1)

    sp_prior = data.get_sp(year - 1).rename(
        columns={
            "sp_rating": "sp_prior",
            "sp_offense": "sp_off_prior",
            "sp_defense": "sp_def_prior",
        }
    )

    w = 1.0 if postseason else blend_weight(week)
    prior_adv = data.get_adv_stats(year - 1)
    cur_adv = (
        data.get_adv_stats(year, end_week=None if postseason else week - 1)
        if w > 0
        else pd.DataFrame()
    )
    adv = _blend_current_prior(prior_adv, cur_adv, ADV_COLS, w)

    # Havoc: same current/prior blend as the advanced stats, re-aggregated
    # from per-game events so the current side only sees weeks before `week`.
    prior_havoc = _havoc_rates(year - 1, regular_only=False)
    cur_havoc = (
        _havoc_rates(year, week=None if postseason else week)
        if w > 0
        else pd.DataFrame()
    )
    havoc = _with_cols(_blend_current_prior(prior_havoc, cur_havoc, HAVOC_COLS, w), HAVOC_COLS)

    # CORE ratings only exist as latest-per-season snapshots, so like SP+ they
    # are leak-free only as a prior-season feature. Empty before 2016.
    core_prior = _with_cols(data.get_core(year - 1), ["core", "core_off", "core_def"]).rename(
        columns={
            "core": "core_prior",
            "core_off": "core_off_prior",
            "core_def": "core_def_prior",
        }
    )

    # ESPN FPI: same end-of-season-snapshot caveat as SP+ and CORE, so prior
    # season only; the efficiencies are cached but unused. 2024-25 walk-forward
    # ablation (cfb.ablate): MAE 12.734 -> 12.727, weeks 1-3 14.16 -> 14.15; kept.
    fpi_prior = _with_cols(data.get_fpi(year - 1), ["fpi"])[["team", "fpi"]].rename(
        columns={"fpi": "fpi_prior"}
    )

    # Preseason-known roster/coaching context (safe at any week of `year`).
    returning = _with_cols(data.get_returning(year), ["ret_ppa", "ret_pass_ppa", "ret_usage"])
    portal = _with_cols(data.get_portal(year), ["portal_net"])
    coaches = _with_cols(data.get_coaches(year), ["new_coach"])
    coach_q = _with_cols(_coach_quality(year), ["coach_prior_wpct"])

    snap = (
        elo.merge(talent, on="team", how="outer")
        .merge(sp_prior, on="team", how="outer")
        .merge(adv, on="team", how="outer")
        .merge(core_prior, on="team", how="left")
        .merge(fpi_prior, on="team", how="left")
        .merge(havoc, on="team", how="left")
        .merge(returning[["team", "ret_ppa"]], on="team", how="left")
        .merge(portal, on="team", how="left")
        .merge(coaches, on="team", how="left")
        .merge(coach_q, on="team", how="left")
    )
    # A duplicated team row here would silently duplicate every game it plays.
    return snap.drop_duplicates(subset="team").reset_index(drop=True)


def neutral_round_robin_features(snap: pd.DataFrame) -> pd.DataFrame:
    """Every ordered pair of teams in `snap` as a neutral-site matchup with
    margin-model features. Home field, rest, and travel are all neutral (0),
    so the two orientations of a pair differ only by model asymmetry — power
    rankings average them out."""
    home = snap.add_prefix("home_").rename(columns={"home_team": "homeTeam"})
    away = snap.add_prefix("away_").rename(columns={"away_team": "awayTeam"})
    df = home.merge(away, how="cross")
    df = df[df["homeTeam"] != df["awayTeam"]].reset_index(drop=True)

    df["home_field"] = 0
    df["elo_diff"] = df["home_elo_pre"] - df["away_elo_pre"]
    df["talent_diff"] = df["home_talent"] - df["away_talent"]
    df["sp_prior_diff"] = df["home_sp_prior"] - df["away_sp_prior"]
    df["sp_off_prior_diff"] = df["home_sp_off_prior"] - df["away_sp_off_prior"]
    df["sp_def_prior_diff"] = df["home_sp_def_prior"] - df["away_sp_def_prior"]
    for col in ["off_ppa", "def_ppa", "off_sr", "def_sr", "off_expl"]:
        df[f"{col}_diff"] = df[f"home_{col}"] - df[f"away_{col}"]
    df["ret_ppa_diff"] = df["home_ret_ppa"] - df["away_ret_ppa"]
    df["portal_net_diff"] = df["home_portal_net"] - df["away_portal_net"]
    df["new_coach_diff"] = df["home_new_coach"] - df["away_new_coach"]
    _add_coach_quality_diff(df)
    df["core_prior_diff"] = df["home_core_prior"] - df["away_core_prior"]
    df["core_off_prior_diff"] = df["home_core_off_prior"] - df["away_core_off_prior"]
    df["core_def_prior_diff"] = df["home_core_def_prior"] - df["away_core_def_prior"]
    df["fpi_prior_diff"] = df["home_fpi_prior"] - df["away_fpi_prior"]
    df["def_havoc_diff"] = df["home_def_havoc"] - df["away_def_havoc"]
    df["off_havoc_allowed_diff"] = df["home_off_havoc_allowed"] - df["away_off_havoc_allowed"]
    df["rest_diff"] = 0.0
    df["travel_diff"] = 0.0
    for col in OPTIONAL_FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)
    return df


def _haversine_km(lat1, lon1, lat2, lon2) -> float:
    if any(pd.isna(v) for v in (lat1, lon1, lat2, lon2)):
        return np.nan
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


@lru_cache(maxsize=None)
def _schedule_context(year: int) -> tuple[pd.DataFrame, dict, dict]:
    """Schedule with parsed dates, per-team sorted game dates (for rest days),
    and coordinate lookups (for travel)."""
    sched = data.get_schedule(year).copy()
    sched["date"] = pd.to_datetime(sched["startDate"], utc=True, format="mixed")

    team_dates: dict[str, list] = {}
    for col in ("homeTeam", "awayTeam"):
        for team, grp in sched.groupby(col):
            team_dates.setdefault(team, []).extend(grp["date"].tolist())
    team_dates = {t: sorted(ds) for t, ds in team_dates.items()}

    locs = data.get_team_locations(year)
    team_loc = {r["team"]: (r["lat"], r["lon"]) for _, r in locs.iterrows()}
    venues = data.get_venues()
    venue_loc = {
        int(r["venueId"]): (r["venue_lat"], r["venue_lon"])
        for _, r in venues.iterrows()
        if pd.notna(r["venueId"])
    }
    return sched, team_dates, venue_loc | {"__teams__": team_loc}  # type: ignore[return-value]


def _rest_days(team: str, game_date, team_dates: dict) -> float:
    dates = team_dates.get(team, [])
    prior = [d for d in dates if d < game_date]
    if not prior:
        return REST_CAP_DAYS
    return min((game_date - prior[-1]).days, REST_CAP_DAYS)


def _add_rest_travel(df: pd.DataFrame, year: int) -> pd.DataFrame:
    sched, team_dates, loc_map = _schedule_context(year)
    team_loc = loc_map["__teams__"]

    # Venue for each matchup (schedule covers regular + postseason).
    df = df.merge(
        sched[["season", "week", "seasonType", "homeTeam", "awayTeam", "venueId", "date"]],
        on=["season", "week", "seasonType", "homeTeam", "awayTeam"],
        how="left",
    )

    rest_diff, travel_diff = [], []
    for _, r in df.iterrows():
        gd = r["date"]
        if pd.isna(gd):
            rest_diff.append(np.nan)
            travel_diff.append(np.nan)
            continue
        rest_diff.append(
            _rest_days(r["homeTeam"], gd, team_dates)
            - _rest_days(r["awayTeam"], gd, team_dates)
        )
        venue = loc_map.get(int(r["venueId"])) if pd.notna(r["venueId"]) else None
        if venue is None and not r["neutralSite"]:
            venue = team_loc.get(r["homeTeam"])
        home_loc = team_loc.get(r["homeTeam"], (np.nan, np.nan))
        away_loc = team_loc.get(r["awayTeam"], (np.nan, np.nan))
        if venue is None:
            travel_diff.append(np.nan)
        else:
            travel_diff.append(
                _haversine_km(home_loc[0], home_loc[1], venue[0], venue[1])
                - _haversine_km(away_loc[0], away_loc[1], venue[0], venue[1])
            )
    df["rest_diff"] = rest_diff
    df["travel_diff"] = travel_diff
    return df.drop(columns=["venueId", "date"])


def _add_weather(df: pd.DataFrame, year: int) -> pd.DataFrame:
    """Join game weather (actuals for played games, forecasts for upcoming
    ones) and derive totals features. Games with no weather row get neutral
    (0) values; indoor games get calm/dry/room-temperature ones."""
    wx = data.get_weather(year)
    if wx.empty:
        for col in WEATHER_FEATURES:
            df[col] = 0.0
        return df
    keys = ["season", "week", "seasonType", "homeTeam", "awayTeam"]
    wx = wx.drop_duplicates(subset=keys)
    before = len(df)
    df = df.merge(wx, on=keys, how="left")
    assert len(df) == before, "weather join duplicated game rows"

    indoor = df["indoors"].astype("boolean").fillna(False).astype(bool)
    wind = pd.to_numeric(df["windSpeed"], errors="coerce")
    temp = pd.to_numeric(df["temperature"], errors="coerce")
    precip = pd.to_numeric(df["precipitation"], errors="coerce")

    df["wx_wind"] = np.where(indoor, -WIND_NEUTRAL_MPH, wind - WIND_NEUTRAL_MPH)
    df["wx_cold"] = np.where(indoor, 0.0, (COLD_BASE_F - temp).clip(lower=0))
    df["wx_precip"] = np.where(indoor, 0.0, precip)
    df["wx_indoor"] = indoor.astype(int)
    for col in ("wx_wind", "wx_cold", "wx_precip"):
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)
    return df.drop(columns=["indoors", "temperature", "windSpeed", "precipitation"])


def build_matchup_features(
    games: pd.DataFrame, year: int, week: int, season_type: str = "regular"
) -> pd.DataFrame:
    """Attach home/away snapshots to games and compute model features."""
    snap = team_snapshot(year, week, season_type)

    home = snap.add_prefix("home_").rename(columns={"home_team": "homeTeam"})
    away = snap.add_prefix("away_").rename(columns={"away_team": "awayTeam"})
    df = games.merge(home, on="homeTeam", how="left").merge(away, on="awayTeam", how="left")

    df["home_field"] = (~df["neutralSite"].astype(bool)).astype(int)
    df["elo_diff"] = df["home_elo_pre"] - df["away_elo_pre"]
    df["talent_diff"] = df["home_talent"] - df["away_talent"]
    df["sp_prior_diff"] = df["home_sp_prior"] - df["away_sp_prior"]
    df["sp_off_prior_diff"] = df["home_sp_off_prior"] - df["away_sp_off_prior"]
    df["sp_def_prior_diff"] = df["home_sp_def_prior"] - df["away_sp_def_prior"]
    df["sp_off_prior_sum"] = df["home_sp_off_prior"] + df["away_sp_off_prior"]
    df["sp_def_prior_sum"] = df["home_sp_def_prior"] + df["away_sp_def_prior"]
    for col in ["off_ppa", "def_ppa", "off_sr", "def_sr", "off_expl"]:
        df[f"{col}_diff"] = df[f"home_{col}"] - df[f"away_{col}"]
        df[f"{col}_sum"] = df[f"home_{col}"] + df[f"away_{col}"]

    df["ret_ppa_diff"] = df["home_ret_ppa"] - df["away_ret_ppa"]
    df["portal_net_diff"] = df["home_portal_net"] - df["away_portal_net"]
    df["new_coach_diff"] = df["home_new_coach"] - df["away_new_coach"]
    _add_coach_quality_diff(df)

    df["core_prior_diff"] = df["home_core_prior"] - df["away_core_prior"]
    df["core_off_prior_diff"] = df["home_core_off_prior"] - df["away_core_off_prior"]
    df["core_def_prior_diff"] = df["home_core_def_prior"] - df["away_core_def_prior"]
    df["fpi_prior_diff"] = df["home_fpi_prior"] - df["away_fpi_prior"]
    df["core_off_prior_sum"] = df["home_core_off_prior"] + df["away_core_off_prior"]
    df["core_def_prior_sum"] = df["home_core_def_prior"] + df["away_core_def_prior"]
    df["def_havoc_diff"] = df["home_def_havoc"] - df["away_def_havoc"]
    df["off_havoc_allowed_diff"] = df["home_off_havoc_allowed"] - df["away_off_havoc_allowed"]

    df = _add_rest_travel(df, year)
    df = _add_weather(df, year)

    # Optional features default to "no information" rather than dropping rows.
    for col in _FILL_ZERO:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)
    return df


def attach_market(df: pd.DataFrame, year: int) -> pd.DataFrame:
    """Add market_margin (= -spread) and market_total (the over/under) from
    cached full-season lines."""
    lines = data.get_lines(year)
    lines = lines[
        ["season", "week", "homeTeam", "awayTeam", "spread", "overUnder"]
    ].dropna(subset=["spread"])
    df = df.merge(lines, on=["season", "week", "homeTeam", "awayTeam"], how="left")
    df["market_margin"] = -df["spread"]
    df["market_total"] = df["overUnder"]
    return df.drop(columns=["spread", "overUnder"])


def build_training_frame(seasons: list[int], quiet: bool = False) -> pd.DataFrame:
    """Completed regular-season FBS games with point-in-time features,
    margin/total targets, and the market line where one exists."""
    frames = []
    for year in seasons:
        games = data.get_games(year, "regular")
        games = games[games["completed"] & games["homePoints"].notna()]
        if games.empty:
            if not quiet:
                print(f"  {year}: no completed games yet, skipping")
            continue
        year_frames = []
        for week in sorted(games["week"].unique()):
            wk_games = games[games["week"] == week]
            year_frames.append(build_matchup_features(wk_games, year, int(week)))
        year_df = attach_market(pd.concat(year_frames, ignore_index=True), year)
        frames.append(year_df)
        if not quiet:
            print(f"  {year}: {len(games)} games across {games['week'].nunique()} weeks")
    df = pd.concat(frames, ignore_index=True)
    df["margin"] = df["homePoints"] - df["awayPoints"]
    df["total"] = df["homePoints"] + df["awayPoints"]

    core = sorted(set(CORE_FEATURES + TOTAL_FEATURES))
    complete = df.dropna(subset=core)
    dropped = len(df) - len(complete)
    if dropped and not quiet:
        print(f"  dropped {dropped} games with incomplete features (FBS newcomers etc.)")
    return complete.reset_index(drop=True)
