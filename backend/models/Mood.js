const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emotion: { type: String, required: true },  // e.g., happy, sad
  intensity: { type: Number, min: 1, max: 10 },  // scale of 1–10
  note: { type: String },  // optional
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', moodSchema);
