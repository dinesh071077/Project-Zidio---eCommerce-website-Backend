// // models/Product.js
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   tshirtType: {
//     type: String,
//     required: true
//   },
//   sizes: {
//     type: [String], // e.g., ["S", "M", "L", "XL"]
//     required: true
//   },
//   quantity: {
//     type: Map, // e.g., { "S": 10, "M": 15, "L": 5 }
//     of: Number,
//     required: true
//   },
//   imageUrl: {
//     type: String, // optional, for image URL if needed
//   },
//   highlights: {
//     type: [String], // New field: array of strings
//     default: []
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

// Allow multiple colors per size
const sizeDetailSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  colors: [{ type: String, required: true }]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  tshirtType: {
    type: String,
    required: true
  },
  sizes: {
    type: Map,
    of: sizeDetailSchema,
    required: true
  },
  imageUrl: {
    type: String,
  },
  highlights: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
