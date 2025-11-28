# Deployment Guide - Sarboshakti Sanatani Sangathan

## 🚀 Backend Deployment on Render

### Step 1: Prepare Repository
1. Push backend code to GitHub repository
2. Ensure all files are committed and pushed

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Configure the following:
   - **Name**: `sarboshakti-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Environment Variables
Set these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sarboshakti_ngo
JWT_SECRET=sarboshakti-jwt-secret-2024-production-key
FRONTEND_URL=https://sarboshaktisonatanisangathan.org

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=your-app-password

# Organization Details
ORG_NAME=Sarboshakti Sanatani Sangathan
ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_PHONE=+91 9876543210
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Your backend will be available at: `https://sarboshakti-backend.onrender.com`

## 🌐 Frontend Deployment on Netlify

### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

### Step 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop the `build` folder to Netlify
3. Or connect GitHub repository and set:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/build`

### Step 3: Environment Variables
Set in Netlify dashboard:
```env
REACT_APP_BACKEND_URL=https://sarboshakti-backend.onrender.com
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Step 4: Configure Redirects
Netlify will automatically handle React Router redirects with the `_redirects` file in build folder.

## 🔧 Post-Deployment Configuration

### Update CORS Settings
Ensure backend CORS allows your frontend domain:
```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-domain.netlify.app',
    'https://sarboshakti.netlify.app'
  ]
};
```

### Test Deployment
1. Visit your frontend URL
2. Test all functionality:
   - Membership registration
   - Donations
   - Contact form
   - Admin login

## 📋 Deployment Checklist

### Backend (Render)
- ✅ Repository connected
- ✅ Environment variables set
- ✅ MongoDB connection string updated
- ✅ SMTP credentials configured
- ✅ CORS origins updated
- ✅ Health check endpoint working

### Frontend (Netlify)
- ✅ Build completed successfully
- ✅ API URL environment variable set
- ✅ Razorpay key configured
- ✅ Redirects working for React Router
- ✅ All pages loading correctly

## 🔍 Troubleshooting

### Common Issues
1. **CORS Errors**: Update CORS origins in backend
2. **API Connection**: Check REACT_APP_API_URL
3. **Build Failures**: Check for missing dependencies
4. **Database Connection**: Verify MongoDB URI

### Monitoring
- Backend logs: Available in Render dashboard
- Frontend errors: Check browser console
- API health: Visit `/api/health` endpoint

## 🚀 Going Live

1. Update DNS settings to point to Netlify
2. Configure custom domain in Netlify
3. Enable HTTPS (automatic with Netlify)
4. Update environment variables with production domains
5. Test all functionality thoroughly

Your application will be live at:
- **Frontend**: https://sarboshaktisonatanisangathan.org
- **Backend API**: https://sarboshakti-backend.onrender.com