const express = require('express');
const { sendEmailRender } = require('../utils/renderEmailService');
require('dotenv').config({ path: '.env.production' });

const router = express.Router();

// Test email for Render deployment
router.post('/send', async (req, res) => {
  try {
    const { to = 'abhishek.abhinova@gmail.com', subject = 'Render Email Test' } = req.body;
    
    const mailOptions = {
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d2691e;">🚀 Render Email Test</h2>
          <p>This email was sent from your NGO backend deployed on Render!</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Server Info:</strong><br>
            Environment: ${process.env.NODE_ENV}<br>
            Platform: Render<br>
            Time: ${new Date().toLocaleString()}<br>
            Backend URL: ${process.env.BASE_URL}
          </div>
          <p>✅ If you receive this email, the email service is working on Render!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Sarboshakti Sanatani Sangathan<br>
            Email System Test
          </p>
        </div>
      `
    };

    const result = await sendEmailRender(mailOptions);
    
    res.json({
      success: true,
      message: 'Email sent successfully from Render',
      messageId: result.messageId,
      to: to,
      service: result.envelope ? 'Gmail' : 'Ethereal Test'
    });
  } catch (error) {
    console.error('Render email test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      solution: 'Set GMAIL_USER and GMAIL_APP_PASSWORD in Render environment variables'
    });
  }
});

module.exports = router;