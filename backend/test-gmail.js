const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmail() {
  try {
    console.log('🧪 Testing Gmail credentials...');
    console.log('Gmail User:', process.env.GMAIL_USER);
    console.log('App Password:', process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified successfully!');

    // Send test email
    const result = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.GMAIL_USER}>`,
      to: 'test@example.com',
      subject: '🧪 Gmail Test Email',
      html: `
        <h2>Gmail Service Test</h2>
        <p>This email confirms Gmail service is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> ${process.env.GMAIL_USER}</p>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Gmail test failed:', error.message);
    return false;
  }
}

testGmail();