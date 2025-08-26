const Mood = require('../models/Mood');

// @desc    Create a new mood entry
// @route   POST /api/moods
// @access  Private
const createMood = async (req, res) => {
  try {
    const { emotion, intensity, note } = req.body;

    if (!emotion || !intensity) {
      return res.status(400).json({ message: 'Emotion and intensity are required.' });
    }

    const mood = new Mood({
      user: req.user.id, // from auth middleware
      emotion,
      intensity,
      note
    });

    await mood.save();
    res.status(201).json(mood);
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get all mood entries for logged-in user
// @route   GET /api/moods
// @access  Private
const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: 'asc' });
    res.status(200).json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  createMood,
  getMoods
};
