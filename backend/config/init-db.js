const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sarboshakti_ngo');
    console.log('✅ Connected to MongoDB');
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: 'admin@sarboshakti.org' });
    
    if (!existingAdmin) {
      // Create default admin user
      const adminUser = new User({
        email: 'admin@sarboshakti.org',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Default admin user created:');
      console.log('📧 Email: admin@sarboshakti.org');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Create indexes for better performance
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Database indexes created');
    
    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

initializeDatabase();