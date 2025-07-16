const mongoose = require('mongoose');

const stockNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  notified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('StockNotification', stockNotificationSchema); 