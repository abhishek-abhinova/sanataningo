const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('./models/Member');
const Donation = require('./models/Donation');
const Contact = require('./models/Contact');

async function testAdminData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test member data
    console.log('\n📊 Testing Member Data:');
    const totalMembers = await Member.countDocuments();
    const pendingMembers = await Member.countDocuments({ status: 'pending' });
    const approvedMembers = await Member.countDocuments({ status: 'approved' });
    
    console.log(`Total Members: ${totalMembers}`);
    console.log(`Pending Members: ${pendingMembers}`);
    console.log(`Approved Members: ${approvedMembers}`);

    // Test recent members
    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('fullName email membershipPlan status createdAt');
    
    console.log('\nRecent Members:');
    recentMembers.forEach(member => {
      console.log(`- ${member.fullName} (${member.membershipPlan}) - ${member.status}`);
    });

    // Test donation data
    console.log('\n💰 Testing Donation Data:');
    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ paymentStatus: 'pending' });
    const approvedDonations = await Donation.countDocuments({ paymentStatus: 'approved' });
    
    console.log(`Total Donations: ${totalDonations}`);
    console.log(`Pending Donations: ${pendingDonations}`);
    console.log(`Approved Donations: ${approvedDonations}`);

    // Calculate total donation amount
    const donationSum = await Donation.aggregate([
      { $match: { paymentStatus: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonationAmount = donationSum.length > 0 ? donationSum[0].total : 0;
    console.log(`Total Donation Amount: ₹${totalDonationAmount}`);

    // Test recent donations
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('donorName amount purpose paymentStatus createdAt');
    
    console.log('\nRecent Donations:');
    recentDonations.forEach(donation => {
      console.log(`- ${donation.donorName}: ₹${donation.amount} (${donation.paymentStatus})`);
    });

    // Test contact data
    console.log('\n📧 Testing Contact Data:');
    const totalContacts = await Contact.countDocuments();
    console.log(`Total Contacts: ${totalContacts}`);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name email subject createdAt');
    
    console.log('\nRecent Contacts:');
    recentContacts.forEach(contact => {
      console.log(`- ${contact.name}: ${contact.subject}`);
    });

    console.log('\n✅ Admin data test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing admin data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testAdminData();