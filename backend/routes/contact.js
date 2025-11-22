const express = require('express');
const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');
const { contactValidation, handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// Submit contact form
router.post('/', contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Create contact record
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });
    
    await contact.save();
    
    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting us',
      template: 'contact-confirmation',
      data: { name, subject }
    });
    
    // Send notification email to admin
    await sendEmail({
      to: process.env.ORG_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      template: 'contact-notification',
      data: { contact }
    });
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;