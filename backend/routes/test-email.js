const express = require('express');
const router = express.Router();
const { sendThankYouWithReceipt, sendMembershipCardWithPDF } = require('../utils/emailService');
const { generateMembershipCard, generateDonationReceipt } = require('../utils/cardGenerator');

// Test donation thank you email
router.post('/test-donation-email', async (req, res) => {
  try {
    const testDonation = {
      _id: 'test123',
      donationId: 'TEST-DONATION-001',
      donorName: 'Abhishek Kumar',
      email: 'abhisheks200426@gmail.com',
      phone: '+91 9876543210',
      address: 'Test Address, Test City',
      amount: 1000,
      purpose: 'General Donation',
      paymentReference: '123456789012',
      createdAt: new Date()
    };

    await sendThankYouWithReceipt(testDonation);
    res.json({ success: true, message: 'Test donation thank you email sent to abhisheks200426@gmail.com' });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test membership card email
router.post('/test-membership-email', async (req, res) => {
  try {
    const testMember = {
      _id: 'test456',
      memberId: 'TEST-MEMBER-001',
      fullName: 'Abhishek Kumar',
      email: 'abhisheks200426@gmail.com',
      phone: '+91 9876543210',
      dateOfBirth: new Date('1990-01-01'),
      aadhaarNumber: '123456789012',
      membershipPlan: 'basic',
      validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };

    // Generate card and send email
    const cardPath = await generateMembershipCard(testMember);
    await sendMembershipCardWithPDF(testMember, cardPath);
    
    res.json({ success: true, message: 'Test membership card email sent to abhisheks200426@gmail.com' });
  } catch (error) {
    console.error('Test membership email failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test simple thank you email
router.post('/test-simple-thank-you', async (req, res) => {
  try {
    const testDonation = {
      _id: 'test789',
      donationId: 'SIMPLE-TEST-001',
      donorName: 'Abhishek Kumar',
      email: 'abhisheks200426@gmail.com',
      phone: '+91 9876543210',
      address: 'Test Address, Test City',
      amount: 500,
      purpose: 'Test Donation',
      paymentReference: '123456789012',
      createdAt: new Date()
    };

    console.log('🧪 Testing simple thank you email...');
    await sendThankYouWithReceipt(testDonation);
    
    res.json({ success: true, message: 'Simple thank you email test completed - check server logs' });
  } catch (error) {
    console.error('Simple thank you test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;