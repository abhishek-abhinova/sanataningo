const nodemailer = require('nodemailer');

// Create a more robust transporter with better error handling
const createTransporter = () => {
  try {
    const config = {
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      pool: false,
      maxConnections: 1,
      maxMessages: 1,
      greetingTimeout: 15000,
      connectionTimeout: 15000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1'
      },
      debug: false,
      logger: false
    };

    console.log('📧 Creating email transporter with config:', {
      host: config.host,
      port: config.port,
      user: config.auth.user,
      secure: config.secure
    });

    return nodemailer.createTransporter(config);
  } catch (error) {
    console.error('❌ Failed to create transporter:', error);
    throw error;
  }
};

// Send email with timeout and retry logic
const sendEmail = async (mailOptions, retries = 2) => {
  let lastError = null;
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${retries + 1} to ${mailOptions.to}`);
      
      const transporter = createTransporter();
      
      // Add timeout wrapper
      const sendWithTimeout = (options, timeout = 30000) => {
        return Promise.race([
          transporter.sendMail(options),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email send timeout')), timeout)
          )
        ]);
      };

      const result = await sendWithTimeout(mailOptions);
      
      console.log('✅ Email sent successfully:', {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected
      });
      
      // Close transporter
      if (transporter.close) {
        transporter.close();
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`❌ Email attempt ${attempt} failed:`, error.message);
      
      if (attempt <= retries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Simple email functions
const sendAdminNotification = async (subject, content) => {
  const mailOptions = {
    from: `"${process.env.ORG_NAME}" <${process.env.SMTP_USER}>`,
    to: process.env.ORG_EMAIL || process.env.SMTP_USER,
    subject,
    html: content
  };
  
  return await sendEmail(mailOptions);
};

const sendUserEmail = async (to, subject, content) => {
  const mailOptions = {
    from: `"${process.env.ORG_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: content
  };
  
  return await sendEmail(mailOptions);
};

module.exports = {
  sendEmail,
  sendAdminNotification,
  sendUserEmail,
  createTransporter
};