@echo off
echo 🚀 Starting Sarboshakti Sanatani Sangathan Development Environment...
echo.

echo 📦 Installing dependencies...
call npm run install-all

echo.
echo 🗄️ Initializing database...
cd backend
call npm run init-db
cd ..

echo.
echo 🌟 Starting development servers...
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 Backend will be available at: http://localhost:5000
echo 🛡️ Admin panel will be available at: http://localhost:3000/admin
echo.
echo Default admin credentials:
echo Email: admin@sarboshakti.org
echo Password: admin123
echo.
echo Press Ctrl+C to stop the servers
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo ✅ Development environment started successfully!
echo.
pause