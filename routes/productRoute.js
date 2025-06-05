// // routes/productRoutes.js
// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');

// // Middleware to protect admin routes
// const authenticateToken = require("../middleware/authMiddleware");

// router.post('/add', async (req, res) => {
//   try {
//     const { name, price, tshirtType, sizes, quantity, imageUrl, highlights } = req.body;

//     const newProduct = new Product({
//       name,
//       price,
//       tshirtType,
//       sizes,
//       quantity,
//       imageUrl,
//       highlights
//     });

//     await newProduct.save();
//     res.status(201).json({ message: 'T-shirt added successfully', product: newProduct });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const authenticateToken = require("../middleware/authMiddleware");

// // Unified route: handles both single and multiple product uploads
// router.post('/add', async (req, res) => {
//   try {
//     const data = req.body;

//     // If data is an array → multiple products
//     if (Array.isArray(data)) {
//       if (data.length === 0) {
//         return res.status(400).json({ message: 'No T-shirts provided' });
//       }

//       const insertedProducts = await Product.insertMany(data);
//       return res.status(201).json({ message: 'Multiple T-shirts added successfully', products: insertedProducts });
//     }

//     // Otherwise, it's a single product
//     const { name, price, tshirtType, sizes, quantity, imageUrl, highlights } = data;

//     const newProduct = new Product({
//       name,
//       price,
//       tshirtType,
//       sizes,
//       quantity,
//       imageUrl,
//       highlights,
//     });

//     await newProduct.save();
//     return res.status(201).json({ message: 'Single T-shirt added successfully', product: newProduct });
//   } catch (error) {
//     console.error('Add Product Error:', error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticateToken = require("../middleware/authMiddleware");

// Unified route: handles both single and multiple product uploads
router.post('/add', async (req, res) => {
  try {
    const data = req.body;

    // If data is an array → multiple products
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ message: 'No T-shirts provided' });
      }

      // Optional: validate each item before inserting
      const validProducts = data.map(product => {
        return {
          ...product,
          highlights: product.highlights || [],
        };
      });

      const insertedProducts = await Product.insertMany(validProducts);
      return res.status(201).json({
        message: 'Multiple T-shirts added successfully',
        products: insertedProducts,
      });
    }

    // Single product upload
    const { name, price, tshirtType, sizes, imageUrl, highlights } = data;

    // Basic validation
    if (!name || !price || !tshirtType || !sizes || typeof sizes !== 'object') {
      return res.status(400).json({ message: 'Missing required fields or invalid sizes format' });
    }

    // Ensure each size has `quantity` and `colors` (array)
    for (const [sizeKey, sizeVal] of Object.entries(sizes)) {
      if (
        typeof sizeVal.quantity !== 'number' ||
        !Array.isArray(sizeVal.colors) ||
        sizeVal.colors.length === 0
      ) {
        return res.status(400).json({
          message: `Invalid data for size "${sizeKey}" — expected quantity (number) and colors (non-empty array)`,
        });
      }
    }

    const newProduct = new Product({
      name,
      price,
      tshirtType,
      sizes,
      imageUrl,
      highlights: highlights || [],
    });

    await newProduct.save();
    return res.status(201).json({
      message: 'Single T-shirt added successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Add Product Error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;
