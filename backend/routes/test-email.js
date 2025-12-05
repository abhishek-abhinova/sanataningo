const express = require('express');
const { sendEmailEthereal } = require('../utils/emailServiceEthereal');
const router = express.Router();

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    console.log('🧪 Testing email service...');
    
    const testEmail = {
      to: 'test@example.com',
      subject: '🧪 Test Email from Admin Dashboard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🧪 Email Service Test</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 8px;">
            <p>This is a test email to verify the email service is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Service:</strong> Ethereal Test Account</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>Sarboshakti Sanatani Sangathan</p>
            <p>🕉️ Admin Dashboard Email Test 🕉️</p>
          </div>
        </div>
      `
    };

    const result = await sendEmailEthereal(testEmail);
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      previewUrl: result.previewUrl,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;