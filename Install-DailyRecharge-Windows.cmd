@echo off
title Installing Daily Recharge Alarm Desktop Application
cls
echo ========================================================
echo   DAILY RECHARGE ALARM - WINDOWS APP INSTALLER
echo   Sir Orlando V. Pasion, Jr. - Executive Edition
echo ========================================================
echo.
echo Installing native Windows desktop application with taskbar support...

set "APP_URL=https://orlandopasion000.github.io/orlandorecharge"
set "APP_NAME=Daily Recharge Alarm"
set "APP_DIR=%LOCALAPPDATA%\DailyRechargeAlarm"
if not exist "%APP_DIR%" mkdir "%APP_DIR%"
set "APP_ICON=%APP_DIR%\app-icon.ico"

:: Download high-res icon if not present
if not exist "%APP_ICON%" (
  powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'https://orlandopasion000.github.io/assets/app-icon.ico' -OutFile '%APP_ICON%' -UseBasicParsing } catch {}"
)

:: Find Microsoft Edge or Google Chrome
set "BROWSER_EXE="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER_EXE if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER_EXE if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_EXE if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_EXE set "BROWSER_EXE=msedge.exe"

:: Create Desktop and Start Menu Shortcuts with custom Gold Icon
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desk = [Environment]::GetFolderPath('Desktop'); " ^
  "$sc = $ws.CreateShortcut((Join-Path $desk '%APP_NAME%.lnk')); " ^
  "$sc.TargetPath = '%BROWSER_EXE%'; " ^
  "$sc.Arguments = '--app=\"%APP_URL%\" --window-size=1280,880'; " ^
  "$sc.Description = 'Daily Recharge Alarm Desktop Application'; " ^
  "if (Test-Path '%APP_ICON%') { $sc.IconLocation = '%APP_ICON%,0'; } " ^
  "$sc.Save(); " ^
  "$startMenu = [Environment]::GetFolderPath('Programs'); " ^
  "$sc2 = $ws.CreateShortcut((Join-Path $startMenu '%APP_NAME%.lnk')); " ^
  "$sc2.TargetPath = '%BROWSER_EXE%'; " ^
  "$sc2.Arguments = '--app=\"%APP_URL%\" --window-size=1280,880'; " ^
  "$sc2.Description = 'Daily Recharge Alarm Desktop Application'; " ^
  "if (Test-Path '%APP_ICON%') { $sc2.IconLocation = '%APP_ICON%,0'; } " ^
  "$sc2.Save();"

echo.
echo [SUCCESS] Daily Recharge Alarm installed successfully!
echo   - Desktop Shortcut: %USERPROFILE%\Desktop\%APP_NAME%.lnk
echo   - Start Menu: Added to Windows Programs
echo.
echo Launching Daily Recharge Alarm...
echo TIP: Once opened, right-click its gold clock icon on your taskbar and click "Pin to taskbar"!
start "" "%BROWSER_EXE%" --app="%APP_URL%" --window-size=1280,880
ping 127.0.0.1 -n 3 >nul
exit
