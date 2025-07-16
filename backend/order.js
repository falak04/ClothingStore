const express = require('express');
const router = express.Router();
const Order = require('./models/order');

// Helper: Mark stock notifications as notified for a variant
async function notifyStockForVariant(productId, size, color) {
  const StockNotification = require('./models/stockNotification');
  await StockNotification.updateMany({ productId, size, color, notified: false }, { $set: { notified: true } });
}

// Place a new order
router.post('/', async (req, res) => {
  try {
    const { user, customerName, phone, address, totalAmount, items } = req.body;
    // Each item should include size and color for the variant
    const order = new Order({
      user,
      customerName,
      phone,
      address,
      totalAmount,
      items
    });
    await order.save();
    // Update stock for each ordered variant
    const Product = require('./models/product');
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
        if (variant) {
          variant.stock = Math.max(0, (variant.stock || 0) - item.quantity);
          await product.save();
        }
      }
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders for a user
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seller: Get all orders for their products
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    // Find orders where any item has this seller
    const orders = await Order.find({ 'items.seller': sellerId }).populate('items.productId').populate('user');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 