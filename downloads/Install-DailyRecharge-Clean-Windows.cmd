@echo off
title Installing Daily Recharge (Clean Edition) Desktop Application
cls
echo ========================================================
echo   DAILY RECHARGE (CLEAN EDITION) - WINDOWS INSTALLER
echo   100%% Clean, Schedule-Free Personal Rhythms & Alarms
echo ========================================================
echo.
echo Installing native Windows desktop application...

set "APP_URL=https://orlandopasion000.github.io/recharge-clean.html"
set "APP_NAME=Daily Recharge (Clean Edition)"
set "APP_ICON=%~dp0assets\app-icon.ico"

:: Find Microsoft Edge
set "EDGE_EXE="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "EDGE_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined EDGE_EXE if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "EDGE_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined EDGE_EXE set "EDGE_EXE=msedge.exe"

:: Create Desktop Shortcut using PowerShell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desk = [Environment]::GetFolderPath('Desktop'); " ^
  "$sc = $ws.CreateShortcut((Join-Path $desk '%APP_NAME%.lnk')); " ^
  "$sc.TargetPath = '%EDGE_EXE%'; " ^
  "$sc.Arguments = '--app=\"%APP_URL%\" --window-size=1260,880'; " ^
  "$sc.Description = 'Daily Recharge Clean Edition Desktop Application'; " ^
  "if (Test-Path '%APP_ICON%') { $sc.IconLocation = '%APP_ICON%,0'; } " ^
  "$sc.Save(); " ^
  "$startMenu = [Environment]::GetFolderPath('Programs'); " ^
  "$sc2 = $ws.CreateShortcut((Join-Path $startMenu '%APP_NAME%.lnk')); " ^
  "$sc2.TargetPath = '%EDGE_EXE%'; " ^
  "$sc2.Arguments = '--app=\"%APP_URL%\" --window-size=1260,880'; " ^
  "$sc2.Description = 'Daily Recharge Clean Edition Desktop Application'; " ^
  "if (Test-Path '%APP_ICON%') { $sc2.IconLocation = '%APP_ICON%,0'; } " ^
  "$sc2.Save();"

echo.
echo [SUCCESS] Daily Recharge (Clean Edition) installed successfully!
echo   - Desktop Shortcut created: %USERPROFILE%\Desktop\%APP_NAME%.lnk
echo   - Start Menu shortcut added to Windows Programs
echo.
echo Launching Daily Recharge Clean Desktop Application...
start "" "%EDGE_EXE%" --app="%APP_URL%" --window-size=1260,880
ping 127.0.0.1 -n 2 >nul
exit
