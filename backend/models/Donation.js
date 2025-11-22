const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    unique: true,
    required: true
  },
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  purpose: {
    type: String,
    enum: ['general', 'education', 'healthcare', 'disaster_relief', 'cultural_programs'],
    default: 'general'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentReference: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: Date,
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  receiptPath: String,
  isAnonymous: {
    type: Boolean,
    default: false
  },
  panNumber: String,
  donationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

donationSchema.pre('save', async function(next) {
  if (!this.donationId) {
    const count = await mongoose.model('Donation').countDocuments();
    this.donationId = `DON${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);