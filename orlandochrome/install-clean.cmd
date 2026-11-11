@echo off
title Installing OrlandoChrome (Clean Edition) - Desktop Application
cls
echo ========================================================
echo   ORLANDOCHROME (CLEAN EDITION) - APP INSTALLER
echo   100%% Blank Canvas for External Laptops & Students
echo ========================================================
echo.
echo Installing native Windows desktop application...

set "APP_URL=https://orlandopasion000.github.io/orlandochrome/?edition=blank"
set "APP_NAME=OrlandoChrome (Clean Edition)"
set "ICON_URL=https://orlandopasion000.github.io/orlandochrome/assets/icon.ico"
set "APP_DIR=%LOCALAPPDATA%\OrlandoChromeClean"
set "APP_ICON=%APP_DIR%\icon.ico"

:: Create local app dir
if not exist "%APP_DIR%" mkdir "%APP_DIR%"

:: Download icon if needed
if not exist "%APP_ICON%" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -Uri '%ICON_URL%' -OutFile '%APP_ICON%' -UseBasicParsing } catch {}"
)

:: Find Browser (prefer Chrome or Edge)
set "BROWSER_EXE="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_EXE if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER_EXE if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER_EXE if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER_EXE set "BROWSER_EXE=msedge.exe"

:: Create Desktop Shortcut and Start Menu Shortcut using PowerShell
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$desk = [Environment]::GetFolderPath('Desktop'); " ^
  "$sc = $ws.CreateShortcut((Join-Path $desk '%APP_NAME%.lnk')); " ^
  "$sc.TargetPath = '%BROWSER_EXE%'; " ^
  "$sc.Arguments = '--app=\"%APP_URL%\" --window-size=1120,820'; " ^
  "$sc.Description = 'OrlandoChrome (Clean Edition) - 100%% Blank Canvas'; " ^
  "if (Test-Path '%APP_ICON%') { $sc.IconLocation = '%APP_ICON%,0'; } " ^
  "$sc.Save(); " ^
  "$startMenu = [Environment]::GetFolderPath('Programs'); " ^
  "$sc2 = $ws.CreateShortcut((Join-Path $startMenu '%APP_NAME%.lnk')); " ^
  "$sc2.TargetPath = '%BROWSER_EXE%'; " ^
  "$sc2.Arguments = '--app=\"%APP_URL%\" --window-size=1120,820'; " ^
  "$sc2.Description = 'OrlandoChrome (Clean Edition) - 100%% Blank Canvas'; " ^
  "if (Test-Path '%APP_ICON%') { $sc2.IconLocation = '%APP_ICON%,0'; } " ^
  "$sc2.Save();"

echo.
echo [SUCCESS] OrlandoChrome (Clean Edition) installed successfully!
echo   - Desktop Shortcut created: %USERPROFILE%\Desktop\%APP_NAME%.lnk
echo   - Start Menu shortcut added to Windows Programs
echo.
echo Launching OrlandoChrome Clean Edition...
start "" "%BROWSER_EXE%" --app="%APP_URL%" --window-size=1120,820
ping 127.0.0.1 -n 2 >nul
exit
