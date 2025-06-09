const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      size: String,
      color: String,
      price: Number,
    }
  ],
  totalAmount: Number,
  paymentId: String,
  paymentMethod: { type: String, default: 'upi' },
  shippingAddress: { type: String, required: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
