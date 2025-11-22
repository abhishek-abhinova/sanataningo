# Deployment Guide

## 🚀 Quick Deployment Steps

### Push to GitHub First

**Windows:**
```bash
# Run the deployment script
deploy-github.bat
```

**Linux/Mac:**
```bash
# Make executable and run
chmod +x deploy-github.sh
./deploy-github.sh
```

### Frontend Deployment (Netlify)

1. **Repository is now on GitHub**
   - URL: https://github.com/abhishek-abhinova/sanataningo.git

2. **Deploy on Netlify**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Build settings are automatically configured via `netlify.toml`
   - Set environment variables in Netlify dashboard:
     - `REACT_APP_RAZORPAY_KEY_ID`: Your Razorpay key
     - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com/api`)

### Backend Deployment (Render)

1. **Deploy on Render**
   - Go to [Render](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Environment Variables on Render**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sarboshakti_ngo
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=https://your-frontend.netlify.app
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # Organization Details
   ORG_NAME=Sarboshakti Sanatani Sangathan
   ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
   ORG_EMAIL=info@sarboshakti.org
   ORG_PHONE=+91 XXXXX XXXXX
   ```

## 🔧 Pre-Deployment Checklist

### Backend Setup
- [ ] MongoDB Atlas database created
- [ ] Gmail App Password generated for SMTP
- [ ] Razorpay account created and keys obtained
- [ ] All environment variables configured
- [ ] Database initialized with admin user

### Frontend Setup
- [ ] Razorpay key added to environment
- [ ] API URL configured for production
- [ ] All forms tested with backend

### Testing
- [ ] All API endpoints working
- [ ] Payment integration tested
- [ ] Email service working
- [ ] PDF generation working
- [ ] Admin panel accessible

## 📧 Email Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

## 💳 Razorpay Setup

1. **Create Razorpay Account**
2. **Get API Keys**:
   - Dashboard → Settings → API Keys
   - Generate keys for Test/Live mode
3. **Configure Webhooks** (optional):
   - Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-backend.onrender.com/api/webhooks/razorpay`

## 🗄️ Database Setup

1. **MongoDB Atlas**:
   - Create free cluster
   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for all)
   - Get connection string

2. **Initialize Database**:
   ```bash
   cd backend
   npm run init-db
   ```

## 🔐 Admin Access

Default admin credentials (change after first login):
- **Email**: admin@sarboshakti.org
- **Password**: admin123

## 🌐 Domain Configuration

### Custom Domain (Optional)
1. **Netlify**: Add custom domain in site settings
2. **SSL**: Automatically provided by Netlify
3. **DNS**: Point your domain to Netlify

## 📊 Monitoring

### Backend Monitoring
- Render provides built-in monitoring
- Check logs in Render dashboard
- Set up alerts for downtime

### Frontend Monitoring
- Netlify provides analytics
- Monitor build logs
- Set up form notifications

## 🔄 Updates

### Deploying Updates
1. **Frontend**: Push to GitHub → Auto-deploy on Netlify
2. **Backend**: Push to GitHub → Auto-deploy on Render

### Database Migrations
- Run migration scripts manually if needed
- Backup database before major updates

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend environment
   - Verify allowed origins in server.js

2. **Payment Failures**
   - Verify Razorpay keys
   - Check webhook configuration
   - Test in Razorpay dashboard

3. **Email Not Sending**
   - Verify Gmail app password
   - Check SMTP settings
   - Test email service separately

4. **Database Connection**
   - Verify MongoDB URI
   - Check IP whitelist
   - Test connection locally

### Logs
- **Backend**: Check Render service logs
- **Frontend**: Check browser console
- **Database**: Check MongoDB Atlas logs

## 📞 Support

For deployment issues:
1. Check service status pages
2. Review documentation
3. Contact support if needed

---

**Ready for Production! 🎉**

Your Sarboshakti Sanatani Sangathan application is now ready for deployment with all features activated and properly configured.