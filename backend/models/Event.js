const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  venue: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  published: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  banner: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    name: String,
    email: String,
    phone: String,
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

eventSchema.index({ eventDate: -1, status: 1, published: 1 });

module.exports = mongoose.model('Event', eventSchema);