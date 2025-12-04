const express = require('express');
const multer = require('multer');
const Donation = require('../models/Donation');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { sendAdminDonationNotification, sendThankYouWithReceipt } = require('../utils/emailService');
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
    const { donorName, email, phone, amount, purpose, panNumber, isAnonymous, razorpay_order_id, razorpay_payment_id, razorpay_signature, message } = req.body;

    // Validate required fields
    if (!donorName || !email || !phone || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const donationData = {
      donor_name: donorName,
      email,
      phone,
      amount: parseFloat(amount),
      donation_type: purpose || 'general',
      message: message || '',
      is_anonymous: isAnonymous === 'true' || isAnonymous === true,
      pan_number: panNumber || '',
      payment_status: razorpay_payment_id ? 'completed' : 'pending',
      payment_id: req.file ? req.file.path : '',
      razorpay_order_id: razorpay_order_id || '',
      razorpay_payment_id: razorpay_payment_id || '',
      razorpay_signature: razorpay_signature || '',
      tax_benefit: true
    };

    const donation = await Donation.create(donationData);

    // Email will be sent only after admin approval
    // Removed automatic email sending to avoid duplicate emails

    res.json({
      success: true,
      message: 'Donation submitted successfully. Thank you email sent!',
      donationId: donation.receipt_number || `DON${String(donation.id).padStart(6, '0')}`
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ error: 'Failed to create donation', details: error.message });
  }
});

// Main donation route (handles both with and without file)
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { donorName, email, phone, amount, purpose, isAnonymous, panNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature, message } = req.body;

    // Validate required fields
    if (!donorName || !email || !phone || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const donationData = {
      donor_name: donorName,
      email,
      phone,
      amount: parseFloat(amount),
      donation_type: purpose || 'general',
      message: message || '',
      is_anonymous: isAnonymous === 'true' || isAnonymous === true,
      pan_number: panNumber || '',
      payment_status: razorpay_payment_id ? 'completed' : 'pending',
      payment_id: req.file ? req.file.path : '',
      razorpay_order_id: razorpay_order_id || '',
      razorpay_payment_id: razorpay_payment_id || '',
      razorpay_signature: razorpay_signature || '',
      tax_benefit: true
    };

    const donation = await Donation.create(donationData);

    // Email will be sent only after admin approval
    // Removed automatic email sending to avoid duplicate emails

    res.json({
      success: true,
      message: 'Donation submitted successfully. Payment verification pending.',
      donation: {
        donationId: donation.receipt_number || `DON${String(donation.id).padStart(6, '0')}`,
        donorName: donation.donor_name,
        amount: donation.amount,
        purpose: donation.donation_type
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

    // Generate and send PDF receipt via email
    try {
      const { generateDonationReceipt } = require('../utils/cardGenerator');
      const { sendDonationReceiptWithPDF } = require('../utils/emailService');

      const receiptPath = await generateDonationReceipt(donation);
      donation.receiptFile = receiptPath;
      await donation.save();

      await sendDonationReceiptWithPDF(donation, receiptPath);
    } catch (emailError) {
      console.error('Receipt email failed:', emailError);
    }

    res.json({ success: true, message: 'Donation approved and receipt sent to email successfully' });
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

// Get all donations list (Admin only)
router.get('/list', auth, async (req, res) => {
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

// Get all donations (Admin only) - duplicate route, keeping for compatibility
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

// Approve donation and send receipt with PDF (async to prevent timeout)
router.post('/approve/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Update donation status first
    await Donation.update(req.params.id, {
      payment_status: 'approved',
      approved_by: req.user.id,
      approved_at: new Date(),
      receipt_generated: true
    });

    // Return immediate response to prevent timeout
    res.json({ success: true, message: 'Donation approved. Receipt will be sent to email shortly.' });

    // Process receipt generation and email sending asynchronously
    setImmediate(async () => {
      try {
        const { generateDonationReceipt } = require('../utils/cardGenerator');
        const { sendDonationReceiptWithPDF } = require('../utils/emailService');

        console.log('🧾 Generating donation receipt for:', donation.donor_name);
        const receiptPath = await generateDonationReceipt(donation);
        
        // Update with receipt file path
        await Donation.update(req.params.id, {
          receipt_file: receiptPath
        });

        console.log('📧 Sending donation receipt email to:', donation.email);
        await sendDonationReceiptWithPDF(donation, receiptPath);
        console.log('✅ Donation receipt sent successfully to:', donation.email);
      } catch (error) {
        console.error('❌ Receipt generation/email failed:', error);
      }
    });
  } catch (error) {
    console.error('❌ Donation approval failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send donation receipt (async to prevent timeout)
router.post('/send-receipt/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Return immediate response to prevent timeout
    res.json({ success: true, message: 'Receipt generation started. Email will be sent shortly.' });

    // Process receipt generation and email sending asynchronously
    setImmediate(async () => {
      try {
        const { generateDonationReceipt } = require('../utils/cardGenerator');
        const { sendDonationReceiptWithPDF } = require('../utils/emailService');

        console.log('🧾 Generating donation receipt for:', donation.donor_name);
        const receiptPath = await generateDonationReceipt(donation);
        
        // Update donation record
        await Donation.update(req.params.id, {
          receipt_file: receiptPath,
          receipt_generated: true
        });

        console.log('📧 Sending donation receipt email to:', donation.email);
        await sendDonationReceiptWithPDF(donation, receiptPath);
        console.log('✅ Donation receipt sent successfully to:', donation.email);
      } catch (error) {
        console.error('❌ Failed to send receipt:', error);
      }
    });
  } catch (error) {
    console.error('❌ Failed to process receipt request:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
