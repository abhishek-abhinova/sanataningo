# Render + Hostinger MySQL Deployment Guide

## 🚀 Perfect Setup: Render Backend + Hostinger Database + Hostinger Frontend

### Architecture:
- **Backend**: Render.com (Node.js API)
- **Database**: Hostinger MySQL 
- **Frontend**: Hostinger (Static files)
- **Domain**: https://sarboshaktisonatanisangathan.org/

## 📋 Step 1: Get Hostinger Database Details

### 1.1 Find Database Host
1. Login to Hostinger hPanel
2. Go to **Databases** → **MySQL Databases**
3. Find your database connection details:
   - **Host**: Usually `srv1150.hstgr.io` or similar
   - **Username**: `u391855440_sarboshakti`
   - **Password**: `>k7QKB46am`
   - **Database**: `u391855440_sarboshaktingo`
   - **Port**: `3306`

### 1.2 Enable Remote Access
1. In **MySQL Databases** → **Remote MySQL**
2. Add IP: `0.0.0.0` (Allow all - for Render)
3. Or add Render's IP ranges if available

## 📋 Step 2: Deploy Backend to Render

### 2.1 Prepare Repository
1. Push backend code to GitHub
2. Ensure `package.json` has correct start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 2.2 Deploy on Render
1. Go to [render.com](https://render.com)
2. **New** → **Web Service**
3. Connect GitHub repository
4. Configure:
   - **Name**: `sarboshakti-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Environment Variables on Render
Set these in Render dashboard:
```
NODE_ENV=production
PORT=10000
DB_HOST=srv1150.hstgr.io
DB_USER=u391855440_sarboshakti
DB_PASSWORD=>k7QKB46am
DB_NAME=u391855440_sarboshaktingo
DB_PORT=3306
FRONTEND_URL=https://sarboshaktisonatanisangathan.org
JWT_SECRET=sarboshakti-production-jwt-secret-2024-render
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=Sangathan@123
ORG_NAME=Sarbo Shakti Sonatani Sangathan
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
```

### 2.4 Backend URL
Your API will be: `https://sarboshakti-backend.onrender.com`

## 📋 Step 3: Update Frontend Configuration

Frontend `.env.production` should have:
```env
REACT_APP_BACKEND_URL=https://sarboshakti-backend.onrender.com
REACT_APP_API_URL=https://sarboshakti-backend.onrender.com
REACT_APP_SITE_URL=https://sarboshaktisonatanisangathan.org
```

## 📋 Step 4: Deploy Frontend to Hostinger

### 4.1 Build Frontend
```bash
cd frontend
npm run build
```

### 4.2 Upload to Hostinger
1. Upload ALL files from `frontend/build/` to `public_html/`
2. Include `.htaccess` for React Router
3. Enable SSL certificate

## 🔧 Step 5: Database Connection Setup

### 5.1 Update Backend Database Config
In your backend `config/database.js` or similar:
```javascript
const mysql = require('mysql2');

const dbConfig = {
  host: process.env.DB_HOST || 'srv1150.hstgr.io',
  user: process.env.DB_USER || 'u391855440_sarboshakti',
  password: process.env.DB_PASSWORD || '>k7QKB46am',
  database: process.env.DB_NAME || 'u391855440_sarboshaktingo',
  port: process.env.DB_PORT || 3306,
  ssl: false, // Hostinger doesn't require SSL for MySQL
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
};

const pool = mysql.createPool(dbConfig);
module.exports = pool.promise();
```

### 5.2 Test Database Connection
Create test endpoint in your backend:
```javascript
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    res.json({ success: true, message: 'Database connected!', data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## ✅ Step 6: Testing & Verification

### 6.1 Test Backend API
- Health check: `https://sarboshakti-backend.onrender.com/api/health`
- Database test: `https://sarboshakti-backend.onrender.com/api/test-db`

### 6.2 Test Frontend
- Website: `https://sarboshaktisonatanisangathan.org/`
- Check API calls in browser console

### 6.3 Test Full Integration
- User registration
- Login functionality
- Database operations
- Email sending

## 🚨 Important Notes

### Render Free Tier Limitations:
- Sleeps after 15 minutes of inactivity
- Cold start takes 30-60 seconds
- 750 hours/month limit

### Database Security:
- Use environment variables for credentials
- Consider IP whitelisting if possible
- Monitor database connections

### Performance Tips:
- Keep database connections alive
- Use connection pooling
- Implement proper error handling

## 🔍 Troubleshooting

### Database Connection Issues:
1. Check Hostinger database host URL
2. Verify remote access is enabled
3. Test connection from local environment first

### CORS Issues:
1. Ensure FRONTEND_URL is correct in backend
2. Check Render deployment logs
3. Verify API endpoints are accessible

Your setup will be:
- **Frontend**: https://sarboshaktisonatanisangathan.org/
- **Backend**: https://sarboshakti-backend.onrender.com
- **Database**: Hostinger MySQL (remote connection)