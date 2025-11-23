const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateMembershipCard = async (member) => {
  try {
    const doc = new PDFDocument({ size: [350, 220], margin: 10 });
    const cardPath = path.join(__dirname, '../uploads/cards', `card-${member.memberId}.pdf`);
    
    // Ensure directory exists
    const cardDir = path.dirname(cardPath);
    if (!fs.existsSync(cardDir)) {
      fs.mkdirSync(cardDir, { recursive: true });
    }
    
    doc.pipe(fs.createWriteStream(cardPath));

    // Background gradient
    doc.rect(0, 0, 350, 220).fill('#8b4513');
    doc.rect(5, 5, 340, 210).fill('#ffffff');
    
    // Header
    doc.rect(5, 5, 340, 40).fill('#d2691e');
    doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
       .text('SARBO SHAKTI SONATANI SANGATHAN', 15, 18);
    doc.fontSize(8).text('Membership Identity Card', 15, 32);

    // Member photo placeholder
    doc.rect(15, 55, 60, 70).stroke('#d2691e');
    doc.fontSize(8).fillColor('#666666')
       .text('PHOTO', 35, 85);

    // Member details
    doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
       .text(`Name: ${member.fullName}`, 85, 55);
    doc.fontSize(8).font('Helvetica')
       .text(`ID: ${member.memberId}`, 85, 70)
       .text(`DOB: ${new Date(member.dateOfBirth).toLocaleDateString()}`, 85, 82)
       .text(`Phone: ${member.phone}`, 85, 94)
       .text(`Email: ${member.email}`, 85, 106)
       .text(`Aadhaar: ${member.aadhaarNumber}`, 85, 118);

    // Membership details
    doc.fontSize(9).font('Helvetica-Bold')
       .text(`Type: ${member.membershipPlan.toUpperCase()}`, 15, 140)
       .text(`Valid Till: ${member.validTill ? new Date(member.validTill).toLocaleDateString() : 'Lifetime'}`, 15, 155)
       .text(`Issue Date: ${new Date().toLocaleDateString()}`, 15, 170);

    // Generate QR Code
    const qrData = `https://sarboshaktisonatanisangathan.org/member/${member._id}`;
    const qrCodeBuffer = await QRCode.toBuffer(qrData, { width: 60 });
    doc.image(qrCodeBuffer, 280, 140, { width: 50 });
    
    // Footer
    doc.fontSize(6).fillColor('#666666')
       .text('19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301', 15, 190)
       .text('This card is property of Sarbo Shakti Sonatani Sangathan', 15, 200);

    doc.end();
    
    return cardPath;
  } catch (error) {
    console.error('Card generation error:', error);
    throw error;
  }
};

const generateDonationReceipt = async (donation) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    const receiptPath = path.join(__dirname, '../uploads/receipts', `receipt-${donation._id}.pdf`);
    
    // Ensure directory exists
    const receiptDir = path.dirname(receiptPath);
    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir, { recursive: true });
    }
    
    doc.pipe(fs.createWriteStream(receiptPath));

    // Header
    doc.fontSize(20).font('Helvetica-Bold')
       .text('SARBO SHAKTI SONATANI SANGATHAN', 50, 50);
    doc.fontSize(12).font('Helvetica')
       .text('19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301', 50, 75)
       .text('Email: info@sarboshaktisonatanisangathan.org', 50, 90);

    // Receipt title
    doc.fontSize(16).font('Helvetica-Bold')
       .text('DONATION RECEIPT', 50, 130);
    
    // Receipt details
    const receiptNo = `SSS-${Date.now()}`;
    doc.fontSize(12).font('Helvetica')
       .text(`Receipt No: ${receiptNo}`, 50, 160)
       .text(`Date: ${new Date().toLocaleDateString()}`, 350, 160)
       .text(`Donor Name: ${donation.donorName}`, 50, 190)
       .text(`Amount: ₹${donation.amount}`, 50, 210)
       .text(`Purpose: ${donation.purpose || 'General Donation'}`, 50, 230)
       .text(`Payment Method: UPI`, 50, 250)
       .text(`Transaction ID: ${donation.paymentReference}`, 50, 270);

    // Thank you message
    doc.fontSize(14).font('Helvetica-Bold')
       .text('Thank you for your generous donation!', 50, 320);
    
    doc.fontSize(10).font('Helvetica')
       .text('This receipt is computer generated and does not require signature.', 50, 350)
       .text('For any queries, please contact us at info@sarboshaktisonatanisangathan.org', 50, 365);

    doc.end();
    
    return receiptPath;
  } catch (error) {
    console.error('Receipt generation error:', error);
    throw error;
  }
};

// Generate membership card HTML for email
const generateMembershipCardHTML = (member) => {
  return `
    <div style="width: 350px; height: 220px; background: linear-gradient(135deg, #8b4513, #d2691e); border-radius: 15px; padding: 3px; margin: 20px auto; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
      <div style="width: 100%; height: 100%; background: #fff8f0; border-radius: 12px; padding: 15px; position: relative; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #d2691e, #ff8c00); color: white; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; text-align: center;">
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">🕉️ SARBO SHAKTI SONATANI SANGATHAN</div>
          <div style="font-size: 9px; color: #ffd700;">MEMBERSHIP IDENTITY CARD</div>
        </div>
        
        <!-- Content -->
        <div style="display: flex; gap: 10px;">
          <!-- Photo placeholder -->
          <div style="width: 60px; height: 75px; border: 2px solid #d2691e; border-radius: 5px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #666; text-align: center; line-height: 1.2;">MEMBER<br>PHOTO</div>
          
          <!-- Details -->
          <div style="flex: 1; font-size: 9px; line-height: 1.4;">
            <div style="font-size: 11px; font-weight: bold; color: #8b4513; margin-bottom: 3px;">${member.fullName}</div>
            <div><strong>ID:</strong> ${member.memberId}</div>
            <div><strong>DOB:</strong> ${new Date(member.dateOfBirth).toLocaleDateString('en-IN')}</div>
            <div><strong>Phone:</strong> ${member.phone}</div>
            <div><strong>Email:</strong> ${member.email}</div>
            <div><strong>Aadhaar:</strong> ${'*'.repeat(8)}${member.aadhaarNumber.slice(-4)}</div>
          </div>
          
          <!-- QR Code placeholder -->
          <div style="width: 50px; height: 50px; border: 1px solid #d2691e; border-radius: 3px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #666; text-align: center;">QR<br>CODE</div>
        </div>
        
        <!-- Membership info -->
        <div style="background: linear-gradient(135deg, #e8f5e8, #f0fff0); padding: 6px 8px; border-radius: 5px; margin-top: 8px; border-left: 3px solid #228b22;">
          <div style="font-size: 9px; font-weight: bold; color: #228b22;">Membership: ${member.membershipPlan.toUpperCase()}</div>
          <div style="font-size: 8px; color: #666;">Valid Till: ${member.validTill ? new Date(member.validTill).toLocaleDateString('en-IN') : 'LIFETIME'} | Issue: ${new Date().toLocaleDateString('en-IN')}</div>
        </div>
        
        <!-- Footer -->
        <div style="position: absolute; bottom: 5px; left: 15px; right: 15px; font-size: 6px; color: #666; text-align: center; line-height: 1.2;">
          19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301<br>
          This card is property of Sarbo Shakti Sonatani Sangathan
        </div>
        
        <!-- Decorative elements -->
        <div style="position: absolute; top: 60px; right: 15px; font-size: 12px; color: #d2691e; opacity: 0.7;">🕉️</div>
        <div style="position: absolute; top: 80px; right: 15px; font-size: 12px; color: #d2691e; opacity: 0.7;">🕉️</div>
      </div>
    </div>
  `;
};

module.exports = {
  generateMembershipCard,
  generateDonationReceipt,
  generateMembershipCardHTML
};