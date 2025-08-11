const mongoose = require('mongoose');
const User = require('../models/user.js');
const Product = require('../models/product.js');

// ✅ Correctly destructure from the data file
const { users, products } = require('./data.js');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    'mongodb+srv://falakshah4956:Falak2004@cluster0.jxclz1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  );
  await initData();
}

async function initData() {
  console.log('Initializing data...');
  // await User.deleteMany({});
  await Product.deleteMany({});
  console.log('Users to insert:', users);
  // await User.insertMany(users);
  await Product.insertMany(products);
  console.log('Data initialized successfully');
}
