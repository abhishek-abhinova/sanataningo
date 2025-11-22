const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  category: { 
    type: String, 
    enum: ['general', 'homepage', 'social', 'email'],
    default: 'general'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);