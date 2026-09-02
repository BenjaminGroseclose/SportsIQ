"""Cached fetchers for the CFBD API.

Every fetcher returns a pandas DataFrame and caches the raw records as JSON
under data/, so historical seasons only ever cost one API call. Pass
force=True to refresh anything that can still change (current-week games,
lines).
"""
from __future__ import annotations

import json

import cfbd
import pandas as pd

from .config import DATA_DIR, get_api_key

_FBS = cfbd.DivisionClassification("fbs")


def _client() -> cfbd.ApiClient:
    cfg = cfbd.Configuration(
        access_token=get_api_key(), host="https://api.collegefootballdata.com"
    )
    return cfbd.ApiClient(cfg)


def _cached(name: str, fetch, force: bool = False) -> pd.DataFrame:
    path = DATA_DIR / f"{name}.json"
    if path.exists() and not force:
        return pd.read_json(path, orient="records")
    records = fetch()
    with open(path, "w") as f:
        json.dump(records, f, default=str)
    return pd.DataFrame(records)


def get_games(year: int, season_type: str = "regular", force: bool = False) -> pd.DataFrame:
    """FBS-vs-FBS games for a season. Columns include week, startDate,
    neutralSite, conferenceGame, home/away team, id, points, completed."""

    def fetch():
        with _client() as api:
            games = cfbd.GamesApi(api).get_games(
                year=year, season_type=cfbd.SeasonType(season_type), classification=_FBS
            )
        out = []
        for g in games:
            d = g.to_dict()
            if d.get("homeClassification") != "fbs" or d.get("awayClassification") != "fbs":
                continue
            out.append(
                {
                    "season": d["season"],
                    "week": d["week"],
                    "seasonType": season_type,
                    "startDate": str(d.get("startDate")),
                    "completed": d.get("completed"),
                    "neutralSite": bool(d.get("neutralSite")),
                    "conferenceGame": bool(d.get("conferenceGame")),
                    "homeId": d["homeId"],
                    "homeTeam": d["homeTeam"],
                    "homePoints": d.get("homePoints"),
                    "awayId": d["awayId"],
                    "awayTeam": d["awayTeam"],
                    "awayPoints": d.get("awayPoints"),
                }
            )
        return out

    return _cached(f"games_{year}_{season_type}", fetch, force)


def get_calendar(year: int, force: bool = False) -> pd.DataFrame:
    """Season calendar: one row per week with seasonType and its date window."""

    def fetch():
        with _client() as api:
            cal = cfbd.GamesApi(api).get_calendar(year=year)
        return [
            {
                "season": w.season,
                "week": w.week,
                "seasonType": str(w.season_type.value),
                "startDate": str(w.start_date),
                "endDate": str(w.end_date),
            }
            for w in cal
        ]

    return _cached(f"calendar_{year}", fetch, force)


def get_elo(year: int, week: int | None = None, force: bool = False) -> pd.DataFrame:
    """Elo ratings. week=N gives ratings *after* week N's games; week=None is
    end of season. Pregame Elo for week W is therefore week=W-1 (or the prior
    season's final for week 1)."""

    def fetch():
        with _client() as api:
            elo = cfbd.RatingsApi(api).get_elo(year=year, week=week)
        return [{"team": r.team, "elo": r.elo} for r in elo]

    suffix = f"_wk{week}" if week is not None else "_final"
    return _cached(f"elo_{year}{suffix}", fetch, force)


def get_sp(year: int, force: bool = False) -> pd.DataFrame:
    """End-of-season SP+ ratings. Only leak-free as a *prior season* feature."""

    def fetch():
        with _client() as api:
            sp = cfbd.RatingsApi(api).get_sp(year=year)
        out = []
        for r in sp:
            d = r.to_dict()
            if d.get("team") == "nationalAverages":
                continue
            out.append(
                {
                    "team": d["team"],
                    "sp_rating": d.get("rating"),
                    "sp_offense": (d.get("offense") or {}).get("rating"),
                    "sp_defense": (d.get("defense") or {}).get("rating"),
                }
            )
        return out

    return _cached(f"sp_{year}", fetch, force)


def get_core(year: int, force: bool = False) -> pd.DataFrame:
    """CORE (Context & Opponent-Relative Efficiency) ratings. The API returns
    only the LATEST snapshot per season (end of season for past years), so this
    is leak-free only as a *prior season* feature, like SP+. Lower core_def is
    a better defense. Empty before 2016."""

    def fetch():
        with _client() as api:
            core = cfbd.RatingsApi(api).get_core(year=year)
        return [
            {
                "team": r.team,
                "core": float(r.overall),
                "core_off": float(r.offense),
                "core_def": float(r.defense),
            }
            for r in core
        ]

    return _cached(f"core_{year}", fetch, force)


def get_fpi(year: int, force: bool = False) -> pd.DataFrame:
    """ESPN Football Power Index. Like SP+ the API serves one end-of-season
    snapshot per year, so this is leak-free only as a *prior season* feature.
    `fpi` is a points-scale rating; the efficiencies are 0-100 scores.
    Available from 2005."""

    def fetch():
        with _client() as api:
            fpi = cfbd.RatingsApi(api).get_fpi(year=year)
        out = []
        for r in fpi:
            d = r.to_dict()
            eff = d.get("efficiencies") or {}
            out.append(
                {
                    "team": d["team"],
                    "fpi": d.get("fpi"),
                    "fpi_off_eff": eff.get("offense"),
                    "fpi_def_eff": eff.get("defense"),
                }
            )
        return out

    return _cached(f"fpi_{year}", fetch, force)


def get_havoc(year: int, force: bool = False) -> pd.DataFrame:
    """Per-game havoc rates (TFLs, forced fumbles, passes defensed per play).
    The API's `offense` block is havoc *suffered* while on offense; `defense`
    is havoc *created*. Events/plays are kept so rates can be re-aggregated
    through an arbitrary week. Empty before 2016."""

    def fetch():
        with _client() as api:
            havoc = cfbd.StatsApi(api).get_game_havoc_stats(year=year)
        return [
            {
                "season": h.season,
                "week": h.week,
                "seasonType": str(h.season_type.value),
                "team": h.team,
                "off_events": float(h.offense.total_havoc_events),
                "off_plays": float(h.offense.total_plays),
                "def_events": float(h.defense.total_havoc_events),
                "def_plays": float(h.defense.total_plays),
            }
            for h in havoc
        ]

    return _cached(f"havoc_{year}", fetch, force)


def get_weather(year: int, force: bool = False) -> pd.DataFrame:
    """Game weather (historical actuals plus forecasts for upcoming games),
    both season types in one call. Patreon-gated; Tier 1 has access. Refresh
    with force=True before predicting a week so forecasts are current."""

    def fetch():
        with _client() as api:
            wx = cfbd.GamesApi(api).get_weather(year=year)
        return [
            {
                "season": w.season,
                "week": w.week,
                "seasonType": str(w.season_type.value),
                "homeTeam": w.home_team,
                "awayTeam": w.away_team,
                "indoors": bool(w.game_indoors),
                "temperature": w.temperature,
                "windSpeed": w.wind_speed,
                "precipitation": w.precipitation,
            }
            for w in wx
        ]

    return _cached(f"weather_{year}", fetch, force)


def get_talent(year: int, force: bool = False) -> pd.DataFrame:
    """247 talent composite. Known preseason, so safe for the current year."""

    def fetch():
        with _client() as api:
            talent = cfbd.TeamsApi(api).get_talent(year=year)
        return [{"team": t.team, "talent": float(t.talent)} for t in talent]

    return _cached(f"talent_{year}", fetch, force)


def get_adv_stats(year: int, end_week: int | None = None, force: bool = False) -> pd.DataFrame:
    """Advanced season stats (garbage time excluded) through end_week.
    end_week=None means the full season. Leak-free for predicting week W when
    end_week <= W-1."""

    def fetch():
        with _client() as api:
            adv = cfbd.StatsApi(api).get_advanced_season_stats(
                year=year, end_week=end_week, exclude_garbage_time=True
            )
        out = []
        for a in adv:
            out.append(
                {
                    "team": a.team,
                    "off_ppa": a.offense.ppa,
                    "off_sr": a.offense.success_rate,
                    "off_expl": a.offense.explosiveness,
                    "def_ppa": a.defense.ppa,
                    "def_sr": a.defense.success_rate,
                    "def_expl": a.defense.explosiveness,
                }
            )
        return out

    suffix = f"_thru{end_week}" if end_week is not None else "_full"
    return _cached(f"adv_{year}{suffix}", fetch, force)


def get_returning(year: int, force: bool = False) -> pd.DataFrame:
    """Returning production (share of last season's PPA/usage back this year).
    Published preseason, so safe for the current year."""

    def fetch():
        with _client() as api:
            rp = cfbd.PlayersApi(api).get_returning_production(year=year)
        return [
            {
                "team": r.team,
                "ret_ppa": r.percent_ppa,
                "ret_pass_ppa": r.percent_passing_ppa,
                "ret_usage": r.usage,
            }
            for r in rp
        ]

    return _cached(f"returning_{year}", fetch, force)


# Portal value proxy when the 247 rating is missing but stars are known.
_STAR_VALUE = {5: 0.98, 4: 0.92, 3: 0.85, 2: 0.80, 1: 0.76}


def get_portal(year: int, force: bool = False) -> pd.DataFrame:
    """Net transfer-portal talent per team for a season: sum of incoming player
    ratings minus outgoing. Uses the 247 rating when present, a star-based
    proxy otherwise; unrated/no-star players count 0. Empty before 2021."""

    def fetch():
        with _client() as api:
            portal = cfbd.PlayersApi(api).get_transfer_portal(year=year)
        flows: dict[str, float] = {}
        for p in portal:
            value = p.rating if p.rating else _STAR_VALUE.get(p.stars or 0, 0.0)
            if not value:
                continue
            if p.destination:
                flows[p.destination] = flows.get(p.destination, 0.0) + value
            if p.origin:
                flows[p.origin] = flows.get(p.origin, 0.0) - value
        return [{"team": t, "portal_net": round(v, 3)} for t, v in flows.items()]

    return _cached(f"portal_{year}", fetch, force)


def get_coach_history(force: bool = False) -> pd.DataFrame:
    """One row per head-coach season since 2000: coach name, school, games,
    wins, losses. Basis for career track-record features."""

    def fetch():
        with _client() as api:
            coaches = cfbd.CoachesApi(api).get_coaches(min_year=2000)
        out = []
        for c in coaches:
            for s in c.seasons:
                out.append(
                    {
                        "coach": f"{c.first_name} {c.last_name}",
                        "school": s.school,
                        "year": s.year,
                        "games": s.games,
                        "wins": s.wins,
                        "losses": s.losses,
                    }
                )
        return out

    return _cached("coach_history", fetch, force)


def get_coaches(year: int, force: bool = False) -> pd.DataFrame:
    """First-year-head-coach flag per team. A coach hired from June of the
    prior calendar year onward counts as new for this season."""

    def fetch():
        with _client() as api:
            coaches = cfbd.CoachesApi(api).get_coaches(year=year)
        out = []
        for c in coaches:
            hire = c.hire_date
            if hire is None:
                first_season = None
            else:
                first_season = hire.year + 1 if hire.month >= 6 else hire.year
            for s in c.seasons:
                if s.year == year:
                    out.append(
                        {"team": s.school, "new_coach": int(first_season == year)}
                    )
        return out

    df = _cached(f"coaches_{year}", fetch, force)
    if df.empty:
        return df
    # Teams with a mid-season change have multiple coach rows; one row per team.
    return df.groupby("team", as_index=False)["new_coach"].max()


def get_fbs_teams(year: int, force: bool = False) -> pd.DataFrame:
    """FBS team list with conference — the universe for power rankings."""

    def fetch():
        with _client() as api:
            teams = cfbd.TeamsApi(api).get_fbs_teams(year=year)
        return [{"team": t.school, "conference": t.conference} for t in teams]

    return _cached(f"fbs_teams_{year}", fetch, force)


def get_team_locations(year: int, force: bool = False) -> pd.DataFrame:
    """Home-stadium coordinates per FBS team."""

    def fetch():
        with _client() as api:
            teams = cfbd.TeamsApi(api).get_fbs_teams(year=year)
        out = []
        for t in teams:
            loc = t.location
            out.append(
                {
                    "team": t.school,
                    "lat": loc.latitude if loc else None,
                    "lon": loc.longitude if loc else None,
                }
            )
        return out

    return _cached(f"locations_{year}", fetch, force)


def get_venues(force: bool = False) -> pd.DataFrame:
    """All venues with coordinates, keyed by venueId."""

    def fetch():
        with _client() as api:
            venues = cfbd.VenuesApi(api).get_venues()
        return [
            {"venueId": v.id, "venue_lat": v.latitude, "venue_lon": v.longitude}
            for v in venues
        ]

    return _cached("venues", fetch, force)


def get_schedule(year: int, force: bool = False) -> pd.DataFrame:
    """Every game involving an FBS team (FCS opponents included), regular and
    postseason, with dates and venue — the basis for rest-day and travel
    features. Unlike get_games, this is NOT filtered to FBS-vs-FBS."""

    def fetch():
        out = []
        with _client() as api:
            games_api = cfbd.GamesApi(api)
            for st in ("regular", "postseason"):
                games = games_api.get_games(
                    year=year, season_type=cfbd.SeasonType(st), classification=_FBS
                )
                for g in games:
                    d = g.to_dict()
                    out.append(
                        {
                            "season": d["season"],
                            "week": d["week"],
                            "seasonType": st,
                            "startDate": str(d.get("startDate")),
                            "homeTeam": d["homeTeam"],
                            "awayTeam": d["awayTeam"],
                            "neutralSite": bool(d.get("neutralSite")),
                            "venueId": d.get("venueId"),
                        }
                    )
        return out

    return _cached(f"schedule_{year}", fetch, force)


def get_lines(
    year: int,
    week: int | None = None,
    season_type: str = "regular",
    providers: tuple[str, ...] = ("DraftKings", "Bovada", "ESPN Bet", "consensus"),
    force: bool = False,
) -> pd.DataFrame:
    """Betting lines, one row per game, using the first provider (in
    preference order) that posted a line. spread is the home handicap:
    negative means the home team is favored."""

    def fetch():
        with _client() as api:
            lines = cfbd.BettingApi(api).get_lines(
                year=year, week=week, season_type=cfbd.SeasonType(season_type)
            )
        out = []
        for game in lines:
            if not game.lines:
                continue
            by_provider = {ln.provider: ln for ln in game.lines}
            line = None
            for p in providers:
                if p in by_provider:
                    line = by_provider[p]
                    break
            if line is None:
                line = game.lines[0]
            out.append(
                {
                    "season": game.season,
                    "week": game.week,
                    "homeTeam": game.home_team,
                    "awayTeam": game.away_team,
                    "provider": line.provider,
                    "spread": float(line.spread) if line.spread is not None else None,
                    "formattedSpread": line.formatted_spread,
                    "overUnder": float(line.over_under) if line.over_under is not None else None,
                    "homeMoneyline": line.home_moneyline,
                    "awayMoneyline": line.away_moneyline,
                }
            )
        return out

    suffix = f"_wk{week}" if week is not None else "_all"
    return _cached(f"lines_{year}_{season_type}{suffix}", fetch, force)
