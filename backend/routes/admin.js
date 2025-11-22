const express = require('express');
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalRegistered: await Member.countDocuments(),
      activeMembers: await Member.countDocuments({ 
        status: 'approved', 
        validTill: { $gte: new Date() } 
      }),
      pendingMembers: await Member.countDocuments({ status: 'pending' }),
      approvedMembers: await Member.countDocuments({ status: 'approved' }),
      rejectedMembers: await Member.countDocuments({ status: 'rejected' }),
      expiredMembers: await Member.countDocuments({ 
        status: 'approved', 
        validTill: { $lt: new Date() } 
      }),
      totalDonations: await Donation.countDocuments(),
      approvedDonations: await Donation.countDocuments({ status: 'approved' }),
      todayRegistrations: await Member.countDocuments({ 
        createdAt: { $gte: today } 
      }),
      todayDonations: await Donation.countDocuments({ 
        createdAt: { $gte: today } 
      })
    };

    // Monthly registration data for graph
    const monthlyData = await Member.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Recent members
    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName email membershipPlan status createdAt');

    // Recent donations
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('donorName amount purpose status createdAt');

    res.json({
      success: true,
      stats,
      monthlyData,
      recentMembers,
      recentDonations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pending transactions
router.get('/transactions/pending', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'pending' })
      .populate('memberId', 'fullName email phone membershipPlan')
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve transaction
router.put('/transactions/approve/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = 'approved';
    transaction.verifiedBy = req.user.id;
    transaction.verifiedAt = new Date();
    await transaction.save();

    // If membership transaction, approve member
    if (transaction.type === 'membership') {
      const member = await Member.findById(transaction.memberId);
      if (member) {
        const validTill = new Date();
        validTill.setMonth(validTill.getMonth() + 12);
        
        member.status = 'approved';
        member.approvedBy = req.user.id;
        member.approvedAt = new Date();
        member.validTill = validTill;
        await member.save();
      }
    }

    res.json({ success: true, message: 'Transaction approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reports
router.get('/reports/daily', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const report = {
      date: targetDate,
      newMembers: await Member.countDocuments({
        createdAt: { $gte: targetDate, $lt: nextDay }
      }),
      newDonations: await Donation.countDocuments({
        createdAt: { $gte: targetDate, $lt: nextDay }
      }),
      approvedMembers: await Member.countDocuments({
        approvedAt: { $gte: targetDate, $lt: nextDay }
      }),
      approvedDonations: await Donation.countDocuments({
        approvedAt: { $gte: targetDate, $lt: nextDay }
      })
    };

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;