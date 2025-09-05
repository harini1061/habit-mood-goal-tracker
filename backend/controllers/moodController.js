// controllers/moodController.js
const Mood = require('../models/Mood');

// Create a new mood entry
const createMood = async (req, res) => {
  try {
    const { emotion, note, intensity } = req.body;

    if (!emotion) {
      return res.status(400).json({ error: "Emotion is required" });
    }

    const mood = new Mood({
      user: req.user.userId, // Use userId from auth middleware
      emotion,
      note,
      intensity
    });

    await mood.save();
    res.status(201).json(mood);
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all moods for authenticated user
const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.userId }).sort({ date: -1 });
    res.status(200).json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a mood
const updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { emotion, note, intensity } = req.body;

    // Only update the fields that should be updatable
    const updateFields = {};
    if (emotion !== undefined) updateFields.emotion = emotion;
    if (note !== undefined) updateFields.note = note;
    if (intensity !== undefined) updateFields.intensity = intensity;

    const updatedMood = await Mood.findOneAndUpdate(
      { _id: id, user: req.user.userId }, // Match mood + owner
      { $set: updateFields },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ message: 'Mood not found or not authorized' });
    }

    res.status(200).json(updatedMood);
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a mood
const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;

    // Only delete if this mood belongs to the logged-in user
    const deletedMood = await Mood.findOneAndDelete({ 
      _id: id, 
      user: req.user.userId 
    });

    if (!deletedMood) {
      return res.status(404).json({ message: 'Mood not found or not authorized' });
    }

    res.status(200).json({ message: 'Mood deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMood,
  getMoods,
  updateMood,
  deleteMood
};