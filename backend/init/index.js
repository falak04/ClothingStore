const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
require('dotenv').config();


// ✅ Correctly destructure from the data file
const { users, products } = require('./data.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  await initData();
}

async function initData() {
  console.log("Initializing data...");
  // await User.deleteMany({});
  await Product.deleteMany({});
  console.log("Users to insert:", users);
  // await User.insertMany(users);
  await Product.insertMany(products);
  console.log("Data initialized successfully");
}
