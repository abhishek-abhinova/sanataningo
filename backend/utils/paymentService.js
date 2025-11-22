const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createPaymentOrder = async (amount, purpose, entityId) => {
  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `${purpose}_${entityId}_${Date.now()}`,
      notes: {
        purpose,
        entityId: entityId.toString()
      }
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Payment order creation error:', error);
    throw error;
  }
};

const verifyPayment = (paymentId, orderId, signature) => {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment
};