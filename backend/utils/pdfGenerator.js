const path = require('path');
const fs = require('fs').promises;

// Lightweight PDF generator without puppeteer
const generateMembershipCard = async (member) => {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads/cards');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Generate HTML content for membership card
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .card { width: 350px; height: 220px; border: 2px solid #D2691E; border-radius: 10px; padding: 15px; background: linear-gradient(135deg, #FFF8DC, #FFFACD); }
          .header { text-align: center; color: #8B4513; margin-bottom: 10px; }
          .org-name { font-size: 16px; font-weight: bold; }
          .member-info { margin-top: 15px; }
          .member-info div { margin: 5px 0; font-size: 12px; }
          .member-id { font-weight: bold; color: #D2691E; }
          .footer { text-align: center; margin-top: 15px; font-size: 10px; color: #8B4513; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="org-name">🕉️ Sarboshakti Sanatani Sangathan</div>
            <div style="font-size: 12px;">Membership Card</div>
          </div>
          <div class="member-info">
            <div><strong>Name:</strong> ${member.fullName}</div>
            <div><strong>Member ID:</strong> <span class="member-id">${member.membershipId}</span></div>
            <div><strong>Type:</strong> ${member.membershipType.toUpperCase()}</div>
            <div><strong>Join Date:</strong> ${new Date(member.joinDate).toLocaleDateString()}</div>
            <div><strong>Email:</strong> ${member.email}</div>
          </div>
          <div class="footer">
            <div>Serving Humanity through Sanatan Dharma</div>
            <div>${process.env.ORG_ADDRESS}</div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const filename = `membership_card_${member.membershipId}.html`;
    const filepath = path.join(uploadsDir, filename);
    
    await fs.writeFile(filepath, html);
    return filepath;
  } catch (error) {
    console.error('Card generation error:', error);
    throw error;
  }
};

const generateDonationReceipt = async (donation) => {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads/receipts');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Generate HTML content for donation receipt
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #D2691E; padding-bottom: 15px; margin-bottom: 20px; }
          .org-name { font-size: 24px; font-weight: bold; color: #8B4513; }
          .receipt-title { font-size: 18px; margin-top: 10px; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px dotted #ccc; }
          .amount { font-size: 20px; font-weight: bold; color: #D2691E; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="org-name">🕉️ Sarboshakti Sanatani Sangathan</div>
            <div class="receipt-title">Donation Receipt</div>
          </div>
          <div class="details">
            <div class="detail-row">
              <span><strong>Receipt No:</strong></span>
              <span>${donation.donationId}</span>
            </div>
            <div class="detail-row">
              <span><strong>Date:</strong></span>
              <span>${new Date(donation.donationDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span><strong>Donor Name:</strong></span>
              <span>${donation.donorName}</span>
            </div>
            <div class="detail-row">
              <span><strong>Email:</strong></span>
              <span>${donation.email}</span>
            </div>
            <div class="detail-row">
              <span><strong>Phone:</strong></span>
              <span>${donation.phone}</span>
            </div>
            <div class="detail-row">
              <span><strong>Purpose:</strong></span>
              <span>${donation.purpose}</span>
            </div>
            <div class="detail-row">
              <span><strong>Amount:</strong></span>
              <span class="amount">₹${donation.amount}</span>
            </div>
          </div>
          <div class="footer">
            <p><strong>Thank you for your generous donation!</strong></p>
            <p>${process.env.ORG_NAME}</p>
            <p>${process.env.ORG_ADDRESS}</p>
            <p>Email: ${process.env.ORG_EMAIL} | Phone: ${process.env.ORG_PHONE}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const filename = `donation_receipt_${donation.donationId}.html`;
    const filepath = path.join(uploadsDir, filename);
    
    await fs.writeFile(filepath, html);
    return filepath;
  } catch (error) {
    console.error('Receipt generation error:', error);
    throw error;
  }
};

module.exports = {
  generateMembershipCard,
  generateDonationReceipt
};