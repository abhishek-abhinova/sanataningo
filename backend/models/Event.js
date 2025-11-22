const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String },
  banner: { type: String },
  venue: { type: String },
  mapLink: { type: String },
  eventDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  published: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);