const Habit = require('../models/Habit');

// Create a new habit
const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newHabit = new Habit({
      userId: req.user.userId, // ✅ Fixed: Use req.user.userId (from JWT)
      name,
      frequency: frequency || 'daily'
    });

    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all habits for a user
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId }) // ✅ Fixed: Use req.user.userId
      .sort({ createdAt: -1 });
    res.status(200).json(habits);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a habit
const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, frequency } = req.body;

    // Only update the fields that should be updatable
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (frequency !== undefined) updateFields.frequency = frequency;

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user.userId }, // ✅ Fixed: Use req.user.userId
      { $set: updateFields },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found or not authorized' });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a habit
const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHabit = await Habit.findOneAndDelete({ 
      _id: id, 
      userId: req.user.userId // ✅ Fixed: Use req.user.userId
    });

    if (!deletedHabit) {
      return res.status(404).json({ message: 'Habit not found or not authorized' });
    }

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark a habit as completed (handles streak logic)
const markHabitCompleted = async (req, res) => {
  const { id } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const habit = await Habit.findOne({ 
      _id: id, 
      userId: req.user.userId // ✅ Fixed: Use req.user.userId
    });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or not authorized' });
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
    res.status(200).json({ 
      message: 'Habit marked completed', 
      streak: habit.streak,
      habit: habit // Return updated habit data
    });
  } catch (error) {
    console.error('Error marking habit completed:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitCompleted,
};