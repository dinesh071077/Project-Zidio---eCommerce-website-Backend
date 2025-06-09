// const express = require('express');
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const router = express.Router();
// const authenticate = require('../middleware/authMiddleware');
// const Order = require('../models/Order');

// // Razorpay Init
// const razorpay = new Razorpay({
//   key_id: 'rzp_test_QopNQ6tXDHThvf',
//   key_secret: 'jEh5zeJLD32GPez6V4qSmlGB',
// });

// // 1. Create Order
// router.post('/create', authenticate, async (req, res) => {
//   const { amount } = req.body;
//   const options = {
//     amount: amount * 100, // in paise
//     currency: 'INR',
//     receipt: `receipt_order_${Date.now()}`
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     res.status(200).json({ order });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create order' });
//   }
// });

// // 2. Verify Signature
// router.post('/verify', authenticate, async (req, res) => {
//   const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

//   const signature = crypto
//     .createHmac('sha256', razorpay.key_secret)
//     .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//     .digest('hex');

//   if (signature === razorpaySignature) {
//     res.status(200).json({ success: true, message: 'Payment verified' });
//   } else {
//     res.status(400).json({ success: false, message: 'Invalid signature' });
//   }
// });

// // 3. Confirm Order & Save
// router.post('/confirm', authenticate, async (req, res) => {
//   try {
//     const { items, totalAmount, paymentId, paymentMethod, shippingAddress } = req.body;

//     const newOrder = new Order({
//       userId: req.user.userId,
//       items,
//       totalAmount,
//       paymentId,
//       paymentMethod,
//       shippingAddress,
//     });

//     await newOrder.save();
//     res.status(201).json({ message: 'Order saved successfully' });
//   } catch (error) {
//     console.error('Save order error:', error);
//     res.status(500).json({ message: 'Could not save order' });
//   }
// });

// module.exports = router;


const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Razorpay Init
const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_QopNQ6tXDHThvf',
  key_secret: 'jEh5zeJLD32GPez6V4qSmlGB',
});

// 1. Create Razorpay Order
router.post('/create', authenticate, async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ order });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// 2. Verify Razorpay Signature
router.post('/verify', authenticate, async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', 'jEh5zeJLD32GPez6V4qSmlGB') // use raw key_secret here
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Signature mismatch. Verification failed' });
    }
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// 3. Confirm & Save Order to DB
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { items, totalAmount, paymentId, paymentMethod, shippingAddress } = req.body;

    const newOrder = new Order({
      userId: req.user.userId,
      items,
      totalAmount,
      paymentId,
      paymentMethod,
      shippingAddress,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Save order error:', error);
    res.status(500).json({ message: 'Could not save order' });
  }
});


// 4. Get Orders for Logged-in User
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Fetching orders failed:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});



module.exports = router;
