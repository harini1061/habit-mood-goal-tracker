// backend/config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Make sure this path matches your User model

module.exports = (passport) => {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth Profile:', profile.id, profile.emails[0].value);
      
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        // User exists, update last login
        user.lastLogin = new Date();
        await user.save();
        console.log('Existing Google user logged in:', user.email);
        return done(null, user);
      }

      // Check if user exists with same email (for account linking)
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value || user.avatar;
        user.verified = true; // Google accounts are pre-verified
        user.lastLogin = new Date();
        await user.save();
        console.log('Linked Google account to existing user:', user.email);
        return done(null, user);
      }

      // Create new user
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0]?.value || '',
        verified: true, // Google accounts are pre-verified
        lastLogin: new Date()
      });

      await user.save();
      console.log('New Google user created:', user.email);
      done(null, user);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      console.error('Deserialize user error:', error);
      done(error, null);
    }
  });
};