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
    cb(null, 'uploads/screenshots/');
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

// Register new member
router.post('/register', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { fullName, email, phone, address, state, membershipPlan, amount, upiReference } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
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
      state,
      membershipPlan,
      amount,
      upiReference,
      paymentScreenshot: req.file.path
    });

    await member.save();

    // Create transaction record
    const transaction = new Transaction({
      memberId: member._id,
      type: 'membership',
      amount,
      upiReference,
      paymentScreenshot: req.file.path
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

// Approve member
router.put('/approve/:id', auth, async (req, res) => {
  try {
    const { duration = 12 } = req.body; // Default 12 months
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const validTill = new Date();
    validTill.setMonth(validTill.getMonth() + duration);

    member.status = 'approved';
    member.approvedBy = req.user.id;
    member.approvedAt = new Date();
    member.validTill = validTill;

    await member.save();

    // Update transaction
    await Transaction.findOneAndUpdate(
      { memberId: member._id, type: 'membership' },
      { 
        status: 'approved',
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      }
    );

    // Send approval email
    try {
      await sendMemberApprovalEmail(member);
    } catch (emailError) {
      console.error('Approval email failed:', emailError);
    }

    res.json({ success: true, message: 'Member approved successfully' });
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
    
    await sendMembershipCardEmail(member);
    res.json({ success: true, message: 'Membership card sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;