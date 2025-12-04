const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.production' });

const testEmail = async () => {
  console.log('🔧 Testing Email Configuration...\n');
  
  console.log('Current Settings:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`Secure: ${process.env.SMTP_SECURE}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`Pass: ${process.env.SMTP_PASS ? 'SET' : 'NOT SET'}\n`);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: true
    });

    console.log('📧 Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');

    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'abhishek.abhinova@gmail.com',
      subject: 'Email Test - NGO System',
      text: 'This is a test email from your NGO system. If you receive this, email is working!'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);

  } catch (error) {
    console.error('❌ Email Error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    
    console.log('\n🔧 Possible Solutions:');
    console.log('1. Check email password in Hostinger');
    console.log('2. Verify email account exists');
    console.log('3. Try port 587 with STARTTLS');
    console.log('4. Check firewall settings');
  }
};

testEmail();