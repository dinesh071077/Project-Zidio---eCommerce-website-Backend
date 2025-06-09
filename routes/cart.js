// const express = require('express');
// const router = express.Router();
// const Cart = require('../models/cartschema');
// const authenticate = require('../middleware/authMiddleware');

// // Add to cart
// router.post('/add', authenticate , async (req, res) => {
//   try {
//     const { productId, selectedSize, selectedColor } = req.body;

//     const newCartItem = new Cart({
//       userId: req.user.id, // ✅ Important
//       productId,
//       selectedSize,
//       selectedColor
//     });

//     await newCartItem.save();
//     res.status(201).json({ message: 'Item added to cart' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to add item to cart' });
//   }
// });

// // Get user's cart
// router.get('/', authenticate, async (req, res) => {
//   const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
//   res.status(200).json(cart);
// });

// // Remove from cart
// router.delete('/remove/:itemId', authenticate, async (req, res) => {
//   const cart = await Cart.findOneAndUpdate(
//     { userId: req.user.id },
//     { $pull: { items: { _id: req.params.itemId } } },
//     { new: true }
//   );
//   res.status(200).json(cart);
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Cart = require('../models/cartschema');
const authenticate = require('../middleware/authMiddleware');

// POST: Add item to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, selectedSize, selectedColor } = req.body;
    const userId = req.user.userId; // ✅ correct key from JWT

    const newItem = {
      productId,
      selectedSize,
      selectedColor,
      quantity: 1
    };

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [newItem]
      });
    } else {
      cart.items.push(newItem);
    }

    await cart.save();
    res.status(201).json({ message: 'Item added to cart', cart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// GET: Fetch user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }) // ✅ corrected
      .populate('items.productId'); // optional, populate product details

    res.status(200).json(cart || { items: [] });
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// DELETE: Remove item from cart
router.delete('/remove/:itemId', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId }, // ✅ corrected
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true }
    );

    res.status(200).json(cart);
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

module.exports = router;
