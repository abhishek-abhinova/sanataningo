const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    default: 'Sarbo Shakti Sonatani Sangathan'
  },
  email: {
    type: String,
    default: 'info@sarboshaktisonatanisangathan.org'
  },
  phone: {
    type: String,
    default: '+91 9876543210'
  },
  address: {
    type: String,
    default: '19, Kalyan Kunj, Sector 49, Gautam Buddha Nagar, Uttar Pradesh-231301'
  },
  website: {
    type: String,
    default: 'https://sarboshaktisonatanisangathan.org'
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    linkedin: String
  },
  aboutDescription: {
    type: String,
    default: 'Sarbo Shakti Sonatani Sangathan is dedicated to preserving and promoting Sanatan Dharma values through community service, cultural activities, and spiritual guidance.'
  },
  mission: {
    type: String,
    default: 'To serve humanity through the principles of Sanatan Dharma and create a harmonious society.'
  },
  vision: {
    type: String,
    default: 'A world where dharmic values guide every aspect of life, fostering peace, prosperity, and spiritual growth.'
  },
  homepageVideo: {
    type: String
  },
  bannerVideo: {
    type: String
  },
  logo: {
    type: String,
    default: '/images/logo.jpeg'
  },
  favicon: {
    type: String,
    default: '/images/favicon.ico'
  },
  membershipPlans: [{
    name: String,
    price: Number,
    duration: String,
    features: [String],
    active: {
      type: Boolean,
      default: true
    }
  }],
  paymentGateway: {
    razorpay: {
      keyId: String,
      keySecret: String,
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },
  emailSettings: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromEmail: String,
    fromName: String
  },
  siteSettings: {
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    allowRegistrations: {
      type: Boolean,
      default: true
    },
    allowDonations: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);