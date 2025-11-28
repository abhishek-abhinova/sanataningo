const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['founder', 'trustee', 'core_member', 'volunteer'],
    default: 'core_member'
  },
  bio: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  showInTeam: {
    type: Boolean,
    default: true
  },
  published: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);