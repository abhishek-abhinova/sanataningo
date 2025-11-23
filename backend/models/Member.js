const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    unique: true,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
  aadhaarNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{12}$/.test(v);
      },
      message: 'Aadhaar number must be 12 digits'
    }
  },
  aadhaarFront: {
    type: String, // File path for Aadhaar front image
    required: true
  },
  aadhaarBack: {
    type: String, // File path for Aadhaar back image
    required: true
  },
  state: {
    type: String,
    required: true
  },
  membershipPlan: {
    type: String,
    enum: ['basic', 'premium', 'lifetime'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  upiReference: {
    type: String,
    required: true
  },
  paymentScreenshot: {
    type: String, // File path
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended', 'expired'],
    default: 'pending'
  },
  validTill: {
    type: Date
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  cardGenerated: {
    type: Boolean,
    default: false
  },
  cardFile: {
    type: String // Path to generated card file
  },
  cardCreatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate member ID before saving
memberSchema.pre('save', async function(next) {
  if (!this.memberId) {
    const count = await mongoose.model('Member').countDocuments();
    this.memberId = `SSS${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);