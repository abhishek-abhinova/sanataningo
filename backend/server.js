process.noDeprecation = true;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const contactRoutes = require('./routes/contact');
const transactionRoutes = require('./routes/transactions');
const mediaRoutes = require('./routes/media');
const eventRoutes = require('./routes/events');
const settingsRoutes = require('./routes/settings');
const galleryRoutes = require('./routes/gallery');
const teamRoutes = require('./routes/team');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sarboshakti_ngo')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Security middleware - simplified to avoid conflicts
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP to avoid HTML injection issues
}));

// CORS configuration with explicit preflight handling
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://sarboshaktisonatanisangathan.org',
      'https://www.sarboshaktisonatanisangathan.org',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More restrictive in production
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  // Only log API requests to avoid HTML content
  if (req.url.startsWith('/api/')) {
    console.log(`🔍 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files - ensure proper content types
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpeg') || path.endsWith('.jpg') || path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes with error handling
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/team', teamRoutes);
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Route loading error:', error);
}

// Health check
app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sarboshakti Sanatani Sangathan API',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      members: '/api/members',
      donations: '/api/donations',
      contact: '/api/contact',
      admin: '/api/admin',
      public: '/api/public'
    }
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Prevent HTML output in console
  const errorInfo = {
    message: err.message,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  };
  
  console.error('❌ Server Error:', errorInfo);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base: ${process.env.NODE_ENV === 'production' ? `https://your-app.onrender.com/api` : `http://localhost:${PORT}/api`}`);
  console.log(`🛡️ Health Check: ${process.env.NODE_ENV === 'production' ? `https://your-app.onrender.com/api/health` : `http://localhost:${PORT}/api/health`}`);
  console.log(`📧 Email Service: ${process.env.SMTP_HOST ? '✅ Configured' : '❌ Not Configured'}`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
});

module.exports = app;