const { normalizeDonationData } = require('./donationFormatter');

const generateMembershipCardHTML = (member) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .card { width: 400px; height: 250px; margin: 20px auto; background: linear-gradient(135deg, #FF8C00, #D2691E); border-radius: 15px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); color: white; position: relative; }
        .header { text-align: center; margin-bottom: 15px; }
        .logo { font-size: 24px; margin-bottom: 5px; }
        .org-name { font-size: 16px; font-weight: bold; margin-bottom: 3px; }
        .tagline { font-size: 10px; opacity: 0.9; }
        .member-info { margin-top: 10px; }
        .member-info div { margin: 3px 0; font-size: 11px; }
        .member-id { font-size: 14px; font-weight: bold; background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 5px; display: inline-block; }
        .footer { position: absolute; bottom: 10px; left: 20px; right: 20px; text-align: center; font-size: 8px; opacity: 0.8; }
        .validity { position: absolute; top: 20px; right: 20px; font-size: 9px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="validity">
          <div>Valid Till:</div>
          <div><strong>${new Date(member.validTill || new Date(Date.now() + 365*24*60*60*1000)).toLocaleDateString()}</strong></div>
        </div>
        
        <div class="header">
          <div class="logo">🕉️</div>
          <div class="org-name">SARBOSHAKTI SANATANI SANGATHAN</div>
          <div class="tagline">Serving Humanity through Sanatan Dharma Values</div>
        </div>
        
        <div style="text-align: center; margin: 10px 0;">
          <div style="font-size: 12px; font-weight: bold;">MEMBERSHIP CARD</div>
        </div>
        
        <div class="member-info">
          <div><strong>Name:</strong> ${member.fullName}</div>
          <div><strong>Member ID:</strong> <span class="member-id">${member.membershipId || member.memberId}</span></div>
          <div><strong>Type:</strong> ${(member.membershipPlan || member.membershipType || 'Basic').toUpperCase()}</div>
          <div><strong>Join Date:</strong> ${new Date(member.joinDate || member.createdAt).toLocaleDateString()}</div>
          <div><strong>Email:</strong> ${member.email}</div>
        </div>
        
        <div class="footer">
          <div><strong>Dharma • Seva • Sanskriti • Samaj</strong></div>
          <div>${process.env.ORG_ADDRESS}</div>
          <div>📧 ${process.env.ORG_EMAIL}</div>
          <div style="margin-top: 10px; font-size: 10px; line-height: 1.4;">
            <strong>Key Officials:</strong><br>
            Mr. Ajit Kumar Ray - Chief General Secretary: +91 9907916429<br>
            Shri Goutam Chandra Biswas - Cashier: +91 9868362375<br>
            Shriwas Halder - Official Secretary: +91 9816195600<br>
            Mr. Dinesh Bairagi - President & Founder: +91 8584871180
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateDonationReceiptHTML = (donation) => {
  const data = normalizeDonationData(donation);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #D2691E; padding: 30px; background: white; }
        .header { text-align: center; border-bottom: 3px solid #D2691E; padding-bottom: 20px; margin-bottom: 25px; }
        .logo { font-size: 36px; color: #D2691E; margin-bottom: 10px; }
        .org-name { font-size: 24px; font-weight: bold; color: #8B4513; margin-bottom: 5px; }
        .tagline { font-size: 14px; color: #666; margin-bottom: 10px; }
        .receipt-title { font-size: 20px; font-weight: bold; color: #D2691E; margin-top: 15px; }
        .receipt-no { background: #FFF8DC; padding: 10px; border-left: 4px solid #D2691E; margin: 15px 0; }
        .details { margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px dotted #ccc; }
        .detail-label { font-weight: bold; color: #333; }
        .detail-value { color: #666; }
        .amount-row { background: #FFF8DC; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #D2691E; }
        .tax-info { background: #E8F5E8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #D2691E; }
        .signature { margin-top: 40px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">🕉️</div>
          <div class="org-name">SARBOSHAKTI SANATANI SANGATHAN</div>
          <div class="tagline">Serving Humanity through Sanatan Dharma Values</div>
          <div class="receipt-title">DONATION RECEIPT</div>
        </div>
        
        <div class="receipt-no">
          <strong>Receipt No: ${data.receiptNumber}</strong> | Date: ${data.donationDateFormatted}
        </div>
        
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Donor Name:</span>
            <span class="detail-value">${data.donorName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${data.email || 'N/A'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${data.phone || 'N/A'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${data.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Purpose:</span>
            <span class="detail-value">${data.purpose}</span>
          </div>
        </div>
        
        <div class="amount-row">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: bold;">Donation Amount:</span>
            <span class="amount">₹${data.amountFormatted}</span>
          </div>
          <div style="margin-top: 10px; font-size: 14px; color: #666;">
            Amount in words: ${numberToWords(data.amount)} Rupees Only
          </div>
        </div>
        
        <div class="tax-info">
          <strong>📋 Tax Benefit Information:</strong><br>
          This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
          Please retain this receipt for your tax filing purposes.
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your generous contribution!</strong></p>
          <p>Your support helps us serve humanity and preserve Sanatan Dharma values.</p>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <div><strong>${process.env.ORG_NAME}</strong></div>
            <div>${process.env.ORG_ADDRESS}</div>
            <div>📧 ${process.env.ORG_EMAIL}</div>
            <div style="margin-top: 10px; font-size: 12px; line-height: 1.4;">
              <strong>Key Officials:</strong><br>
              Mr. Ajit Kumar Ray - Chief General Secretary: +91 9907916429<br>
              Shri Goutam Chandra Biswas - Cashier: +91 9868362375<br>
              Shriwas Halder - Official Secretary: +91 9816195600<br>
              Mr. Dinesh Bairagi - President & Founder: +91 8584871180
            </div>
          </div>
        </div>
        
        <div class="signature">
          <div style="margin-top: 40px; border-top: 1px solid #333; width: 200px; margin-left: auto;">
            <div style="margin-top: 10px; font-size: 14px;">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateThankYouEmailHTML = (donation) => {
  const data = normalizeDonationData(donation);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #D2691E, #FF8C00); color: white; padding: 30px; text-align: center; }
        .logo { font-size: 48px; margin-bottom: 10px; }
        .content { padding: 30px; }
        .highlight { background: #FFF8DC; padding: 20px; border-left: 4px solid #D2691E; margin: 20px 0; }
        .footer { background: #8B4513; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🕉️</div>
          <h1>SARBOSHAKTI SANATANI SANGATHAN</h1>
          <p>Serving Humanity through Sanatan Dharma Values</p>
        </div>
        
        <div class="content">
          <h2 style="color: #D2691E;">🙏 Heartfelt Gratitude</h2>
          
          <p>Dear <strong>${data.donorName}</strong>,</p>
          
          <p>We are deeply grateful for your generous donation of <strong>₹${data.amountFormatted}</strong> towards <strong>${data.purpose}</strong>.</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #8B4513;">Your Impact</h3>
            <p>Your contribution will help us continue our mission of serving humanity through:</p>
            <ul>
              <li>🎓 Educational programs for underprivileged children</li>
              <li>🏥 Healthcare services for communities in need</li>
              <li>🕉️ Preservation of Sanatan Dharma traditions</li>
              <li>🤝 Community development initiatives</li>
            </ul>
          </div>
          
          <p>Your donation receipt is attached to this email for your tax filing purposes. This donation is eligible for tax deduction under Section 80G.</p>
          
          <p>May your generosity bring you abundant blessings and prosperity.</p>
          
          <p style="margin-top: 30px;">
            With sincere gratitude,<br>
            <strong>Sarboshakti Sanatani Sangathan Team</strong>
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Dharma • Seva • Sanskriti • Samaj</strong></p>
          <p>${process.env.ORG_ADDRESS}</p>
          <p>📧 ${process.env.ORG_EMAIL}</p>
          <div style="margin-top: 15px; font-size: 12px; line-height: 1.4;">
            <strong>Key Officials:</strong><br>
            Mr. Ajit Kumar Ray - Chief General Secretary: +91 9907916429<br>
            Shri Goutam Chandra Biswas - Cashier: +91 9868362375<br>
            Shriwas Halder - Official Secretary: +91 9816195600<br>
            Mr. Dinesh Bairagi - President & Founder: +91 8584871180
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
};

module.exports = {
  generateMembershipCardHTML,
  generateDonationReceiptHTML,
  generateThankYouEmailHTML
};