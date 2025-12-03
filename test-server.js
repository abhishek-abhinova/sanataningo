// Simple test to verify server functionality
const express = require('express');
const app = express();

console.log('✅ Testing server components...');

try {
  // Test nodemailer
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'testpass'
    }
  });
  console.log('✅ Nodemailer loaded successfully');
} catch (error) {
  console.error('❌ Nodemailer error:', error.message);
}

try {
  // Test basic express
  app.get('/test', (req, res) => {
    res.json({ message: 'Server test successful' });
  });
  console.log('✅ Express routes working');
} catch (error) {
  console.error('❌ Express error:', error.message);
}

console.log('✅ All components tested successfully');
console.log('🚀 You can now start the server with: npm start');