const express = require('express');
const { testEmailConfiguration, sendEmailWithFallbacks } = require('../utils/emailServiceImproved');
const router = express.Router();

// Test email configuration
router.get('/test-config', async (req, res) => {
  try {
    console.log('🔍 Testing email configuration...');
    const results = await testEmailConfiguration();
    
    res.json({
      success: true,
      message: 'Email configuration test completed',
      results
    });
  } catch (error) {
    console.error('❌ Email config test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Email configuration test failed'
    });
  }
});

// Send test email
router.post('/send-test', async (req, res) => {
  try {
    const { to, subject = 'Test Email', message = 'This is a test email.' } = req.body;
    
    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }
    
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Test';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #28a745;">✅ Email Test Successful!</h2>
            <p style="color: #666;">${message}</p>
            <p style="font-size: 12px; color: #999;">Sent at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };
    
    console.log('📧 Sending test email to:', to);
    const result = await sendEmailWithFallbacks(mailOptions);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      isTestEmail: result.isTestEmail || false,
      previewUrl: result.previewUrl || null
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to send test email'
    });
  }
});

module.exports = router;