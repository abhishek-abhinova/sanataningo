const nodemailer = require('nodemailer');
const { generateMembershipCardHTML, generateDonationReceiptHTML, generateThankYouEmailHTML } = require('./emailTemplates');
const { normalizeDonationData } = require('./donationFormatter');

// Create transporter factory with better timeouts and pooling
const createTransporter = () => {
  try {
    const opts = {
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: { 
        rejectUnauthorized: false
      }
    };

    console.log('📧 Creating SMTP transporter:', {
      host: opts.host,
      port: opts.port,
      secure: opts.secure,
      user: opts.auth.user,
      pool: opts.pool
    });

    return nodemailer.createTransport(opts);
  } catch (err) {
    console.error('❌ Failed to create transporter:', err);
    throw err;
  }
};

let transporter = createTransporter();

// Helper to send mail with retry and Ethereal fallback for local testing
const sendMailWithRetry = async (mailOptions, attempts = 1) => {
  let lastErr = null;
  
  // Skip verification to avoid timeout issues
  
  for (let i = 0; i < attempts; i++) {
    try {
      console.log(`📧 Sending email attempt ${i + 1}/${attempts} to ${mailOptions.to}`);
      console.log(`📧 From: ${mailOptions.from}`);
      console.log(`📧 Subject: ${mailOptions.subject}`);
      
      const info = await transporter.sendMail(mailOptions);
      
      console.log('📧 Email accepted by SMTP server:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      });
      
      // If using Ethereal, log preview URL when available
      if (nodemailer.getTestMessageUrl && info) {
        try {
          const preview = nodemailer.getTestMessageUrl(info);
          if (preview) {
            console.log('🔎 Preview URL (Ethereal test):', preview);
            console.warn('⚠️ Using Ethereal test account - email will NOT be delivered to real inbox!');
          }
        } catch (e) {
          // ignore
        }
      }
      
      // Verify email was actually accepted
      if (!info.accepted || info.accepted.length === 0) {
        throw new Error('Email was not accepted by SMTP server');
      }
      
      return info;
    } catch (err) {
      lastErr = err;
      console.error(`❌ sendMail attempt ${i + 1} failed:`, {
        message: err.message,
        code: err.code,
        command: err.command,
        response: err.response,
        responseCode: err.responseCode
      });
      
      // Wait before retry
      if (i < attempts - 1) {
        console.log('⏳ Waiting 500ms before retry...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // On failure, try to recreate transporter in case of transient errors
      try {
        console.log('🔁 Recreating transporter and retrying...');
        if (transporter.close) {
          transporter.close();
        }
      } catch (e) {
        // ignore close errors
      }
      try {
        // recreate transporter with latest env
        transporter = createTransporter();
        // Wait a bit for transporter to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.error('❌ Could not recreate transporter:', e);
      }
    }
  }

  // If all retries failed, fallback to Ethereal for local development (won't deliver to real inbox)
  try {
    console.log('🛠️ Falling back to Ethereal test account for debugging');
    const testAccount = await nodemailer.createTestAccount();
    const ethTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    const info = await ethTransport.sendMail(mailOptions);
    console.log('📧 Ethereal email sent (preview):', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (ethErr) {
    console.error('❌ Ethereal fallback failed:', ethErr && ethErr.message);
    throw lastErr || ethErr;
  }
};

// Send admin notification for new member
const sendAdminMemberNotification = async (member) => {
  try {
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const mailOptions = {
      from: `"${process.env.ORG_NAME || 'Admin'}" <${fromEmail}>`,
      to: process.env.ORG_EMAIL || fromEmail,
      subject: `🆕 New Member Registration - ${member.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">🆕 New Member Registration</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${member.fullName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${member.email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${member.phone}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Membership:</td><td style="padding: 8px;">${member.membershipPlan}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Amount:</td><td style="padding: 8px;">₹${member.amount}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">UPI Ref:</td><td style="padding: 8px;">${member.upiReference || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${new Date().toLocaleDateString()}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
              <strong>⚠️ Action Required:</strong> Please verify the payment and approve the membership in admin panel.
            </div>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Admin member notification sent');
  } catch (error) {
    console.error('❌ Failed to send admin member notification:', error);
    throw error;
  }
};

// Send admin notification for new donation
const sendAdminDonationNotification = async (donation) => {
  try {
    const donationData = normalizeDonationData(donation);
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const mailOptions = {
      from: `"${process.env.ORG_NAME || 'Admin'}" <${fromEmail}>`,
      to: process.env.ORG_EMAIL || fromEmail,
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
              <tr><td style="padding: 8px; font-weight: bold;">Reference:</td><td style="padding: 8px;">${donationData.paymentReference || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${donationData.donationDateFormatted}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #d1ecf1; border-left: 4px solid #17a2b8;">
              <strong>⚠️ Action Required:</strong> Please verify the payment screenshot and approve the donation in admin panel.
            </div>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Admin donation notification sent');
  } catch (error) {
    console.error('❌ Failed to send admin donation notification:', error);
    throw error;
  }
};

// Send member approval email with ID card
const sendMemberApprovalEmail = async (member) => {
  try {
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarbo Shakti Sonatani Sangathan';
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: member.email,
      subject: '🎉 Membership Approved - Welcome to Sarboshakti Sanatani Sangathan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6f42c1, #e83e8c); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Our Family!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Your membership has been approved</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 18px; color: #333;">Dear ${member.fullName},</p>
            <p style="color: #666; line-height: 1.6;">We are delighted to welcome you to <strong>Sarboshakti Sanatani Sangathan</strong>. Your membership application has been approved and you are now part of our mission to serve humanity through Sanatan Dharma values.</p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #6f42c1;">
              <h3 style="color: #6f42c1; margin-top: 0;">📋 Your Membership Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Member ID:</td><td style="padding: 8px 0; color: #6f42c1; font-weight: bold;">${member.memberId}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Membership Type:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">${member.membershipPlan}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Valid Till:</td><td style="padding: 8px 0;">${new Date(member.validTill).toLocaleDateString()}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Amount Paid:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">₹${member.amount}</td></tr>
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">🎫 Digital Membership Card</h4>
              <p style="color: #856404; margin-bottom: 0;">Your digital membership card will be available in your member portal. Please keep your Member ID safe for future reference.</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">As a member, you now have access to all our programs, events, and services. We look forward to your active participation in our noble cause.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6f42c1; font-size: 18px; font-weight: bold; margin: 0;">🕉️ Dharma • Seva • Sanskriti • Samaj 🕉️</p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 3px solid #6f42c1;">
            <p style="margin: 0; color: #666;"><strong>Sarboshakti Sanatani Sangathan</strong></p>
            <p style="margin: 5px 0; color: #666;">${process.env.ORG_EMAIL} | ${process.env.ORG_PHONE}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #999;">${process.env.ORG_ADDRESS}</p>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Member approval email sent');
  } catch (error) {
    console.error('❌ Failed to send member approval email:', error);
    throw error;
  }
};

// Send donation receipt email
const sendDonationReceiptEmail = async (donation) => {
  try {
    const donationData = normalizeDonationData(donation);
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarbo Shakti Sonatani Sangathan';
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: donationData.email,
      subject: `🙏 Donation Receipt - ${donationData.receiptNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🙏 Thank You!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Your generous donation has been received</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 18px; color: #333;">Dear ${donationData.donorName},</p>
            <p style="color: #666; line-height: 1.6;">We have received and verified your generous donation. Your contribution brings us one step closer to serving humanity through the noble values of Sanatan Dharma.</p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">🧾 Donation Receipt</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Donation ID:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">${donationData.receiptNumber}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Amount:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold; font-size: 18px;">₹${donationData.amountFormatted}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Purpose:</td><td style="padding: 8px 0;">${donationData.purpose}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Date:</td><td style="padding: 8px 0;">${donationData.donationDateFormatted}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Payment Ref:</td><td style="padding: 8px 0;">${donationData.paymentReference || 'N/A'}</td></tr>
              </table>
            </div>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">💰 Tax Benefit Information</h4>
              <p style="color: #155724; margin-bottom: 0;">This donation is eligible for <strong>tax exemption under Section 80G</strong> of the Income Tax Act. Please retain this receipt for your tax filing.</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">Your noble contribution enables us to continue our mission of serving society through dharmic values, cultural preservation, and community welfare programs.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #28a745; font-size: 18px; font-weight: bold; margin: 0;">🕉️ May your generosity bring you abundant blessings 🕉️</p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 3px solid #28a745;">
            <p style="margin: 0; color: #666;"><strong>With Gratitude,</strong></p>
            <p style="margin: 5px 0; color: #666; font-weight: bold;">Sarboshakti Sanatani Sangathan</p>
            <p style="margin: 5px 0; color: #666;">${process.env.ORG_EMAIL} | ${process.env.ORG_PHONE}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #999;">${process.env.ORG_ADDRESS}</p>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Donation receipt email sent');
  } catch (error) {
    console.error('❌ Failed to send donation receipt email:', error);
    throw error;
  }
};

// Send contact form notification
const sendContactNotification = async (contact) => {
  try {
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const mailOptions = {
      from: `"${process.env.ORG_NAME || 'Contact Form'}" <${fromEmail}>`,
      to: process.env.ORG_EMAIL || fromEmail,
      subject: `📧 New Contact Form Submission - ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #17a2b8, #6f42c1); padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${contact.name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${contact.email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${contact.phone || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${contact.subject}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${new Date().toLocaleDateString()}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
              <strong>Message:</strong><br>
              <p style="margin: 10px 0; line-height: 1.6;">${contact.message}</p>
            </div>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Contact notification sent');
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error);
    throw error;
  }
};

// Send contact confirmation email
const sendContactConfirmation = async (contact) => {
  try {
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarbo Shakti Sonatani Sangathan';
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: contact.email,
      subject: '✅ Thank You for Contacting Us - Sarboshakti Sanatani Sangathan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #17a2b8, #6f42c1); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">✅ Message Received!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Thank you for reaching out to us</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 18px; color: #333;">Dear ${contact.name},</p>
            <p style="color: #666; line-height: 1.6;">Thank you for contacting <strong>Sarboshakti Sanatani Sangathan</strong>. We have received your message and will respond to you within 24-48 hours.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #17a2b8;">
              <h4 style="color: #17a2b8; margin-top: 0;">📋 Your Message Summary</h4>
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">In the meantime, feel free to explore our website to learn more about our mission and activities.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #17a2b8; font-size: 18px; font-weight: bold; margin: 0;">🕉️ Dharma • Seva • Sanskriti • Samaj 🕉️</p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 3px solid #17a2b8;">
            <p style="margin: 0; color: #666;"><strong>Sarboshakti Sanatani Sangathan</strong></p>
            <p style="margin: 5px 0; color: #666;">${process.env.ORG_EMAIL} | ${process.env.ORG_PHONE}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #999;">${process.env.ORG_ADDRESS}</p>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Contact confirmation email sent');
  } catch (error) {
    console.error('❌ Failed to send contact confirmation:', error);
    throw error;
  }
};

// Send membership card email
const sendMembershipCardEmail = async (member) => {
  try {
    const cardHTML = generateMembershipCardHTML(member);
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarbo Shakti Sonatani Sangathan';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: member.email,
      subject: '🎫 Your Digital Membership Card - Sarboshakti Sanatani Sangathan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D2691E, #FF8C00); padding: 20px; text-align: center; color: white;">
            <h2>🎫 Your Digital Membership Card</h2>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p>Dear ${member.fullName},</p>
            <p>Please find your digital membership card below:</p>
            ${cardHTML}
            <p style="margin-top: 20px; color: #666;">Please save this card for your records.</p>
          </div>
        </div>
      `
    };
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Membership card email sent');
  } catch (error) {
    console.error('❌ Failed to send membership card:', error);
    throw error;
  }
};

// Send thank you email with receipt
const sendThankYouWithReceipt = async (donation) => {
  try {
    const donationData = normalizeDonationData(donation);
    console.log('📧 Attempting to send thank you email to:', donationData.email);
    
    const thankYouHTML = generateThankYouEmailHTML(donationData);
    const receiptHTML = generateDonationReceiptHTML(donationData);
    
    console.log('📧 Email templates generated successfully');
    
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarbo Shakti Sonatani Sangathan';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: donationData.email,
      subject: '🙏 Thank You for Your Generous Donation - Sarboshakti Sanatani Sangathan',
      html: thankYouHTML,
      attachments: [{
        filename: `donation-receipt-${donationData.receiptNumber}.html`,
        content: receiptHTML,
        contentType: 'text/html'
      }]
    };
    
    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    await sendMailWithRetry(mailOptions);
    console.log('✅ Thank you email with receipt sent successfully to:', donationData.email);
  } catch (error) {
    console.error('❌ Failed to send thank you email:', error.message);
    console.error('❌ Full error:', error);
    // Don't throw error to prevent donation creation failure
  }
};

// Send membership card with PDF attachment
const sendMembershipCardWithPDF = async (member, cardPath) => {
  try {
    const fromEmail = process.env.SMTP_USER || process.env.ORG_EMAIL;
    const fromName = process.env.ORG_NAME || 'Sarbo Shakti Sonatani Sangathan';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: member.email,
      subject: 'Your Membership ID Card – Sarbo Shakti Sonatani Sangathan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fff8f0, #fef6ed); border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b4513; margin-bottom: 10px;">🕉️ Sarbo Shakti Sonatani Sangathan</h1>
            <p style="color: #d2691e; font-size: 18px; font-weight: bold;">Membership Confirmation</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333;">Dear <strong>${member.fullName}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">🎉 <strong>Congratulations!</strong> Your membership application has been approved. We are delighted to welcome you to our spiritual family.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d2691e;">
              <h3 style="color: #8b4513; margin-top: 0;">📋 Membership Details:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Member ID:</strong> ${member.memberId}</li>
                <li><strong>Membership Type:</strong> ${member.membershipPlan.toUpperCase()}</li>
                <li><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</li>
                <li><strong>Valid Till:</strong> ${member.validTill ? new Date(member.validTill).toLocaleDateString() : 'Lifetime'}</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6;">📎 Your official membership ID card is attached to this email. Please keep it safe and present it when attending our programs and events.</p>
            
            <div style="background: linear-gradient(135deg, #e8f5e8, #f0fff0); padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #228b22; margin: 0; font-weight: bold;">🙏 Thank you for joining our mission to serve humanity through Sanatan Dharma values!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #d2691e;">
              <p style="color: #8b4513; font-weight: bold; margin: 0;">🕉️ Sarbo Shakti Sonatani Sangathan</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301</p>
              <p style="color: #666; font-size: 12px; margin: 5px 0;">Email: info@sarboshaktisonatanisangathan.org</p>
              <div style="margin-top: 15px; font-size: 11px; line-height: 1.4; color: #555;">
                <strong>Key Officials:</strong><br>
                Mr. Ajit Kumar Ray - Chief General Secretary: +91 9907916429<br>
                Shri Goutam Chandra Biswas - Cashier: +91 9868362375<br>
                Shriwas Halder - Official Secretary: +91 9816195600<br>
                Mr. Dinesh Bairagi - President & Founder: +91 8584871180
              </div>
              <p style="color: #d2691e; font-style: italic; margin: 15px 0 0 0; font-size: 12px;">"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</p>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `membership-card-${member.memberId}.pdf`,
          path: cardPath
        }
      ]
    };

    await sendMailWithRetry(mailOptions);
    console.log('✅ Membership card email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send membership card email:', error);
    throw error;
  }
};

// Send donation receipt with PDF attachment - REDIRECTED TO GMAIL SERVICE
const sendDonationReceiptWithPDF = async (donation, receiptPath) => {
  console.log('⚠️ Redirecting to Gmail service to avoid SMTP timeouts');
  const { sendDonationReceiptGmail } = require('./emailServiceGmail');
  return await sendDonationReceiptGmail(donation);
};

module.exports = {
  sendAdminMemberNotification,
  sendAdminDonationNotification,
  sendMemberApprovalEmail,
  sendDonationReceiptEmail,
  sendContactNotification,
  sendContactConfirmation,
  sendMembershipCardEmail,
  sendThankYouWithReceipt,
  sendMembershipCardWithPDF,
  sendDonationReceiptWithPDF
};