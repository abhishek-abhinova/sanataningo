const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Import Hostinger upload utility
const { createHostingerUpload, getHostingerUrl, getUploadInstructions } = require('../utils/hostingerUpload');

// Create upload handlers
const galleryUpload = createHostingerUpload('gallery');
const videoUpload = createHostingerUpload('videos');

// Real-time broadcast helper
const broadcastUpdate = (req, type, data) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('dataUpdate', { type, data, timestamp: new Date() });
  }
};

// Upload single/multiple images
router.post('/upload', auth, galleryUpload.single('images'), async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category = 'general', description = '', title = 'Gallery Item', featured = false } = req.body;
    
    let imageUrl = '/images/placeholder.jpg';
    let uploadInstructions = null;
    
    if (req.file) {
      // Generate Hostinger URL
      imageUrl = getHostingerUrl(req.file.filename, 'gallery');
      uploadInstructions = getUploadInstructions(req.file.filename, 'gallery');
    }
    
    const galleryData = {
      title: title || 'New Gallery Item',
      description: description || '',
      image_url: imageUrl,
      category,
      display_order: 0,
      is_active: true,
      uploaded_by: req.user?.id || null
    };
    
    const galleryItem = await Gallery.create(galleryData);
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    
    res.json({
      success: true,
      message: 'Image uploaded to server. Please follow instructions to make it accessible.',
      data: galleryItem,
      uploadInstructions: uploadInstructions
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});



// Upload video
router.post('/upload-video', auth, videoUpload.single('video'), async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category = 'general', description = '', youtubeUrl, title = 'Video', featured = false } = req.body;
    
    let videoUrl = '/videos/placeholder.mp4';
    let uploadInstructions = null;
    
    if (youtubeUrl) {
      videoUrl = youtubeUrl;
    } else if (req.file) {
      videoUrl = getHostingerUrl(req.file.filename, 'videos');
      uploadInstructions = getUploadInstructions(req.file.filename, 'videos');
    }

    const galleryData = {
      title: title || 'Video',
      description: description || 'Video uploaded from admin',
      image_url: videoUrl,
      category,
      display_order: 0,
      is_active: true,
      uploaded_by: req.user?.id || null
    };
    
    const galleryItem = await Gallery.create(galleryData);
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });

    res.json({
      success: true,
      message: 'Video uploaded to server. Please follow instructions to make it accessible.',
      data: galleryItem,
      uploadInstructions: uploadInstructions
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});



// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Gallery routes working' });
});

// Simple upload test route
router.post('/upload-test', auth, (req, res) => {
  res.json({ success: true, message: 'Upload route accessible' });
});

// Get all gallery items (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category, page = 1, limit = 20 } = req.query;
    
    const options = {
      category,
      page: parseInt(page),
      limit: parseInt(limit)
    };
    
    const gallery = await Gallery.findAll(options);
    
    res.json({
      success: true,
      gallery,
      totalPages: Math.ceil(gallery.length / limit),
      currentPage: parseInt(page),
      total: gallery.length
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.json({ success: true, gallery: [] });
  }
});

// Create new gallery item (without file upload)
router.post('/', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { title, description, category, featured = false } = req.body;
    
    const galleryData = {
      title,
      description,
      image_url: '/images/placeholder.jpg',
      category,
      display_order: 0,
      is_active: true,
      uploaded_by: req.user?.id || null
    };
    
    const galleryItem = await Gallery.create(galleryData);
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    
    res.json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Gallery create error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update gallery item
router.put('/:id', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { title, description, category, is_active, featured } = req.body;
    
    const updateData = { title, description, category };
    if (is_active !== undefined) updateData.is_active = is_active;
    
    const galleryItem = await Gallery.update(req.params.id, updateData);
    
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    
    broadcastUpdate(req, 'gallery', { action: 'update', item: galleryItem });
    
    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Gallery update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete gallery item
router.delete('/:id', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    
    // Delete file from filesystem
    if (galleryItem.image_url && !galleryItem.image_url.includes('youtube')) {
      const filePath = path.join(__dirname, '..', galleryItem.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Gallery.delete(req.params.id);
    broadcastUpdate(req, 'gallery', { action: 'delete', id: req.params.id });
    
    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Gallery delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reorder gallery items
router.put('/reorder', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { items } = req.body;
    
    const updatePromises = items.map(item => 
      Gallery.update(item.id, { display_order: item.order })
    );
    
    await Promise.all(updatePromises);
    broadcastUpdate(req, 'gallery', { action: 'reorder', items });
    
    res.json({
      success: true,
      message: 'Gallery order updated successfully'
    });
  } catch (error) {
    console.error('Gallery reorder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;