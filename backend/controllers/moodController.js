const Mood = require('../models/Mood');

// Create a new mood
exports.createMood = async (req, res) => {
  try {
    const mood = new Mood(req.body);
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all moods
exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a mood
exports.updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Mood.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Mood not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a mood
exports.deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Mood.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Mood not found' });
    res.json({ message: 'Mood deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
