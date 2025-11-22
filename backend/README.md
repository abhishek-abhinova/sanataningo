# Sarboshakti Backend API

Backend API for Sarboshakti Sanatani Sangathan NGO built with Node.js, Express, and MongoDB.

## 🚀 Quick Deploy to Render

### 1. Push to GitHub
```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the backend folder or root directory
5. Configure:
   - **Name**: `sarboshakti-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://sangathan:abhishek@cluster0.walx5w1.mongodb.net/sarboshakti_ngo
JWT_SECRET=sarboshakti-jwt-secret-2024-production-key
FRONTEND_URL=https://your-frontend-domain.com
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@sarboshaktisonatanisangathan.org
SMTP_PASS=Sangathan@123
ORG_NAME=Sarboshakti Sanatani Sangathan
ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_PHONE=+91 9876543210
```

## 📡 API Endpoints

### Public APIs
- `GET /api/health` - Health check
- `POST /api/members` - Create membership
- `POST /api/donations` - Create donation
- `POST /api/contact` - Submit contact form
- `GET /api/public/*` - Public data

### Admin APIs (Authenticated)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/members` - List members
- `GET /api/admin/donations` - List donations

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Initialize database
npm run init-db
```

## 🛡️ Security Features
- JWT Authentication
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- Input Validation
- Password Hashing

## 📦 Dependencies
- Express.js - Web framework
- Mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT tokens
- nodemailer - Email service
- puppeteer - PDF generation
- multer - File uploads