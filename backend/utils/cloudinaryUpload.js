const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|webm|avi|mov/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Upload to Cloudinary
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'ngo-gallery',
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });
};

// Upload gallery image
const uploadGalleryImage = async (file, category = 'general') => {
  try {
    const result = await uploadToCloudinary(file.buffer, {
      folder: `ngo-gallery/${category}`,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Gallery image upload failed:', error);
    throw error;
  }
};

// Upload video
const uploadVideo = async (file, category = 'general') => {
  try {
    const result = await uploadToCloudinary(file.buffer, {
      folder: `ngo-videos/${category}`,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: 'video',
      transformation: [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      duration: result.duration
    };
  } catch (error) {
    console.error('Video upload failed:', error);
    throw error;
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    console.log('🗑️ Cloudinary delete result:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary delete failed:', error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadGalleryImage,
  uploadVideo,
  deleteFromCloudinary,
  cloudinary
};