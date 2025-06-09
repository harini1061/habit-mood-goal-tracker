const Habit = require('../models/Habit');

// Add a new habit
exports.createHabit = async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
