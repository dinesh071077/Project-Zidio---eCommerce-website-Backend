const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all T-shirts
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Update T-shirt by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, tshirtType, sizes, imageUrl, highlights } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          price,
          tshirtType,
          sizes,
          imageUrl,
          highlights
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'T-shirt updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete T-shirt by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'T-shirt deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
