const nodemailer = require('nodemailer');
const { generateDonationReceiptHTML, generateThankYouEmailHTML } = require('./emailTemplates');
const { normalizeDonationData } = require('./donationFormatter');

// Email queue for retry mechanism
const emailQueue = [];
let isProcessingQueue = false;

// Multiple transporter configurations
const createTransporters = () => {
  const transporters = [];
  
  // Primary: Hostinger SMTP with optimized settings
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporters.push({
      name: 'Hostinger',
      transporter: nodemailer.createTransporter({
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 14,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        }
      })
    });
  }
  
  // Fallback: Gmail SMTP
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    transporters.push({
      name: 'Gmail',
      transporter: nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        pool: true,
        maxConnections: 5
      })
    });
  }
  
  return transporters;
};

// Enhanced send function with multiple fallbacks
const sendEmailWithFallbacks = async (mailOptions, maxRetries = 3) => {
  const transporters = createTransporters();
  
  if (transporters.length === 0) {
    console.error('❌ No email transporters configured');
    throw new Error('No email configuration found');
  }
  
  let lastError = null;
  
  // Try each transporter with retries
  for (const { name, transporter } of transporters) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📧 Attempting to send via ${name} (attempt ${attempt}/${maxRetries})`);
        
        // Add timeout wrapper to prevent hanging
        const result = await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email send timeout after 15 seconds')), 15000)
          )
        ]);
        
        console.log(`✅ Email sent successfully via ${name}:`, {
          messageId: result.messageId,
          accepted: result.accepted?.length || 0,
          rejected: result.rejected?.length || 0
        });
        
        return result;
      } catch (error) {
        lastError = error;
        console.error(`❌ ${name} attempt ${attempt} failed:`, {
          message: error.message,
          code: error.code,
          command: error.command
        });
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  // Final fallback: Ethereal test account (for development)
  try {
    console.log('🛠️ All transporters failed, trying Ethereal test account');
    const testAccount = await nodemailer.createTestAccount();
    const ethTransporter = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });
    
    const result = await ethTransporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(result);
    
    console.log('📧 Ethereal test email sent:', previewUrl);
    console.warn('⚠️ Email sent to test account only - not delivered to real inbox');
    
    return { ...result, previewUrl, isTestEmail: true };
  } catch (ethError) {
    console.error('❌ Ethereal fallback also failed:', ethError.message);
    throw lastError || ethError;
  }
};

// Queue-based email processing to handle high volume
const processEmailQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }
  
  isProcessingQueue = true;
  console.log(`📧 Processing email queue (${emailQueue.length} emails)`);
  
  while (emailQueue.length > 0) {
    const emailTask = emailQueue.shift();
    
    try {
      await sendEmailWithFallbacks(emailTask.mailOptions, emailTask.retries || 3);
      console.log('✅ Queue email sent successfully');
      
      if (emailTask.onSuccess) {
        emailTask.onSuccess();
      }
    } catch (error) {
      console.error('❌ Queue email failed:', error.message);
      
      if (emailTask.onError) {
        emailTask.onError(error);
      }
    }
    
    // Small delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  isProcessingQueue = false;
  console.log('📧 Email queue processing completed');
};

// Add email to queue for async processing
const queueEmail = (mailOptions, options = {}) => {
  emailQueue.push({
    mailOptions,
    retries: options.retries || 3,
    onSuccess: options.onSuccess,
    onError: options.onError
  });
  
  // Start processing if not already running
  setImmediate(processEmailQueue);
};

// Improved donation receipt email function
const sendDonationReceiptEmail = async (donation, useQueue = true) => {
  try {
    const donationData = normalizeDonationData(donation);
    console.log('📧 Preparing donation receipt email for:', donationData.email);
    
    if (!donationData.email) {
      throw new Error('No email address provided for donation receipt');
    }
    
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarboshakti Sanatani Sangathan';
    
    if (!fromEmail) {
      throw new Error('SMTP_USER not configured in environment variables');
    }
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: donationData.email,
      subject: `🙏 Donation Receipt - ${donationData.receiptNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fff8f0, #fef6ed); border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b4513; margin-bottom: 10px;">🕉️ Sarboshakti Sanatani Sangathan</h1>
            <p style="color: #d2691e; font-size: 18px; font-weight: bold;">Donation Receipt</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333;">Dear <strong>${donationData.donorName}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">🙏 <strong>Thank you</strong> for your generous donation! Your contribution helps us serve humanity through Sanatan Dharma values.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d2691e;">
              <h3 style="color: #8b4513; margin-top: 0;">💰 Donation Details:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Receipt ID:</strong> ${donationData.receiptNumber}</li>
                <li><strong>Amount:</strong> ₹${donationData.amountFormatted}</li>
                <li><strong>Purpose:</strong> ${donationData.purpose}</li>
                <li><strong>Date:</strong> ${donationData.donationDateFormatted}</li>
                ${donationData.paymentReference ? `<li><strong>Transaction ID:</strong> ${donationData.paymentReference}</li>` : ''}
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #e8f5e8, #f0fff0); padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #228b22; margin: 0; font-weight: bold;">📋 This receipt is eligible for tax exemption under Section 80G of the Income Tax Act.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #d2691e;">
              <p style="color: #8b4513; font-weight: bold; margin: 0;">🕉️ Sarboshakti Sanatani Sangathan</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Email: ${process.env.ORG_EMAIL || fromEmail}</p>
              <p style="color: #d2691e; font-style: italic; margin: 10px 0 0 0;">\"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः\"</p>
            </div>
          </div>
        </div>
      `
    };
    
    if (useQueue) {
      // Add to queue for async processing
      queueEmail(mailOptions, {
        onSuccess: () => console.log('✅ Donation receipt email queued successfully'),
        onError: (error) => console.error('❌ Queued donation receipt email failed:', error.message)
      });
      
      return { success: true, message: 'Email queued for sending' };
    } else {
      // Send immediately
      const result = await sendEmailWithFallbacks(mailOptions);
      console.log('✅ Donation receipt email sent successfully');
      return result;
    }
  } catch (error) {
    console.error('❌ Failed to send donation receipt email:', error);
    throw error;
  }
};

// Improved donation receipt with PDF attachment
const sendDonationReceiptWithPDF = async (donation, receiptPath, useQueue = true) => {
  try {
    const donationData = normalizeDonationData(donation);
    console.log('📧 Preparing donation receipt with PDF for:', donationData.email);
    
    if (!donationData.email) {
      throw new Error('No email address provided for donation receipt');
    }
    
    // Verify PDF file exists
    const fs = require('fs');
    if (!fs.existsSync(receiptPath)) {
      throw new Error(`Receipt PDF file not found at: ${receiptPath}`);
    }
    
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarboshakti Sanatani Sangathan';
    
    if (!fromEmail) {
      throw new Error('SMTP_USER not configured in environment variables');
    }
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: donationData.email,
      subject: `🙏 Donation Receipt - ${donationData.receiptNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fff8f0, #fef6ed); border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b4513; margin-bottom: 10px;">🕉️ Sarboshakti Sanatani Sangathan</h1>
            <p style="color: #d2691e; font-size: 18px; font-weight: bold;">Donation Receipt</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333;">Dear <strong>${donationData.donorName}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">🙏 <strong>Thank you</strong> for your generous donation! Your contribution helps us serve humanity through Sanatan Dharma values.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d2691e;">
              <h3 style="color: #8b4513; margin-top: 0;">💰 Donation Details:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Receipt ID:</strong> ${donationData.receiptNumber}</li>
                <li><strong>Amount:</strong> ₹${donationData.amountFormatted}</li>
                <li><strong>Purpose:</strong> ${donationData.purpose}</li>
                <li><strong>Date:</strong> ${donationData.donationDateFormatted}</li>
                ${donationData.paymentReference ? `<li><strong>Transaction ID:</strong> ${donationData.paymentReference}</li>` : ''}
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6;">📎 Your official donation receipt (PDF) is attached to this email for your records.</p>
            
            <div style="background: linear-gradient(135deg, #e8f5e8, #f0fff0); padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #228b22; margin: 0; font-weight: bold;">📋 This receipt is eligible for tax exemption under Section 80G of the Income Tax Act.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #d2691e;">
              <p style="color: #8b4513; font-weight: bold; margin: 0;">🕉️ Sarboshakti Sanatani Sangathan</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Email: ${process.env.ORG_EMAIL || fromEmail}</p>
              <p style="color: #d2691e; font-style: italic; margin: 10px 0 0 0;">\"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः\"</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `donation-receipt-${donationData.receiptNumber}.pdf`,
          path: receiptPath
        }
      ]
    };
    
    if (useQueue) {
      // Add to queue for async processing
      queueEmail(mailOptions, {
        onSuccess: () => console.log('✅ Donation receipt with PDF queued successfully'),
        onError: (error) => console.error('❌ Queued donation receipt with PDF failed:', error.message)
      });
      
      return { success: true, message: 'Email with PDF queued for sending' };
    } else {
      // Send immediately
      const result = await sendEmailWithFallbacks(mailOptions);
      console.log('✅ Donation receipt with PDF sent successfully');
      return result;
    }
  } catch (error) {
    console.error('❌ Failed to send donation receipt with PDF:', error);
    throw error;
  }
};

// Send admin notification for new donation
const sendAdminDonationNotification = async (donation, useQueue = true) => {
  try {
    const donationData = normalizeDonationData(donation);
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const adminEmail = process.env.ORG_EMAIL || fromEmail;
    
    const mailOptions = {
      from: `"${process.env.ORG_NAME || 'Admin'}" <${fromEmail}>`,
      to: adminEmail,
      subject: `💰 New Donation - ${donationData.donorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">💰 New Donation Received</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Donor:</td><td style="padding: 8px;">${donationData.donorName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${donationData.email || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${donationData.phone || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Amount:</td><td style="padding: 8px; color: #28a745; font-size: 18px; font-weight: bold;">₹${donationData.amountFormatted}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Purpose:</td><td style="padding: 8px;">${donationData.purpose}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${donationData.donationDateFormatted}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #d1ecf1; border-left: 4px solid #17a2b8;">
              <strong>⚠️ Action Required:</strong> Please verify the payment and approve the donation in admin panel.
            </div>
          </div>
        </div>
      `
    };
    
    if (useQueue) {
      queueEmail(mailOptions, {
        onSuccess: () => console.log('✅ Admin donation notification queued successfully'),
        onError: (error) => console.error('❌ Admin donation notification failed:', error.message)
      });
      
      return { success: true, message: 'Admin notification queued' };
    } else {
      const result = await sendEmailWithFallbacks(mailOptions);
      console.log('✅ Admin donation notification sent successfully');
      return result;
    }
  } catch (error) {
    console.error('❌ Failed to send admin donation notification:', error);
    throw error;
  }
};

// Health check function to test email configuration
const testEmailConfiguration = async () => {
  try {
    console.log('🔍 Testing email configuration...');
    
    const transporters = createTransporters();
    if (transporters.length === 0) {
      throw new Error('No email transporters configured');
    }
    
    const testResults = [];
    
    for (const { name, transporter } of transporters) {
      try {
        console.log(`Testing ${name} transporter...`);
        await transporter.verify();
        testResults.push({ name, status: 'success', message: 'Connection verified' });
        console.log(`✅ ${name} transporter verified successfully`);
      } catch (error) {
        testResults.push({ name, status: 'failed', message: error.message });
        console.error(`❌ ${name} transporter failed:`, error.message);
      }
    }
    
    return testResults;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmailWithFallbacks,
  sendDonationReceiptEmail,
  sendDonationReceiptWithPDF,
  sendAdminDonationNotification,
  queueEmail,
  testEmailConfiguration,
  processEmailQueue
};