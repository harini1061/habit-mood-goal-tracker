// Create this as test-mongodb.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 5002; // Different port

console.log("🔍 Testing with MongoDB connection...");
console.log("🌐 MONGO_URI is:", process.env.MONGO_URI);

// Test MongoDB connection FIRST
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    
    // Now add middleware step by step
    console.log("Adding CORS...");
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }));
    
    console.log("Adding express.json...");
    app.use(express.json());

    console.log("Adding session middleware...");
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      }
    }));

    console.log("Adding passport middleware...");
    app.use(passport.initialize());
    app.use(passport.session());

    console.log("Loading passport config...");
    require('./config/passport')(passport);

    console.log("Adding routes...");
    const habitRoutes = require('./routes/habitRoutes');
    const moodRoutes = require('./routes/moodRoutes');
    const goalRoutes = require('./routes/goalRoutes');
    const authRoutes = require('./routes/authRoutes');
    const partnerRoutes = require('./routes/partnerRoutes');

    app.use('/api/habits', habitRoutes);
    app.use('/api/moods', moodRoutes);
    app.use('/api/goals', goalRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/partners', partnerRoutes);

    app.get('/', (req, res) => {
      res.send('Hello from the backend with MongoDB!');
    });

    console.log("Starting server...");
    app.listen(PORT, () => {
      console.log(`🚀 Server with MongoDB running on http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("This might be the source of the path-to-regexp error!");
  });