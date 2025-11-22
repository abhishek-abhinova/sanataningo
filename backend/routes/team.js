const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/team');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Add team member
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const team = new Team({
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone,
      photo: req.file ? `/uploads/team/${req.file.filename}` : null,
      showOnHomepage: req.body.showOnHomepage !== 'false',
      showOnAbout: req.body.showOnAbout !== 'false'
    });
    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team members
router.get('/', async (req, res) => {
  try {
    const { homepage, about } = req.query;
    const filter = { active: true };
    
    if (homepage === 'true') filter.showOnHomepage = true;
    if (about === 'true') filter.showOnAbout = true;
    
    const team = await Team.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team member
router.put('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team member
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (member && member.photo) {
      const filePath = path.join(__dirname, '..', member.photo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;