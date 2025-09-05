// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
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
    required: function() {
      // Password is required only if googleId is not present
      return !this.googleId;
    },
    minlength: 6
  },

  // Google OAuth fields
  googleId: {
    type: String,
    sparse: true // Allows multiple null values but unique non-null values
  },

  avatar: {
    type: String,
    default: ''
  },

  verified: {
    type: Boolean,
    default: false
  },

  // Password reset functionality
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // Remember me functionality
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }
    },
    deviceInfo: String // Optional: store device/browser info
  }],

  // One-to-one partner reference (from your original code)
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  lastLogin: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); // This gives you createdAt and updatedAt

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ 'refreshTokens.token': 1 });

// Clean up expired refresh tokens before saving
userSchema.pre('save', function(next) {
  if (this.refreshTokens) {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.expiresAt > new Date());
  }
  next();
});

// Method to add refresh token
userSchema.methods.addRefreshToken = function(token, deviceInfo = '') {
  this.refreshTokens.push({
    token,
    deviceInfo,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  
  // Keep only the last 5 refresh tokens per user
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return this.save();
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

// Method to check if refresh token is valid
userSchema.methods.hasValidRefreshToken = function(token) {
  return this.refreshTokens.some(rt => 
    rt.token === token && rt.expiresAt > new Date()
  );
};

module.exports = mongoose.model('User', userSchema);