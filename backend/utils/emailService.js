const nodemailer = require('nodemailer');

// Create transporter with better error handling
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Send admin notification for new member
const sendAdminMemberNotification = async (member) => {
  try {
    const mailOptions = {
      from: process.env.ORG_EMAIL,
      to: process.env.ORG_EMAIL,
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
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin member notification sent');
  } catch (error) {
    console.error('❌ Failed to send admin member notification:', error);
    throw error;
  }
};

// Send admin notification for new donation
const sendAdminDonationNotification = async (donation) => {
  try {
    const mailOptions = {
      from: process.env.ORG_EMAIL,
      to: process.env.ORG_EMAIL,
      subject: `💰 New Donation - ${donation.donorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">💰 New Donation Received</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Donor:</td><td style="padding: 8px;">${donation.donorName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${donation.email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${donation.phone}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Amount:</td><td style="padding: 8px; color: #28a745; font-size: 18px; font-weight: bold;">₹${donation.amount}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Purpose:</td><td style="padding: 8px;">${donation.purpose}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">UPI Ref:</td><td style="padding: 8px;">${donation.paymentReference || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${new Date().toLocaleDateString()}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #d1ecf1; border-left: 4px solid #17a2b8;">
              <strong>⚠️ Action Required:</strong> Please verify the payment screenshot and approve the donation in admin panel.
            </div>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin donation notification sent');
  } catch (error) {
    console.error('❌ Failed to send admin donation notification:', error);
    throw error;
  }
};

// Send member approval email with ID card
const sendMemberApprovalEmail = async (member) => {
  try {
    const mailOptions = {
      from: process.env.ORG_EMAIL,
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
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Member approval email sent');
  } catch (error) {
    console.error('❌ Failed to send member approval email:', error);
    throw error;
  }
};

// Send donation receipt email
const sendDonationReceiptEmail = async (donation) => {
  try {
    const mailOptions = {
      from: process.env.ORG_EMAIL,
      to: donation.email,
      subject: '🙏 Donation Receipt - Thank You for Your Noble Contribution',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🙏 Thank You!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Your generous donation has been received</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="font-size: 18px; color: #333;">Dear ${donation.donorName},</p>
            <p style="color: #666; line-height: 1.6;">We have received and verified your generous donation. Your contribution brings us one step closer to serving humanity through the noble values of Sanatan Dharma.</p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 15px; margin: 25px 0; border-left: 5px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">🧾 Donation Receipt</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Donation ID:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">${donation.donationId}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Amount:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold; font-size: 18px;">₹${donation.amount}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Purpose:</td><td style="padding: 8px 0;">${donation.purpose}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Date:</td><td style="padding: 8px 0;">${new Date(donation.approvedAt).toLocaleDateString()}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #495057;">Payment Ref:</td><td style="padding: 8px 0;">${donation.paymentReference}</td></tr>
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
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Donation receipt email sent');
  } catch (error) {
    console.error('❌ Failed to send donation receipt email:', error);
    throw error;
  }
};

// Send contact form notification
const sendContactNotification = async (contact) => {
  try {
    const mailOptions = {
      from: process.env.ORG_EMAIL,
      to: process.env.ORG_EMAIL,
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
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification sent');
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error);
    throw error;
  }
};

// Send contact confirmation email
const sendContactConfirmation = async (contact) => {
  try {
    const mailOptions = {
      from: process.env.ORG_EMAIL,
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
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact confirmation email sent');
  } catch (error) {
    console.error('❌ Failed to send contact confirmation:', error);
    throw error;
  }
};

module.exports = {
  sendAdminMemberNotification,
  sendAdminDonationNotification,
  sendMemberApprovalEmail,
  sendDonationReceiptEmail,
  sendContactNotification,
  sendContactConfirmation
};