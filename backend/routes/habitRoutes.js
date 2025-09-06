const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitCompleted,
  undoHabitCompletion
} = require('../controllers/habitController');

// Create a new habit
router.post('/', auth, createHabit);

// Get all habits for a user
router.get('/', auth, getHabits);

// Update a habit
router.put('/:id', auth, updateHabit);

// Delete a habit
router.delete('/:id', auth, deleteHabit);

// Mark habit as completed
router.post('/:id/complete', auth, markHabitCompleted);

// Undo habit completion
router.delete('/:id/complete', auth, undoHabitCompletion);

module.exports = router;