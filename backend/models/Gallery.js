const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    get: function() {
      return this.image;
    }
  },
  caption: {
    type: String,
    get: function() {
      return this.description;
    }
  },
  category: {
    type: String,
    enum: ['general', 'events', 'activities', 'achievements', 'temple', 'festival', 'photo', 'video', 'featured'],
    default: 'general'
  },
  type: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo'
  },
  published: {
    type: Boolean,
    default: true
  },
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  sortOrder: {
    type: Number,
    get: function() {
      return this.order;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

gallerySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Gallery', gallerySchema);