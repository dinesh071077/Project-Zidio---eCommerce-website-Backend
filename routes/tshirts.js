const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all T-shirts

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // ✅ Latest first
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});


// Get T-shirts by type (e.g., Full Sleeve)
router.get('/type/:tshirtType', async (req, res) => {
  try {
    const { tshirtType } = req.params;
    const products = await Product.find({ tshirtType });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET a single T-shirt by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'T-shirt not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
