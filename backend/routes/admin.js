const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Real-time broadcast helper
const broadcastUpdate = (req, type, data) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('dataUpdate', { type, data, timestamp: new Date() });
  }
};

const router = express.Router();

// Root admin route
router.get('/', auth, async (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin panel access granted',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const stats = {
      totalMembers: 0,
      activeMembers: 0,
      pendingMembers: 0,
      totalDonationAmount: 0,
      totalContacts: 0
    };

    try {
      stats.totalMembers = await Member.countDocuments();
      stats.activeMembers = await Member.countDocuments({ status: 'approved' });
      stats.pendingMembers = await Member.countDocuments({ status: 'pending' });
    } catch (error) {
      console.error('Member count error:', error);
    }

    try {
      const donationSum = await Donation.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      stats.totalDonationAmount = donationSum.length > 0 ? donationSum[0].total : 0;
    } catch (error) {
      console.error('Donation sum error:', error);
    }

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.json({
      success: true,
      stats: {
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        totalDonationAmount: 0,
        totalContacts: 0
      }
    });
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

// Gallery upload route
router.post('/gallery/upload', auth, upload.single('images'), async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { title = 'Gallery Item', description = '', category = 'general', featured = false } = req.body;
    
    let imageUrl = '/images/placeholder.jpg';
    if (req.file) {
      imageUrl = `/uploads/gallery/${req.file.filename}`;
    }
    
    const galleryItem = new Gallery({
      title,
      description,
      image: imageUrl,
      category,
      type: 'photo',
      published: true,
      showOnHomepage: featured === 'true' || featured === true,
      order: 0
    });
    
    await galleryItem.save();
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Gallery video upload route
router.post('/gallery/upload-video', auth, upload.single('video'), async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { title = 'Video', description = '', category = 'general', featured = false } = req.body;
    
    let videoUrl = '/videos/placeholder.mp4';
    if (req.file) {
      videoUrl = `/uploads/gallery/${req.file.filename}`;
    }
    
    const galleryItem = new Gallery({
      title,
      description,
      image: videoUrl,
      category,
      type: 'video',
      published: true,
      showOnHomepage: featured === 'true' || featured === true,
      order: 0
    });
    
    await galleryItem.save();
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send donation receipt email
router.post('/donations/:id/send-receipt', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    
    if (!donation.donorEmail) {
      return res.status(400).json({ error: 'Donor email not found' });
    }
    
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    const receiptHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${process.env.FRONTEND_URL}/images/logo.jpeg" alt="Logo" style="width: 80px; height: 80px; border-radius: 50%;">
            <h1 style="color: #d2691e; margin: 10px 0;">Sarbo Shakti Sonatani Sangathan</h1>
            <p style="color: #666; margin: 0;">Serving Humanity through Sanatan Dharma Values</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0;">🙏 Thank You for Your Donation!</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Donation Receipt</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span><strong>Receipt ID:</strong></span>
              <span>${donation._id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span><strong>Donor Name:</strong></span>
              <span>${donation.donorName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span><strong>Amount:</strong></span>
              <span style="color: #28a745; font-weight: bold;">₹${donation.amount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span><strong>Purpose:</strong></span>
              <span>${donation.purpose}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span><strong>Date:</strong></span>
              <span>${new Date(donation.createdAt).toLocaleDateString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span><strong>Payment Status:</strong></span>
              <span style="color: #28a745;">✓ ${donation.paymentStatus}</span>
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #28a745; margin-bottom: 10px;">🏛️ Tax Benefits (80G)</h4>
            <p style="margin: 0; color: #333;">This donation is eligible for tax deduction under Section 80G of the Income Tax Act. Please keep this receipt for your tax filing.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">Your contribution helps us serve humanity and preserve our cultural values. May you be blessed with prosperity and happiness.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">🕉️ Dharma • Seva • Sanskriti • Samaj 🕉️</p>
            <p style="color: #666; font-size: 12px;">Sarbo Shakti Sonatani Sangathan<br>${process.env.ORG_ADDRESS}<br>Email: ${process.env.ORG_EMAIL} | Phone: ${process.env.ORG_PHONE}</p>
          </div>
        </div>
      </div>
    `;
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: donation.donorEmail,
      subject: 'Thank You for Your Donation - Receipt & Tax Benefits',
      html: receiptHtml
    });
    
    res.json({ success: true, message: `Receipt sent to ${donation.donorEmail}` });
  } catch (error) {
    console.error('Send receipt error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts
router.get('/contacts', auth, async (req, res) => {
  try {
    let Contact;
    try {
      Contact = require('../models/Contact');
    } catch (error) {
      return res.json({ success: true, contacts: [] });
    }
    
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, contacts });
  } catch (error) {
    res.json({ success: true, contacts: [] });
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
    let Gallery;
    try {
      Gallery = require('../models/Gallery');
    } catch (error) {
      return res.status(500).json({ error: 'Gallery model not available' });
    }
    
    const { title, description, file, image, type, category, featured } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const imageUrl = file || image || '/images/placeholder.jpg';
    
    const gallery = new Gallery({
      title,
      description: description || '',
      image: imageUrl,
      type: type || 'photo',
      category: category || 'general',
      showOnHomepage: featured === true || featured === 'true',
      published: true,
      order: 0
    });
    
    await gallery.save();
    broadcastUpdate(req, 'gallery', { action: 'create', item: gallery });
    res.json({ success: true, data: gallery });
  } catch (error) {
    console.error('Gallery POST error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/gallery', auth, async (req, res) => {
  try {
    let Gallery;
    try {
      Gallery = require('../models/Gallery');
    } catch (error) {
      return res.json({ success: true, gallery: [] });
    }
    
    const { type, category, published, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (published !== undefined) query.published = published === 'true';
    
    const gallery = await Gallery.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Gallery.countDocuments(query);
    
    res.json({ 
      success: true, 
      gallery,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.json({ success: true, gallery: [] });
  }
});

router.put('/gallery/:id', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    broadcastUpdate(req, 'gallery', { action: 'update', item: gallery });
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update gallery order
router.put('/gallery/reorder', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { items } = req.body;
    
    const updatePromises = items.map(item => 
      Gallery.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Gallery order updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team routes
router.post('/team', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const { name, position, category, bio, message, email, phone, photo, order, showOnHomepage, showOnAbout, published } = req.body;
    
    const team = new Team({
      name,
      position,
      category: category || 'core_member',
      bio,
      message,
      email,
      phone,
      photo,
      order: order || 0,
      showOnHomepage: showOnHomepage !== 'false',
      showOnAbout: showOnAbout !== 'false',
      published: published !== 'false'
    });
    
    await team.save();
    broadcastUpdate(req, 'team', { action: 'create', item: team });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/team', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const { category, published, page = 1, limit = 20 } = req.query;
    
    let query = { active: true };
    if (category) query.category = category;
    if (published !== undefined) query.published = published === 'true';
    
    const team = await Team.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Team.countDocuments(query);
    
    res.json({ 
      success: true, 
      team,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/team/:id', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    broadcastUpdate(req, 'team', { action: 'update', item: team });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team order
router.put('/team/reorder', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const { items } = req.body; // Array of { id, order }
    
    const updatePromises = items.map(item => 
      Team.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Team order updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle team visibility
router.put('/team/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    member.showInTeam = !member.showInTeam;
    await member.save();
    
    broadcastUpdate(req, 'team', { action: 'update', item: member });
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send ID card to team member
router.post('/team/:id/send-card', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    if (!member.email) {
      return res.status(400).json({ error: 'Team member email not found' });
    }
    
    // Send ID card email
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${process.env.FRONTEND_URL}/images/logo.jpeg" alt="Logo" style="width: 80px; height: 80px; border-radius: 50%;">
            <h1 style="color: #d2691e; margin: 10px 0;">Sarbo Shakti Sonatani Sangathan</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0;">Team Member ID Card</h2>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <img src="${process.env.FRONTEND_URL}${member.photo}" alt="${member.name}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #d2691e;">
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 15px;">Member Details:</h3>
            <p><strong>Name:</strong> ${member.name}</p>
            <p><strong>Position:</strong> ${member.position}</p>
            <p><strong>Category:</strong> ${member.category}</p>
            <p><strong>Email:</strong> ${member.email}</p>
            ${member.phone ? `<p><strong>Phone:</strong> ${member.phone}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #e8f5e8; border-radius: 8px;">
            <p style="color: #28a745; font-weight: bold; margin: 0;">✓ This is your official team member ID card</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">Thank you for being part of our team!</p>
            <p style="color: #666; font-size: 12px;">Sarbo Shakti Sonatani Sangathan<br>${process.env.ORG_ADDRESS}</p>
          </div>
        </div>
      </div>
    `;
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: member.email,
      subject: 'Your Team ID Card - Sarbo Shakti Sonatani Sangathan',
      html: emailHtml
    });
    
    res.json({ success: true, message: `ID card sent to ${member.email}` });
  } catch (error) {
    console.error('Send ID card error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Events routes
router.post('/events', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    const { title, description, content, venue, location, eventDate, status, published, images, banner, order } = req.body;
    
    const event = new Event({
      title,
      description,
      content,
      venue,
      location,
      eventDate,
      status: status || 'upcoming',
      published: published !== 'false',
      images: images || [],
      banner,
      order: order || 0,
      createdBy: req.user._id
    });
    
    await event.save();
    broadcastUpdate(req, 'events', { action: 'create', item: event });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    const { status, published, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (published !== undefined) query.published = published === 'true';
    
    const events = await Event.find(query)
      .populate('createdBy', 'name')
      .sort({ eventDate: -1, order: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Event.countDocuments(query);
    
    res.json({ 
      success: true, 
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/events/:id', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    broadcastUpdate(req, 'events', { action: 'update', item: event });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update events order
router.put('/events/reorder', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    const { items } = req.body;
    
    const updatePromises = items.map(item => 
      Event.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Events order updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings routes
router.get('/settings', auth, async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        organizationName: 'Sarbo Shakti Sonatani Sangathan',
        email: 'info@sarboshaktisonatanisangathan.org',
        phone: '+91 9876543210',
        address: '19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, Uttar Pradesh-231301'
      });
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', auth, async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload homepage video
router.post('/homepage-video', auth, async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    const { videoUrl } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ homepageVideo: videoUrl });
    } else {
      settings.homepageVideo = videoUrl;
    }
    
    await settings.save();
    res.json({ success: true, message: 'Homepage video updated', settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload banner video
router.post('/banner-video', auth, async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    const { videoUrl } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ bannerVideo: videoUrl });
    } else {
      settings.bannerVideo = videoUrl;
    }
    
    await settings.save();
    res.json({ success: true, message: 'Banner video updated', settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk operations
router.put('/members/bulk-update', auth, async (req, res) => {
  try {
    const { ids, status } = req.body;
    await Member.updateMany(
      { _id: { $in: ids } },
      { status, approvedBy: req.user._id, approvedAt: new Date() }
    );
    res.json({ success: true, message: `${ids.length} members updated` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/members/bulk-delete', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    await Member.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} members deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export data
router.get('/members/export', auth, async (req, res) => {
  try {
    const members = await Member.find().select('-password -__v');
    const csv = convertToCSV(members);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update member status
router.put('/members/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status, approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    );
    broadcastUpdate(req, 'members', { action: 'update', item: member });
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete routes
router.delete('/gallery/:id', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    await Gallery.findByIdAndDelete(req.params.id);
    broadcastUpdate(req, 'gallery', { action: 'delete', id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team/:id', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    await Team.findByIdAndDelete(req.params.id);
    broadcastUpdate(req, 'team', { action: 'delete', id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate ID card for team member
router.post('/team/:id/generate-id-card', auth, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const { generateIdCard } = require('../utils/idCardGenerator');
    
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    const cardPath = await generateIdCard(member);
    
    if (member.email) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: member.email,
          subject: 'Your Team ID Card - Sarbo Shakti Sonatani Sangathan',
          html: `
            <h2>Dear ${member.name},</h2>
            <p>Please find your team ID card attached.</p>
            <p>Thank you for being part of Sarbo Shakti Sonatani Sangathan.</p>
            <br>
            <p>Best regards,<br>Admin Team</p>
          `,
          attachments: [{
            filename: 'id-card.pdf',
            path: cardPath
          }]
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'ID card generated and sent successfully'
    });
  } catch (error) {
    console.error('ID card generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/events/:id', auth, async (req, res) => {
  try {
    const Event = require('../models/Event');
    await Event.findByIdAndDelete(req.params.id);
    broadcastUpdate(req, 'events', { action: 'delete', id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/members/:id', auth, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    broadcastUpdate(req, 'members', { action: 'delete', id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/contacts/:id', auth, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/donations/:id', auth, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    broadcastUpdate(req, 'donations', { action: 'delete', id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/activities/:id', auth, async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    await Activity.findByIdAndDelete(req.params.id);
    broadcastUpdate(req, 'activities', { action: 'delete', id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/activities', auth, async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const activities = await Activity.find().sort({ order: 1, date: -1 });
    res.json({ success: true, activities });
  } catch (error) {
    res.json({ success: true, activities: [] });
  }
});

router.post('/activities', auth, async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const activity = new Activity(req.body);
    await activity.save();
    broadcastUpdate(req, 'activities', { action: 'create', item: activity });
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/activities/:id', auth, async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    broadcastUpdate(req, 'activities', { action: 'update', item: activity });
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  if (!data.length) return '';
  const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
  const csvHeaders = headers.join(',');
  const csvRows = data.map(item => {
    const obj = item.toObject ? item.toObject() : item;
    return headers.map(header => {
      const value = obj[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(',');
  });
  return [csvHeaders, ...csvRows].join('\n');
}

module.exports = router;