// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🌐 Debug MONGO_URI
console.log("🌐 MONGO_URI is:", process.env.MONGO_URI);

// 🔗 Routes
const habitRoutes = require('./routes/habitRoutes');
const moodRoutes = require('./routes/moodRoutes');
const goalRoutes = require('./routes/goalRoutes');
const authRoutes = require('./routes/authRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
 // ✅ Moved after `app` is declared

// 🛣️ Use Routes
app.use('/api/habits', habitRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/partners', partnerRoutes); // ✅ Now safe to use

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err.message));

// 🧪 Test Route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
