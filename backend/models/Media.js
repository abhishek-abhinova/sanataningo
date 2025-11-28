const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  category: {
    type: String,
    enum: ['team', 'gallery', 'events', 'homepage', 'general'],
    default: 'general'
  },
  compressed: { type: Boolean, default: false },
  thumbnail: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usedIn: [{
    model: String,
    id: mongoose.Schema.Types.ObjectId
  }]
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);