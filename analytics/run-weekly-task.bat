@echo off
rem Non-interactive weekly CFB run for Task Scheduler (Wednesday mornings).
rem Appends all output to output\weekly-runs.log; use run-weekly.bat for
rem interactive runs.
cd /d "%~dp0"
echo. >> output\weekly-runs.log
echo ===== run started %date% %time% ===== >> output\weekly-runs.log
.venv\Scripts\python.exe -m cfb.weekly >> output\weekly-runs.log 2>&1
echo ===== run finished %date% %time% (exit %errorlevel%) ===== >> output\weekly-runs.log
