@echo off
echo 🚀 Starting Local Backend Server...
echo.
echo This will start the backend on http://localhost:5000
echo You can use this while fixing the Render deployment
echo.

cd /d "c:\Users\abhis\Desktop\sarboshakti-react-app\backend"

echo 📝 Setting up environment...
set NODE_ENV=development
set PORT=5000
set MONGODB_URI=mongodb+srv://sangathan:abhishek@cluster0.walx5w1.mongodb.net/sarboshakti_ngo
set JWT_SECRET=sarboshakti-jwt-secret-2024-production-key

echo 🌐 Starting server...
node server-minimal.js

pause