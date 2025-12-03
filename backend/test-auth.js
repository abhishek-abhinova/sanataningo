const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const testAuth = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user exists
    let admin = await User.findOne({ email: 'admin@sarboshakti.org' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = new User({
        name: 'Admin',
        email: 'admin@sarboshakti.org',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user exists');
      
      // Test password
      const isMatch = await admin.comparePassword('admin123');
      console.log('🔐 Password test:', isMatch ? 'PASS' : 'FAIL');
      
      if (!isMatch) {
        console.log('🔧 Resetting admin password...');
        admin.password = await bcrypt.hash('admin123', 10);
        await admin.save();
        console.log('✅ Admin password reset to: admin123');
      }
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log('Email: admin@sarboshakti.org');
    console.log('Password: admin123');
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testAuth();