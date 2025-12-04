const express = require('express');
const Team = require('../models/Team');

const router = express.Router();

// Get all active team members (Public - no auth required)
router.get('/team', async (req, res) => {
  try {
    const team = await Team.findAll({ is_active: true });
    res.json({ 
      success: true, 
      team: team,
      count: team.length 
    });
  } catch (error) {
    console.error('Public team fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch team members',
      team: [] 
    });
  }
});

module.exports = router;