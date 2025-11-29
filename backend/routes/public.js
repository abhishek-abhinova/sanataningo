const express = require('express');
const router = express.Router();

// Get public gallery
router.get('/gallery', async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category, type, limit = 50 } = req.query;
    
    let query = { published: true };
    if (category) query.category = category;
    if (type) query.type = type;
    
    const gallery = await Gallery.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit * 1);
    
    res.json({
      success: true,
      gallery
    });
  } catch (error) {
    res.json({ success: true, gallery: [] });
  }
});

// Get public team
router.get('/team', async (req, res) => {
  try {
    const Team = require('../models/Team');
    const team = await Team.find({ 
      published: true, 
      active: true,
      showInTeam: true 
    })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      team
    });
  } catch (error) {
    res.json({ success: true, team: [] });
  }
});

// Get public events
router.get('/events', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const events = await Event.find({ published: true })
      .sort({ eventDate: -1 });
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.json({ success: true, events: [] });
  }
});

// Get public activities
router.get('/activities', async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const { limit = 10 } = req.query;
    
    const activities = await Activity.find({ published: true })
      .sort({ featured: -1, date: -1, order: 1 })
      .limit(limit * 1);
    
    res.json({
      success: true,
      activities
    });
  } catch (error) {
    res.json({ success: true, activities: [] });
  }
});

// Get organization info
router.get('/info', async (req, res) => {
  try {
    const Settings = require('../models/Settings');
    const settings = await Settings.findOne();
    
    res.json({
      success: true,
      info: settings || {
        organizationName: 'Sarbo Shakti Sonatani Sangathan',
        email: 'info@sarboshaktisonatanisangathan.org',
        phone: '+91 9876543210',
        address: '19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, Uttar Pradesh-231301'
      }
    });
  } catch (error) {
    res.json({
      success: true,
      info: {
        organizationName: 'Sarbo Shakti Sonatani Sangathan',
        email: 'info@sarboshaktisonatanisangathan.org',
        phone: '+91 9876543210',
        address: '19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, Uttar Pradesh-231301'
      }
    });
  }
});

module.exports = router;