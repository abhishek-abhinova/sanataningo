const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const Team = require('../models/Team');
const Event = require('../models/Event');
const Activity = require('../models/Activity');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const { sendThankYouWithReceipt, sendMembershipCardWithPDF, sendMemberApprovalEmail } = require('../utils/emailService');

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../uploads/gallery'),
  path.join(__dirname, '../uploads/screenshots'),
  path.join(__dirname, '../uploads/aadhaar')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created upload directory: ${dir}`);
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
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

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Admin routes working' });
});

// =====================================================
// DASHBOARD STATISTICS
// =====================================================
router.get('/dashboard', auth, async (req, res) => {
  try {
    const memberStats = await Member.getStatistics();
    const donationStats = await Donation.getStatistics();
    const contactStats = await Contact.getStatistics();

    const stats = {
      totalMembers: memberStats.total,
      activeMembers: memberStats.active,
      pendingMembers: memberStats.byPaymentStatus.find(s => s.payment_status === 'pending')?.count || 0,
      totalDonations: donationStats.totalDonations,
      totalDonationAmount: donationStats.totalAmount,
      totalContacts: contactStats.total,
      newContacts: contactStats.new,
      recentMembers: memberStats.recentMembers,
      recentDonations: donationStats.recentDonations,
      thisMonthDonations: donationStats.thisMonthAmount
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// MEMBERS MANAGEMENT
// =====================================================
router.get('/members', auth, async (req, res) => {
  try {
    const { status, membership_type, payment_status, search, page = 1, limit = 10 } = req.query;

    const result = await Member.findAll({
      status,
      membership_type,
      payment_status,
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      members: result.members.map(m => ({
        _id: m.id,
        fullName: m.full_name,
        email: m.email,
        phone: m.phone,
        status: m.status,
        createdAt: m.created_at,
        ...m
      })),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.page
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/members/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/members/:id', auth, async (req, res) => {
  try {
    const member = await Member.update(req.params.id, req.body);
    broadcastUpdate(req, 'members', { action: 'update', item: member });
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate member and send activation email + ID card PDF
router.put('/members/:id/activate', auth, async (req, res) => {
  try {
    const m = await Member.findById(req.params.id);
    if (!m) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const updated = await Member.update(req.params.id, { status: 'active' });

    // Map to email/card format
    const mappedMember = {
      _id: updated.id,
      memberId: updated.member_id || `SSS${String(updated.id).padStart(6, '0')}`,
      fullName: updated.full_name,
      email: updated.email,
      phone: updated.phone,
      dateOfBirth: updated.date_of_birth,
      aadhaarNumber: updated.aadhaar_number,
      membershipPlan: updated.membership_type,
      validTill: updated.valid_till,
      amount: updated.membership_fee,
      createdAt: updated.created_at
    };

    try {
      const { generateMembershipCard } = require('../utils/cardGenerator');
      const cardPath = await generateMembershipCard(mappedMember);
      await sendMemberApprovalEmail(mappedMember);
      await sendMembershipCardWithPDF(mappedMember, cardPath);
    } catch (emailErr) {
      console.error('Activate member email/card failed:', emailErr);
    }

    broadcastUpdate(req, 'members', { action: 'update', item: updated });
    res.json({ success: true, message: 'Member activated and activation email sent', member: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/members/:id', auth, async (req, res) => {
  try {
    await Member.delete(req.params.id);
    broadcastUpdate(req, 'members', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// DONATIONS MANAGEMENT
// =====================================================
router.get('/donations', auth, async (req, res) => {
  try {
    const { donation_type, payment_status, search, start_date, end_date, page = 1, limit = 10 } = req.query;

    const result = await Donation.findAll({
      donation_type,
      payment_status,
      search,
      start_date,
      end_date,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      donations: result.donations.map(d => ({
        _id: d.id,
        donorName: d.donor_name,
        email: d.email,
        phone: d.phone,
        amount: d.amount,
        purpose: d.donation_type,
        paymentStatus: d.payment_status,
        paymentScreenshot: d.payment_id,
        createdAt: d.created_at,
        ...d
      })),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.page
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/donations/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/donations/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.update(req.params.id, req.body);
    broadcastUpdate(req, 'donations', { action: 'update', item: donation });
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/donations/:id', auth, async (req, res) => {
  try {
    await Donation.delete(req.params.id);
    broadcastUpdate(req, 'donations', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/donations/:id/send-receipt', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Allow longer timeout for PDF generation + email sending (60 seconds)
    req.setTimeout(60000);
    res.setTimeout(60000);

    // Use reliable PDF generation with PDFDocument (pdfkit)
    const { generateDonationReceipt } = require('../utils/cardGenerator');
    const { sendDonationReceiptWithPDF } = require('../utils/emailService');

    try {
      console.log('📄 Generating PDF receipt for donation', donation.donationId || donation._id);
      
      // Generate PDF receipt using PDFDocument
      const pdfPath = await generateDonationReceipt(donation);
      console.log('✅ PDF receipt generated at:', pdfPath);

      // Send email with PDF attachment
      console.log('📧 Sending receipt email to:', donation.email);
      await sendDonationReceiptWithPDF(donation, pdfPath);
      
      console.log('✅ Receipt sent successfully');
      res.json({ success: true, message: 'PDF receipt sent successfully' });
    } catch (err) {
      console.error('❌ Send receipt error:', err);
      res.status(500).json({ error: err.message || 'Failed to send receipt' });
    }
  } catch (error) {
    console.error('❌ Send receipt error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// CONTACTS MANAGEMENT
// =====================================================
router.get('/contacts', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const result = await Contact.findAll({
      status,
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Format dates for frontend compatibility
    const formattedContacts = result.contacts.map(contact => ({
      ...contact,
      _id: contact.id,
      createdAt: contact.created_at ? new Date(contact.created_at).toISOString() : null,
      updatedAt: contact.updated_at ? new Date(contact.updated_at).toISOString() : null,
      repliedAt: contact.replied_at ? new Date(contact.replied_at).toISOString() : null
    }));

    res.json({
      success: true,
      contacts: formattedContacts,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.page
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/contacts/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.update(req.params.id, req.body);
    broadcastUpdate(req, 'contacts', { action: 'update', item: contact });
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/contacts/:id/mark-read', auth, async (req, res) => {
  try {
    const contact = await Contact.markAsRead(req.params.id);
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/contacts/:id', auth, async (req, res) => {
  try {
    await Contact.delete(req.params.id);
    broadcastUpdate(req, 'contacts', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// GALLERY MANAGEMENT
// =====================================================
router.get('/gallery', auth, async (req, res) => {
  try {
    const { category, is_active, page = 1, limit = 20 } = req.query;

    const gallery = await Gallery.findAll({
      category,
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({ success: true, gallery });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/gallery', auth, async (req, res) => {
  try {
    const galleryItem = await Gallery.create({
      ...req.body,
      uploaded_by: req.user.userId
    });

    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    res.json({ success: true, data: galleryItem });
  } catch (error) {
    console.error('Gallery create error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/gallery/upload', auth, upload.single('images'), async (req, res) => {
  try {
    console.log('📤 Gallery upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    const { title = 'Gallery Item', description = '', category = 'general', featured = false } = req.body;

    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    console.log('📁 Image URL:', imageUrl);

    const galleryItem = await Gallery.create({
      title,
      description,
      image_url: imageUrl,
      thumbnail_url: imageUrl, // Use same image for thumbnail
      category,
      is_active: true,
      uploaded_by: req.user.id // Fix: userId -> id
    });

    console.log('✅ Gallery item created:', galleryItem);
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    res.json({ success: true, message: 'Image uploaded successfully', data: galleryItem });
  } catch (error) {
    console.error('❌ Gallery upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/gallery/:id', auth, async (req, res) => {
  try {
    const galleryItem = await Gallery.update(req.params.id, req.body);
    broadcastUpdate(req, 'gallery', { action: 'update', item: galleryItem });
    res.json({ success: true, data: galleryItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/gallery/:id', auth, async (req, res) => {
  try {
    await Gallery.delete(req.params.id);
    broadcastUpdate(req, 'gallery', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// TEAM MANAGEMENT
// =====================================================
router.get('/team', auth, async (req, res) => {
  try {
    const { is_active, page = 1, limit = 20 } = req.query;

    const team = await Team.findAll({
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Map id to _id for frontend compatibility
    const formattedTeam = (team || []).map(member => ({
      ...member,
      _id: member.id
    }));

    res.json({ success: true, team: formattedTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download Team Member ID card PDF
router.get('/team/:id/id-card.pdf', auth, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    const teamId = `TM${String(member.id).padStart(6, '0')}`;
    const mapped = {
      id: member.id,
      name: member.name,
      designation: member.designation,
      bio: member.bio,
      photo_url: member.photo_url,
      email: member.email,
      phone: member.phone,
      teamId
    };

    const { generateTeamIdCard } = require('../utils/cardGenerator');
    const cardPath = await generateTeamIdCard(mapped);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="team-id-card-${teamId}.pdf"`);
    const stream = fs.createReadStream(cardPath);
    stream.on('error', () => res.status(500).end());
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team', auth, async (req, res) => {
  try {
    const teamMember = await Team.create(req.body);
    const formattedMember = { ...teamMember, _id: teamMember.id };
    broadcastUpdate(req, 'team', { action: 'create', item: formattedMember });
    res.json({ success: true, team: formattedMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/team/:id', auth, async (req, res) => {
  try {
    const teamMember = await Team.update(req.params.id, req.body);
    const formattedMember = { ...teamMember, _id: teamMember.id };
    broadcastUpdate(req, 'team', { action: 'update', item: formattedMember });
    res.json({ success: true, team: formattedMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/team/:id', auth, async (req, res) => {
  try {
    await Team.delete(req.params.id);
    broadcastUpdate(req, 'team', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// EVENTS MANAGEMENT
// =====================================================
router.get('/events', auth, async (req, res) => {
  try {
    const { status, category, is_featured, page = 1, limit = 20 } = req.query;

    const events = await Event.findAll({
      status,
      category,
      is_featured: is_featured !== undefined ? is_featured === 'true' : undefined,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Map id to _id for frontend compatibility
    const formattedEvents = (events || []).map(event => ({
      ...event,
      _id: event.id
    }));

    res.json({ success: true, events: formattedEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/events', auth, async (req, res) => {
  try {
    const { title, description, event_date, location, status, category, image_url, is_featured } = req.body;

    if (!title || !event_date || !location) {
      return res.status(400).json({ error: 'Missing required fields: title, event_date, location' });
    }

    const event = await Event.create({
      title,
      description: description || '',
      event_date,
      location,
      image_url: image_url || null,
      category: category || null,
      is_featured: typeof is_featured !== 'undefined' ? !!is_featured : false,
      status: status || 'upcoming',
      created_by: req.user.id
    });

    const formattedEvent = { ...event, _id: event.id };
    broadcastUpdate(req, 'events', { action: 'create', item: formattedEvent });
    res.json({ success: true, event: formattedEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.update(req.params.id, req.body);
    const formattedEvent = { ...event, _id: event.id };
    broadcastUpdate(req, 'events', { action: 'update', item: formattedEvent });
    res.json({ success: true, event: formattedEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/events/:id', auth, async (req, res) => {
  try {
    await Event.delete(req.params.id);
    broadcastUpdate(req, 'events', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// ACTIVITIES MANAGEMENT
// =====================================================
router.get('/activities', auth, async (req, res) => {
  try {
    const { category, is_active, page = 1, limit = 20 } = req.query;

    const activities = await Activity.findAll({
      category,
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Map id to _id for frontend compatibility
    const formattedActivities = (activities || []).map(activity => ({
      ...activity,
      _id: activity.id
    }));

    res.json({ success: true, activities: formattedActivities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/activities', auth, async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    const formattedActivity = { ...activity, _id: activity.id };
    broadcastUpdate(req, 'activities', { action: 'create', item: formattedActivity });
    res.json({ success: true, activity: formattedActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/activities/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.update(req.params.id, req.body);
    const formattedActivity = { ...activity, _id: activity.id };
    broadcastUpdate(req, 'activities', { action: 'update', item: formattedActivity });
    res.json({ success: true, activity: formattedActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/activities/:id', auth, async (req, res) => {
  try {
    await Activity.delete(req.params.id);
    broadcastUpdate(req, 'activities', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// SETTINGS MANAGEMENT
// =====================================================
router.get('/settings', auth, async (req, res) => {
  try {
    const settings = await Settings.getAllAsObject();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', auth, async (req, res) => {
  try {
    const { settings } = req.body;

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await Settings.update(key, value);
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
