const multer = require('multer');
const path = require('path');

// Store images in memory for database upload
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for database storage
  },
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

// Convert file buffer to Base64
const fileToBase64 = (file) => {
  if (!file || !file.buffer) {
    return null;
  }
  
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
};

// Get file info from buffer
const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    base64Data: fileToBase64(file)
  };
};

module.exports = {
  upload,
  fileToBase64,
  getFileInfo
};