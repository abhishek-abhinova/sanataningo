const express = require('express');
const { sendGmailEmail } = require('../utils/emailServiceGmail');
const router = express.Router();

// Test Gmail service
router.post('/test-gmail', async (req, res) => {
  try {
    console.log('🧪 Testing Gmail service with credentials...');
    
    const testEmail = {
      to: 'test@example.com',
      subject: '🧪 Gmail Service Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🧪 Gmail Service Test</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 8px;">
            <p>This is a test email to verify Gmail service is working with app password.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Gmail User:</strong> ${process.env.GMAIL_USER}</p>
            <p><strong>Service:</strong> Gmail SMTP</p>
          </div>
        </div>
      `
    };

    const result = await sendGmailEmail(testEmail);
    
    res.json({
      success: true,
      message: 'Gmail test email sent successfully!',
      messageId: result.messageId,
      gmailUser: process.env.GMAIL_USER
    });
  } catch (error) {
    console.error('❌ Gmail test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      gmailUser: process.env.GMAIL_USER
    });
  }
});

module.exports = router;