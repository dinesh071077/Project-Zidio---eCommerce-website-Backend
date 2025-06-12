const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Populate user names
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId);
        return {
          _id: order._id,
          userName: user?.name || 'Unknown',
          totalAmount: order.totalAmount,
          status: order.status || 'Pending',
        };
      })
    );

    res.status(200).json({
      totalProducts,
      totalUsers,
      totalRevenue,
      recentOrders: populatedOrders,
    });
  } catch (error) {
    console.error('Dashboard fetch failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
