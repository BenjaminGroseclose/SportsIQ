"""Render a shareable HTML report for a predicted week.

Usage:
    python -m cfb.report --year 2026 --week 1

Reads the CSVs written by cfb.predict plus models/model_meta.json and writes
output/report_{year}_wk{week}.html — a self-contained page (inline CSS, no
external assets beyond Google Fonts) that can be opened locally or published
as a Claude artifact.
"""
from __future__ import annotations

import argparse
import html
import json
from datetime import datetime
from zoneinfo import ZoneInfo

import pandas as pd

from . import results
from .config import MODEL_DIR, OUTPUT_DIR
from .predict import week_slug

EASTERN = ZoneInfo("America/New_York")

TIER_LABEL = {"extreme": "Extreme", "strong": "Strong", "moderate": "Moderate", "lean": "Lean"}

TAB_SCRIPT = """
<script>
(function () {
  var buttons = document.querySelectorAll('.tabbtn');
  var panes = document.querySelectorAll('.tabpane');
  function show(id) {
    buttons.forEach(function (b) { b.classList.toggle('active', b.dataset.tab === id); });
    panes.forEach(function (p) { p.classList.toggle('active', p.id === id); });
  }
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      show(btn.dataset.tab);
      try { history.replaceState(null, '', '#' + btn.dataset.tab.replace('tab-', '')); } catch (e) {}
      // Switching from deep in a long tab: bring the tab bar back into view.
      var bar = document.querySelector('.tabbar');
      if (bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: 'start' });
    });
  });
  var initial = document.getElementById('tab-' + location.hash.slice(1));
  if (initial && initial.classList.contains('tabpane')) show(initial.id);
})();
</script>"""


def esc(v) -> str:
    return html.escape(str(v))


def kickoff(iso: str) -> datetime:
    return datetime.fromisoformat(str(iso).replace("Z", "+00:00")).astimezone(EASTERN)


def fmt_prob(p: float) -> str:
    return f"{round(p * 100)}%"


def edge_bar(edge: float, scale: float) -> str:
    """Center-out bar: right/blue = model likes the home side, left/orange = away."""
    pct = min(abs(edge) / scale, 1.0) * 50
    side = "home" if edge > 0 else "away"
    if edge > 0:
        fill = f'<div class="bar-fill bar-home" style="left:50%;width:{pct:.1f}%"></div>'
    else:
        fill = f'<div class="bar-fill bar-away" style="right:50%;width:{pct:.1f}%"></div>'
    return f'<div class="bar" data-side="{side}">{fill}<div class="bar-mid"></div></div>'


def tier_chip(tier: str) -> str:
    if tier not in TIER_LABEL:
        return '<span class="chip chip-none">–</span>'
    return f'<span class="chip chip-{tier}">{TIER_LABEL[tier]}</span>'


def side_html(text: str) -> str:
    """'Western Michigan +27.5' -> a team name that may wrap onto a second line
    and a number that never breaks away from it."""
    team, _, num = str(text).rpartition(" ")
    if not team:
        return esc(text)
    return f'{esc(team)} <span class="nb">{esc(num)}</span>'


def _mark(ok: bool) -> str:
    return '<span class="mk-y">✓</span>' if ok else '<span class="mk-n">✗</span>'


def _res_chip(result: str) -> str:
    cls = {"Cover": "res-win", "Win": "res-win", "Loss": "res-loss", "Push": "res-push"}.get(result)
    if cls is None:
        return '<span class="res-push">–</span>'
    return f'<span class="{cls}">{result}</span>'


def _render_results_tab(year: int, week: int, season_type: str) -> str:
    """Previous predicted weeks graded against final scores."""
    upto = week if season_type == "regular" else None
    graded = results.grade_weeks(year, upto_week=upto)
    if graded.empty:
        return """
<h2>Season results</h2>
<p class="lede">Nothing to grade yet. Picks are frozen when each week is predicted; once
those games have been played, this tab shows how they did — game by game, week by week.</p>"""

    n = len(graded)
    winners = int(graded["winner_correct"].sum())
    mae = graded["margin_abs_err"].mean()
    market_mae = graded["market_abs_err"].mean()
    w, l, p = results.ats_record(results.flagged(graded))
    ats_pct = f"{w / (w + l) * 100:.0f}% covered" if (w + l) else "no flagged edges"
    market_sub = f"market: {market_mae:.1f}" if pd.notna(market_mae) else "no lines graded"
    pushes = f"–{p}" if p else ""

    tiles = f"""
<div class="tiles">
  <div class="tile"><div class="v">{graded['week'].nunique()}</div><div class="l">Weeks graded</div></div>
  <div class="tile"><div class="v">{winners / n * 100:.0f}%</div><div class="l">Winners</div>
    <div class="s">{winners} of {n} games</div></div>
  <div class="tile"><div class="v">{mae:.1f}</div><div class="l">Margin MAE</div>
    <div class="s">{market_sub}</div></div>
  <div class="tile"><div class="v">{w}–{l}{pushes}</div><div class="l">Edges ATS</div>
    <div class="s">{ats_pct}</div></div>
</div>"""

    sum_rows = []
    for _, r in results.week_summary(graded).iterrows():
        market = f"{r['market_mae']:.1f}" if pd.notna(r["market_mae"]) else "–"
        wp = f"–{int(r['ats_pushes'])}" if r["ats_pushes"] else ""
        sum_rows.append(
            f"<tr><td>Week {int(r['week'])}</td><td class='num'>{int(r['games'])}</td>"
            f"<td class='num'>{int(r['winner_correct'])}/{int(r['games'])}"
            f"<span class='sub'>{r['winner_acc'] * 100:.0f}%</span></td>"
            f"<td class='num'>{r['margin_mae']:.1f}</td><td class='num'>{market}</td>"
            f"<td class='num'>{int(r['ats_wins'])}–{int(r['ats_losses'])}{wp}</td></tr>"
        )

    tier_rows = []
    for _, r in results.ats_by_tier(graded).iterrows():
        tp = f"–{int(r['pushes'])}" if r["pushes"] else ""
        pct = f"{r['win_pct'] * 100:.0f}%" if pd.notna(r["win_pct"]) else "–"
        tier_rows.append(
            f"<tr><td>{tier_chip(r['tier'])}</td><td class='num'>{int(r['bets'])}</td>"
            f"<td class='num'>{int(r['wins'])}–{int(r['losses'])}{tp}</td>"
            f"<td class='num'>{pct}</td></tr>"
        )

    week_sections = []
    for i, wk in enumerate(sorted(graded["week"].unique(), reverse=True)):
        g = graded[graded["week"] == wk].sort_values("startDate")
        rows = []
        for _, r in g.iterrows():
            if pd.notna(r["tier"]) and r["tier"] != "none":
                edge_cell = f"{esc(r['bet_side'])} {tier_chip(r['tier'])}"
                ats_cell = _res_chip(r["ats_result"])
            else:
                edge_cell = '<span class="res-push">–</span>'
                ats_cell = '<span class="res-push">–</span>'
            if pd.notna(r["overUnder"]) and r["total_result"] != "–":
                tcls = {"Win": "res-win", "Loss": "res-loss", "Push": "res-push"}[r["total_result"]]
                total_cell = (
                    f"<span class='{tcls}'>{esc(r['total_side'])} {r['overUnder']:g}</span>"
                    f"<span class='sub'>final {int(r['actual_total'])}</span>"
                )
            else:
                total_cell = '<span class="res-push">–</span>'
            rows.append(f"""
            <tr>
              <td class="matchup"><span class="team">{esc(r['awayTeam'])}</span>
                <span class="at">at</span> <span class="team">{esc(r['homeTeam'])}</span></td>
              <td class="num">{r['pred_away_points']:.0f}–{r['pred_home_points']:.0f}</td>
              <td class="num winner">{int(r['awayPoints'])}–{int(r['homePoints'])}</td>
              <td class="num">{esc(r['pred_winner'])} {_mark(bool(r['winner_correct']))}</td>
              <td>{edge_cell}</td>
              <td>{ats_cell}</td>
              <td class="num">{total_cell}</td>
            </tr>""")
        ww, wl, wp_ = results.ats_record(results.flagged(g))
        wpush = f"–{wp_}" if wp_ else ""
        in_progress = " · week in progress" if season_type == "regular" and wk == week else ""
        week_sections.append(f"""
<details class="wk"{' open' if i == 0 else ''}>
  <summary>Week {wk} <span class="wksub">{int(g['winner_correct'].sum())}/{len(g)} winners
    ({g['winner_correct'].mean() * 100:.0f}%) · margin MAE {g['margin_abs_err'].mean():.1f}
    · edges {ww}–{wl}{wpush} ATS{in_progress}</span></summary>
  <div class="tablewrap"><table>
    <thead><tr><th>Matchup</th><th>Projected</th><th>Final</th><th>Pick</th>
      <th>Edge side</th><th>ATS</th><th>Total</th></tr></thead>
    <tbody>{''.join(rows)}</tbody>
  </table></div>
</details>""")

    return f"""
<h2>Season to date</h2>
<p class="lede">Every predicted game that has been played, graded against the final score —
including the completed portion of a week still in progress. Picks are frozen at
prediction time; nothing here is re-predicted after the fact. Scores read away–home.</p>
{tiles}
<div class="cols2">
<div><h3 class="day">Week by week</h3>
<div class="tablewrap"><table>
  <thead><tr><th>Week</th><th>Games</th><th>Winners</th><th>Model MAE</th>
    <th>Market MAE</th><th>Edges ATS</th></tr></thead>
  <tbody>{''.join(sum_rows)}</tbody>
</table></div></div>
<div><h3 class="day">Flagged edges by tier</h3>
<div class="tablewrap"><table>
  <thead><tr><th>Tier</th><th>Bets</th><th>Record</th><th>Win %</th></tr></thead>
  <tbody>{''.join(tier_rows)}</tbody>
</table></div></div>
</div>
<h2>Game by game</h2>
{''.join(week_sections)}"""


def _render_history_tab(year: int, week: int, season_type: str) -> str:
    """Week-by-week power ranking of every team across the saved rankings."""
    upto = week if season_type == "regular" else None
    hist = results.rankings_history(year, upto_week=upto)
    if hist.empty:
        return """
<h2>Power ranking history</h2>
<p class="lede">No saved rankings yet — each predicted week saves a full power ranking,
and this tab tracks how every team moves across the season.</p>"""

    weeks = sorted(hist["week"].unique())
    latest = weeks[-1]
    prev = weeks[-2] if len(weeks) > 1 else None
    cur = hist[hist["week"] == latest].sort_values("rank")
    pivot = hist.pivot(index="team", columns="week", values="rank")

    move_head = "<th>Move</th>" if prev is not None else ""
    week_heads = "".join(f"<th class='num'>W{w}</th>" for w in weeks)
    rows = []
    for _, r in cur.iterrows():
        team = r["team"]
        conf = esc(r["conference"]) if pd.notna(r["conference"]) else ""
        move_cell = ""
        if prev is not None:
            prev_rank = pivot.at[team, prev] if team in pivot.index else float("nan")
            if pd.isna(prev_rank):
                move_cell = "<td><span class='res-push'>new</span></td>"
            else:
                d = int(prev_rank) - int(r["rank"])
                if d > 0:
                    move_cell = f"<td><span class='res-win'>▲{d}</span></td>"
                elif d < 0:
                    move_cell = f"<td><span class='res-loss'>▼{-d}</span></td>"
                else:
                    move_cell = "<td><span class='res-push'>·</span></td>"
        cells = []
        for w in weeks:
            v = pivot.at[team, w] if team in pivot.index else float("nan")
            cls = "num rknow" if w == latest else "num"
            cells.append(
                f"<td class='{cls}'>{int(v)}</td>" if pd.notna(v) else f"<td class='{cls}'>–</td>"
            )
        rows.append(
            f"<tr><td class='num rk'>{int(r['rank'])}</td>"
            f"<td class='rkteam'>{esc(team)}<span class='sub'>{conf}</span></td>"
            f"<td class='num'>{r['power']:+.1f}</td>{move_cell}{''.join(cells)}</tr>"
        )

    move_note = " Move is the change since the previous saved week." if prev is not None else ""
    return f"""
<h2>Power ranking history</h2>
<p class="lede">Week-by-week rank of every FBS team on the model's power rating (predicted
margin vs. an average FBS team on a neutral field). Each column is the ranking saved when
that week was predicted — before its games were played.{move_note}</p>
<div class="tablewrap"><table>
  <thead><tr><th>#</th><th>Team</th><th>Rating</th>{move_head}{week_heads}</tr></thead>
  <tbody>{''.join(rows)}</tbody>
</table></div>"""


def build_report(year: int, week: int, season_type: str = "regular") -> str:
    slug = week_slug(year, week, season_type)
    predictions = pd.read_csv(OUTPUT_DIR / f"predictions_{slug}.csv")
    edges = pd.read_csv(OUTPUT_DIR / f"edges_{slug}.csv")
    with open(MODEL_DIR / "model_meta.json") as f:
        meta = json.load(f)

    board = edges[edges["tier"] != "none"].copy()
    scale = max(board["edge"].abs().max() if len(board) else 8.0, 8.0)

    # --- edge board rows ---
    board_rows = []
    for _, r in board.iterrows():
        ko = kickoff(r["startDate"])
        winner_prob = r["home_win_prob"] if r["pred_margin"] >= 0 else 1 - r["home_win_prob"]
        note = ' <span class="flag" title="Missing team data was imputed — treat with caution">*</span>' if r["data_imputed"] else ""
        board_rows.append(f"""
        <tr>
          <td class="matchup"><span class="team">{esc(r['awayTeam'])}</span>
            <span class="at">at</span> <span class="team">{esc(r['homeTeam'])}</span>{note}
            <span class="ko">{ko.strftime('%a')} {ko.strftime('%I:%M %p').lstrip('0')} ET</span></td>
          <td class="txt">{esc(r['pred_winner'])} <span class="nb">by {abs(r['pred_margin']):.1f}</span>
            <span class="sub">{fmt_prob(winner_prob)} win prob</span></td>
          <td class="txt">{side_html(r['formattedSpread'])}<span class="sub">{esc(r['provider'])}</span></td>
          <td class="edgecell"><div class="edgewrap">{edge_bar(r['edge'], scale)}
            <span class="edgeval">{r['edge']:+.1f}</span></div>
            <span class="sub">market-aware: {r['market_edge']:+.1f}</span></td>
          <td class="num">{fmt_prob(r['cover_prob'])}</td>
          <td class="txt side">{side_html(r['bet_side'])}
            <span class="chipline">{tier_chip(r['tier'])}</span></td>
          <td class="num ou">{r['pred_total']:.0f} vs {r['overUnder']:.1f}
            <span class="sub">{esc(r['total_side'])} {abs(r['total_edge']):.1f}</span></td>
        </tr>""")

    # --- full slate grouped by day ---
    predictions = predictions.copy()
    predictions["ko"] = predictions["startDate"].map(kickoff)
    slate_sections = []
    for day, day_games in predictions.groupby(predictions["ko"].dt.strftime("%A, %B %d")):
        rows = []
        for _, r in day_games.sort_values("ko").iterrows():
            winner_prob = r["home_win_prob"] if r["pred_margin"] >= 0 else 1 - r["home_win_prob"]
            rows.append(f"""
            <tr>
              <td class="ko-td">{r['ko'].strftime('%I:%M %p').lstrip('0')} ET</td>
              <td class="matchup"><span class="team">{esc(r['awayTeam'])}</span>
                <span class="at">at</span> <span class="team">{esc(r['homeTeam'])}</span>
                {'<span class="neutral">N</span>' if r['neutralSite'] else ''}</td>
              <td class="num">{r['pred_away_points']:.0f}–{r['pred_home_points']:.0f}</td>
              <td class="num winner">{esc(r['pred_winner'])} <span class="sub">by {abs(r['pred_margin']):.1f}</span></td>
              <td class="num">{fmt_prob(winner_prob)}</td>
            </tr>""")
        slate_sections.append(f"""
        <h3 class="day">{esc(day)}</h3>
        <div class="tablewrap"><table class="slate">
          <thead><tr><th>Kick</th><th>Matchup</th><th>Proj score</th><th>Pick</th><th>Win prob</th></tr></thead>
          <tbody>{''.join(rows)}</tbody>
        </table></div>""")

    # --- power rankings (1..N), four columns of compact tables ---
    rankings_section = (
        '<h2>Power rankings</h2><p class="lede">No power rankings were saved for this week.</p>'
    )
    rank_path = OUTPUT_DIR / f"rankings_{slug}.csv"
    if rank_path.exists():
        ranks = pd.read_csv(rank_path)
        n_cols = 4
        per_col = -(-len(ranks) // n_cols)  # ceil
        cols_html = []
        for i in range(0, len(ranks), per_col):
            chunk = ranks.iloc[i:i + per_col]
            rows = "".join(
                f"""<tr>
                  <td class="num rk">{int(r['rank'])}</td>
                  <td class="rkteam">{esc(r['team'])}{' <span class="flag" title="Missing team data was imputed — treat with caution">*</span>' if r['data_imputed'] else ''}
                    <span class="sub">{esc(r['conference']) if pd.notna(r['conference']) else ''}</span></td>
                  <td class="num rkval">{r['power']:+.1f}</td>
                </tr>"""
                for _, r in chunk.iterrows()
            )
            cols_html.append(f"""
            <div class="rankcol"><table class="ranks">
              <thead><tr><th>#</th><th>Team</th><th>Rating</th></tr></thead>
              <tbody>{rows}</tbody>
            </table></div>""")
        rankings_section = f"""
<h2>Power rankings</h2>
<p class="lede">All {len(ranks)} FBS teams ranked by the model's power rating — the predicted
margin against an average FBS opponent on a neutral field, from a full round-robin of model
predictions using the same pre-week data as the picks on the Edge board tab. The gap between two teams'
ratings is the model's neutral-field spread between them.</p>
<div class="rankgrid">{''.join(cols_html)}</div>"""

    # --- backtest bucket table ---
    bucket_rows = "".join(
        f"<tr><td>{esc(b['bucket'])}</td><td class='num'>{b['bets']}</td>"
        f"<td class='num'>{b['ats_wins']}</td><td class='num'>{b['ats_win_pct']}%</td>"
        f"<td class='num'>{b.get('ci_low', '–')}–{b.get('ci_high', '–')}%</td></tr>"
        for b in meta["ats_buckets"]
    )

    results_tab = _render_results_tab(year, week, season_type)
    history_tab = _render_history_tab(year, week, season_type)

    generated = datetime.now(EASTERN).strftime("%B %d, %Y %I:%M %p ET")
    n_edges = len(board)
    strong_plus = len(board[board["tier"].isin(["strong", "extreme"])])

    week_title = f"Week {week}" if season_type == "regular" else f"Bowl Week {week}"

    early_note = ""
    if season_type == "regular" and week <= 3:
        early_note = """
<p class="lede caution"><strong>Early-season caveat:</strong> through roughly week 3 the model
runs almost entirely on last season's data. It does not know about transfers, coaching changes,
or returning production — the betting market does. Expect more (and less trustworthy) edges than
usual, especially ones backing big underdogs.</p>"""

    return f"""<meta charset="utf-8">
<title>CFB Edge Board</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap">
<style>
:root {{
  --bg: #f7f6f1; --surface: #fffefb; --ink: #191b17; --ink2: #565a52;
  --muted: #8b8f86; --line: #e3e2d8; --accent: #1d6f3d; --accent-ink: #ffffff;
  --home: #2a78d6; --away: #eb6834; --chip-strong-bg: #1d6f3d; --chip-strong-ink: #ffffff;
  --chip-mod-line: #1d6f3d; --chip-mod-ink: #1d6f3d; --flag: #b3261e;
  --tile-bg: #fffefb; --grid: #eceade;
}}
@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    --bg: #101210; --surface: #181b18; --ink: #edece4; --ink2: #b9bdb2;
    --muted: #83877e; --line: #2a2d29; --accent: #3fa663; --accent-ink: #0c1a10;
    --home: #3987e5; --away: #d95926; --chip-strong-bg: #3fa663; --chip-strong-ink: #0c1a10;
    --chip-mod-line: #3fa663; --chip-mod-ink: #3fa663; --flag: #ff8a80;
    --tile-bg: #181b18; --grid: #23261f;
  }}
}}
:root[data-theme="dark"] {{
  --bg: #101210; --surface: #181b18; --ink: #edece4; --ink2: #b9bdb2;
  --muted: #83877e; --line: #2a2d29; --accent: #3fa663; --accent-ink: #0c1a10;
  --home: #3987e5; --away: #d95926; --chip-strong-bg: #3fa663; --chip-strong-ink: #0c1a10;
  --chip-mod-line: #3fa663; --chip-mod-ink: #3fa663; --flag: #ff8a80;
  --tile-bg: #181b18; --grid: #23261f;
}}
* {{ box-sizing: border-box; }}
body {{ background: var(--bg); color: var(--ink); margin: 0;
  font-family: "Source Sans 3", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 15px; line-height: 1.5; }}
.wrap {{ max-width: 1200px; margin: 0 auto; padding: 32px 20px 64px; }}
header {{ border-bottom: 3px solid var(--accent); padding-bottom: 16px; margin-bottom: 24px; }}
.eyebrow {{ color: var(--accent); font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
  font-weight: 600; font-size: 15px; text-transform: uppercase; letter-spacing: 0.14em; }}
h1 {{ font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 700;
  font-size: clamp(34px, 5vw, 52px); line-height: 1.02; margin: 4px 0 6px; text-wrap: balance;
  text-transform: uppercase; letter-spacing: 0.01em; }}
.gen {{ color: var(--muted); font-size: 13px; }}
h2 {{ font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 700;
  font-size: 26px; text-transform: uppercase; letter-spacing: 0.04em; margin: 40px 0 4px; }}
h2 + .lede {{ margin: 0 0 14px; color: var(--ink2); max-width: 68ch; }}
.caution {{ border-left: 3px solid var(--away); padding: 6px 12px; max-width: 68ch;
  color: var(--ink2); background: var(--surface); border-radius: 0 6px 6px 0; }}
h3.day {{ font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 600;
  font-size: 19px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink2);
  margin: 26px 0 8px; }}
.tiles {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px; margin: 20px 0 8px; }}
.tile {{ background: var(--tile-bg); border: 1px solid var(--line); border-radius: 6px;
  padding: 12px 14px; }}
.tile .v {{ font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 700;
  font-size: 30px; line-height: 1.1; }}
.tile .l {{ color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }}
.tile .s {{ color: var(--ink2); font-size: 12.5px; margin-top: 2px; }}
.tablewrap {{ overflow-x: auto; background: var(--surface); border: 1px solid var(--line);
  border-radius: 8px; }}
table {{ border-collapse: collapse; width: 100%; min-width: 700px; }}
th {{ text-align: left; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--muted); font-weight: 600; padding: 10px 12px; border-bottom: 1px solid var(--line); }}
td {{ padding: 10px 12px; border-bottom: 1px solid var(--grid); vertical-align: middle; }}
tbody tr:last-child td {{ border-bottom: none; }}
.num {{ font-variant-numeric: tabular-nums; white-space: nowrap; }}
.sub {{ display: block; color: var(--muted); font-size: 12px; }}
.matchup .team {{ font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
  font-weight: 600; font-size: 17px; letter-spacing: 0.01em; }}
.matchup .at {{ color: var(--muted); font-size: 12.5px; padding: 0 2px; }}
.matchup .ko {{ display: block; color: var(--muted); font-size: 12px; }}
.ko-td {{ color: var(--ink2); white-space: nowrap; font-variant-numeric: tabular-nums; }}
.neutral {{ color: var(--muted); font-size: 11px; border: 1px solid var(--line);
  border-radius: 3px; padding: 0 4px; margin-left: 6px; vertical-align: 1px; }}
.winner {{ font-weight: 600; }}
.side {{ font-weight: 700; }}
/* Edge board: sized to fit the page column, never to scroll. Team-name cells
   wrap (.txt) while the numbers stay whole (.nb). */
table.board th {{ padding: 10px 10px; }}
table.board td {{ padding: 9px 10px; }}
table.board td.matchup {{ min-width: 170px; }}
.txt {{ font-variant-numeric: tabular-nums; }}
.nb {{ white-space: nowrap; }}
.chipline {{ display: block; margin-top: 4px; }}
.edgecell {{ min-width: 176px; }}
.edgewrap {{ display: flex; align-items: center; gap: 10px; }}
.bar {{ position: relative; flex: 1; height: 14px; background: var(--grid);
  border-radius: 4px; min-width: 96px; }}
.bar-mid {{ position: absolute; left: 50%; top: -2px; bottom: -2px; width: 2px;
  background: var(--muted); border-radius: 1px; }}
.bar-fill {{ position: absolute; top: 2px; bottom: 2px; border-radius: 3px; }}
.bar-home {{ background: var(--home); }}
.bar-away {{ background: var(--away); }}
.edgeval {{ font-variant-numeric: tabular-nums; font-weight: 700; min-width: 44px; }}
.chip {{ display: inline-block; font-size: 11.5px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; border-radius: 999px; padding: 2px 10px; white-space: nowrap; }}
.chip-extreme {{ background: var(--ink); color: var(--bg); }}
.chip-strong {{ background: var(--chip-strong-bg); color: var(--chip-strong-ink); }}
.chip-moderate {{ border: 1.5px solid var(--chip-mod-line); color: var(--chip-mod-ink); }}
.chip-lean {{ border: 1px solid var(--line); color: var(--ink2); }}
.chip-none {{ color: var(--muted); }}
.legend {{ display: flex; gap: 18px; align-items: center; color: var(--ink2); font-size: 13px;
  margin: 10px 2px 0; flex-wrap: wrap; }}
.swatch {{ display: inline-block; width: 12px; height: 12px; border-radius: 3px;
  margin-right: 6px; vertical-align: -1px; }}
.flag {{ color: var(--flag); font-weight: 700; }}
.rankgrid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px; align-items: start; }}
.rankcol {{ background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  overflow: hidden; }}
table.ranks {{ min-width: 0; }}
table.ranks td {{ padding: 6px 10px; }}
table.ranks th {{ padding: 8px 10px; }}
.rk {{ color: var(--muted); font-weight: 600; width: 30px; }}
.rkteam {{ font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 600;
  font-size: 16px; letter-spacing: 0.01em; }}
.rkteam .sub {{ font-family: "Source Sans 3", system-ui, sans-serif; font-size: 11px;
  font-weight: 400; }}
.rkval {{ font-weight: 600; text-align: right; }}
.tabbar {{ display: flex; gap: 2px; margin: 0 0 4px; border-bottom: 1px solid var(--line);
  flex-wrap: wrap; }}
.tabbtn {{ appearance: none; background: none; border: none; border-bottom: 3px solid transparent;
  color: var(--ink2); font-family: "Barlow Condensed", "Arial Narrow", sans-serif;
  font-weight: 600; font-size: 18px; text-transform: uppercase; letter-spacing: 0.07em;
  padding: 8px 16px 6px; cursor: pointer; margin-bottom: -1px; }}
.tabbtn:hover {{ color: var(--ink); }}
.tabbtn.active {{ color: var(--ink); border-bottom-color: var(--accent); }}
.tabpane {{ display: none; }}
.tabpane.active {{ display: block; }}
.tabpane > h2:first-child {{ margin-top: 24px; }}
.mk-y {{ color: var(--accent); font-weight: 700; }}
.mk-n {{ color: var(--flag); font-weight: 700; }}
.res-win {{ color: var(--accent); font-weight: 600; }}
.res-loss {{ color: var(--flag); font-weight: 600; }}
.res-push {{ color: var(--muted); }}
.cols2 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px; align-items: start; }}
.cols2 table {{ min-width: 0; }}
details.wk {{ background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  margin: 14px 0; }}
details.wk summary {{ cursor: pointer; padding: 12px 16px;
  font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 700;
  font-size: 20px; text-transform: uppercase; letter-spacing: 0.05em; }}
details.wk .wksub {{ font-family: "Source Sans 3", system-ui, sans-serif; font-weight: 400;
  font-size: 13px; text-transform: none; letter-spacing: 0; color: var(--ink2);
  margin-left: 8px; }}
details.wk .tablewrap {{ border: none; border-top: 1px solid var(--line);
  border-radius: 0 0 8px 8px; }}
.rknow {{ font-weight: 700; }}
.method {{ background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  padding: 18px 20px; margin-top: 40px; }}
.method h2 {{ margin-top: 0; }}
.method p {{ max-width: 72ch; color: var(--ink2); }}
.method table {{ min-width: 0; max-width: 460px; }}
.disclaimer {{ color: var(--muted); font-size: 12.5px; margin-top: 22px; max-width: 78ch; }}
</style>
<div class="wrap">
<header>
  <div class="eyebrow">SportsIQ · College Football</div>
  <h1>{week_title} Edge Board · {year}</h1>
  <div class="gen">Generated {esc(generated)} · model: {esc(meta['margin_model'])},
    trained {esc('–'.join(str(s) for s in [min(meta['train_seasons']), max(meta['train_seasons'])]))},
    walk-forward validated on {esc(str(meta['holdout_season']))}</div>
</header>

<nav class="tabbar" role="tablist">
  <button class="tabbtn active" data-tab="tab-board">Edge board</button>
  <button class="tabbtn" data-tab="tab-slate">Full slate</button>
  <button class="tabbtn" data-tab="tab-rankings">Power rankings</button>
  <button class="tabbtn" data-tab="tab-results">Results</button>
  <button class="tabbtn" data-tab="tab-history">Ranking history</button>
</nav>

<div class="tabpane active" id="tab-board">
<div class="tiles">
  <div class="tile"><div class="v">{len(predictions)}</div><div class="l">Games predicted</div></div>
  <div class="tile"><div class="v">{len(edges)}</div><div class="l">Games with lines</div></div>
  <div class="tile"><div class="v">{n_edges}</div><div class="l">Edges ≥ 1 pt</div>
    <div class="s">{strong_plus} strong or better</div></div>
  <div class="tile"><div class="v">{meta['holdout_margin_mae']:.1f}</div><div class="l">Model margin MAE</div>
    <div class="s">market: {meta['market_margin_mae']:.1f} on {meta['holdout_season']}</div></div>
  <div class="tile"><div class="v">{meta['holdout_winner_accuracy'] * 100:.0f}%</div>
    <div class="l">Winner accuracy</div><div class="s">{meta['holdout_season']} replay</div></div>
</div>

<h2>Edge board</h2>
<p class="lede">The edge is how far the model's projected margin sits from the market's,
in points, from the home team's perspective — the bar points toward the side the model
likes. "Market-aware" is a second model that sees the line itself and predicts its error;
its cover&nbsp;% is the probability the flagged side covers. A cover&nbsp;% above 50 means
the two models agree; below 50 means the market-aware model sides with the line.</p>
{early_note}
<div class="tablewrap">
<table class="board">
  <thead><tr><th>Matchup</th><th>Model pick</th><th>Line</th><th>Edge vs market</th>
    <th>Cover&nbsp;%</th><th>Model side</th><th>Total vs O/U</th></tr></thead>
  <tbody>{''.join(board_rows)}</tbody>
</table>
</div>
<div class="legend">
  <span><span class="swatch" style="background: var(--home)"></span>Model likes the home side</span>
  <span><span class="swatch" style="background: var(--away)"></span>Model likes the away side</span>
  <span><span class="flag">*</span>&nbsp;incomplete team data, imputed</span>
</div>

<div class="method">
<h2>How to read this</h2>
<p>Two models, both using only information available before kickoff: pregame Elo,
prior-season SP+ and FPI, talent, returning production, transfer-portal movement, coaching
changes, rest and travel, and opponent-adjusted EPA/success rate/explosiveness blended
between last season and this season's games to date. The <em>pure model</em> predicts
each game's margin from scratch — its disagreement with the market is the edge shown
above; the <em>market-aware model</em> additionally sees the betting line, predicts its
error, and supplies the cover&nbsp;%. Both train on
{esc('–'.join(str(s) for s in [min(meta['train_seasons']), max(meta['train_seasons'])]))}
(excluding COVID 2020), refreshed weekly with the current season's completed games.</p>
<p>Evaluation is a week-by-week walk-forward replay of {esc(str(meta['holdout_season']))}
({meta['eval_games']} games): every evaluation prediction comes from a model fit only on
games played <em>before</em> that week — exactly how the system runs live. The model
sharpens as current-season data replaces last year's:
{esc(', '.join(f"{p['phase']} {p['mae']:.1f} pts" for p in meta['mae_by_phase']))} of
average margin error.</p>
<p>Across the replay the closing line's average margin error was
{meta['market_margin_mae']:.1f} points, the pure model's {meta['holdout_margin_mae']:.1f}, and the
market-aware model's {meta['aware_margin_mae']:.1f}. An edge is a <em>starting point for
research</em>, not a bet slip: <strong>no edge bucket beat the 52.4% breakeven with
statistical significance</strong> — the confidence intervals below all straddle it.
Against-the-spread results by edge size:</p>
<div class="tablewrap"><table>
  <thead><tr><th>|Edge|</th><th>Bets</th><th>ATS wins</th><th>Win %</th><th>95% CI</th></tr></thead>
  <tbody>{bucket_rows}</tbody>
</table></div>
<p class="disclaimer">For entertainment and research purposes only. Nothing here is betting
advice. Lines shown are a snapshot from a single book and move constantly; margins in
college football have a standard deviation of roughly {meta['margin_sigma']:.0f} points around
any projection, so even "extreme" edges lose often.</p>
</div>
</div>

<div class="tabpane" id="tab-slate">
<h2>Full slate</h2>
<p class="lede">Every FBS-vs-FBS game this week with a projected score and win probability.</p>
{''.join(slate_sections)}
</div>

<div class="tabpane" id="tab-rankings">
{rankings_section}
</div>

<div class="tabpane" id="tab-results">{results_tab}</div>
<div class="tabpane" id="tab-history">{history_tab}</div>
{TAB_SCRIPT}
</div>
"""


def run(year: int, week: int, season_type: str = "regular") -> None:
    html_out = build_report(year, week, season_type)
    path = OUTPUT_DIR / f"report_{week_slug(year, week, season_type)}.html"
    path.write_text(html_out, encoding="utf-8")
    print(f"wrote {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--week", type=int, required=True)
    parser.add_argument("--season-type", default="regular", choices=["regular", "postseason"])
    args = parser.parse_args()
    run(args.year, args.week, args.season_type)


if __name__ == "__main__":
    main()
