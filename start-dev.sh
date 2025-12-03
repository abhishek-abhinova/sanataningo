#!/bin/bash

echo "🚀 Starting Sarboshakti Sanatani Sangathan Development Environment..."
echo ""

echo "📦 Installing dependencies..."
npm run install-all

echo ""
echo "🗄️ Initializing database..."
cd backend
npm run init-db
cd ..

echo ""
echo "🌟 Starting development servers..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend will be available at: http://localhost:5000"
echo "🛡️ Admin panel will be available at: http://localhost:3000/admin"
echo ""
echo "Default admin credentials:"
echo "Email: admin@sarboshakti.org"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Development environment started successfully!"
echo ""

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID