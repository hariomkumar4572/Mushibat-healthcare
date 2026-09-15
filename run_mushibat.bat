@echo off
title Mushibat Healthcare Dev Server
cd /d "C:\Users\hario\.gemini\antigravity\scratch\mushibat-healthcare"
echo ===================================================
echo   Starting Mushibat Healthcare (Mithila Region) Dev Server
echo   Opening http://localhost:5173 in browser...
echo ===================================================
echo.
start http://localhost:5173/
npm run dev
pause
