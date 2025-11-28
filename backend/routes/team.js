const express = require('express');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all team members (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team member (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team member (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team member (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle visibility (Admin)
router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    team.showInTeam = !team.showInTeam;
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;