require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

const habitRoutes = require('./routes/habitRoutes');
app.use('/api/habits', habitRoutes);
// Debug log to check MONGO_URI
console.log("🌐 MONGO_URI is:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// Test route (you can remove or update this)
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
