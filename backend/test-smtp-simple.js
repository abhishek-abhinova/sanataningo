const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log('🔍 Testing SMTP Configuration...\n');
  
  console.log('Environment Variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'Not set');
  console.log();
  
  try {
    console.log('Nodemailer version:', require('nodemailer/package.json').version);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
    
    console.log('📧 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('\n📧 Sending test email...');
    const result = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: 'SMTP Test Email',
      html: '<h2>✅ SMTP is working!</h2><p>This is a test email.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testSMTP();