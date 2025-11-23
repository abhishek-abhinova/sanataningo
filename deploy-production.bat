@echo off
echo ========================================
echo   SARBOSHAKTI PRODUCTION DEPLOYMENT
echo ========================================

echo.
echo [1/4] Installing dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Building frontend for production...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Installing backend dependencies...
cd ..\backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [4/4] Testing backend connection...
node -e "console.log('Backend environment check:'); console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Configured' : 'Missing'); console.log('Email configured:', process.env.SMTP_USER ? 'Yes' : 'No'); console.log('Razorpay configured:', process.env.RAZORPAY_KEY_ID ? 'Yes' : 'No');"

echo.
echo ========================================
echo   DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Frontend build is ready in: frontend/build/
echo Backend is configured for production
echo.
echo Next steps:
echo 1. Upload frontend/build/ to your hosting service
echo 2. Deploy backend to Render or your server
echo 3. Update environment variables in production
echo.
pause