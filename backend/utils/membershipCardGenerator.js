const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generateMembershipCard = async (member) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const cardHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 20px;
                font-family: 'Arial', sans-serif;
                background: #f0f0f0;
            }
            .card {
                width: 350px;
                height: 220px;
                background: linear-gradient(135deg, #8b4513, #d2691e);
                border-radius: 15px;
                padding: 20px;
                color: white;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                overflow: hidden;
            }
            .card::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200%;
                height: 200%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
                animation: float 20s infinite linear;
            }
            .header {
                text-align: center;
                margin-bottom: 15px;
            }
            .org-name {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .card-title {
                font-size: 12px;
                opacity: 0.9;
            }
            .member-info {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .member-photo {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid rgba(255,255,255,0.3);
                object-fit: cover;
            }
            .member-details h3 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }
            .member-id {
                font-size: 14px;
                font-weight: bold;
                color: #fff3cd;
            }
            .membership-type {
                font-size: 12px;
                opacity: 0.9;
                text-transform: uppercase;
            }
            .validity {
                position: absolute;
                bottom: 15px;
                right: 20px;
                font-size: 10px;
                opacity: 0.8;
            }
            .qr-code {
                position: absolute;
                bottom: 15px;
                left: 20px;
                width: 40px;
                height: 40px;
                background: white;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <div class="org-name">SARBO SHAKTI SONATANI SANGATHAN</div>
                <div class="card-title">MEMBERSHIP CARD</div>
            </div>
            <div class="member-info">
                <img src="${member.photo || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="%23ddd"/><circle cx="50" cy="40" r="12" fill="%23999"/><path d="M30 70 Q50 60 70 70" stroke="%23999" stroke-width="8" fill="none"/></svg>'}" 
                     alt="Member Photo" class="member-photo" />
                <div class="member-details">
                    <h3>${member.fullName}</h3>
                    <div class="member-id">ID: ${member.memberId}</div>
                    <div class="membership-type">${member.membershipPlan} Member</div>
                </div>
            </div>
            <div class="qr-code">QR</div>
            <div class="validity">
                Valid Till: ${member.validTill ? new Date(member.validTill).toLocaleDateString() : 'Lifetime'}
            </div>
        </div>
    </body>
    </html>`;

    await page.setContent(cardHTML);
    await page.setViewport({ width: 400, height: 280 });
    
    const cardDir = path.join(__dirname, '..', 'uploads', 'membership-cards');
    if (!fs.existsSync(cardDir)) {
      fs.mkdirSync(cardDir, { recursive: true });
    }
    
    const cardPath = path.join(cardDir, `card-${member.memberId}-${Date.now()}.png`);
    
    await page.screenshot({
      path: cardPath,
      clip: { x: 0, y: 0, width: 390, height: 260 },
      omitBackground: false
    });
    
    await browser.close();
    
    return cardPath;
  } catch (error) {
    console.error('Error generating membership card:', error);
    throw error;
  }
};

const generateDonationReceipt = async (donation) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 30px;
                font-family: 'Arial', sans-serif;
                background: white;
                color: #333;
            }
            .receipt {
                max-width: 600px;
                margin: 0 auto;
                border: 2px solid #d2691e;
                border-radius: 10px;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #8b4513, #d2691e);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .org-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .receipt-title {
                font-size: 18px;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .receipt-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            .info-group h4 {
                margin: 0 0 10px 0;
                color: #d2691e;
                font-size: 14px;
                text-transform: uppercase;
            }
            .info-group p {
                margin: 5px 0;
                font-size: 16px;
            }
            .amount-section {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 30px 0;
            }
            .amount {
                font-size: 36px;
                font-weight: bold;
                color: #d2691e;
                margin: 10px 0;
            }
            .amount-words {
                font-style: italic;
                color: #666;
            }
            .footer {
                border-top: 1px solid #eee;
                padding: 20px 30px;
                background: #f8f9fa;
                text-align: center;
            }
            .thank-you {
                font-size: 18px;
                color: #d2691e;
                margin-bottom: 10px;
            }
            .tax-note {
                font-size: 12px;
                color: #666;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="receipt">
            <div class="header">
                <div class="org-name">SARBO SHAKTI SONATANI SANGATHAN</div>
                <div class="receipt-title">DONATION RECEIPT</div>
            </div>
            <div class="content">
                <div class="receipt-info">
                    <div class="info-group">
                        <h4>Donor Information</h4>
                        <p><strong>${donation.donorName}</strong></p>
                        <p>${donation.email}</p>
                        <p>${donation.phone}</p>
                        <p>${donation.address}</p>
                    </div>
                    <div class="info-group">
                        <h4>Receipt Details</h4>
                        <p><strong>Receipt No:</strong> ${donation.donationId}</p>
                        <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
                        <p><strong>Purpose:</strong> ${donation.purpose || 'General Donation'}</p>
                        <p><strong>Payment Ref:</strong> ${donation.paymentReference}</p>
                    </div>
                </div>
                
                <div class="amount-section">
                    <h3>Donation Amount</h3>
                    <div class="amount">₹${donation.amount}</div>
                    <div class="amount-words">${numberToWords(donation.amount)} Rupees Only</div>
                </div>
            </div>
            <div class="footer">
                <div class="thank-you">Thank You for Your Generous Donation!</div>
                <p>Your contribution helps us serve the community better.</p>
                <div class="tax-note">
                    This receipt is eligible for tax deduction under Section 80G of Income Tax Act.
                    <br>Registration No: [NGO Registration Number]
                </div>
            </div>
        </div>
    </body>
    </html>`;

    await page.setContent(receiptHTML);
    await page.setViewport({ width: 800, height: 1000 });
    
    const receiptDir = path.join(__dirname, '..', 'uploads', 'donation-receipts');
    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir, { recursive: true });
    }
    
    const receiptPath = path.join(receiptDir, `receipt-${donation.donationId}-${Date.now()}.pdf`);
    
    await page.pdf({
      path: receiptPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    
    await browser.close();
    
    return receiptPath;
  } catch (error) {
    console.error('Error generating donation receipt:', error);
    throw error;
  }
};

function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

module.exports = {
  generateMembershipCard,
  generateDonationReceipt
};