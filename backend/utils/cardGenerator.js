const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { normalizeDonationData } = require('./donationFormatter');

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

const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convert = (n) => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    }
    if (n < 1000) {
      return `${convert(Math.floor(n / 100))} Hundred${n % 100 ? ' ' + convert(n % 100) : ''}`;
    }
    if (n < 100000) {
      return `${convert(Math.floor(n / 1000))} Thousand${n % 1000 ? ' ' + convert(n % 1000) : ''}`;
    }
    if (n < 10000000) {
      return `${convert(Math.floor(n / 100000))} Lakh${n % 100000 ? ' ' + convert(n % 100000) : ''}`;
    }
    return `${convert(Math.floor(n / 10000000))} Crore${n % 10000000 ? ' ' + convert(n % 10000000) : ''}`;
  };

  return convert(Math.floor(num));
};

const generateDonationReceipt = async (donation) => {
  try {
    const data = normalizeDonationData(donation);
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Donation Receipt - ${data.receiptNumber}`,
        Author: 'Sarbo Shakti Sonatani Sangathan',
        Subject: 'Donation Receipt'
      }
    });

    const safeReceiptId = data.receiptNumber.replace(/[^a-z0-9-_]/gi, '-');
    const receiptPath = path.join(
      __dirname,
      '../uploads/receipts',
      `receipt-${safeReceiptId}-${Date.now()}.pdf`
    );

    const receiptDir = path.dirname(receiptPath);
    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(receiptPath);
    doc.pipe(writeStream);

    const primaryColor = '#8b4513';
    const accentColor = '#d2691e';
    const successColor = '#1e7f34';

    // Header
    doc.save();
    doc.rect(50, 40, 495, 80).fill(primaryColor);
    doc.restore();

    doc.fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('SARBO SHAKTI SONATANI SANGATHAN', 50, 55, { align: 'center', width: 495 });

    doc.font('Helvetica')
      .fontSize(10)
      .text('19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301 | info@sarboshaktisonatanisangathan.org', 50, 80, {
        align: 'center',
        width: 495
      });

    // Title
    doc.fillColor('#000000');
    doc.rect(50, 140, 495, 32).fill(accentColor);
    doc.fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('DONATION RECEIPT', 50, 148, { align: 'center', width: 495 });

    let yPos = 200;

    // Receipt meta
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(11);
    doc.text('Receipt No:', 50, yPos);
    doc.font('Helvetica').text(data.receiptNumber, 140, yPos);

    doc.font('Helvetica-Bold').text('Date:', 360, yPos);
    doc.font('Helvetica').text(data.donationDateFormatted, 420, yPos);
    yPos += 30;

    doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor(accentColor).lineWidth(1).stroke();
    yPos += 20;

    // Donor info
    doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(13).text('Donor Information', 50, yPos);
    yPos += 18;
    doc.font('Helvetica').fillColor('#000000').fontSize(11);
    doc.text(`Name: ${data.donorName}`, 50, yPos, { width: 495 });
    yPos += 16;
    if (data.email) {
      doc.text(`Email: ${data.email}`, 50, yPos, { width: 495 });
      yPos += 16;
    }
    if (data.phone) {
      doc.text(`Phone: ${data.phone}`, 50, yPos, { width: 495 });
      yPos += 16;
    }
    doc.text(`Address: ${data.address}`, 50, yPos, { width: 495 });
    yPos += 24;

    doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(13).text('Donation Details', 50, yPos);
    yPos += 18;
    doc.font('Helvetica').fillColor('#000000').fontSize(11);
    doc.text(`Amount: Rs. ${data.amountFormatted}`, 50, yPos);
    yPos += 16;
    doc.text(`Purpose: ${data.purpose}`, 50, yPos);
    yPos += 16;
    doc.text(`Payment Method: UPI / Digital Payment`, 50, yPos);
    yPos += 16;
    if (data.paymentReference) {
      doc.text(`Transaction ID: ${data.paymentReference}`, 50, yPos);
      yPos += 16;
    }

    yPos += 10;
    doc.rect(50, yPos, 495, 50).fill('#f8f9fa').strokeColor(accentColor).lineWidth(0.5).stroke();
    doc.fillColor(primaryColor).font('Helvetica-Bold').text('Amount in Words:', 60, yPos + 10);
    const words = numberToWords(data.amount);
    doc.font('Helvetica').fillColor('#000000').text(`${words} Rupees Only`, 60, yPos + 28, { width: 470 });
    yPos += 70;

    doc.rect(50, yPos, 495, 70).fill('#f0fff4').strokeColor(successColor).lineWidth(0.5).stroke();
    doc.fillColor(successColor).font('Helvetica-Bold').text('Tax Exemption Information', 60, yPos + 12);
    doc.font('Helvetica').fillColor('#155724').text(
      'This donation is eligible for deduction under Section 80G of the Income Tax Act, 1961. Please retain this receipt for your tax filing.',
      60,
      yPos + 32,
      { width: 470 }
    );
    yPos += 90;

    doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(13)
      .text('Thank You for Your Generous Contribution!', 50, yPos, { align: 'center', width: 495 });
    yPos += 20;
    doc.font('Helvetica').fillColor('#333333').fontSize(10)
      .text(
        'Your support empowers us to continue our mission of serving humanity through Sanatan Dharma values, cultural preservation, and welfare initiatives.',
        70,
        yPos,
        { width: 455, align: 'center' }
      );
    yPos += 60;

    doc.moveTo(50, yPos).lineTo(545, yPos).strokeColor(accentColor).lineWidth(1).stroke();
    yPos += 15;

    doc.font('Helvetica').fillColor('#555555').fontSize(9)
      .text('This is a computer-generated receipt and does not require a signature.', 50, yPos, { align: 'center', width: 495 });
    yPos += 12;
    doc.text('For any queries, please contact: info@sarboshaktisonatanisangathan.org', 50, yPos, {
      align: 'center',
      width: 495
    });
    yPos += 20;

    doc.font('Helvetica-Bold').fillColor(primaryColor).fontSize(11)
      .text('Sarbo Shakti Sonatani Sangathan', 50, yPos, { align: 'center', width: 495 });
    yPos += 14;
    doc.font('Helvetica').fillColor('#555555').fontSize(9)
      .text('19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301', 50, yPos, { align: 'center', width: 495 });

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

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

// Generate Team Member ID card PDF
const generateTeamIdCard = async (team) => {
  try {
    const doc = new PDFDocument({ size: [400, 260], margin: 16 });
    const teamId = team.teamId || `TM${String(team.id || team._id).padStart(6, '0')}`;
    const fileSafeId = teamId.replace(/[^a-z0-9-_]/gi, '-');
    const cardPath = path.join(__dirname, '../uploads/teamcards', `team-id-card-${fileSafeId}.pdf`);

    const dir = path.dirname(cardPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(cardPath);
    doc.pipe(writeStream);

    const primary = '#8b4513';
    const accent = '#d2691e';

    // Background
    doc.rect(0, 0, 400, 260).fill(primary);
    doc.rect(6, 6, 388, 248).fill('#fff8f0');

    // Header
    doc.rect(6, 6, 388, 40).fill(accent);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(16)
      .text('SARBOSHAKTI SANATANI SANGATHAN', 12, 14, { width: 376, align: 'center' });
    doc.font('Helvetica').fontSize(9).text('Team Identity Card', 12, 30, { width: 376, align: 'center' });

    // Photo
    let photoPath = null;
    if (team.photo_url && typeof team.photo_url === 'string' && !team.photo_url.startsWith('http')) {
      const rel = team.photo_url.replace(/^\/*/, '');
      const candidate = path.join(__dirname, '..', rel);
      if (fs.existsSync(candidate)) photoPath = candidate;
    }
    if (photoPath) {
      try {
        doc.image(photoPath, 20, 60, { width: 70, height: 90, fit: [70, 90] });
      } catch {}
    } else {
      doc.rect(20, 60, 70, 90).stroke(accent);
      doc.fontSize(9).fillColor('#666').text('PHOTO', 45, 100);
    }

    // Details
    const startX = 100;
    let y = 60;
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(12).text(team.name || '-', startX, y);
    y += 18;
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(`Position: ${team.designation || team.position || '-'}`, startX, y);
    y += 14;
    doc.text(`Team ID: ${teamId}`, startX, y);
    y += 14;
    doc.text(`Phone: ${team.phone || '-'}`, startX, y);
    y += 14;
    doc.text(`Email: ${team.email || '-'}`, startX, y);
    y += 18;
    doc.font('Helvetica-Bold').fillColor(primary).text('Biography', startX, y);
    y += 14;
    doc.font('Helvetica').fillColor('#000').fontSize(9)
      .text((team.bio || '').slice(0, 350) || '—', startX, y, { width: 280, height: 90 });

    // Footer
    doc.fontSize(8).fillColor('#666')
      .text('19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, UP-231301', 20, 220, { width: 360, align: 'center' })
      .text('This card is property of Sarbo Shakti Sonatani Sangathan', 20, 236, { width: 360, align: 'center' });

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return cardPath;
  } catch (err) {
    console.error('Team ID card generation error:', err);
    throw err;
  }
};

module.exports = {
  generateMembershipCard,
  generateDonationReceipt,
  generateMembershipCardHTML,
  generateTeamIdCard
};
