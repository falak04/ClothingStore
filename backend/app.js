const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const Cart = require('./models/cart');
const cors = require('cors');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');  
const { UserDetails } = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');
const orderRouter = require('./order');
const StockNotification = require('./models/stockNotification');

const sessionOptions = {
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
};
app.use(session(sessionOptions));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use('/orders', orderRouter);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ClothingStore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/demouser', async (req, res) => {
let user = new User({username: 'falak',email: 'falak@gmail.com',});
let newUser = await User.register(user,'123456'); 
res.send(newUser);
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
app.get('/products/featured', async (req, res) => {
  try {
    console.log(11);
    const featured = await Product.find({ isFeatured: true });
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

app.post('/cart', async (req, res) => {
    try {
      const { userId, productId, quantity, size, color } = req.body;
      console.log(userId, productId, quantity, size, color);
      if (!size || !color) {
        return res.status(400).json({ error: 'Size and color are required' });
      }
      let cart = await Cart.findOne({ userId });

      if (cart) {
        // Check for same productId, size, and color
        const index = cart.items.findIndex(item => item.productId.toString() === productId && item.size === size && item.color === color);
        if (index > -1) {
          cart.items[index].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity, size, color });
        }
        await cart.save();
      } else {
        cart = new Cart({
          userId,
          items: [{ productId, quantity, size, color }]
        });
        await cart.save();
      }

      res.status(201).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
 
  app.get('/cart/:userId', async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
app.get("/signup",async (req,res)=>{
  res.render("signup");
})
app.post("/signup", async (req, res) => {
  try {
    let { username, email, password, role } = req.body;
    let user = new User({ username, email, role: role || 'customer' });
    let newUser = await User.register(user, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/login", (req, res) => {
  res.send("login"); // You need a login view or replace with res.send('Login Page')
});

app.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: 'Welcome back!'
}), (req, res) => {
  // Send user info to frontend (including _id, username, email, etc.)
  res.json({ user: req.user });
});

// app.get("/login-success", (req, res) => {
//   res.send("Login successful!");
// });

// app.get("/login-failure", (req, res) => {
//   res.send("Login failed. Please check your credentials and try again.");
// });
app.get('/logout',async (req,res)=>{
  req.logout((err)=>{
   if(err){
    return err;
   }
   res.redirect("/products");
  })
})

// Update quantity of a cart item
app.put('/cart/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    // Find the cart containing this item
    const cart = await Cart.findOne({ 'items._id': itemId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.quantity = quantity;
    // Remove item if quantity is 0 or less
    if (quantity <= 0) {
      item.remove();
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a cart item
app.delete('/cart/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    // Find the cart containing this item
    const cart = await Cart.findOne({ 'items._id': itemId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    // Remove the item by filtering
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    if (cart.items.length === originalLength) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all items from a user's cart
app.delete('/cart/user/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user details
app.get('/userdetails/:userId', async (req, res) => {
  try {
    const details = await UserDetails.findOne({ user: req.params.userId }).populate('user');
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update user details
app.post('/userdetails', async (req, res) => {
  try {
    const { userId, phoneNumber, gender, dateOfBirth, location, address, alternateMobile, hintName } = req.body;
    let details = await UserDetails.findOne({ user: userId });
    if (details) {
      details.phoneNumber = phoneNumber;
      details.gender = gender;
      details.dateOfBirth = dateOfBirth;
      details.location = location;
      details.address = address;
      details.alternateMobile = alternateMobile;
      details.hintName = hintName;
      await details.save();
    } else {
      details = new UserDetails({
        user: userId,
        phoneNumber,
        gender,
        dateOfBirth,
        location,
        address,
        alternateMobile,
        hintName
      });
      await details.save();
    }
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seller: Add a new product
app.post('/seller/products', async (req, res) => {
  try {
    const { name, price, description, category, Gender, imageUrl, variants, isFeatured, sellerId } = req.body;
    // Only allow sellers to add products
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can add products' });
    }
    const product = new Product({
      name, price, description, category, Gender, imageUrl, variants, isFeatured, seller: sellerId
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seller: Get all products for a seller
app.get('/seller/products', async (req, res) => {
  try {
    const { sellerId } = req.query;
    const products = await Product.find({ seller: sellerId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seller: Edit a product (only if owner)
app.put('/seller/products/:id', async (req, res) => {
  try {
    const { sellerId, ...updateFields } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({ error: 'You can only edit your own products' });
    }
    Object.assign(product, updateFields);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seller: Delete a product (only if owner)
app.delete('/seller/products/:id', async (req, res) => {
  try {
    const { sellerId } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register or update a stock notification request
app.post('/notify-stock', async (req, res) => {
  try {
    const { userId, productId, size, color, notified } = req.body;
    const existing = await StockNotification.findOne({ userId, productId, size, color, notified: false });
    if (existing) {
      // If notified is true, update the notification
      if (notified === true) {
        existing.notified = true;
        await existing.save();
        return res.status(200).json({ message: 'Notification marked as notified' });
      }
      return res.status(200).json({ message: 'Already registered' });
    }
    await StockNotification.create({ userId, productId, size, color, notified: !!notified });
    res.status(201).json({ message: 'Notification registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get pending notifications for a user
app.get('/notify-stock/:userId', async (req, res) => {
  try {
    const notifs = await StockNotification.find({ userId: req.params.userId, notified: false });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


