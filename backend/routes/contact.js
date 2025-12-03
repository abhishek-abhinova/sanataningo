const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { sendContactNotification, sendContactConfirmation } = require('../utils/emailService');
const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Create contact record
    const contactData = {
      name,
      email,
      phone: phone || '',
      subject,
      message
    };

    const contact = await Contact.create(contactData);

    // Send emails
    try {
      await sendContactNotification(contact);
      await sendContactConfirmation(contact);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all contacts (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments();

    res.json({
      success: true,
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contact by ID (Admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark contact as resolved (Admin only)
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolvedBy: req.user.id,
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact marked as resolved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;