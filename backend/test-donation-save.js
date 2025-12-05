const Donation = require('./models/Donation');
require('dotenv').config();

async function testDonationSave() {
  try {
    console.log('🔍 Testing donation save to database...\n');
    
    const testDonation = {
      donor_name: 'Test Donor',
      email: 'test@example.com',
      phone: '9999999999',
      amount: 1000,
      donation_type: 'general',
      message: 'Test donation',
      is_anonymous: false,
      payment_status: 'pending'
    };
    
    console.log('Creating test donation...');
    const donation = await Donation.create(testDonation);
    console.log('✅ Donation saved successfully!');
    console.log('Donation ID:', donation.id);
    console.log('Receipt Number:', donation.receipt_number);
    
    // Fetch all donations to verify
    console.log('\nFetching all donations...');
    const allDonations = await Donation.findAll({ limit: 5 });
    console.log('Total donations:', allDonations.total);
    console.log('Recent donations:', allDonations.donations.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testDonationSave();