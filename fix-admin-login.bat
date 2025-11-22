@echo off
echo 🔧 Fixing Admin Login Issues...
echo.

cd backend

echo 📦 Installing dependencies without puppeteer...
copy package-deploy.json package.json
npm install

echo 🔐 Testing admin authentication...
node test-auth.js

echo.
echo ✅ Admin login fixes applied!
echo.
echo 📋 Login Credentials:
echo Email: admin@sarboshakti.org
echo Password: admin123
echo.
echo 🌐 Access admin panel at: http://localhost:3000/admin
echo.
pause