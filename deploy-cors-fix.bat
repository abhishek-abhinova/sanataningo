@echo off
echo 🚀 Deploying CORS fix to production...

cd /d "c:\Users\abhis\Desktop\sarboshakti-react-app"

echo 📝 Adding changes to git...
git add .

echo 💾 Committing changes...
git commit -m "Fix CORS configuration for production domain"

echo 🌐 Pushing to GitHub (this will trigger Render deployment)...
git push origin main

echo ✅ Deployment initiated! 
echo 📱 Check Render dashboard for deployment status
echo 🔗 Backend will be available at: https://sanataningo.onrender.com
echo 🌐 Frontend domain: https://sarboshaktisonatanisangathan.org

pause