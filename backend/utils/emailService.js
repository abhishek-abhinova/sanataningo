const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send admin notification for new member
const sendAdminMemberNotification = async (member) => {
  const mailOptions = {
    from: process.env.ORG_EMAIL,
    to: process.env.ORG_EMAIL,
    subject: `New Member Registration - ${member.fullName}`,
    html: `
      <h2>New Member Registration</h2>
      <p><strong>Name:</strong> ${member.fullName}</p>
      <p><strong>Email:</strong> ${member.email}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Membership Type:</strong> ${member.membershipPlan}</p>
      <p><strong>Amount:</strong> ₹${member.amount}</p>
      <p><strong>UPI Reference:</strong> ${member.upiReference}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p>Please verify the payment and approve the membership.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send admin notification for new donation
const sendAdminDonationNotification = async (donation) => {
  const mailOptions = {
    from: process.env.ORG_EMAIL,
    to: process.env.ORG_EMAIL,
    subject: `New Donation - ${donation.donorName}`,
    html: `
      <h2>New Donation Received</h2>
      <p><strong>Donor:</strong> ${donation.donorName}</p>
      <p><strong>Email:</strong> ${donation.email}</p>
      <p><strong>Phone:</strong> ${donation.phone}</p>
      <p><strong>Amount:</strong> ₹${donation.amount}</p>
      <p><strong>Purpose:</strong> ${donation.purpose}</p>
      <p><strong>UPI Reference:</strong> ${donation.paymentReference}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p>Please verify the payment and approve the donation.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send member approval email with ID card
const sendMemberApprovalEmail = async (member) => {
  const mailOptions = {
    from: process.env.ORG_EMAIL,
    to: member.email,
    subject: 'Membership Approved - Welcome to Sarboshakti Sanatani Sangathan',
    html: `
      <h2>🎉 Congratulations! Your Membership is Approved</h2>
      <p>Dear ${member.fullName},</p>
      <p>We are pleased to inform you that your membership application has been approved.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>Membership Details:</h3>
        <p><strong>Member ID:</strong> ${member.memberId}</p>
        <p><strong>Membership Type:</strong> ${member.membershipPlan}</p>
        <p><strong>Valid Till:</strong> ${new Date(member.validTill).toLocaleDateString()}</p>
        <p><strong>Amount Paid:</strong> ₹${member.amount}</p>
      </div>
      
      <p>Your digital membership card will be available in your member portal.</p>
      <p>Thank you for joining our mission to serve humanity through Sanatan Dharma values.</p>
      
      <p>Best regards,<br>
      Sarboshakti Sanatani Sangathan<br>
      ${process.env.ORG_EMAIL}<br>
      ${process.env.ORG_PHONE}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send donation receipt email
const sendDonationReceiptEmail = async (donation) => {
  const mailOptions = {
    from: process.env.ORG_EMAIL,
    to: donation.email,
    subject: 'Donation Receipt - Thank You for Your Contribution',
    html: `
      <h2>🙏 Thank You for Your Generous Donation</h2>
      <p>Dear ${donation.donorName},</p>
      <p>We have received and verified your donation. Thank you for supporting our cause.</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>Donation Receipt:</h3>
        <p><strong>Donation ID:</strong> ${donation.donationId}</p>
        <p><strong>Amount:</strong> ₹${donation.amount}</p>
        <p><strong>Purpose:</strong> ${donation.purpose}</p>
        <p><strong>Date:</strong> ${new Date(donation.approvedAt).toLocaleDateString()}</p>
        <p><strong>Payment Reference:</strong> ${donation.paymentReference}</p>
      </div>
      
      <p>This donation is eligible for tax exemption under Section 80G of the Income Tax Act.</p>
      <p>Your contribution helps us continue our service to society through dharmic values.</p>
      
      <p>With gratitude,<br>
      Sarboshakti Sanatani Sangathan<br>
      ${process.env.ORG_EMAIL}<br>
      ${process.env.ORG_PHONE}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendAdminMemberNotification,
  sendAdminDonationNotification,
  sendMemberApprovalEmail,
  sendDonationReceiptEmail
};