const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateIdCard = async (teamMember) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [400, 250] });
      const fileName = `id-card-${teamMember._id}-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../uploads/cards', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Background
      doc.rect(0, 0, 400, 250).fill('#f8f9fa');
      
      // Header
      doc.rect(0, 0, 400, 60).fill('#d2691e');
      doc.fillColor('white').fontSize(16).font('Helvetica-Bold')
         .text('SARBO SHAKTI SONATANI SANGATHAN', 20, 20);
      doc.fontSize(10).text('Team Member ID Card', 20, 40);
      
      // Member Info
      doc.fillColor('#333').fontSize(14).font('Helvetica-Bold')
         .text(teamMember.name || 'Team Member', 20, 80);
      
      doc.fontSize(12).font('Helvetica')
         .text(`Position: ${teamMember.position || 'Member'}`, 20, 105)
         .text(`Category: ${teamMember.category || 'General'}`, 20, 125)
         .text(`Email: ${teamMember.email || 'N/A'}`, 20, 145)
         .text(`Phone: ${teamMember.phone || 'N/A'}`, 20, 165);
      
      // ID Number
      doc.fontSize(10).fillColor('#666')
         .text(`ID: ${teamMember._id.toString().slice(-8).toUpperCase()}`, 20, 190);
      
      // Issue Date
      doc.text(`Issued: ${new Date().toLocaleDateString()}`, 20, 210);
      
      // Logo placeholder
      doc.rect(300, 80, 80, 80).stroke('#ddd');
      doc.fontSize(8).fillColor('#999')
         .text('PHOTO', 330, 115);
      
      // Footer
      doc.fontSize(8).fillColor('#666')
         .text('This card is property of Sarbo Shakti Sonatani Sangathan', 20, 230);
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(filePath);
      });
      
      stream.on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateIdCard };