const nodemailer = require('nodemailer');

// Ethereal-only email service for Render deployment
const sendEmailEthereal = async (mailOptions) => {
  try {
    console.log('🛠️ Using Ethereal test account for email');
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const result = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(result);
    
    console.log('✅ Email sent via Ethereal (preview):', previewUrl);
    console.warn('⚠️ Using Ethereal test account - email will NOT be delivered to real inbox!');
    return { ...result, previewUrl };
  } catch (error) {
    console.error('❌ Ethereal email failed:', error.message);
    throw error;
  }
};

// Send donation receipt
const sendDonationReceiptEthereal = async (donation) => {
  const donationData = {
    donorName: donation.donor_name || donation.donorName,
    email: donation.email,
    amount: donation.amount,
    receiptNumber: donation.receipt_number || `DON${donation.id}`,
    purpose: donation.donation_type || donation.purpose || 'General',
    date: new Date(donation.created_at || donation.createdAt).toLocaleDateString()
  };

  const mailOptions = {
    to: donationData.email,
    subject: `🙏 Donation Receipt - ${donationData.receiptNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px;">
          <h1>🙏 Thank You for Your Donation!</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 8px;">
          <h3>Donation Receipt</h3>
          <p><strong>Donor:</strong> ${donationData.donorName}</p>
          <p><strong>Amount:</strong> ₹${donationData.amount}</p>
          <p><strong>Purpose:</strong> ${donationData.purpose}</p>
          <p><strong>Receipt ID:</strong> ${donationData.receiptNumber}</p>
          <p><strong>Date:</strong> ${donationData.date}</p>
        </div>
        
        <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
          <p><strong>Note:</strong> This receipt is eligible for tax exemption under Section 80G.</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666;">
          <p>Sarboshakti Sanatani Sangathan</p>
          <p>🕉️ Serving humanity through Sanatan Dharma values 🕉️</p>
        </div>
      </div>
    `
  };

  return await sendEmailEthereal(mailOptions);
};

module.exports = {
  sendEmailEthereal,
  sendDonationReceiptEthereal,
  sendDonationReceiptWithPDF: sendDonationReceiptEthereal
};