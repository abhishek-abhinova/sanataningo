const express = require('express');
const Donation = require('./models/Donation');
require('dotenv').config();

async function debugDonation() {
  try {
    console.log('🔍 Debugging donation creation...\n');
    
    // Test data
    const testData = {
      donor_name: 'Debug Test',
      email: 'debug@test.com',
      phone: '1234567890',
      amount: 500,
      donation_type: 'general',
      payment_status: 'pending'
    };
    
    console.log('Test data:', testData);
    console.log('\n📝 Creating donation...');
    
    const donation = await Donation.create(testData);
    console.log('✅ Success! Donation created:', donation);
    
    console.log('\n📋 Fetching all donations...');
    const all = await Donation.findAll({ limit: 5 });
    console.log('Total donations:', all.total);
    console.log('Recent donations:', all.donations.map(d => ({
      id: d.id,
      receipt: d.receipt_number,
      donor: d.donor_name,
      amount: d.amount
    })));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugDonation();