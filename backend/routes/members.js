const express = require('express');
const multer = require('multer');
const path = require('path');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { sendAdminMemberNotification, sendMemberApprovalEmail, sendMembershipCardEmail } = require('../utils/emailService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'paymentScreenshot') {
      cb(null, 'uploads/screenshots/');
    } else if (file.fieldname === 'aadhaarFront' || file.fieldname === 'aadhaarBack') {
      cb(null, 'uploads/aadhaar/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// Register new member (PUBLIC - no auth required)
router.post('/register', upload.fields([
  { name: 'paymentScreenshot', maxCount: 1 },
  { name: 'aadhaarFront', maxCount: 1 },
  { name: 'aadhaarBack', maxCount: 1 }
]), async (req, res) => {
  try {
    const { fullName, email, phone, address, dateOfBirth, occupation, aadhaarNumber, membershipPlan, amount, upiReference } = req.body;
    
    if (!req.files || !req.files.paymentScreenshot || !req.files.aadhaarFront || !req.files.aadhaarBack) {
      return res.status(400).json({ error: 'Payment screenshot and both Aadhaar card images are required' });
    }
    
    // Validate UPI reference format (12 digits)
    if (!upiReference || !/^\d{12}$/.test(upiReference)) {
      return res.status(400).json({ error: 'UPI reference must be exactly 12 digits' });
    }
    
    // Check for duplicate UPI reference
    const existingMember = await Member.findOne({ upiReference });
    if (existingMember) {
      return res.status(400).json({ error: 'This UPI reference number has already been used' });
    }

    const member = new Member({
      fullName,
      email,
      phone,
      address,
      dateOfBirth,
      occupation,
      aadhaarNumber,
      aadhaarFront: req.files.aadhaarFront[0].path,
      aadhaarBack: req.files.aadhaarBack[0].path,
      state: 'Delhi', // Default state, can be made dynamic
      membershipPlan,
      amount,
      upiReference,
      paymentScreenshot: req.files.paymentScreenshot[0].path
    });

    await member.save();

    // Create transaction record
    const transaction = new Transaction({
      memberId: member._id,
      type: 'membership',
      amount,
      upiReference,
      paymentScreenshot: req.files.paymentScreenshot[0].path
    });

    await transaction.save();

    // Send admin notification
    try {
      await sendAdminMemberNotification(member);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.json({ 
      success: true, 
      message: 'Membership application submitted successfully',
      member: {
        memberId: member.memberId,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        membershipPlan: member.membershipPlan,
        amount: member.amount,
        upiReference: member.upiReference
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all members (Admin only)
router.get('/list', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { memberId: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await Member.find(query)
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get member by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('approvedBy', 'name email');
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve member and send card
router.put('/approve/:id', auth, async (req, res) => {
  try {
    const { duration = 12 } = req.body;
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const validTill = new Date();
    if (member.membershipPlan === 'lifetime') {
      validTill.setFullYear(validTill.getFullYear() + 50); // 50 years for lifetime
    } else {
      validTill.setMonth(validTill.getMonth() + duration);
    }

    member.status = 'approved';
    member.approvedBy = req.user.id;
    member.approvedAt = new Date();
    member.validTill = validTill;
    member.cardGenerated = true;

    await member.save();

    // Generate and send membership card automatically
    try {
      const { generateMembershipCard } = require('../utils/cardGenerator');
      const { sendMembershipCardWithPDF } = require('../utils/emailService');
      
      console.log('🎫 Generating membership card for:', member.fullName);
      const cardPath = await generateMembershipCard(member);
      member.cardFile = cardPath;
      await member.save();
      
      console.log('📧 Sending membership card email to:', member.email);
      await sendMembershipCardWithPDF(member, cardPath);
      console.log('✅ Membership card sent successfully to', member.email);
      
      res.json({ success: true, message: 'Member approved and ID card sent to email successfully' });
    } catch (error) {
      console.error('❌ Card generation/email failed:', error);
      res.json({ success: true, message: 'Member approved but failed to send ID card. Please resend manually.', warning: error.message });
    }
  } catch (error) {
    console.error('❌ Member approval failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send membership card
router.post('/member/send-card/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const { generateMembershipCard } = require('../utils/cardGenerator');
    const { sendMembershipCardWithPDF } = require('../utils/emailService');
    
    console.log('🎫 Generating membership card for:', member.fullName);
    const cardPath = await generateMembershipCard(member);
    member.cardFile = cardPath;
    member.cardGenerated = true;
    await member.save();
    
    console.log('📧 Sending membership card email to:', member.email);
    await sendMembershipCardWithPDF(member, cardPath);
    console.log('✅ Membership card sent successfully to', member.email);
    
    res.json({ success: true, message: 'Membership card sent successfully to ' + member.email });
  } catch (error) {
    console.error('❌ Failed to send membership card:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve donation and send receipt
router.post('/donation/approve/:id', auth, async (req, res) => {
  try {
    const Donation = require('../models/Donation');
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    donation.paymentStatus = 'approved';
    donation.approvedBy = req.user.id;
    donation.approvedAt = new Date();
    donation.receiptGenerated = true;

    await donation.save();

    // Generate and send receipt automatically
    try {
      const { generateDonationReceipt } = require('../utils/cardGenerator');
      const { sendDonationReceiptWithPDF } = require('../utils/emailService');
      
      console.log('🧾 Generating donation receipt for:', donation.donorName);
      const receiptPath = await generateDonationReceipt(donation);
      donation.receiptFile = receiptPath;
      await donation.save();
      
      console.log('📧 Sending donation receipt email to:', donation.email);
      await sendDonationReceiptWithPDF(donation, receiptPath);
      console.log('✅ Donation receipt sent successfully');
    } catch (error) {
      console.error('❌ Receipt generation/email failed:', error);
      // Don't fail the approval if receipt sending fails
    }

    res.json({ success: true, message: 'Donation approved and receipt sent to email successfully' });
  } catch (error) {
    console.error('❌ Donation approval failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send donation receipt
router.post('/donation/send-receipt/:id', auth, async (req, res) => {
  try {
    const Donation = require('../models/Donation');
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    const { generateDonationReceipt } = require('../utils/cardGenerator');
    const { sendDonationReceiptEmail } = require('../utils/emailService');
    
    const receiptPath = await generateDonationReceipt(donation);
    donation.receiptFile = receiptPath;
    donation.receiptGenerated = true;
    await donation.save();
    
    const { sendDonationReceiptWithPDF } = require('../utils/emailService');
    await sendDonationReceiptWithPDF(donation, receiptPath);
    
    res.json({ success: true, message: 'Receipt sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject member
router.put('/reject/:id', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.status = 'rejected';
    member.rejectionReason = reason;
    member.approvedBy = req.user.id;
    member.approvedAt = new Date();

    await member.save();

    // Update transaction
    await Transaction.findOneAndUpdate(
      { memberId: member._id, type: 'membership' },
      { 
        status: 'rejected',
        verifiedBy: req.user.id,
        verifiedAt: new Date(),
        rejectionReason: reason
      }
    );

    res.json({ success: true, message: 'Member rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suspend member
router.put('/suspend/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended' },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ success: true, message: 'Member suspended' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extend membership
router.put('/extend/:id', auth, async (req, res) => {
  try {
    const { months } = req.body;
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const newValidTill = new Date(member.validTill || new Date());
    newValidTill.setMonth(newValidTill.getMonth() + months);

    member.validTill = newValidTill;
    await member.save();

    res.json({ success: true, message: `Membership extended by ${months} months` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send membership card
router.post('/:id/send-card', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const { generateMembershipCard } = require('../utils/cardGenerator');
    const { sendMembershipCardWithPDF } = require('../utils/emailService');
    
    console.log('🎫 Generating membership card for:', member.fullName);
    const cardPath = await generateMembershipCard(member);
    member.cardFile = cardPath;
    member.cardGenerated = true;
    await member.save();
    
    console.log('📧 Sending membership card email to:', member.email);
    await sendMembershipCardWithPDF(member, cardPath);
    console.log('✅ Membership card sent successfully to', member.email);
    
    res.json({ success: true, message: 'Membership card sent successfully to ' + member.email });
  } catch (error) {
    console.error('❌ Failed to send membership card:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;