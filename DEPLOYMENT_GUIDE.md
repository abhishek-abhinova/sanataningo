# 🚀 Production Deployment Guide

## Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify
1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub account
   - Select repository: `abhishek-abhinova/sanataningo`

2. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://sanataningo.onrender.com/api
   ```

4. **Site Name**: Change to `sarboshakti-sangathan` or `sanataningo`

### Step 2: Custom Domain (Optional)
- Add custom domain in Netlify settings
- Update DNS records to point to Netlify

---

## Backend Deployment (Render)

### Step 1: Deploy to Render
1. **Create Web Service**:
   - Go to [Render](https://render.com)
   - Click "New" → "Web Service"
   - Connect GitHub repository: `abhishek-abhinova/sanataningo`

2. **Service Settings**:
   - **Name**: `sanataningo`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Environment Variables
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://sangathan:abhishek@cluster0.walx5w1.mongodb.net/sarboshakti_ngo
JWT_SECRET=sarboshakti-jwt-secret-2024-production-key
FRONTEND_URL=https://sarboshakti-sangathan.netlify.app

# Email Configuration (Hostinger)
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

---

## 🔧 Post-Deployment Setup

### 1. Initialize Database
After backend deployment, run database initialization:
```bash
# This will create the admin user
# Access: https://sanataningo.onrender.com/api/health
```

### 2. Test Email Service
- Submit a contact form to test email delivery
- Check Hostinger email logs if emails fail

### 3. Admin Access
- **URL**: https://sarboshakti-sangathan.netlify.app/admin
- **Email**: admin@sarboshakti.org
- **Password**: admin123

### 4. Update Frontend API URL
If backend URL changes, update in Netlify environment variables:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas database accessible
- [ ] Hostinger email credentials working
- [ ] All environment variables configured
- [ ] CORS origins updated for production URLs

### Frontend (Netlify)
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Backend (Render)
- [ ] Web service created
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Email service functional
- [ ] Admin user created

### Testing
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Forms submission working
- [ ] Email notifications sending
- [ ] Admin panel accessible
- [ ] Payment verification working

---

## 🔗 Production URLs

- **Frontend**: https://sarboshakti-sangathan.netlify.app
- **Backend**: https://sanataningo.onrender.com
- **Admin Panel**: https://sarboshakti-sangathan.netlify.app/admin
- **API Health**: https://sanataningo.onrender.com/api/health

---

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment
   - Verify allowed origins in server.js

2. **Email Not Sending**
   - Verify Hostinger SMTP credentials
   - Check email service logs in Render

3. **Database Connection**
   - Verify MongoDB URI
   - Check IP whitelist (0.0.0.0/0)

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify package.json dependencies

### Logs Access
- **Netlify**: Deploy logs in dashboard
- **Render**: Service logs in dashboard
- **MongoDB**: Atlas logs and metrics

---

## 🔄 Updates & Maintenance

### Deploying Updates
1. **Push to GitHub**: Changes auto-deploy
2. **Environment Changes**: Update in platform dashboards
3. **Database Migrations**: Run manually if needed

### Monitoring
- Set up uptime monitoring
- Monitor email delivery rates
- Check error logs regularly

---

**🎉 Your NGO website is now live and ready to serve the community!**