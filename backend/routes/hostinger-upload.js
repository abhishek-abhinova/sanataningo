const express = require('express');
const { createHostingerUpload, getHostingerUrl, getUploadInstructions } = require('../utils/hostingerUpload');
const auth = require('../middleware/auth');

const router = express.Router();

// Upload to Hostinger gallery
router.post('/gallery', auth, createHostingerUpload('gallery').single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const hostingerUrl = getHostingerUrl(req.file.filename, 'gallery');
    const instructions = getUploadInstructions(req.file.filename, 'gallery');

    res.json({
      success: true,
      message: 'File uploaded to server. Follow instructions to make it accessible on Hostinger.',
      file: {
        filename: req.file.filename,
        localPath: req.file.path,
        hostingerUrl: hostingerUrl
      },
      instructions: instructions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload to Hostinger videos
router.post('/videos', auth, createHostingerUpload('videos').single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const hostingerUrl = getHostingerUrl(req.file.filename, 'videos');
    const instructions = getUploadInstructions(req.file.filename, 'videos');

    res.json({
      success: true,
      message: 'Video uploaded to server. Follow instructions to make it accessible on Hostinger.',
      file: {
        filename: req.file.filename,
        localPath: req.file.path,
        hostingerUrl: hostingerUrl
      },
      instructions: instructions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upload instructions for existing file
router.get('/instructions/:type/:filename', auth, (req, res) => {
  const { type, filename } = req.params;
  const instructions = getUploadInstructions(filename, type);
  
  res.json({
    success: true,
    instructions: instructions
  });
});

module.exports = router;