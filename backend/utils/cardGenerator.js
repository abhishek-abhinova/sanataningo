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

module.exports = {
  generateMembershipCard,
  generateDonationReceipt
};