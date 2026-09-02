@echo off
rem Weekly CFB predictions + edge report. Double-click or run from a terminal.
cd /d "%~dp0"
.venv\Scripts\python.exe -m cfb.weekly
if errorlevel 1 (
  echo.
  echo Something went wrong - see the output above.
)
echo.
pause
