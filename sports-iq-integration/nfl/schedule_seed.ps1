# PowerShell script to schedule NFL database seeding
# Run this to set up Windows Task Scheduler automation

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("Weekly", "Daily", "Test")]
    [string]$ScheduleType = "Weekly"
)

$scriptPath = "$PSScriptRoot\seed-nfl.py"
$pythonPath = (Get-Command python).Source
$logPath = "$PSScriptRoot\logs"

# Create logs directory if it doesn't exist
if (!(Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath | Out-Null
}

# Task configuration
$taskName = "SportsIQ-NFL-Seed"
$taskDescription = "Updates SportsIQ NFL player roster data"

# Remove existing task if it exists
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

switch ($ScheduleType) {
    "Weekly" {
        # Every Tuesday at 6 AM (after MNF)
        $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Tuesday -At 6am
        Write-Host "Setting up WEEKLY schedule (Tuesdays at 6 AM)"
    }
    "Daily" {
        # Every day at 5 AM (for draft/free agency periods)
        $trigger = New-ScheduledTaskTrigger -Daily -At 5am
        Write-Host "Setting up DAILY schedule (Every day at 5 AM)"
    }
    "Test" {
        # Every 5 minutes for testing
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5)
        Write-Host "Setting up TEST schedule (Every 5 minutes)"
    }
}

# Action: Run Python script and log output
$logFile = "$logPath\seed-$(Get-Date -Format 'yyyy-MM-dd').log"
$action = New-ScheduledTaskAction -Execute $pythonPath `
    -Argument "$scriptPath" `
    -WorkingDirectory $PSScriptRoot

# Settings
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable

# Register the task
Register-ScheduledTask `
    -TaskName $taskName `
    -Description $taskDescription `
    -Trigger $trigger `
    -Action $action `
    -Settings $settings `
    -User "SYSTEM" `
    -RunLevel Highest

Write-Host "`n✅ Task scheduled successfully!" -ForegroundColor Green
Write-Host "Task Name: $taskName"
Write-Host "Logs will be saved to: $logPath"
Write-Host "`nTo view/modify the task, run: Get-ScheduledTask -TaskName '$taskName'"
Write-Host "To manually trigger: Start-ScheduledTask -TaskName '$taskName'"
Write-Host "To remove: Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"
