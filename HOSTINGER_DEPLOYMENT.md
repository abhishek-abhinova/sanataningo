# Hostinger Deployment Guide - Sarboshakti Sanatani Sangathan

## 🚀 Complete Hostinger Deployment Setup

### Prerequisites
- Hostinger hosting account with Node.js support
- Domain: https://sarboshaktisonatanisangathan.org/
- MySQL database access
- Email account configured

## 📁 Project Structure for Hostinger
```
public_html/
├── (Frontend React build files)
├── api/
│   └── (Backend Node.js files)
├── .htaccess (for React Router)
└── index.html (React app entry point)
```

## 🎯 Step 1: Backend Deployment

### 1.1 Upload Backend Files
1. Create `api` folder in your Hostinger `public_html` directory
2. Upload all backend files to `public_html/api/`
3. Create `.env` file in `api` folder with:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=u391855440_sarboshakti
DB_PASSWORD=>k7QKB46am
DB_NAME=u391855440_sarboshaktingo
DB_PORT=3306

# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sarboshaktisonatanisangathan.org
BASE_URL=https://sarboshaktisonatanisangathan.org

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345

# Email Configuration (SMTP)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=Sangathan@123

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Organization Details
ORG_NAME=Sarbo Shakti Sonatani Sangathan
ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_PHONE=+91 XXXXX XXXXX
```

### 1.2 Install Dependencies
```bash
cd public_html/api
npm install --production
```

### 1.3 Start Backend Service
Create `start.js` in api folder or configure Hostinger to run `node server.js`

## 🌐 Step 2: Frontend Deployment

### 2.1 Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 2.2 Upload Frontend Files
1. Upload all contents of `frontend/build/` to `public_html/`
2. Ensure `.htaccess` file is uploaded for React Router support
3. Verify `index.html` is in root of `public_html/`

## 🔧 Step 3: Configuration Files

### 3.1 Update API Endpoints
Frontend is configured to use: `https://sarboshaktisonatanisangathan.org/api`

### 3.2 Database Setup
1. Import your MySQL database to Hostinger
2. Update database credentials in backend `.env`
3. Run database initialization if needed

## 📋 Step 4: Testing Deployment

### 4.1 Test Backend API
Visit: `https://sarboshaktisonatanisangathan.org/api/health`

### 4.2 Test Frontend
Visit: `https://sarboshaktisonatanisangathan.org/`

### 4.3 Test Full Integration
- User registration
- Login functionality
- Donation system
- Contact forms
- Admin panel

## 🚨 Important Hostinger Configurations

### Node.js Setup
1. Enable Node.js in Hostinger control panel
2. Set Node.js version to 18+ 
3. Set startup file to `api/server.js`
4. Configure environment variables in Hostinger panel

### SSL Certificate
1. Enable SSL in Hostinger control panel
2. Force HTTPS redirects
3. Update all URLs to use HTTPS

### File Permissions
```bash
chmod 755 public_html/
chmod 644 public_html/.htaccess
chmod -R 755 public_html/api/
```

## 🔍 Troubleshooting

### Common Issues
1. **API not accessible**: Check Node.js configuration in Hostinger
2. **CORS errors**: Verify FRONTEND_URL in backend .env
3. **Database connection**: Check MySQL credentials
4. **React Router 404**: Ensure .htaccess is properly configured

### Logs and Monitoring
- Check Hostinger error logs
- Monitor API responses
- Test all functionality after deployment

## 📞 Support
- Hostinger Support: For hosting-related issues
- Database: Check MySQL connection and credentials
- Email: Verify SMTP settings with Hostinger

## ✅ Deployment Checklist

### Backend
- [ ] Files uploaded to `public_html/api/`
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] Node.js enabled in Hostinger
- [ ] Database connected
- [ ] API endpoints responding

### Frontend  
- [ ] Build files uploaded to `public_html/`
- [ ] `.htaccess` file in place
- [ ] All routes working
- [ ] API calls successful
- [ ] SSL certificate active

### Final Testing
- [ ] Complete user flow testing
- [ ] Admin functionality
- [ ] Payment integration
- [ ] Email notifications
- [ ] Mobile responsiveness

Your application will be live at: **https://sarboshaktisonatanisangathan.org/**