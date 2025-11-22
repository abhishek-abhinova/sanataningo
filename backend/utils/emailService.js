const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const emailTemplates = {
  'membership-card': {
    subject: '🕉️ Welcome to Sarboshakti Sanatani Sangathan - Your Membership Card',
    html: (data) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #8B4513, #D2691E, #FF8C00); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🕉️ Welcome to Our Spiritual Family!</h1>
          <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Sarboshakti Sanatani Sangathan</p>
        </div>
        <div style="padding: 30px; background: white;">
          <h2 style="color: #8B4513; margin-bottom: 20px;">🙏 Namaste ${data.member.fullName}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">We are delighted to welcome you to our spiritual family! Your membership has been successfully activated, and you are now part of our divine mission to serve humanity through Sanatan Dharma values.</p>
          
          <div style="background: linear-gradient(135deg, #FFF8DC, #FFFACD); padding: 20px; border-radius: 10px; border-left: 5px solid #D2691E; margin: 25px 0; box-shadow: 0 5px 15px rgba(139,69,19,0.1);">
            <h3 style="color: #8B4513; margin-top: 0;">📋 Your Membership Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Member ID:</td><td style="padding: 8px 0; color: #D2691E; font-weight: bold;">${data.member.membershipId}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Membership Type:</td><td style="padding: 8px 0; color: #8B4513; text-transform: uppercase; font-weight: bold;">${data.member.membershipType}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Join Date:</td><td style="padding: 8px 0; color: #333;">${new Date(data.member.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Status:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">✅ ACTIVE</td></tr>
            </table>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
            <h3 style="color: #8B4513; margin-top: 0;">📎 Your Digital Membership Card</h3>
            <p style="color: #666; margin-bottom: 15px;">Your personalized membership card is attached to this email. Please save it for future reference and present it at our events and programs.</p>
            <div style="background: #D2691E; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold;">📄 Membership Card Attached</div>
          </div>
          
          <div style="background: linear-gradient(135deg, #E8F5E8, #F0FFF0); padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #90EE90;">
            <h3 style="color: #228B22; margin-top: 0;">🌟 What's Next?</h3>
            <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
              <li>Participate in our spiritual programs and cultural events</li>
              <li>Join community service activities and seva programs</li>
              <li>Access exclusive member resources and workshops</li>
              <li>Connect with like-minded spiritual seekers</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #FFF8DC, #FFFACD); border-radius: 10px;">
            <p style="font-size: 18px; color: #8B4513; font-style: italic; margin: 0;">"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</p>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0;">May all beings be happy, may all beings be healthy</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">May your journey with us be filled with dharma, seva, spiritual growth, and divine blessings. Together, we shall work towards creating a better world through the eternal values of Sanatan Dharma.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <p style="font-size: 20px; color: #D2691E; font-weight: bold; margin: 0;">🙏 धन्यवाद | Thank You | Hari Om 🕉️</p>
          </div>
        </div>
        
        <div style="background: #8B4513; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Sarboshakti Sanatani Sangathan</p>
          <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.7;">Serving Humanity through Sanatan Dharma Values</p>
        </div>
      </div>
    `
  },
  'donation-receipt': {
    subject: '🙏 Thank You for Your Generous Donation - Receipt Enclosed',
    html: (data) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #228B22, #32CD32, #90EE90); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🙏 Heartfelt Gratitude!</h1>
          <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your Generosity Makes a Difference</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #228B22; margin-bottom: 20px;">🙏 Dear ${data.donation.donorName},</h2>
          
          <div style="background: linear-gradient(135deg, #E8F5E8, #F0FFF0); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #228B22;">
            <p style="font-size: 18px; line-height: 1.6; color: #333; margin: 0; text-align: center; font-weight: 500;">
              "दानं दीयते यत् अनुपकाराय दीयते देशे काले च पात्रे"<br>
              <span style="font-size: 14px; color: #666; font-style: italic;">"Charity given without expectation, at the right place and time, to a worthy cause, is considered virtuous."</span>
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">We are deeply moved by your generous contribution to Sarboshakti Sanatani Sangathan. Your donation is not just a financial support, but a blessing that empowers us to continue our sacred mission of serving humanity through the eternal values of Sanatan Dharma.</p>
          
          <div style="background: linear-gradient(135deg, #FFF8DC, #FFFACD); padding: 25px; border-radius: 10px; border-left: 5px solid #D2691E; margin: 25px 0; box-shadow: 0 5px 15px rgba(139,69,19,0.1);">
            <h3 style="color: #8B4513; margin-top: 0; text-align: center;">📋 Your Donation Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background: rgba(139,69,19,0.1);"><td style="padding: 12px; font-weight: bold; color: #666; border-bottom: 1px solid #ddd;">Donation Amount:</td><td style="padding: 12px; color: #228B22; font-weight: bold; font-size: 18px; border-bottom: 1px solid #ddd;">₹${data.donation.amount}</td></tr>
              <tr><td style="padding: 12px; font-weight: bold; color: #666; border-bottom: 1px solid #ddd;">Receipt Number:</td><td style="padding: 12px; color: #D2691E; font-weight: bold; border-bottom: 1px solid #ddd;">${data.donation.donationId}</td></tr>
              <tr style="background: rgba(139,69,19,0.1);"><td style="padding: 12px; font-weight: bold; color: #666; border-bottom: 1px solid #ddd;">Donation Date:</td><td style="padding: 12px; color: #333; border-bottom: 1px solid #ddd;">${new Date(data.donation.donationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
              <tr><td style="padding: 12px; font-weight: bold; color: #666; border-bottom: 1px solid #ddd;">Purpose:</td><td style="padding: 12px; color: #8B4513; text-transform: capitalize; border-bottom: 1px solid #ddd;">${data.donation.purpose.replace('_', ' ') || 'General Fund'}</td></tr>
              <tr style="background: rgba(40,167,69,0.1);"><td style="padding: 12px; font-weight: bold; color: #666;">Tax Benefit:</td><td style="padding: 12px; color: #28a745; font-weight: bold;">✅ 80G Eligible</td></tr>
            </table>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
            <h3 style="color: #8B4513; margin-top: 0;">📄 Official Receipt</h3>
            <p style="color: #666; margin-bottom: 15px;">Your official donation receipt is attached to this email. Please save it for your tax records and future reference.</p>
            <div style="background: #228B22; color: white; padding: 12px 25px; border-radius: 25px; display: inline-block; font-weight: bold;">📄 Tax Receipt Attached</div>
          </div>
          
          <div style="background: linear-gradient(135deg, #E3F2FD, #F0F8FF); padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #87CEEB;">
            <h3 style="color: #1565C0; margin-top: 0;">🌟 How Your Donation Helps:</h3>
            <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
              <li><strong>Educational Programs:</strong> Supporting underprivileged children's education</li>
              <li><strong>Healthcare Services:</strong> Providing medical assistance to those in need</li>
              <li><strong>Cultural Preservation:</strong> Maintaining and promoting Sanatan traditions</li>
              <li><strong>Community Development:</strong> Empowering communities through various initiatives</li>
              <li><strong>Disaster Relief:</strong> Helping communities during natural calamities</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #FFF8DC, #FFFACD); border-radius: 10px;">
            <p style="font-size: 18px; color: #8B4513; font-style: italic; margin: 0 0 10px;">"यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः"</p>
            <p style="font-size: 14px; color: #666; margin: 0;">Where noble souls are honored, there the divine presence resides</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #FFE4E1, #FFF0F5); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #FF69B4;">
            <h3 style="color: #C71585; margin-top: 0;">🙏 Our Heartfelt Blessings</h3>
            <p style="color: #333; line-height: 1.6; margin: 0;">May the divine shower you with abundant blessings, prosperity, and happiness. Your selfless contribution creates ripples of positive change that will benefit countless lives. You are now part of our extended spiritual family, and we pray for your continued well-being and success.</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333; text-align: center;">Your support enables us to continue our mission of serving humanity through the timeless wisdom of Sanatan Dharma. Together, we are building a more compassionate and dharmic world.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 22px; color: #228B22; font-weight: bold; margin: 0;">🙏 धन्यवाद | Dhanyawad | Thank You 🕉️</p>
            <p style="font-size: 16px; color: #8B4513; margin: 10px 0 0; font-style: italic;">May you be blessed with divine grace and eternal happiness</p>
          </div>
        </div>
        
        <div style="background: #8B4513; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Sarboshakti Sanatani Sangathan</p>
          <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.7;">Serving Humanity through Sanatan Dharma Values</p>
          <p style="margin: 10px 0 0; font-size: 11px; opacity: 0.6;">This donation is eligible for tax deduction under Section 80G</p>
        </div>
      </div>
    `
  },
  'contact-confirmation': {
    subject: 'Thank you for contacting us',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center;">
          <h1>🕉️ Sarboshakti Sanatani Sangathan</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${data.name},</p>
          <p>Thank you for reaching out to us. We have received your message regarding "${data.subject}".</p>
          <p>Our team will review your message and get back to you within 24-48 hours.</p>
          <p>🙏 Hari Om</p>
        </div>
      </div>
    `
  },
  'contact-notification': {
    subject: 'New Contact Form Submission',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.contact.name}</p>
        <p><strong>Email:</strong> ${data.contact.email}</p>
        <p><strong>Phone:</strong> ${data.contact.phone}</p>
        <p><strong>Subject:</strong> ${data.contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.contact.message}</p>
        <p><strong>Submitted:</strong> ${new Date(data.contact.createdAt).toLocaleString()}</p>
      </div>
    `
  }
};

const sendEmail = async ({ to, subject, template, data, attachments = [] }) => {
  try {
    let htmlContent = '';
    let emailSubject = subject;
    
    if (template && emailTemplates[template]) {
      htmlContent = emailTemplates[template].html(data);
      emailSubject = emailTemplates[template].subject;
    }
    
    const mailOptions = {
      from: `"Sarboshakti Sanatani Sangathan" <${process.env.SMTP_USER}>`,
      to,
      subject: emailSubject,
      html: htmlContent,
      attachments
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail };