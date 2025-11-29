const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
 
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'https://sarboshaktisonatanisangathan.org',
      'http://localhost:3000',
      'http://localhost:3003',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3003',
      'http://127.0.0.1:5000'
    ],
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Make io available globally
app.set('io', io);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - disabled for development
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'https://sarboshaktisonatanisangathan.org',
    'http://localhost:3000',
    'http://localhost:3003',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3003',
    'http://127.0.0.1:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
try {
  // Import all route files
  const authRoutes = require('./routes/auth');
  const adminRoutes = require('./routes/admin');
  const memberRoutes = require('./routes/members');
  const donationRoutes = require('./routes/donations');
  const contactRoutes = require('./routes/contact');
  const publicRoutes = require('./routes/public');
  const mediaRoutes = require('./routes/media');
  const galleryRoutes = require('./routes/gallery');
  const realtimeRoutes = require('./routes/realtime');
  const testEmailRoutes = require('./routes/test-email');
  const teamRoutes = require('./routes/team');
  const eventsRoutes = require('./routes/events');
  
  // Use routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/admin/gallery', galleryRoutes);
  app.use('/api/admin/team', teamRoutes);
  app.use('/api/admin/events', eventsRoutes);
  app.use('/api', realtimeRoutes);
  app.use('/api/test', testEmailRoutes);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Route loading error:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Sarboshakti Sanatani Sangathan API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      members: '/api/members',
      donations: '/api/donations',
      contact: '/api/contact',
      public: '/api/public',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error:', error);
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`⚡ WebSocket enabled for real-time updates`);
});

module.exports = app;