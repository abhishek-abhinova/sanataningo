// Update your backend upload configuration
// Instead of saving to Render server, save to Hostinger via FTP or API

const multer = require('multer');
const path = require('path');

// Configure multer to save with proper URLs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This will still save to Render temporarily
    cb(null, 'uploads/gallery/')
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// After upload, save URL pointing to Hostinger
const saveImageRecord = async (filename) => {
  const imageUrl = `https://sarboshaktisonatanisangathan.org/uploads/gallery/${filename}`;
  
  // Save to database with Hostinger URL
  await db.execute(
    'INSERT INTO gallery (title, image_url, is_active) VALUES (?, ?, ?)',
    [title, imageUrl, true]
  );
};