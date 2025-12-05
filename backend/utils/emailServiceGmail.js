const nodemailer = require('nodemailer');

// Gmail-based email service
const sendEmailGmail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'manishlakta@gmail.com',
        pass: 'your-app-password' // Use Gmail App Password
      }
    });

    const result = await transporter.sendMail({
      ...mailOptions,
      from: '"Sarboshakti Sanatani Sangathan" <manishlakta@gmail.com>'
    });

    console.log('✅ Email sent via Gmail:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Gmail email failed:', error.message);
    
    // Fallback to Ethereal
    try {
      const testAccount = await nodemailer.createTestAccount();
      const ethTransporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      const result = await ethTransporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(result);
      
      console.log('✅ Email sent via Ethereal (preview):', previewUrl);
      return { ...result, previewUrl };
    } catch (ethError) {
      console.error('❌ Ethereal fallback failed:', ethError.message);
      throw error;
    }
  }
};

// Send donation receipt
const sendDonationReceiptGmail = async (donation) => {
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

  return await sendEmailGmail(mailOptions);
};

module.exports = {
  sendDonationReceiptGmail,
  sendEmailGmail
};