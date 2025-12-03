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
    
    // Create sample data if none exists
    const Member = require('../models/Member');
    const Donation = require('../models/Donation');
    const Contact = require('../models/Contact');
    
    const memberCount = await Member.countDocuments();
    if (memberCount === 0) {
      const sampleMembers = [
        {
          memberId: 'SSS000001',
          fullName: 'Rajesh Kumar Singh',
          email: 'rajesh@example.com',
          phone: '9876543210',
          address: 'Delhi, India',
          dateOfBirth: new Date('1985-05-15'),
          occupation: 'Software Engineer',
          aadhaarNumber: '123456789012',
          aadhaarFront: '/uploads/aadhaar/sample-front.jpg',
          aadhaarBack: '/uploads/aadhaar/sample-back.jpg',
          state: 'Delhi',
          membershipPlan: 'premium',
          amount: 500,
          upiReference: '123456789012',
          paymentScreenshot: '/uploads/payments/sample.jpg',
          status: 'approved',
          validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        {
          memberId: 'SSS000002',
          fullName: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '9876543211',
          address: 'Mumbai, India',
          dateOfBirth: new Date('1990-08-20'),
          occupation: 'Teacher',
          aadhaarNumber: '123456789013',
          aadhaarFront: '/uploads/aadhaar/sample-front2.jpg',
          aadhaarBack: '/uploads/aadhaar/sample-back2.jpg',
          state: 'Maharashtra',
          membershipPlan: 'basic',
          amount: 100,
          upiReference: '123456789013',
          paymentScreenshot: '/uploads/payments/sample2.jpg',
          status: 'pending'
        },
        {
          memberId: 'SSS000003',
          fullName: 'Amit Patel',
          email: 'amit@example.com',
          phone: '9876543212',
          address: 'Gujarat, India',
          dateOfBirth: new Date('1980-12-10'),
          occupation: 'Business Owner',
          aadhaarNumber: '123456789014',
          aadhaarFront: '/uploads/aadhaar/sample-front3.jpg',
          aadhaarBack: '/uploads/aadhaar/sample-back3.jpg',
          state: 'Gujarat',
          membershipPlan: 'lifetime',
          amount: 2000,
          upiReference: '123456789014',
          paymentScreenshot: '/uploads/payments/sample3.jpg',
          status: 'approved'
        }
      ];
      
      for (const memberData of sampleMembers) {
        const member = new Member(memberData);
        await member.save();
      }
      console.log('✅ Sample members created');
    }
    
    const donationCount = await Donation.countDocuments();
    if (donationCount === 0) {
      const sampleDonations = [
        {
          donorName: 'Suresh Gupta',
          email: 'suresh@example.com',
          phone: '9876543213',
          amount: 1000,
          purpose: 'Education Support',
          paymentMethod: 'UPI',
          upiReference: '123456789015',
          paymentStatus: 'completed'
        },
        {
          donorName: 'Meera Joshi',
          email: 'meera@example.com',
          phone: '9876543214',
          amount: 500,
          purpose: 'Healthcare',
          paymentMethod: 'UPI',
          upiReference: '123456789016',
          paymentStatus: 'completed'
        }
      ];
      
      await Donation.insertMany(sampleDonations);
      console.log('✅ Sample donations created');
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