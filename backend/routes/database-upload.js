const express = require('express');
const { upload, getFileInfo } = require('../utils/databaseImageUpload');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

const router = express.Router();

// Upload image to database
router.post('/gallery', auth, upload.single('image'), async (req, res) => {
  try {
    const { title = 'Gallery Item', description = '', category = 'general' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const fileInfo = getFileInfo(req.file);
    
    const galleryData = {
      title,
      description,
      image_url: null, // No URL needed for database storage
      image_data: fileInfo.base64Data, // Store Base64 in database
      category,
      display_order: 0,
      is_active: true,
      uploaded_by: req.user?.id || null
    };

    const galleryItem = await Gallery.create(galleryData);

    res.json({
      success: true,
      message: 'Image uploaded to database successfully',
      data: {
        id: galleryItem.id,
        title: galleryItem.title,
        description: galleryItem.description,
        category: galleryItem.category,
        fileInfo: {
          originalName: fileInfo.originalName,
          mimeType: fileInfo.mimeType,
          size: fileInfo.size
        }
      }
    });
  } catch (error) {
    console.error('Database upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get image from database
router.get('/gallery/:id/image', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem || !galleryItem.image_data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Extract mime type and base64 data
    const matches = galleryItem.image_data.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    res.set({
      'Content-Type': mimeType,
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    res.send(imageBuffer);
  } catch (error) {
    console.error('Image retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all gallery items with image URLs
router.get('/gallery', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const options = {
      category,
      page: parseInt(page),
      limit: parseInt(limit),
      is_active: true
    };
    
    const gallery = await Gallery.findAll(options);
    
    // Add image URLs for database-stored images
    const galleryWithUrls = gallery.map(item => ({
      ...item,
      image_url: item.image_data ? `/api/database/gallery/${item.id}/image` : item.image_url,
      has_database_image: !!item.image_data
    }));

    res.json({
      success: true,
      gallery: galleryWithUrls,
      totalPages: Math.ceil(gallery.length / limit),
      currentPage: parseInt(page),
      total: gallery.length
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;