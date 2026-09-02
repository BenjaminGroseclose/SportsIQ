"""College football prediction pipeline.

Weekly workflow:
    python -m cfb.train                      # (re)train + backtest, run occasionally
    python -m cfb.predict --year 2026 --week 1   # predictions + edges CSVs
    python -m cfb.report  --year 2026 --week 1   # shareable HTML report
"""
