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

// Get all members with pagination
router.get('/members', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const members = await Member.find(query)
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donations with pagination
router.get('/donations', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.paymentStatus = status;

    const donations = await Donation.find(query)
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending approvals
router.get('/pending', auth, async (req, res) => {
  try {
    const pendingMembers = await Member.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(20);
    
    const pendingDonations = await Donation.find({ paymentStatus: 'pending' })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      pendingMembers,
      pendingDonations,
      counts: {
        members: pendingMembers.length,
        donations: pendingDonations.length
      }
    });
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

// Gallery routes
router.post('/gallery', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const gallery = new Gallery({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image || '/uploads/gallery/default.jpg',
      category: req.body.category || 'general',
      showOnHomepage: req.body.showOnHomepage === 'true'
    });
    await gallery.save();
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const images = await Gallery.find({ published: true }).sort({ createdAt: -1 });
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team routes
router.post('/team', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const team = new Team({
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone,
      showOnHomepage: req.body.showOnHomepage !== 'false',
      showOnAbout: req.body.showOnAbout !== 'false'
    });
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/team', async (req, res) => {
  try {
    const Team = require('../models/Team');
    const team = await Team.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events routes
router.post('/events', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      venue: req.body.venue,
      eventDate: req.body.eventDate,
      status: req.body.status || 'upcoming',
      published: true,
      createdBy: req.user._id
    });
    await event.save();
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const events = await Event.find({ published: true }).sort({ eventDate: -1 });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete routes
router.delete('/gallery/:id', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team/:id', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/events/:id', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;