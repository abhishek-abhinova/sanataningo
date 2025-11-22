const express = require('express');
const multer = require('multer');
const Donation = require('../models/Donation');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { sendAdminDonationNotification, sendDonationReceiptEmail, sendThankYouWithReceipt } = require('../utils/emailService');
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// Create donation with UPI screenshot
router.post('/create', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { donorName, email, phone, address, amount, purpose, panNumber, upiReference, isAnonymous } = req.body;
    
    // Validate required fields
    if (!donorName || !email || !phone || !address || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    const donation = new Donation({
      donorName,
      email,
      phone,
      address,
      amount: parseFloat(amount),
      purpose: purpose || 'general',
      panNumber,
      paymentReference: upiReference,
      paymentScreenshot: req.file.path,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      paymentStatus: 'pending'
    });

    await donation.save();

    // Send admin notification
    try {
      await sendAdminDonationNotification(donation);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }
    
    res.json({ 
      success: true, 
      message: 'Donation submitted successfully',
      donationId: donation.donationId || donation._id
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ error: 'Failed to create donation', details: error.message });
  }
});

// Main donation route (handles both with and without file)
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { donorName, email, phone, address, amount, purpose, isAnonymous, panNumber, upiReference, paymentReference } = req.body;
    
    // Validate required fields
    if (!donorName || !email || !phone || !address || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const refNumber = upiReference || paymentReference;
    
    // Validate UPI reference format (12 digits)
    if (!refNumber || !/^\d{12}$/.test(refNumber)) {
      return res.status(400).json({ error: 'UPI reference must be exactly 12 digits' });
    }
    
    // Check for duplicate UPI reference
    const existingDonation = await Donation.findOne({ paymentReference: refNumber });
    if (existingDonation) {
      return res.status(400).json({ error: 'This UPI reference number has already been used' });
    }
    
    const donationData = {
      donorName,
      email,
      phone,
      address,
      amount: parseFloat(amount),
      purpose: purpose || 'general',
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      panNumber,
      paymentReference: refNumber,
      paymentStatus: 'pending'
    };

    if (req.file) {
      donationData.paymentScreenshot = req.file.path;
    }
    
    const donation = new Donation(donationData);
    await donation.save();

    // Send admin notification
    try {
      await sendAdminDonationNotification(donation);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }
    
    res.json({
      success: true,
      message: 'Donation submitted successfully. Payment verification pending.',
      donation: {
        donationId: donation.donationId,
        donorName: donation.donorName,
        amount: donation.amount,
        purpose: donation.purpose,
        paymentReference: donation.paymentReference
      }
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ error: 'Failed to create donation', details: error.message });
  }
});



// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation' });
  }
});

// Approve donation (Admin only)
router.put('/:id/approve', auth, async (req, res) => {
  try {
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
      await sendDonationReceiptEmail(donation);
    } catch (emailError) {
      console.error('Receipt email failed:', emailError);
    }

    res.json({ success: true, message: 'Donation approved and receipt sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject donation (Admin only)
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: 'rejected',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        rejectionReason: reason
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({ success: true, message: 'Donation rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donations (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.paymentStatus = status;

    const donations = await Donation.find(query)
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending donations for admin
router.get('/pending', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ paymentStatus: 'pending' })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send thank you email
router.post('/:id/send-thank-you', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    await sendThankYouWithReceipt(donation);
    res.json({ success: true, message: 'Thank you email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;