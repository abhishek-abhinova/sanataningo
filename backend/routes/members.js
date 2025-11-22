const express = require('express');
const Member = require('../models/Member');
const { generateMembershipCard } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const { memberValidation, handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// Create membership
router.post('/', memberValidation, handleValidationErrors, async (req, res) => {
  try {
    const { fullName, email, phone, address, dateOfBirth, occupation, membershipType, paymentReference, aadhaarNumber } = req.body;
    
    // Determine amount based on membership type
    const amounts = {
      basic: 100,
      premium: 500,
      lifetime: 2000
    };
    const amount = amounts[membershipType] || 100;
    
    // Create member record
    const member = new Member({
      fullName,
      email,
      phone,
      address,
      dateOfBirth,
      occupation,
      membershipType,
      amount,
      paymentReference,
      aadhaarNumber,
      paymentStatus: 'pending'
    });
    
    await member.save();
    
    res.json({
      success: true,
      message: 'Membership application submitted. Payment verification pending.',
      membershipId: member.membershipId,
      memberId: member._id
    });
  } catch (error) {
    console.error('Membership creation error:', error);
    res.status(500).json({ error: 'Failed to create membership' });
  }
});



// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

module.exports = router;