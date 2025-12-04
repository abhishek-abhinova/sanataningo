const express = require('express');
const { sendSimpleEmail } = require('../utils/emailServiceSimple');
require('dotenv').config({ path: '.env.production' });

const router = express.Router();

// Test simple email
router.post('/send', async (req, res) => {
  try {
    const { to = 'abhishek.abhinova@gmail.com', subject = 'Test Email', message = 'This is a test email from NGO system.' } = req.body;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d2691e;">🕉️ Sarboshakti Sanatani Sangathan</h2>
        <p>Dear User,</p>
        <p>${message}</p>
        <p>This email confirms that the email system is working properly.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent from: ${process.env.SMTP_USER}<br>
          Time: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    await sendSimpleEmail(to, subject, html);
    
    res.json({
      success: true,
      message: 'Email sent successfully',
      to: to,
      subject: subject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Email sending failed'
    });
  }
});

module.exports = router;