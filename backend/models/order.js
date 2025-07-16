// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // For customer orders, this can be null, but for seller views, it will be set
  },
  customerName: String,
  phone: String,
  address: String,
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  totalAmount: Number,
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      productName: String,
      quantity: Number,
      price: Number,
      size: String,
      color: String,
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
