// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      // Each cart item stores a product variant (size+color)
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      size: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
