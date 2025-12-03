# Hostinger + Render Deployment Guide

## 🚀 Deployment Strategy (No Node.js on Hostinger)

Since Hostinger doesn't support Node.js, we'll use:
- **Frontend**: Hostinger (Static files)
- **Backend**: Render.com (Free Node.js hosting)

## 📋 Step 1: Deploy Backend to Render

### 1.1 Prepare Backend for Render
1. Push backend code to GitHub repository
2. Create `render.yaml` in backend folder:

```yaml
services:
  - type: web
    name: sarboshakti-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### 1.2 Deploy on Render
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create Web Service
4. Set environment variables:
   - `NODE_ENV=production`
   - `DB_HOST=localhost`
   - `DB_USER=u391855440_sarboshakti`
   - `DB_PASSWORD=>k7QKB46am`
   - `DB_NAME=u391855440_sarboshaktingo`
   - `FRONTEND_URL=https://sarboshaktisonatanisangathan.org`
   - `JWT_SECRET=sarboshakti-production-jwt-secret-2024`

### 1.3 Backend URL
Your backend will be: `https://sarboshakti-backend.onrender.com`

## 📋 Step 2: Deploy Frontend to Hostinger

### 2.1 Build Frontend
```bash
cd frontend
npm run build
```

### 2.2 Upload to Hostinger
1. Upload ALL files from `frontend/build/` to `public_html/`
2. Ensure `.htaccess` is uploaded for React Router
3. Your site: `https://sarboshaktisonatanisangathan.org/`

## 🔧 Step 3: Configure Hostinger (Frontend Only)

### 3.1 File Structure on Hostinger
```
public_html/
├── index.html (React app)
├── static/ (CSS, JS files)
├── images/ (All images)
├── videos/ (All videos)
├── .htaccess (React Router support)
└── _redirects (Backup routing)
```

### 3.2 SSL Certificate
1. Hostinger Control Panel → SSL
2. Activate free SSL for your domain
3. Force HTTPS redirect

### 3.3 Domain Configuration
1. Point domain to Hostinger
2. Update DNS if needed
3. Wait for propagation (24-48 hours)

## ✅ Final Setup

### Frontend: Hostinger
- Static React files
- Domain: `https://sarboshaktisonatanisangathan.org/`
- SSL enabled

### Backend: Render
- Node.js API
- URL: `https://sarboshakti-backend.onrender.com`
- Free tier (sleeps after 15min inactivity)

## 🚨 Important Notes

1. **Render Free Tier**: Backend sleeps after 15 minutes of inactivity
2. **Cold Starts**: First API call may take 30-60 seconds
3. **Database**: Keep MySQL on Hostinger, connect from Render
4. **CORS**: Backend configured for your frontend domain

## 🔄 Alternative Options

### Option A: Upgrade Hostinger Plan
- Check if higher plans support Node.js
- Contact Hostinger support

### Option B: Use Different Backend Host
- Railway.app (free tier)
- Vercel (serverless functions)
- Netlify Functions
- Heroku (paid)

Your site will work perfectly with this setup!