const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Add gallery image
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const gallery = new Gallery({
      title: req.body.title,
      description: req.body.description,
      image: `/uploads/gallery/${req.file.filename}`,
      category: req.body.category,
      showOnHomepage: req.body.showOnHomepage === 'true',
      uploadedBy: req.user._id
    });
    await gallery.save();
    res.json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gallery images
router.get('/', async (req, res) => {
  try {
    const { homepage, category } = req.query;
    const filter = { published: true };
    
    if (homepage === 'true') filter.showOnHomepage = true;
    if (category) filter.category = category;
    
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete gallery image
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      const filePath = path.join(__dirname, '..', image.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await Gallery.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;