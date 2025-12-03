const express = require('express');
const router = express.Router();

// Get public gallery
router.get('/gallery', async (req, res) => {
  try {
    const GalleryModel = require('../models/Gallery');
    const { category, limit = 50 } = req.query;

    const items = await GalleryModel.findAll({
      category,
      is_active: true,
      page: 1,
      limit: parseInt(limit)
    });

    const gallery = (items || []).map(item => {
      const imageUrl = item.image_url || '';
      const lower = imageUrl.toLowerCase();
      const isVideo = /\.(mp4|webm|ogg|avi|mov)$/i.test(lower);

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        image: imageUrl,
        category: item.category,
        type: isVideo ? 'video' : 'photo'
      };
    });

    res.json({ success: true, gallery });
  } catch (error) {
    res.json({ success: true, gallery: [] });
  }
});

// Get public team
router.get('/team', async (req, res) => {
  try {
    const Team = require('../models/Team');
    
    // Fetch only active team members using MySQL syntax
    const team = await Team.findAll({
      is_active: true,
      page: 1,
      limit: 100
    });
    
    // Format team members for frontend
    const formattedTeam = (team || []).map(member => ({
      id: member.id,
      _id: member.id,
      name: member.name,
      designation: member.designation,
      position: member.designation,
      bio: member.bio,
      photo_url: member.photo_url,
      photo: member.photo_url,
      image: member.photo_url,
      email: member.email,
      phone: member.phone,
      category: member.category,
      is_active: member.is_active,
      showInTeam: member.is_active
    }));
    
    res.json({
      success: true,
      team: formattedTeam
    });
  } catch (error) {
    console.error('Error fetching public team:', error);
    res.json({ success: true, team: [] });
  }
});

// Get public events
router.get('/events', async (req, res) => {
  try {
    const Event = require('../models/Event');
    const { status, limit = 50 } = req.query;
    
    // Fetch events using MySQL syntax
    const events = await Event.findAll({
      status: status || undefined, // If no status, get all
      page: 1,
      limit: parseInt(limit)
    });
    
    // Format events for frontend
    const formattedEvents = (events || []).map(event => ({
      id: event.id,
      _id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      eventDate: event.event_date,
      location: event.location,
      venue: event.location,
      image_url: event.image_url,
      image: event.image_url,
      status: event.status,
      category: event.category,
      created_at: event.created_at
    }));
    
    res.json({
      success: true,
      events: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.json({ success: true, events: [] });
  }
});

// Get public activities
router.get('/activities', async (req, res) => {
  try {
    const Activity = require('../models/Activity');
    const { limit = 50 } = req.query;
    
    // Fetch only active activities for public display
    const activities = await Activity.findAll({
      is_active: true,
      page: 1,
      limit: parseInt(limit)
    });
    
    // Format activities for frontend
    const formattedActivities = (activities || []).map(activity => ({
      id: activity.id,
      _id: activity.id,
      title: activity.title,
      description: activity.description,
      image: activity.image_url,
      image_url: activity.image_url,
      category: activity.category,
      icon: getCategoryIcon(activity.category),
      stats: getCategoryStats(activity.category),
      created_at: activity.created_at
    }));
    
    res.json({
      success: true,
      activities: formattedActivities
    });
  } catch (error) {
    console.error('Error fetching public activities:', error);
    res.json({ success: true, activities: [] });
  }
});

// Helper function to get icon based on category
function getCategoryIcon(category) {
  const iconMap = {
    'event': 'fas fa-calendar-alt',
    'service': 'fas fa-hand-holding-heart',
    'achievement': 'fas fa-trophy',
    'announcement': 'fas fa-bullhorn',
    'donation': 'fas fa-donate',
    'education': 'fas fa-book-open',
    'healthcare': 'fas fa-heartbeat',
    'cultural': 'fas fa-om'
  };
  return iconMap[category] || 'fas fa-star';
}

// Helper function to get stats based on category
function getCategoryStats(category) {
  const statsMap = {
    'education': '500+ Students Helped',
    'healthcare': '200+ Health Camps',
    'cultural': '100+ Cultural Events',
    'service': '50+ Communities Served',
    'donation': '1000+ Lives Touched',
    'event': '100+ Events Organized',
    'achievement': '25+ Achievements',
    'announcement': 'Latest Updates'
  };
  return statsMap[category] || 'Making a Difference';
}

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
