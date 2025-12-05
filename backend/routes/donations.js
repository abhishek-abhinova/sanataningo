const express = require('express');
const multer = require('multer');
const Donation = require('../models/Donation');
const DonationLocal = require('../models/DonationLocal');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { sendDonationReceiptGmail } = require('../utils/emailServiceGmail');
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

    let donation;
    try {
      donation = await Donation.create(donationData);
    } catch (dbError) {
      console.log('⚠️ Database unavailable, using local storage');
      donation = await DonationLocal.create(donationData);
    }

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

    let donation;
    try {
      donation = await Donation.create(donationData);
    } catch (dbError) {
      console.log('⚠️ Database unavailable, using local storage');
      donation = await DonationLocal.create(donationData);
    }

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

// Approve donation and send receipt
router.post('/approve/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Update donation status
    donation.paymentStatus = 'approved';
    donation.receiptGenerated = true;
    await donation.save();

    // Return immediate response
    res.json({ success: true, message: 'Donation approved. Receipt will be sent to email shortly.' });

    // Send email asynchronously
    setImmediate(async () => {
      try {
        console.log('📧 Sending donation receipt via Gmail to:', donation.email);
        await sendDonationReceiptGmail(donation);
        console.log('✅ Donation receipt sent successfully to:', donation.email);
      } catch (error) {
        console.error('❌ Email failed:', error);
      }
    });
  } catch (error) {
    console.error('❌ Donation approval failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send donation receipt
router.post('/send-receipt/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Return immediate response
    res.json({ success: true, message: 'Receipt will be sent to email shortly.' });

    // Send email asynchronously
    setImmediate(async () => {
      try {
        console.log('📧 Sending donation receipt via Gmail to:', donation.email);
        await sendDonationReceiptGmail(donation);
        console.log('✅ Donation receipt sent successfully to:', donation.email);
      } catch (error) {
        console.error('❌ Email failed:', error);
      }
    });
  } catch (error) {
    console.error('❌ Failed to send receipt:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;