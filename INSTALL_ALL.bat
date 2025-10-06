@echo off
echo ========================================
echo Installing All Dependencies
echo ========================================
echo.

echo [1/3] Installing Backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/3] Installing Frontend Portfolio dependencies...
cd frontend-portfolio
call npm install
cd ..

echo.
echo [3/3] Installing Admin Dashboard dependencies...
cd admin-dashboard
call npm install
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env file
echo 2. Run: cd backend ^&^& npm run seed
echo 3. Run: START_ALL.bat
echo.
pause
