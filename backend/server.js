const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { testConnection, closePool } = require('./config/mysql-connection');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      'https://sarboshaktisonatanisangathan.org',
      'https://www.sarboshaktisonatanisangathan.org',
      'http://localhost:3000'
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
    'https://www.sarboshaktisonatanisangathan.org',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// MySQL Connection Test
const initializeDatabase = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to MySQL database');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    process.exit(1);
  }
};

initializeDatabase();


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
  const activitiesRoutes = require('./routes/activities');
  const hostingerUploadRoutes = require('./routes/hostinger-upload');
  const databaseUploadRoutes = require('./routes/database-upload');
  const publicTeamRoutes = require('./routes/public-team');

  // Use routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/public', publicTeamRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/activities', activitiesRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/hostinger', hostingerUploadRoutes);
  app.use('/api/database', databaseUploadRoutes);
  app.use('/api', realtimeRoutes);
  app.use('/api/test', testEmailRoutes);
  app.use('/api/simple-email', require('./routes/test-simple-email'));
  app.use('/api/render-email', require('./routes/test-render-email'));
  app.use('/api/cloudinary', require('./routes/cloudinary-upload'));

  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Route loading error:', error.message);
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: isConnected ? 'Connected' : 'Disconnected',
      databaseType: 'MySQL',
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message
    });
  }
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
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await closePool();
  console.log('MySQL connection pool closed');
  process.exit(0);
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
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`⚡ WebSocket enabled for real-time updates`);
});

module.exports = app;
