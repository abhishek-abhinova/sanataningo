const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Contact = require('../models/Contact');

// SSE endpoint for real-time updates
router.get('/admin/realtime', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendUpdate = async () => {
    try {
      const stats = await getRealtimeStats();
      res.write(`data: ${JSON.stringify(stats)}\n\n`);
    } catch (error) {
      console.error('SSE Error:', error);
    }
  };

  // Send initial data
  sendUpdate();

  // Send updates every 5 seconds
  const interval = setInterval(sendUpdate, 5000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

const getRealtimeStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalMembers,
    activeMembers,
    pendingMembers,
    totalDonations,
    todayDonations,
    totalContacts,
    todayContacts
  ] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({ status: 'approved' }),
    Member.countDocuments({ status: 'pending' }),
    Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Donation.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Contact.countDocuments(),
    Contact.countDocuments({ createdAt: { $gte: today } })
  ]);

  return {
    totalMembers,
    activeMembers,
    pendingMembers,
    totalDonationAmount: totalDonations[0]?.total || 0,
    todayDonationAmount: todayDonations[0]?.total || 0,
    totalContacts,
    todayContacts,
    timestamp: new Date().toISOString()
  };
};

module.exports = router;