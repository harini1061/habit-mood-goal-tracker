const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  emotion: { type: String, required: true }, // e.g., happy, sad, stressed
  intensity: { type: Number, min: 1, max: 10 }, // scale of 1–10
  note: { type: String }, // optional note
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', moodSchema);
