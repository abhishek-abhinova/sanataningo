const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Hostinger upload configuration
const createHostingerUpload = (uploadType = 'gallery') => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Create uploads directory in backend for temporary storage
      const tempPath = path.join(__dirname, '../uploads', uploadType);
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath, { recursive: true });
      }
      cb(null, tempPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '-' + file.originalname.replace(/\s+/g, '');
      cb(null, uniqueName);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (uploadType === 'gallery') {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
      }
    } else if (uploadType === 'videos') {
      const allowedTypes = /mp4|webm|avi|mov/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only MP4, WEBM, AVI, and MOV videos are allowed'));
      }
    } else {
      // For screenshots and documents
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only JPG, PNG, and PDF files are allowed'));
      }
    }
  };

  const limits = {
    gallery: { fileSize: 50 * 1024 * 1024 }, // 50MB
    videos: { fileSize: 200 * 1024 * 1024 }, // 200MB
    screenshots: { fileSize: 10 * 1024 * 1024 }, // 10MB
    aadhaar: { fileSize: 10 * 1024 * 1024 } // 10MB
  };

  return multer({
    storage,
    limits: limits[uploadType] || limits.gallery,
    fileFilter
  });
};

// Function to get Hostinger URL for uploaded file
const getHostingerUrl = (filename, uploadType = 'gallery') => {
  return `https://sarboshaktisonatanisangathan.org/uploads/${uploadType}/${filename}`;
};

// Function to copy file to Hostinger directory (manual process)
const getUploadInstructions = (filename, uploadType = 'gallery') => {
  const localPath = path.join(__dirname, '../uploads', uploadType, filename);
  const hostingerPath = `/public_html/uploads/${uploadType}/${filename}`;
  
  return {
    localFile: localPath,
    hostingerPath: hostingerPath,
    instructions: [
      '1. Download the file from backend/uploads/' + uploadType + '/' + filename,
      '2. Login to Hostinger File Manager',
      '3. Navigate to public_html/uploads/' + uploadType + '/',
      '4. Upload the file: ' + filename,
      '5. File will be accessible at: https://sarboshaktisonatanisangathan.org/uploads/' + uploadType + '/' + filename
    ]
  };
};

module.exports = {
  createHostingerUpload,
  getHostingerUrl,
  getUploadInstructions
};