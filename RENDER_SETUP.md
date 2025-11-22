# 🚀 Render Deployment Setup

## Backend Deployment on Render

### 1. Create Web Service
- Go to [Render Dashboard](https://dashboard.render.com)
- Click "New" → "Web Service"
- Connect GitHub repository: `abhishek-abhinova/sanataningo`

### 2. Service Configuration
```
Name: sanataningo
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 3. Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://sangathan:abhishek@cluster0.walx5w1.mongodb.net/sarboshakti_ngo
JWT_SECRET=sarboshakti-jwt-secret-2024-production-key
FRONTEND_URL=https://sarboshakti-sangathan.netlify.app

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=Sangathan@123

ORG_NAME=Sarboshakti Sanatani Sangathan
ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_PHONE=+91 9876543210
```

### 4. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Your backend will be available at: `https://sanataningo.onrender.com`

---

## Frontend Deployment on Netlify

### 1. Deploy to Netlify
- Go to [Netlify](https://netlify.com)
- Click "New site from Git"
- Connect GitHub: `abhishek-abhinova/sanataningo`

### 2. Build Settings
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

### 3. Environment Variables
```
REACT_APP_API_URL=https://sanataningo.onrender.com/api
```

### 4. Site Name
Change site name to: `sarboshakti-sangathan`

---

## 🔧 Post-Deployment

### 1. Test Backend
Visit: `https://sanataningo.onrender.com/api/health`

### 2. Test Frontend
Visit: `https://sarboshakti-sangathan.netlify.app`

### 3. Initialize Database
The admin user will be created automatically on first API call.

### 4. Admin Access
- URL: `https://sarboshakti-sangathan.netlify.app/admin`
- Email: `admin@sarboshakti.org`
- Password: `admin123`

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Email service functional
- [ ] Admin panel accessible
- [ ] Forms working correctly

Your NGO website is now live! 🎉