@echo off
title Installing OrlandoRecharge Desktop Application
cls
echo ========================================================
echo   ORLANDORECHARGE - WINDOWS APP INSTALLER
echo   Sir Orlando V. Pasion, Jr. - Executive Edition
echo ========================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "irm https://orlandopasion000.github.io/orlandorecharge/install.ps1 | iex"
exit
