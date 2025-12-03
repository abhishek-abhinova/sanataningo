const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete existing admin user if exists
    await User.deleteOne({ email: 'admin@sarboshakti.org' });
    
    // Create new admin user
    const adminUser = new User({
      email: 'admin@sarboshakti.org',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      isActive: true
    });
    
    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@sarboshakti.org');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();