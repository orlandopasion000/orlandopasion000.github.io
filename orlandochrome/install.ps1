# OrlandoChrome (Main Version) · Taskbar Notes - 1-Line Windows Installer
# Run: irm https://orlandopasion000.github.io/orlandochrome/install.ps1 | iex

Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  ORLANDOCHROME (MAIN VERSION) - APP INSTALLER" -ForegroundColor Cyan
Write-Host "  Sir Orlando V. Pasion, Jr. - Executive Edition" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Installing native Windows desktop application with zero warnings..." -ForegroundColor White

$AppUrl = "https://orlandopasion000.github.io/orlandochrome/"
$AppName = "OrlandoChrome (Main Version)"
$IconUrl = "https://orlandopasion000.github.io/orlandochrome/assets/icon.ico"
$AppDir = Join-Path $env:LOCALAPPDATA "OrlandoChrome"
$IconPath = Join-Path $AppDir "icon.ico"

if (-not (Test-Path $AppDir)) {
    New-Item -ItemType Directory -Path $AppDir -Force | Out-Null
}

if (-not (Test-Path $IconPath)) {
    try {
        Invoke-WebRequest -Uri $IconUrl -OutFile $IconPath -UseBasicParsing -ErrorAction SilentlyContinue
    } catch {}
}

# Find Chrome or Edge
$BrowserExe = $null
$ChromePath1 = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
$ChromePath2 = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
$EdgePath1 = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
$EdgePath2 = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"

if (Test-Path $ChromePath1) { $BrowserExe = $ChromePath1 }
elseif (Test-Path $ChromePath2) { $BrowserExe = $ChromePath2 }
elseif (Test-Path $EdgePath1) { $BrowserExe = $EdgePath1 }
elseif (Test-Path $EdgePath2) { $BrowserExe = $EdgePath2 }
else { $BrowserExe = "msedge.exe" }

# Create Desktop Shortcut
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut((Join-Path $DesktopPath "$AppName.lnk"))
$Shortcut.TargetPath = $BrowserExe
$Shortcut.Arguments = "--app=`"$AppUrl`" --window-size=1120,820"
$Shortcut.Description = "OrlandoChrome (Main Version) - Taskbar Notes Desktop Application"
if (Test-Path $IconPath) { $Shortcut.IconLocation = "$IconPath,0" }
$Shortcut.Save()

# Create Start Menu Shortcut
$ProgramsPath = [Environment]::GetFolderPath('Programs')
$StartShortcut = $WshShell.CreateShortcut((Join-Path $ProgramsPath "$AppName.lnk"))
$StartShortcut.TargetPath = $BrowserExe
$StartShortcut.Arguments = "--app=`"$AppUrl`" --window-size=1120,820"
$StartShortcut.Description = "OrlandoChrome (Main Version) - Taskbar Notes Desktop Application"
if (Test-Path $IconPath) { $StartShortcut.IconLocation = "$IconPath,0" }
$StartShortcut.Save()

Write-Host ""
Write-Host "[SUCCESS] OrlandoChrome (Main Version) installed successfully!" -ForegroundColor Green
Write-Host "  ✓ Desktop Shortcut: $DesktopPath\$AppName.lnk" -ForegroundColor Gray
Write-Host "  ✓ Start Menu Shortcut: $ProgramsPath\$AppName.lnk" -ForegroundColor Gray
Write-Host ""
Write-Host "Launching OrlandoChrome Taskbar Notes..." -ForegroundColor Cyan

Start-Process -FilePath $BrowserExe -ArgumentList "--app=`"$AppUrl`" --window-size=1120,820"
