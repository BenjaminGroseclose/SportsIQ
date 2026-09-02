# SportsIQ Analytics — College Football Predictions

Predicts every FBS matchup for a week, compares the projected margin against the
betting market, and produces a shareable HTML edge report.

## Setup

```terminal
python -m venv .venv
.venv\Scripts\activate
pip install -r ..\requirements.txt
```

Provide a CFBD API key either as the `CFBD_API_KEY` environment variable or in
`analytics/secrets.json` (gitignored):

```json
{ "CFBD_API_KEY": "..." }
```

## Weekly workflow

Double-click `run-weekly.bat`, or run:

```terminal
python -m cfb.weekly
```

It auto-detects the current week from the CFBD calendar (including bowl season),
pulls fresh lines, and writes the CSVs and HTML report to `output/`. Best run
midweek (Tue–Thu) once the new lines are posted. To target a specific week
instead:

```terminal
python -m cfb.predict --year 2026 --week 1
python -m cfb.report --year 2026 --week 1
```

`predict` writes three CSVs to `output/`:

- `predictions_{year}_wk{week}.csv` — every FBS-vs-FBS game with predicted
  winner, margin, projected score, total, and home win probability.
- `edges_{year}_wk{week}.csv` — lined games with the **signed** model-vs-market
  edge (positive = model likes the home side more than the market), the side to
  look at, and a tier (lean / moderate / strong / extreme).
- `rankings_{year}_wk{week}.csv` — every FBS team ranked 1–N by the model's
  power rating: the average predicted margin against the full FBS field on a
  neutral site, from the same pre-week snapshot the game predictions use.

`report` renders those into `output/report_{year}_wk{week}.html` — a
self-contained page you can share or publish, with three tabs:

- **This week** — the edge board, full slate, and current power rankings.
- **Results** — every previously predicted week of the season graded against
  final scores: winner accuracy, margin MAE vs the market, and the ATS record
  of flagged edges, plus a game-by-game log per week. Picks are graded from
  the CSVs frozen at prediction time, never re-predicted.
- **Ranking history** — how every team's power-ranking spot has moved week to
  week across the season.

The Results and Ranking history tabs are built from the accumulated weekly
CSVs in `output/` (which is gitignored) — keep those files around, or the
season history disappears from future reports.

## Retraining

`cfb.weekly` retrains automatically each run, folding in the current season's
completed games. For a full offline run with printed metrics:

```terminal
python -m cfb.train
```

Evaluation is a week-by-week **walk-forward replay** of 2024–2025: for every
week, models are refit on all games strictly before it and tested on that week
alone — exactly how the system runs live. The production models are then fit
on everything (2017–2025 excluding COVID 2020, plus the current season to
date). Metrics land in `models/model_meta.json`, backtest detail in
`output/backtest_walkforward.csv`.

To check whether a feature earns its place, replay the evaluation with and without
it. This builds the training frames once and prints MAE, ATS, and standardized
coefficient deltas (the "without" column should reproduce the current
`holdout_margin_mae`):

```terminal
python -m cfb.ablate fpi_prior_diff
```

## The models

- **Margin model (pure):** predicts home margin from team features only —
  pregame Elo, prior-season SP+ and FPI, talent, returning production, transfer-portal
  net talent, first-year-coach flags, rest-day and travel differentials, and
  opponent-adjusted EPA/success rate/explosiveness blended between last season
  and the current season to date.
- **Residual model (market-aware):** sees everything above *plus* the betting
  line, and predicts where the line is wrong. Its output is the edge on the
  edge board — this is the model that matters for bet research.
- **Total model:** combined points, for over/under context.

## Design notes

- **No leakage:** every feature is point-in-time; roster/coaching features are
  preseason-known. The old notebook pipeline trained on end-of-season ratings,
  which inflated its accuracy.
- **Signed edges:** edge > 0 means the home side beats the number. The old
  pipeline compared absolute values, which hid disagreements where the model
  liked the other side of the line.
- All CFBD pulls are cached in `data/` as JSON, so historical seasons cost one
  API call ever. `predict` re-fetches the current week's games and lines each
  run (use `--no-refresh` to work offline).
- The legacy notebooks (`college-football*.ipynb`, `prediction_accuracy.ipynb`)
  are superseded by the `cfb/` package.
