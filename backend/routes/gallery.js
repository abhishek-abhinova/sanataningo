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

// Gallery storage configuration - Store in frontend public directory
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../frontend/public/uploads/gallery');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '');
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '-' + cleanName;
    cb(null, uniqueName);
  }
});

// Video storage configuration - Store in frontend public directory
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../frontend/public/uploads/videos');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '');
    cb(null, Date.now() + '-' + cleanName);
  }
});

const galleryUpload = multer({
  storage: galleryStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
    }
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only MP4, WEBM, AVI, and MOV videos are allowed'));
    }
  }
});

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
    
    if (req.file) {
      // Store with relative path for frontend accessibility
      imageUrl = `/uploads/gallery/${req.file.filename}`;
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
      message: 'Image uploaded successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const handleImageUpload = async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category = 'general', description = '', title = 'Gallery Item', featured = false } = req.body;
    
    // Handle case when no files are uploaded but we want to create a gallery item
    if (!req.files || req.files.length === 0) {
      // Create a placeholder gallery item
      const galleryItem = new Gallery({
        title: title || 'New Gallery Item',
        description: description || 'Gallery item created from admin',
        image: '/images/placeholder.jpg',
        category,
        type: 'photo',
        published: true,
        showOnHomepage: category === 'featured' || featured === 'true' || featured === true,
        order: 0
      });
      
      await galleryItem.save();
      broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
      
      return res.json({
        success: true,
        message: 'Gallery item created successfully',
        data: galleryItem
      });
    }

    // For single file upload (from form)
    const files = req.files.length ? req.files : [req.files.images].filter(Boolean);
    const uploadedImages = [];
    
    for (const file of files) {
      const imageUrl = `/uploads/gallery/${file.filename}`;
      
      // Check for duplicate
      const existingItem = await Gallery.findOne({ image: imageUrl });
      if (existingItem) {
        continue; // Skip duplicate
      }
      
      const galleryItem = new Gallery({
        title: title || file.originalname,
        description: description || '',
        image: imageUrl,
        category,
        type: 'photo',
        published: true,
        showOnHomepage: category === 'featured' || featured === 'true' || featured === true,
        order: 0
      });
      
      await galleryItem.save();
      uploadedImages.push(galleryItem);
    }

    // Return single item if only one was uploaded
    const result = uploadedImages.length === 1 ? uploadedImages[0] : uploadedImages;

    // Broadcast update
    broadcastUpdate(req, 'gallery', { action: 'create', items: uploadedImages });

    res.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: result,
      urls: uploadedImages.map(img => `${process.env.FRONTEND_URL}${img.image}`)
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload video
router.post('/upload-video', auth, videoUpload.single('video'), async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category = 'general', description = '', youtubeUrl, title = 'Video', featured = false } = req.body;
    
    let videoUrl = '/videos/placeholder.mp4';
    
    if (youtubeUrl) {
      videoUrl = youtubeUrl;
    } else if (req.file) {
      videoUrl = `/uploads/videos/${req.file.filename}`;
    }

    const galleryItem = new Gallery({
      title: title || 'Video',
      description: description || 'Video uploaded from admin',
      image: videoUrl,
      category,
      type: 'video',
      published: true,
      showOnHomepage: category === 'featured' || featured === 'true' || featured === true,
      order: 0
    });
    
    await galleryItem.save();
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const handleVideoUpload = async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { category = 'general', description = '', youtubeUrl, title = 'Video', featured = false } = req.body;
    
    let videoUrl;
    
    if (youtubeUrl) {
      videoUrl = youtubeUrl;
    } else if (req.file) {
      videoUrl = `/uploads/videos/${req.file.filename}`;
    } else {
      // Create placeholder video item
      videoUrl = '/videos/placeholder.mp4';
    }

    const galleryItem = new Gallery({
      title: title || 'Video',
      description: description || 'Video uploaded from admin',
      image: videoUrl,
      category,
      type: 'video',
      published: true,
      showOnHomepage: category === 'featured' || featured === 'true' || featured === true,
      order: 0
    });
    
    await galleryItem.save();
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: galleryItem,
      url: youtubeUrl || `${process.env.FRONTEND_URL}${videoUrl}`
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
    const { title, description, category, type = 'photo', featured = false } = req.body;
    
    const galleryItem = new Gallery({
      title,
      description,
      image: '/images/placeholder.jpg',
      category,
      type,
      published: true,
      showOnHomepage: category === 'featured' || featured,
      order: 0
    });
    
    await galleryItem.save();
    broadcastUpdate(req, 'gallery', { action: 'create', item: galleryItem });
    
    res.json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update gallery item
router.put('/:id', auth, async (req, res) => {
  try {
    const Gallery = require('../models/Gallery');
    const { title, description, category, published, showOnHomepage, featured } = req.body;
    
    const updateData = { title, description, category, published };
    if (showOnHomepage !== undefined) updateData.showOnHomepage = showOnHomepage;
    if (featured !== undefined) updateData.showOnHomepage = featured;
    
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
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
      Gallery.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    broadcastUpdate(req, 'gallery', { action: 'reorder', items });
    
    res.json({
      success: true,
      message: 'Gallery order updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;