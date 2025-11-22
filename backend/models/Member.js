const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  membershipId: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
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
  dateOfBirth: {
    type: Date,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  membershipType: {
    type: String,
    enum: ['basic', 'premium', 'lifetime'],
    default: 'basic'
  },
  amount: {
    type: Number,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true,
    match: /^[0-9]{12}$/
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
  cardGenerated: {
    type: Boolean,
    default: false
  },
  cardPath: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

memberSchema.pre('save', async function(next) {
  if (!this.membershipId) {
    const count = await mongoose.model('Member').countDocuments();
    this.membershipId = `SSS${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);