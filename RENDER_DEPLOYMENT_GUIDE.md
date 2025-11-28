# 🚀 Render Backend Deployment Guide

## Step 1: Prepare for Deployment

### 1.1 Update package.json
```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 1.2 Create .gitignore
```
node_modules/
.env
uploads/screenshots/*
!uploads/screenshots/.gitkeep
*.log
.DS_Store
```

### 1.3 Create uploads/.gitkeep
```bash
mkdir -p uploads/screenshots
touch uploads/screenshots/.gitkeep
```

## Step 2: Git Setup

### 2.1 Initialize Git Repository
```bash
cd sarboshakti-react-app
git init
git add .
git commit -m "Initial commit: NGO membership and donation system"
```

### 2.2 Create GitHub Repository
1. Go to GitHub.com
2. Create new repository: `sarboshakti-ngo-system`
3. Don't initialize with README (we already have files)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/sarboshakti-ngo-system.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy on Render

### 3.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository

### 3.2 Create Web Service
1. Click "New" → "Web Service"
2. Connect repository: `sarboshakti-ngo-system`
3. Configure settings:
   - **Name**: `sarboshakti-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci --only=production`
   - **Start Command**: `npm start`

### 3.3 Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://sangathan:abhishek@cluster0.walx5w1.mongodb.net/sarboshakti_ngo
JWT_SECRET=sarboshakti-jwt-secret-2024-production-key
FRONTEND_URL=https://sarboshaktisonatanisangathan.org

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=Sangathan@123

# Organization Details
ORG_NAME=Sarboshakti Sanatani Sangathan
ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_PHONE=+91 9876543210
```

## Step 4: Post-Deployment

### 4.1 Initialize Database
After deployment, access:
```
https://your-app-name.onrender.com/api/health
```

### 4.2 Create Admin User
Run database initialization by accessing:
```
https://your-app-name.onrender.com/api/admin/init
```

### 4.3 Update Frontend
Update frontend `.env.production`:
```env
REACT_APP_BACKEND_URL=https://sarboshakti-backend.onrender.com
```

## Step 5: Continuous Deployment

### 5.1 Auto-Deploy Setup
- Render automatically deploys on git push to main branch
- Monitor deployments in Render dashboard

### 5.2 Update Process
```bash
# Make changes
git add .
git commit -m "Update: description of changes"
git push origin main
# Render will auto-deploy
```

## 🔧 Troubleshooting

### Build Fix for Render:
```bash
# In backend directory, regenerate package-lock.json
cd backend
rm -f package-lock.json
npm install
```

### Common Issues:
1. **Build Failures**: Use `npm ci --only=production` as build command
2. **Database Connection**: Verify MongoDB URI and IP whitelist  
3. **File Uploads**: Render has ephemeral storage, consider cloud storage
4. **Environment Variables**: Double-check all variables are set
5. **Old Commit**: Render may use old commit, trigger manual deploy

### Logs Access:
- View logs in Render dashboard
- Monitor API health endpoint
- Check MongoDB Atlas logs

## 📱 Mobile Responsive Features

### Implemented:
- ✅ Mobile-first CSS design
- ✅ Responsive grid layouts
- ✅ Touch-friendly buttons
- ✅ Optimized forms for mobile
- ✅ Responsive navigation
- ✅ Mobile-optimized hero section
- ✅ Flexible image galleries

Your backend will be live at: `https://sarboshakti-backend.onrender.com`