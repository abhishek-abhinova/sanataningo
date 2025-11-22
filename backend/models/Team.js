const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  email: { type: String },
  phone: { type: String },
  order: { type: Number, default: 0 },
  showOnHomepage: { type: Boolean, default: true },
  showOnAbout: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);