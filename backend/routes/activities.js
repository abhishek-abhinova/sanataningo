const express = require('express');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all activities (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ order: 1, date: -1 });
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create activity (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update activity (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete activity (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;