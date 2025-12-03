const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ email: 'admin@sarboshakti.org' });
    console.log('Deleted existing admin');

    // Create new admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@sarboshakti.org',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ New admin user created successfully');
    console.log('Email: admin@sarboshakti.org');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
}

resetAdmin();