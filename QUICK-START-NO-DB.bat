@echo off
echo ========================================
echo   SOC PLATFORM - QUICK START (NO DB)
echo ========================================
echo.
echo Starting backend in DEMO MODE (no database required)...
echo.

cd server
start "SOC Backend" cmd /k "node src/server-no-db.js"

timeout /t 3 /nobreak >nul

echo.
echo Starting frontend...
echo.

cd ..\client
start "SOC Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   Services Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000 (DEMO MODE)
echo Frontend: http://localhost:3000
echo.
echo Login credentials:
echo   Email: admin@soc.com
echo   Password: Admin@123
echo.
echo ========================================
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WINDOWTITLE eq SOC Backend*" /F
taskkill /FI "WINDOWTITLE eq SOC Frontend*" /F
