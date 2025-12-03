@echo off
echo ========================================
echo MySQL Backend Setup and Start
echo ========================================
echo.

cd backend

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Checking for .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo *** IMPORTANT ***
    echo Please edit backend\.env file and update:
    echo - DB_PASSWORD (your MySQL root password)
    echo - Other configuration as needed
    echo.
    pause
)

echo.
echo [3/4] Initializing MySQL database...
echo Make sure MySQL is running in XAMPP!
echo.
pause

node config\init-mysql-db.js

echo.
echo [4/4] Starting backend server...
echo.
echo Backend will start on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

npm run dev
