const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['events', 'activities', 'ceremonies', 'general'],
    default: 'general'
  },
  showOnHomepage: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);