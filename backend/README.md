# Sarboshakti Sanatani Sangathan - Backend API

Backend API for Sarboshakti Sanatani Sangathan NGO built with Node.js, Express, and MongoDB.

## 🚀 Features

- RESTful API with Express.js
- MongoDB integration with Mongoose
- JWT authentication for admin panel
- Payment processing with Razorpay
- Email service with automated receipts
- PDF generation for membership cards
- Security middleware (Helmet, CORS, Rate Limiting)
- File upload handling with Multer

## 📋 Environment Variables

Set these environment variables in your deployment platform:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password

# Organization Details
ORG_NAME=Sarboshakti Sanatani Sangathan
ORG_ADDRESS=K-11, S/F, Gali No. 6, Old Gobind Pura, Delhi — 110051, India
ORG_EMAIL=info@sarboshaktisonatanisangathan.org
ORG_PHONE=+91 9876543210
```

## 🌐 API Endpoints

### Public APIs
- `POST /api/members` - Create membership
- `POST /api/donations` - Create donation
- `POST /api/contact` - Submit contact form
- `GET /api/public/info` - Get organization info
- `GET /api/health` - Health check

### Admin APIs (Authenticated)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/members` - List all members
- `GET /api/admin/donations` - List all donations

## 🚀 Deployment on Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Set environment variables in Render dashboard
4. Deploy automatically

### Render Configuration
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node.js
- **Plan**: Free tier available

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Initialize database
npm run init-db
```

## 📁 Project Structure

```
backend/
├── config/          # Database configuration
├── middleware/      # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # File uploads
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## 📞 Support

For technical support: info@sarboshaktisonatanisangathan.org