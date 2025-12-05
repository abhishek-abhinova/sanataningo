const nodemailer = require('nodemailer');

// Gmail-based email service for member cards
const sendMembershipCardGmail = async (member, cardPath = null) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'manishlakta@gmail.com',
        pass: 'your-app-password' // Use Gmail App Password
      }
    });

    const mailOptions = {
      from: '"Sarboshakti Sanatani Sangathan" <manishlakta@gmail.com>',
      to: member.email,
      subject: '🎫 Your Membership ID Card - Sarboshakti Sanatani Sangathan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #d2691e, #ff8c00); color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>🎫 Your Membership ID Card</h1>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 8px;">
            <h3>Welcome to Our Family!</h3>
            <p>Dear <strong>${member.fullName || member.full_name}</strong>,</p>
            <p>Congratulations! Your membership has been approved.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4>Membership Details:</h4>
              <p><strong>Member ID:</strong> ${member.memberId || member.member_id}</p>
              <p><strong>Name:</strong> ${member.fullName || member.full_name}</p>
              <p><strong>Type:</strong> ${member.membershipPlan || member.membership_type}</p>
              <p><strong>Valid Till:</strong> ${member.validTill ? new Date(member.validTill).toLocaleDateString() : 'Lifetime'}</p>
            </div>
          </div>
          
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
            <p><strong>Note:</strong> ${cardPath ? 'Your membership card is attached to this email.' : 'Your digital membership card is ready!'}</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>Sarboshakti Sanatani Sangathan</p>
            <p>🕉️ Serving humanity through Sanatan Dharma values 🕉️</p>
          </div>
        </div>
      `
    };

    // Add attachment if card path provided
    if (cardPath) {
      mailOptions.attachments = [{
        filename: `membership-card-${member.memberId || member.member_id}.pdf`,
        path: cardPath
      }];
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Membership card email sent via Gmail:', result.messageId);
    return result;

  } catch (error) {
    console.error('❌ Gmail membership card email failed:', error.message);
    
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
      
      console.log('✅ Membership card email sent via Ethereal (preview):', previewUrl);
      return { ...result, previewUrl };
    } catch (ethError) {
      console.error('❌ Ethereal fallback failed:', ethError.message);
      throw error;
    }
  }
};

module.exports = {
  sendMembershipCardGmail
};