const Habit = require('../models/Habit');

// Helper function to recalculate streak
const calculateStreak = (completedDates) => {
  if (completedDates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = completedDates
    .map(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    })
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if most recent completion was today or yesterday
  const mostRecent = sortedDates[0];
  const daysDiff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 1) return 0; // Streak broken

  let currentDate = new Date(mostRecent);
  
  for (let i = 0; i < sortedDates.length; i++) {
    if (sortedDates[i].getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Create a new habit
const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newHabit = new Habit({
      userId: req.user.userId, // Fixed: Use req.user.userId (from JWT)
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
    const habits = await Habit.find({ userId: req.user.userId }) // Fixed: Use req.user.userId
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
      { _id: id, userId: req.user.userId }, // Fixed: Use req.user.userId
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
      userId: req.user.userId // Fixed: Use req.user.userId
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
      userId: req.user.userId // Fixed: Use req.user.userId
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

// Undo habit completion for today
const undoHabitCompletion = async (req, res) => {
  const { id } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    console.log('Undo completion called for habit ID:', id); // Debug log
    
    const habit = await Habit.findOne({ 
      _id: id, 
      userId: req.user.userId 
    });
    
    if (!habit) {
      console.log('Habit not found for user:', req.user.userId); // Debug log
      return res.status(404).json({ message: 'Habit not found or not authorized' });
    }

    // Check if habit was completed today
    const todayIndex = habit.completedDates.findIndex(date => {
      const d = new Date(date);
      return d.toDateString() === today.toDateString();
    });

    if (todayIndex === -1) {
      console.log('Habit was not completed today'); // Debug log
      return res.status(400).json({ message: 'Habit was not completed today' });
    }

    // Remove today's completion
    habit.completedDates.splice(todayIndex, 1);

    // Recalculate streak from scratch
    habit.streak = calculateStreak(habit.completedDates);
    
    // Update lastCompleted to the most recent completion date
    if (habit.completedDates.length > 0) {
      const sortedDates = habit.completedDates
        .map(date => new Date(date))
        .sort((a, b) => b - a);
      habit.lastCompleted = sortedDates[0];
    } else {
      habit.lastCompleted = null;
    }

    await habit.save();
    console.log('Habit completion undone successfully'); // Debug log
    
    res.status(200).json({ 
      message: 'Habit completion undone', 
      streak: habit.streak,
      habit: habit 
    });
  } catch (error) {
    console.error('Error undoing habit completion:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitCompleted,
  undoHabitCompletion,
};