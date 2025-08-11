const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');

// ✅ Correctly destructure from the data file
const { users, products } = require('./data.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ClothingStore');
  await initData();
}

async function initData() {
  console.log("Initializing data...");
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log("Users to insert:", users);
  await User.insertMany(users);
  await Product.insertMany(products);
  console.log("Data initialized successfully");
}
