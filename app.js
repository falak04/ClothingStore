const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const Cart = require('./models/cart');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');  
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
};
app.use(session(sessionOptions));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
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

app.post('/cart', async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
  
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        const index = cart.items.findIndex(item => item.productId.toString() === productId);
        if (index > -1) {
          cart.items[index].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
        await cart.save();
      } else {
        cart = new Cart({
          userId,
          items: [{ productId, quantity }]
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
app.post("/signup",async (req,res)=>{
  let {username,email,password} = req.body;
  let user = new User({username,email});
  let newUser = await User.register(user,password);
  req.login(newUser,err=>{})
})

app.get("/login", (req, res) => {
  res.send("login"); // You need a login view or replace with res.send('Login Page')
});

app.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: 'Welcome back!'
}), (req, res) => {
  res.redirect('/products');
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


