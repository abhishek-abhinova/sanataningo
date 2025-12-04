const express = require('express');
const { upload, uploadGalleryImage, uploadVideo, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

const router = express.Router();

// Upload gallery image to Cloudinary
router.post('/gallery', auth, upload.single('image'), async (req, res) => {
  try {
    const { title = 'Gallery Item', description = '', category = 'general' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    console.log('📤 Uploading to Cloudinary:', req.file.originalname);
    const uploadResult = await uploadGalleryImage(req.file, category);
    
    const galleryData = {
      title,
      description,
      image_url: uploadResult.url, // Full Cloudinary URL
      thumbnail_url: uploadResult.url,
      category,
      display_order: 0,
      is_active: true,
      uploaded_by: req.user?.id || null
    };

    const galleryItem = await Gallery.create(galleryData);

    res.json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      data: {
        id: galleryItem.id,
        title: galleryItem.title,
        image_url: galleryItem.image_url,
        category: galleryItem.category,
        cloudinary: {
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          size: uploadResult.bytes
        }
      }
    });
  } catch (error) {
    console.error('Cloudinary gallery upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload video to Cloudinary
router.post('/video', auth, upload.single('video'), async (req, res) => {
  try {
    const { title = 'Video', description = '', category = 'general' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    console.log('📤 Uploading video to Cloudinary:', req.file.originalname);
    const uploadResult = await uploadVideo(req.file, category);
    
    const galleryData = {
      title,
      description,
      image_url: uploadResult.url, // Full Cloudinary URL
      thumbnail_url: uploadResult.url,
      category,
      display_order: 0,
      is_active: true,
      uploaded_by: req.user?.id || null
    };

    const galleryItem = await Gallery.create(galleryData);

    res.json({
      success: true,
      message: 'Video uploaded to Cloudinary successfully',
      data: {
        id: galleryItem.id,
        title: galleryItem.title,
        image_url: galleryItem.image_url,
        category: galleryItem.category,
        cloudinary: {
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          size: uploadResult.bytes,
          duration: uploadResult.duration
        }
      }
    });
  } catch (error) {
    console.error('Cloudinary video upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete image/video from Cloudinary
router.delete('/:id', auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if it's a team member photo
    if (itemId.startsWith('team_')) {
      return res.status(400).json({ error: 'Cannot delete team member photos from gallery. Delete from team management instead.' });
    }
    
    const galleryItem = await Gallery.findById(itemId);
    
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Extract public ID from Cloudinary URL
    const url = galleryItem.image_url;
    if (url && url.includes('cloudinary.com')) {
      const urlParts = url.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExt.split('.')[0];
      const folder = urlParts.slice(-3, -1).join('/');
      const fullPublicId = `${folder}/${publicId}`;
      
      console.log('🗑️ Deleting from Cloudinary:', fullPublicId);
      
      // Determine resource type
      const resourceType = url.includes('/video/') ? 'video' : 'image';
      await deleteFromCloudinary(fullPublicId, resourceType);
    }

    // Delete from database
    await Gallery.delete(itemId);

    res.json({
      success: true,
      message: 'Gallery item deleted from Cloudinary and database'
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get gallery items (all stored with full URLs)
router.get('/gallery', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    const options = {
      category,
      page: parseInt(page),
      limit: parseInt(limit),
      is_active: true
    };
    
    let gallery = await Gallery.findAll(options);
    
    // Include team member photos if no specific category filter
    if (!category || category === 'team') {
      const Team = require('../models/Team');
      const teamMembers = await Team.findAll({ is_active: true });
      
      const teamPhotos = teamMembers
        .filter(member => member.photo_url)
        .map(member => ({
          id: `team_${member.id}`,
          title: `${member.name} - ${member.designation}`,
          description: member.bio || `Team member: ${member.name}`,
          image_url: member.photo_url,
          thumbnail_url: member.photo_url,
          category: 'team',
          display_order: 0,
          is_active: true,
          created_at: member.created_at,
          updated_at: member.updated_at
        }));
      
      gallery = [...gallery, ...teamPhotos];
    }

    res.json({
      success: true,
      gallery: gallery,
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