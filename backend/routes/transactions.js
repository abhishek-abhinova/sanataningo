const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get pending transactions
router.get('/pending', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'pending' })
      .populate('memberId', 'fullName email phone membershipPlan')
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve transaction
router.put('/approve/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject transaction
router.put('/reject/:id', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        verifiedBy: req.user.id,
        verifiedAt: new Date(),
        rejectionReason: reason
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;