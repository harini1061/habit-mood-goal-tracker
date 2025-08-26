const Habit = require('../models/Habit');

// Create a new habit
const createHabit = async (req, res) => {
  try {
    const { userId, name, frequency } = req.body;

    const newHabit = new Habit({ userId, name, frequency });
    await newHabit.save();

    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create habit', error });
  }
};

// Get all habits for a user
const getHabits = async (req, res) => {
  try {
    const { userId } = req.params;

    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habits', error });
  }
};

// Update a habit
const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedHabit = await Habit.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error });
  }
};

// Delete a habit
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHabit = await Habit.findByIdAndDelete(id);

    if (!deletedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit', error });
  }
};

// ✅ Mark a habit as completed (handles streak logic)
const markHabitCompleted = async (req, res) => {
  const { id } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Already marked today?
    const alreadyMarked = habit.completedDates.some(date => {
      const d = new Date(date);
      return d.toDateString() === today.toDateString();
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: 'Already completed today' });
    }

    // Check streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
    const continuedStreak = last && last.toDateString() === yesterday.toDateString();

    habit.streak = continuedStreak ? habit.streak + 1 : 1;
    habit.lastCompleted = today;
    habit.completedDates.push(today);

    await habit.save();
    res.status(200).json({ message: 'Habit marked completed', streak: habit.streak });
  } catch (error) {
    console.error('Error marking habit completed:', error);
    res.status(500).json({ message: 'Failed to mark habit completed', error });
  }
};

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitCompleted, // ✅ export the new function
};
