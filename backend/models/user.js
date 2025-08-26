// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  // One-to-one partner reference
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
