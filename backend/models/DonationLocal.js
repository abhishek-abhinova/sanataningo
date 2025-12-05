const fs = require('fs');
const path = require('path');

// Simple file-based storage for donations when DB is unavailable
class DonationLocal {
  static getFilePath() {
    return path.join(__dirname, '../data/donations.json');
  }
  
  static ensureDataDir() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
  
  static loadDonations() {
    try {
      this.ensureDataDir();
      const filePath = this.getFilePath();
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error loading donations:', error);
      return [];
    }
  }
  
  static saveDonations(donations) {
    try {
      this.ensureDataDir();
      const filePath = this.getFilePath();
      fs.writeFileSync(filePath, JSON.stringify(donations, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving donations:', error);
      return false;
    }
  }
  
  static async create(donationData) {
    const donations = this.loadDonations();
    
    const newDonation = {
      id: donations.length + 1,
      receipt_number: `DON${String(donations.length + 1).padStart(6, '0')}`,
      ...donationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    donations.push(newDonation);
    this.saveDonations(donations);
    
    console.log('✅ Donation saved to local file:', newDonation.receipt_number);
    return newDonation;
  }
  
  static async findAll(options = {}) {
    const donations = this.loadDonations();
    const { limit = 10, page = 1 } = options;
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      donations: donations.slice(start, end),
      total: donations.length,
      page,
      limit,
      totalPages: Math.ceil(donations.length / limit)
    };
  }
  
  static async findById(id) {
    const donations = this.loadDonations();
    return donations.find(d => d.id == id) || null;
  }
}

module.exports = DonationLocal;