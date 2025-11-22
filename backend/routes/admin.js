const express = require('express');
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Contact = require('../models/Contact');
const { generateMembershipCard } = require('../utils/pdfGenerator');
const { generateDonationReceipt } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const { verifyToken } = require('./auth');
const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalMembers,
      totalDonations,
      totalAmount,
      pendingContacts,
      recentMembers,
      recentDonations
    ] = await Promise.all([
      Member.countDocuments({ paymentStatus: 'completed' }),
      Donation.countDocuments({ paymentStatus: 'completed' }),
      Donation.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Contact.countDocuments({ status: 'new' }),
      Member.find({ paymentStatus: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName email membershipType joinDate'),
      Donation.find({ paymentStatus: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('donorName amount purpose donationDate')
    ]);
    
    res.json({
      stats: {
        totalMembers,
        totalDonations,
        totalAmount: totalAmount[0]?.total || 0,
        pendingContacts
      },
      recentMembers,
      recentDonations
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all members
router.get('/members', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const members = await Member.find()
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Member.countDocuments();
    
    res.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Verify member payment
router.post('/members/:id/verify', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    member.paymentStatus = 'completed';
    member.verifiedBy = req.user.userId;
    member.verificationDate = new Date();
    await member.save();
    
    // Generate membership card PDF
    const pdfPath = await generateMembershipCard(member);
    member.cardGenerated = true;
    member.cardPath = pdfPath;
    await member.save();
    
    // Send email with membership card
    await sendEmail({
      to: member.email,
      subject: 'Welcome to Sarboshakti Sanatani Sangathan - Membership Card',
      template: 'membership-card',
      data: { member },
      attachments: [{ path: pdfPath }]
    });
    
    res.json({ success: true, message: 'Member verified and activated successfully' });
  } catch (error) {
    console.error('Member verification error:', error);
    res.status(500).json({ error: 'Failed to verify member' });
  }
});

// Get all donations
router.get('/donations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const donations = await Donation.find()
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Donation.countDocuments();
    
    res.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Verify donation payment
router.post('/donations/:id/verify', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    donation.paymentStatus = 'completed';
    donation.verifiedBy = req.user.userId;
    donation.verificationDate = new Date();
    await donation.save();
    
    // Generate donation receipt PDF
    const pdfPath = await generateDonationReceipt(donation);
    donation.receiptGenerated = true;
    donation.receiptPath = pdfPath;
    await donation.save();
    
    // Send email with receipt
    await sendEmail({
      to: donation.email,
      subject: 'Thank You for Your Donation - Receipt',
      template: 'donation-receipt',
      data: { donation },
      attachments: [{ path: pdfPath }]
    });
    
    res.json({ success: true, message: 'Donation verified successfully' });
  } catch (error) {
    console.error('Donation verification error:', error);
    res.status(500).json({ error: 'Failed to verify donation' });
  }
});

// Get all contacts
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Contact.countDocuments();
    
    res.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

module.exports = router;