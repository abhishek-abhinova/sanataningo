const express = require('express');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const settings = await Settings.find(filter);
    const settingsObj = {};
    
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    res.json({ settings: settingsObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update setting
router.put('/:key', auth, async (req, res) => {
  try {
    const { value, category } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value, category: category || 'general' },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, setting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update settings
router.put('/', auth, async (req, res) => {
  try {
    const { settings } = req.body;
    
    const promises = Object.entries(settings).map(([key, value]) => 
      Settings.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      )
    );
    
    await Promise.all(promises);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;