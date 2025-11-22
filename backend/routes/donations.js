const express = require('express');
const Donation = require('../models/Donation');
const { generateDonationReceipt } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const { donationValidation, handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// Create donation
router.post('/', donationValidation, handleValidationErrors, async (req, res) => {
  try {
    const { donorName, email, phone, address, amount, purpose, isAnonymous, panNumber, paymentReference } = req.body;
    
    // Create donation record
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
      donationId: donation.donationId,
      donationDbId: donation._id
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ error: 'Failed to create donation' });
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