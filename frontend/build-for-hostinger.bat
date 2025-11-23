@echo off
echo Building React app for Hostinger deployment...

cd frontend
echo Installing dependencies...
npm install

echo Building production build...
npm run build

echo Build completed! Upload the 'build' folder contents to Hostinger.
echo.
echo Deployment Instructions:
echo 1. Upload all files from 'frontend/build' folder to your Hostinger public_html
echo 2. Make sure .htaccess file is included for React Router
echo 3. Update API URLs to point to your Render backend
echo.
pause