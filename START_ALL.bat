@echo off
echo ========================================
echo Starting Portfolio Complete System
echo ========================================
echo.

echo Starting Backend API...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Portfolio...
start cmd /k "cd frontend-portfolio && npm run dev"

timeout /t 2 /nobreak > nul

echo Starting Admin Dashboard...
start cmd /k "cd admin-dashboard && npm run dev"

echo.
echo ========================================
echo All servers started!
echo ========================================
echo.
echo Portfolio: http://localhost:5173
echo Admin: http://localhost:5174
echo API: http://localhost:5000/api
echo.
echo Press any key to exit...
pause > nul
