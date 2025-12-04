const nodemailer = require('nodemailer');

// Simple email service with minimal configuration
const createSimpleTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send simple email
const sendSimpleEmail = async (to, subject, html) => {
  try {
    const transporter = createSimpleTransporter();
    
    const mailOptions = {
      from: `"Sarboshakti Sanatani Sangathan" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    console.log('📧 Sending email to:', to);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    
    return result;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw error;
  }
};

module.exports = {
  sendSimpleEmail
};