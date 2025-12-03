@echo off
echo Building React app for Hostinger deployment...
echo Domain: https://sarboshaktisonatanisangathan.org/
echo.

cd frontend
echo Installing dependencies...
npm install

echo Building production build...
set NODE_ENV=production
npm run build

echo.
echo ✅ Build completed successfully!
echo.
echo 📁 Deployment Instructions for Hostinger:
echo 1. Upload ALL files from 'frontend/build' folder to Hostinger public_html/
echo 2. Upload backend files to public_html/api/ folder
echo 3. Configure Node.js in Hostinger control panel
echo 4. Set startup file to: api/server.js
echo 5. Create .env file in api/ folder with production settings
echo 6. Enable SSL certificate for https://sarboshaktisonatanisangathan.org/
echo.
echo 🔗 Your site will be live at: https://sarboshaktisonatanisangathan.org/
echo 🔗 API will be at: https://sarboshaktisonatanisangathan.org/api/
echo.
echo 📖 See HOSTINGER_DEPLOYMENT.md for detailed instructions
echo.
pause