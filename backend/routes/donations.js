const express = require('express');
const multer = require('multer');
const Donation = require('../models/Donation');
const Transaction = require('../models/Transaction');
const { generateDonationReceipt } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const { donationValidation, handleValidationErrors } = require('../middleware/validation');
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
    
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' });
    }

    const donation = new Donation({
      donorName,
      email,
      phone,
      address,
      amount,
      purpose: purpose || 'general',
      panNumber,
      paymentReference: upiReference,
      paymentScreenshot: req.file.path,
      isAnonymous: isAnonymous === 'true',
      paymentStatus: 'pending'
    });

    await donation.save();
    
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

// Legacy route for backward compatibility
router.post('/', donationValidation, handleValidationErrors, async (req, res) => {
  try {
    const { donorName, email, phone, address, amount, purpose, isAnonymous, panNumber, paymentReference } = req.body;
    
    const donation = new Donation({
      donorName,
      email,
      phone,
      address,
      amount,
      purpose,
      isAnonymous,
      panNumber,
      paymentReference,
      paymentStatus: 'pending'
    });
    
    await donation.save();
    
    res.json({
      success: true,
      message: 'Donation submitted. Payment verification pending.',
      donationId: donation.donationId || donation._id
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

module.exports = router;