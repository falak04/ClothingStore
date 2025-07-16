// models/User.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
 // Store hashed password
  role: {
    type: String,
    enum: ['seller', 'customer'],
    default: 'customer'
  }
}, { timestamps: true });
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

// New UserDetails schema
const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  alternateMobile: {
    type: String,
    required: false
  },
  hintName: {
    type: String,
    required: false
  }
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = User;
// Export UserDetails as well
module.exports.UserDetails = UserDetails;
