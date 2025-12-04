const nodemailer = require('nodemailer');

// Gmail SMTP configuration for Render compatibility
const createGmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER || 'your-gmail@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Fallback to Ethereal for testing
const createEtherealTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Send email with fallback options
const sendEmailRender = async (mailOptions) => {
  console.log('📧 Attempting to send email via Render-compatible service...');
  
  try {
    // Try Gmail first (most reliable on Render)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Using Gmail SMTP...');
      const gmailTransporter = createGmailTransporter();
      const result = await gmailTransporter.sendMail({
        ...mailOptions,
        from: `"${process.env.ORG_NAME}" <${process.env.GMAIL_USER}>`
      });
      console.log('✅ Email sent via Gmail:', result.messageId);
      return result;
    }
    
    // Fallback to Ethereal for testing
    console.log('📧 Using Ethereal test account...');
    const etherealTransporter = await createEtherealTransporter();
    const result = await etherealTransporter.sendMail(mailOptions);
    console.log('📧 Test email sent (Ethereal):', nodemailer.getTestMessageUrl(result));
    console.log('⚠️ This is a test email - not delivered to real inbox');
    return result;
    
  } catch (error) {
    console.error('❌ All email methods failed:', error.message);
    throw error;
  }
};

// Simple email templates
const sendMemberApprovalEmailRender = async (member) => {
  const mailOptions = {
    to: member.email,
    subject: '🎉 Membership Approved - Sarboshakti Sanatani Sangathan',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d2691e;">🕉️ Welcome to Our Family!</h2>
        <p>Dear ${member.fullName || member.full_name},</p>
        <p>Your membership has been approved! Welcome to Sarboshakti Sanatani Sangathan.</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Membership Details:</strong><br>
          Member ID: ${member.memberId || member.member_id}<br>
          Plan: ${member.membershipPlan || member.membership_type}<br>
          Valid Till: ${member.validTill ? new Date(member.validTill).toLocaleDateString() : 'Lifetime'}
        </div>
        <p>Thank you for joining our mission!</p>
        <p style="color: #666; font-size: 12px;">Sarboshakti Sanatani Sangathan</p>
      </div>
    `
  };
  
  return await sendEmailRender(mailOptions);
};

const sendDonationReceiptEmailRender = async (donation) => {
  const mailOptions = {
    to: donation.email,
    subject: '🙏 Donation Receipt - Sarboshakti Sanatani Sangathan',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #28a745;">🙏 Thank You for Your Donation!</h2>
        <p>Dear ${donation.donorName || donation.donor_name},</p>
        <p>We have received your generous donation. Thank you for supporting our cause!</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Donation Details:</strong><br>
          Amount: ₹${donation.amount}<br>
          Purpose: ${donation.purpose || donation.donation_type}<br>
          Date: ${new Date().toLocaleDateString()}<br>
          Receipt ID: ${donation.receiptNumber || donation.receipt_number || 'DON' + Date.now()}
        </div>
        <p>This donation is eligible for tax exemption under Section 80G.</p>
        <p style="color: #666; font-size: 12px;">Sarboshakti Sanatani Sangathan</p>
      </div>
    `
  };
  
  return await sendEmailRender(mailOptions);
};

const sendContactNotificationRender = async (contact) => {
  const mailOptions = {
    to: process.env.ORG_EMAIL || process.env.GMAIL_USER,
    subject: '📧 New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #17a2b8;">📧 New Contact Message</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>From:</strong> ${contact.name}<br>
          <strong>Email:</strong> ${contact.email}<br>
          <strong>Phone:</strong> ${contact.phone || 'N/A'}<br>
          <strong>Subject:</strong> ${contact.subject}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">
          <strong>Message:</strong><br>
          ${contact.message}
        </div>
      </div>
    `
  };
  
  return await sendEmailRender(mailOptions);
};

module.exports = {
  sendEmailRender,
  sendMemberApprovalEmailRender,
  sendDonationReceiptEmailRender,
  sendContactNotificationRender
};