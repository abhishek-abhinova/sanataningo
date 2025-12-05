const nodemailer = require('nodemailer');

// Create multiple transporter configurations to try
const createTransporters = () => {
  const transporters = [];
  
  // Primary: Hostinger SMTP
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporters.push({
      name: 'Hostinger',
      config: {
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
      }
    });
  }
  
  // Fallback: Gmail SMTP (if configured)
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    transporters.push({
      name: 'Gmail',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000
      }
    });
  }
  
  return transporters;
};

// Send email with multiple fallback options
const sendEmailRobust = async (mailOptions, retries = 1) => {
  const transporters = createTransporters();
  
  if (transporters.length === 0) {
    throw new Error('No email transporters configured');
  }
  
  let lastError = null;
  
  // Try each transporter
  for (const transporterConfig of transporters) {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        console.log(`📧 Trying ${transporterConfig.name} transporter (attempt ${attempt})`);
        
        const transporter = nodemailer.createTransporter(transporterConfig.config);
        
        // Add timeout wrapper
        const result = await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Send timeout')), 10000)
          )
        ]);
        
        console.log(`✅ Email sent via ${transporterConfig.name}:`, {
          messageId: result.messageId,
          accepted: result.accepted
        });
        
        if (transporter.close) {
          transporter.close();
        }
        
        return result;
      } catch (error) {
        lastError = error;
        console.error(`❌ ${transporterConfig.name} attempt ${attempt} failed:`, error.message);
        
        if (attempt <= retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }
  
  // If all transporters fail, try Ethereal as last resort
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
      }
    });
    
    const result = await ethTransporter.sendMail(mailOptions);
    console.log('📧 Ethereal preview:', nodemailer.getTestMessageUrl(result));
    console.warn('⚠️ Email sent to test account only - not delivered to real inbox');
    
    return result;
  } catch (ethError) {
    console.error('❌ Ethereal fallback failed:', ethError.message);
    throw lastError || ethError;
  }
};

// Simplified email functions
const sendMemberApprovalEmail = async (member) => {
  const mailOptions = {
    from: `"${process.env.ORG_NAME || 'Sarbo Shakti'}" <${process.env.SMTP_USER}>`,
    to: member.email,
    subject: '🎉 Membership Approved - Welcome!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d2691e;">🎉 Welcome to Our Family!</h2>
        <p>Dear ${member.fullName},</p>
        <p>Your membership has been approved! Welcome to Sarboshakti Sanatani Sangathan.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Membership Details:</h3>
          <p><strong>Member ID:</strong> ${member.memberId}</p>
          <p><strong>Type:</strong> ${member.membershipPlan}</p>
          <p><strong>Amount:</strong> ₹${member.amount}</p>
        </div>
        <p>Thank you for joining our mission!</p>
        <p>Best regards,<br>Sarboshakti Sanatani Sangathan</p>
      </div>
    `
  };
  
  return await sendEmailRobust(mailOptions);
};

const sendDonationReceiptEmail = async (donation) => {
  const mailOptions = {
    from: `"${process.env.ORG_NAME || 'Sarbo Shakti'}" <${process.env.SMTP_USER}>`,
    to: donation.email,
    subject: `🙏 Donation Receipt - ${donation.receiptNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #28a745;">🙏 Thank You for Your Donation!</h2>
        <p>Dear ${donation.donorName},</p>
        <p>We have received your generous donation. Thank you for supporting our cause!</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Donation Details:</h3>
          <p><strong>Receipt ID:</strong> ${donation.receiptNumber}</p>
          <p><strong>Amount:</strong> ₹${donation.amountFormatted}</p>
          <p><strong>Purpose:</strong> ${donation.purpose}</p>
          <p><strong>Date:</strong> ${donation.donationDateFormatted}</p>
        </div>
        <p>This receipt is eligible for tax exemption under Section 80G.</p>
        <p>With gratitude,<br>Sarboshakti Sanatani Sangathan</p>
      </div>
    `
  };
  
  return await sendEmailRobust(mailOptions);
};

module.exports = {
  sendEmailRobust,
  sendMemberApprovalEmail,
  sendDonationReceiptEmail
};