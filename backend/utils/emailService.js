// Redirect all email functions to Gmail service
const { sendDonationReceiptWithPDF, sendGmailEmail } = require('./emailServiceGmail');
const { sendMembershipCardEmail } = require('./emailServiceMember');
const { normalizeDonationData } = require('./donationFormatter');

// Send admin notification for new member - redirect to Gmail service
const sendAdminMemberNotification = async (member) => {
  try {
    console.log('📧 Redirecting admin member notification to Gmail service');
    
    const emailData = {
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
    
    await sendGmailEmail(emailData);
    console.log('✅ Admin member notification sent via Gmail');
  } catch (error) {
    console.error('❌ Failed to send admin member notification:', error);
    throw error;
  }
};

// Send admin notification for new donation - redirect to Gmail service
const sendAdminDonationNotification = async (donation) => {
  try {
    const donationData = normalizeDonationData(donation);
    console.log('📧 Redirecting admin donation notification to Gmail service');
    
    const emailData = {
      to: process.env.ORG_EMAIL,
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
    
    await sendGmailEmail(emailData);
    console.log('✅ Admin donation notification sent via Gmail');
  } catch (error) {
    console.error('❌ Failed to send admin donation notification:', error);
    throw error;
  }
};

// Send membership card email - redirect to Gmail service
const sendMembershipCard = async (member) => {
  console.log('📧 Redirecting membership card to Gmail service');
  return await sendMembershipCardEmail(member);
};

// Send thank you email - redirect to Gmail service
const sendThankYouEmail = async (donorEmail, donorName) => {
  try {
    console.log('📧 Redirecting thank you email to Gmail service');
    
    const emailData = {
      to: donorEmail,
      subject: `🙏 Thank You for Your Generous Donation - ${process.env.ORG_NAME || 'Organization'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">🙏 Thank You for Your Donation</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Dear ${donorName},</p>
            <p>We are deeply grateful for your generous donation to ${process.env.ORG_NAME || 'our organization'}. Your support helps us continue our mission and make a positive impact in our community.</p>
            <p>Your contribution will be put to good use in furthering our cause. We will send you a detailed receipt once your donation is processed and approved.</p>
            <p>Thank you once again for your kindness and generosity.</p>
            <p>With gratitude,<br>${process.env.ORG_NAME || 'Organization'} Team</p>
          </div>
        </div>
      `
    };
    
    await sendGmailEmail(emailData);
    console.log('✅ Thank you email sent via Gmail');
  } catch (error) {
    console.error('❌ Failed to send thank you email:', error);
    throw error;
  }
};

module.exports = {
  sendDonationReceiptWithPDF,
  sendAdminMemberNotification,
  sendAdminDonationNotification,
  sendMembershipCard,
  sendThankYouEmail
};