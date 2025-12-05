const express = require('express');
const multer = require('multer');
const path = require('path');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { sendMembershipCardEmail } = require('../utils/emailServiceMember');

const router = express.Router();

// Configure multer for file uploads - Store in frontend public directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'paymentScreenshot') {
      const uploadPath = path.join(__dirname, '../../frontend/public/uploads/screenshots');
      if (!require('fs').existsSync(uploadPath)) {
        require('fs').mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } else if (file.fieldname === 'aadhaarFront' || file.fieldname === 'aadhaarBack') {
      const uploadPath = path.join(__dirname, '../../frontend/public/uploads/aadhaar');
      if (!require('fs').existsSync(uploadPath)) {
        require('fs').mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } else {
      const uploadPath = path.join(__dirname, '../../frontend/public/uploads');
      if (!require('fs').existsSync(uploadPath)) {
        require('fs').mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
    const { fullName, email, phone, address, city, state, pincode, dateOfBirth, aadhaarNumber, membershipPlan, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const resolvedMembershipPlan = membershipPlan || req.body.membershipType;
    const resolvedAmount = amount || (resolvedMembershipPlan === 'basic' ? 100 : resolvedMembershipPlan === 'premium' ? 500 : resolvedMembershipPlan === 'lifetime' ? 2000 : undefined);

    // Simple validation - at least basic fields required
    if (!fullName || !email || !phone || !resolvedMembershipPlan || !resolvedAmount) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Prepare member data
    const memberData = {
      full_name: fullName,
      email,
      phone,
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      date_of_birth: dateOfBirth || null,
      aadhaar_number: aadhaarNumber || '',
      aadhaar_front_image: req.files?.aadhaarFront ? `/uploads/aadhaar/${req.files.aadhaarFront[0].filename}` : '',
      aadhaar_back_image: req.files?.aadhaarBack ? `/uploads/aadhaar/${req.files.aadhaarBack[0].filename}` : '',
      membership_type: resolvedMembershipPlan,
      membership_fee: resolvedAmount,
      payment_status: razorpay_payment_id ? 'completed' : 'pending',
      payment_id: req.files?.paymentScreenshot ? `/uploads/screenshots/${req.files.paymentScreenshot[0].filename}` : '',
      razorpay_order_id: razorpay_order_id || '',
      razorpay_payment_id: razorpay_payment_id || '',
      razorpay_signature: razorpay_signature || ''
    };

    const member = await Member.create(memberData);

    // Send admin notification for new member registration
    try {
      await sendAdminMemberNotification({
        fullName: member.full_name,
        email: member.email,
        phone: member.phone,
        membershipPlan: member.membership_type,
        amount: member.membership_fee,
        upiReference: req.body.upiReference || 'N/A'
      });
    } catch (emailError) {
      console.error('Admin notification failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Membership application submitted successfully. You will receive a confirmation email once your membership is approved.',
      member: {
        memberId: member.member_id || `SSS${String(member.id).padStart(6, '0')}`,
        fullName: member.full_name,
        email: member.email,
        phone: member.phone,
        membershipPlan: member.membership_type,
        amount: member.membership_fee
      }
    });
  } catch (error) {
    console.error('Member registration error:', error);
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
      // Map member data for email
      const mappedMember = {
        memberId: member.member_id,
        fullName: member.full_name,
        email: member.email,
        membershipPlan: member.membership_type,
        validTill: validTill
      };

      console.log('📧 Sending membership card email to:', mappedMember.email);
      await sendMembershipCardEmail(mappedMember);
      console.log('✅ Membership card sent successfully to', mappedMember.email);

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
    // Map member data for email
    const mappedMember = {
      memberId: member.member_id,
      fullName: member.full_name,
      email: member.email,
      membershipPlan: member.membership_type,
      validTill: member.valid_till
    };

    console.log('📧 Sending membership card email to:', mappedMember.email);
    await sendMembershipCardEmail(mappedMember);
    console.log('✅ Membership card sent successfully to', mappedMember.email);

    res.json({ success: true, message: 'Membership card sent successfully to ' + mappedMember.email });
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

    // Send receipt email
    try {
      const { sendDonationReceiptWithPDF } = require('../utils/emailServiceGmail');
      console.log('📧 Sending donation receipt email to:', donation.email);
      await sendDonationReceiptWithPDF(donation);
      console.log('✅ Donation receipt sent successfully');
    } catch (error) {
      console.error('❌ Receipt email failed:', error);
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

    const { sendDonationReceiptWithPDF } = require('../utils/emailServiceGmail');
    await sendDonationReceiptWithPDF(donation);
    
    donation.receiptGenerated = true;
    await donation.save();

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
    console.log('📧 Sending membership card email to:', member.email);
    await sendMembershipCardEmail(member);
    console.log('✅ Membership card sent successfully to', member.email);

    res.json({ success: true, message: 'Membership card sent successfully to ' + member.email });
  } catch (error) {
    console.error('❌ Failed to send membership card:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
