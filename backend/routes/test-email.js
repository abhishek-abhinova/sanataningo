const express = require('express');
const router = express.Router();
const { sendThankYouWithReceipt, sendMembershipCardWithPDF, sendDonationReceiptWithPDF } = require('../utils/emailService');
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

// Test donation receipt with PDF
router.post('/test-donation-receipt-pdf', async (req, res) => {
  try {
    const { email } = req.body;
    const testEmail = email || 'abhisheks200426@gmail.com';
    
    const testDonation = {
      _id: 'test-receipt-pdf',
      donationId: 'TEST-RECEIPT-PDF-001',
      donorName: 'Test Donor',
      email: testEmail,
      phone: '+91 9876543210',
      amount: 1000,
      purpose: 'Test Donation',
      paymentReference: 'TEST123456789',
      donationDate: new Date(),
      createdAt: new Date()
    };

    console.log('🧪 Testing donation receipt PDF email to:', testEmail);
    
    // Generate PDF receipt
    const receiptPath = await generateDonationReceipt(testDonation);
    console.log('✅ PDF generated at:', receiptPath);
    
    // Send email with PDF
    const result = await sendDonationReceiptWithPDF(testDonation, receiptPath);
    
    res.json({ 
      success: true, 
      message: `Test donation receipt PDF email sent to ${testEmail}`,
      details: {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected
      }
    });
  } catch (error) {
    console.error('Test donation receipt PDF failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response || error.code || 'Unknown error'
    });
  }
});

// Test SMTP configuration
router.get('/test-smtp-config', async (req, res) => {
  try {
    const config = {
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
      SMTP_USER: process.env.SMTP_USER || 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? '***SET***' : 'NOT SET',
      ORG_EMAIL: process.env.ORG_EMAIL || 'NOT SET',
      ORG_NAME: process.env.ORG_NAME || 'NOT SET'
    };
    
    // Try to verify transporter
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    await transporter.verify();
    
    res.json({ 
      success: true, 
      message: 'SMTP configuration is valid',
      config: config
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'SMTP configuration is invalid',
      message: error.message,
      config: {
        SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
        SMTP_PORT: process.env.SMTP_PORT || 'NOT SET',
        SMTP_USER: process.env.SMTP_USER || 'NOT SET',
        SMTP_PASS: process.env.SMTP_PASS ? '***SET***' : 'NOT SET'
      }
    });
  }
});

module.exports = router;