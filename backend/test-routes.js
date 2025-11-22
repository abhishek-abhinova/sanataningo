const express = require('express');
require('dotenv').config();

const app = express();

// Test if routes can be loaded
try {
  const galleryRoutes = require('./routes/gallery');
  const teamRoutes = require('./routes/team');
  const eventRoutes = require('./routes/events');
  
  console.log('✅ Gallery routes loaded');
  console.log('✅ Team routes loaded');
  console.log('✅ Event routes loaded');
  
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/events', eventRoutes);
  
  console.log('✅ All routes registered successfully');
} catch (error) {
  console.error('❌ Route loading error:', error.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});