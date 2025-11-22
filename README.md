# Sarboshakti Sanatani Sangathan - Full Stack React Application

A complete full-stack web application for Sarboshakti Sanatani Sangathan NGO built with React frontend and Node.js backend with MongoDB database.

## 🚀 Features

### Frontend (React)
- **Modern React Application** with hooks and functional components
- **Dark Mode Navigation** with attractive styling and proper spacing
- **Responsive Design** optimized for all devices with enhanced mobile experience
- **Interactive Slideshow** on homepage with smooth transitions
- **Framer Motion Animations** for enhanced user experience
- **React Router** for seamless navigation
- **React Hook Form** for form validation and handling
- **Razorpay Integration** for secure payments
- **Toast Notifications** for user feedback
- **Premium UI/UX** with modern design patterns
- **Enhanced Thank You Pages** with dynamic content based on user actions
- **Admin Dashboard** with comprehensive management interface

### Backend (Node.js + Express)
- **RESTful API** with Express.js
- **MongoDB Integration** with Mongoose ODM
- **JWT Authentication** for admin panel
- **Payment Processing** with Razorpay
- **Email Service** with automated receipts and confirmations
- **PDF Generation** for membership cards and donation receipts
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **File Upload** handling with Multer

### Key Functionalities
- ✅ **Membership Registration** with payment integration
- ✅ **Donation Processing** with receipt generation
- ✅ **Contact Form** with email notifications
- ✅ **Admin Dashboard** for data management
- ✅ **PDF Generation** for cards and receipts
- ✅ **Email Automation** with HTML templates
- ✅ **Payment Verification** with webhooks
- ✅ **Responsive Gallery** with image optimization

## 📁 Project Structure

```
sarboshakti-react-app/
├── frontend/                 # React Frontend
│   ├── public/
│   │   ├── images/          # All website images
│   │   └── index.html       # Main HTML template
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── Navbar.js    # Navigation component
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js      # Homepage with slideshow
│   │   │   ├── About.js     # About page
│   │   │   ├── Activities.js # Activities page
│   │   │   ├── Gallery.js   # Gallery page
│   │   │   ├── Membership.js # Membership form
│   │   │   ├── Donate.js    # Donation form
│   │   │   ├── Contact.js   # Contact form
│   │   │   └── ThankYou.js  # Success page
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js Backend
│   ├── models/              # MongoDB models
│   │   ├── Member.js        # Member schema
│   │   ├── Donation.js      # Donation schema
│   │   ├── Contact.js       # Contact schema
│   │   └── User.js          # Admin user schema
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── members.js       # Membership routes
│   │   ├── donations.js     # Donation routes
│   │   ├── contact.js       # Contact routes
│   │   ├── admin.js         # Admin routes
│   │   └── public.js        # Public API routes
│   ├── utils/               # Utility functions
│   │   ├── emailService.js  # Email handling
│   │   ├── paymentService.js # Payment processing
│   │   └── pdfGenerator.js  # PDF generation
│   ├── config/              # Configuration files
│   │   └── init-db.js       # Database initialization
│   ├── uploads/             # Generated files
│   │   ├── cards/           # Membership cards
│   │   └── receipts/        # Donation receipts
│   ├── server.js            # Main server file
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
├── package.json             # Root package.json
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sarboshakti-react-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Environment Configuration

Create `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sarboshakti_ngo
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000

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

Create `.env` file in the `frontend` directory:
```env
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### 4. Database Setup
```bash
# Initialize MongoDB database with admin user
cd backend
npm run init-db
```

### 5. Start the Application

**Quick Start (Windows):**
```bash
# Double-click or run:
start-dev.bat
```

**Quick Start (Linux/Mac):**
```bash
# Make executable and run:
chmod +x start-dev.sh
./start-dev.sh
```

**Manual Start:**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
# Backend only (with auto-restart)
npm run server

# Frontend only
npm run client
```

**Access Points:**
- 📱 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 🛡️ **Admin Panel**: http://localhost:3000/admin

**Default Admin Credentials:**
- Email: `admin@sarboshakti.org`
- Password: `admin123`

## 🌐 API Endpoints

### Public APIs
- `POST /api/members` - Create membership
- `POST /api/members/verify` - Verify membership payment
- `POST /api/donations` - Create donation
- `POST /api/donations/verify` - Verify donation payment
- `POST /api/contact` - Submit contact form
- `GET /api/public/info` - Get organization info
- `GET /api/public/team` - Get team members
- `GET /api/public/gallery` - Get gallery images
- `GET /api/public/activities` - Get activities data

### Admin APIs (Authenticated)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/members` - List all members
- `GET /api/admin/donations` - List all donations
- `GET /api/admin/contacts` - List all contacts

## 💳 Payment Integration

The application uses **Razorpay** for secure payment processing:

1. **Membership Payments**: ₹100 (Basic), ₹500 (Premium), ₹2000 (Lifetime)
2. **Donations**: Custom amounts with predefined options
3. **Payment Verification**: Server-side signature verification
4. **Automated Receipts**: PDF generation and email delivery
5. **Tax Benefits**: 80G receipts for donations

## 📧 Email System

Automated email notifications include:
- **Membership Welcome**: With digital membership card
- **Donation Receipt**: With tax benefit information
- **Contact Confirmation**: Acknowledgment of inquiries
- **Admin Notifications**: For new submissions

## 🔐 Security Features

- **JWT Authentication** for admin access
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests
- **Helmet Security** headers
- **Input Validation** on all forms
- **Payment Signature Verification**

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 UI/UX Features

- **Modern Design** with premium aesthetics
- **Smooth Animations** using Framer Motion
- **Interactive Elements** with hover effects
- **Loading States** for better user experience
- **Toast Notifications** for feedback
- **Form Validation** with error messages
- **Accessibility** compliant components

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
```bash
cd backend
# Set NODE_ENV=production in environment variables
# Deploy to your server (Heroku, AWS, etc.)
```

### Environment Variables for Production
- Update `MONGODB_URI` to production database
- Set strong `JWT_SECRET`
- Configure production email credentials
- Update `FRONTEND_URL` to production domain
- Set up Razorpay production keys

## 🔧 Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Adding New Features

1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Add components in `frontend/src/components/` or pages in `frontend/src/pages/`
3. **Database**: Add models in `backend/models/`
4. **Utilities**: Add helper functions in `backend/utils/`

## 📞 Support

For technical support or questions:
- **Email**: info@sarboshakti.org
- **Phone**: +91 XXXXX XXXXX

## 📄 License

This project is developed for Sarboshakti Sanatani Sangathan. All rights reserved.

---

**Sarboshakti Sanatani Sangathan**  
*Serving Humanity through Sanatan Dharma Values*

🕉️ **Dharma • Seva • Sanskriti • Samaj** 🕉️