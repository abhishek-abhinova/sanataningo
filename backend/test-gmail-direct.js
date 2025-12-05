const nodemailer = require('nodemailer');

async function testGmailDirect() {
  try {
    console.log('🧪 Testing Gmail with your credentials...');
    
    const gmailUser = 'Sarboshaktisonatanisangathan@gmail.com';
    const gmailAppPassword = 'ezgkbdfieqvoltnm';
    
    console.log('Gmail User:', gmailUser);
    console.log('App Password:', gmailAppPassword ? '✅ Set' : '❌ Missing');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // Verify connection
    console.log('🔍 Verifying Gmail SMTP connection...');
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified successfully!');

    // Send test email
    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: `"Sarbo Shakti Sonatani Sangathan" <${gmailUser}>`,
      to: 'test@example.com',
      subject: '🧪 Gmail Credentials Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🧪 Gmail Service Test</h1>
          </div>
          <div style="padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 8px;">
            <p>This email confirms Gmail service is working with your credentials.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> ${gmailUser}</p>
            <p><strong>Status:</strong> ✅ Working</p>
          </div>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    return true;
  } catch (error) {
    console.error('❌ Gmail test failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    return false;
  }
}

testGmailDirect();