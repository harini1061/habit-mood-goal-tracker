const express = require('express');
const router = express.Router();
const {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} = require('../controllers/habitController');

// Create a new habit
router.post('/', createHabit);

// Get all habits for a user
router.get('/:userId', getHabits);

// Update a habit
router.put('/:id', updateHabit);

// Delete a habit
router.delete('/:id', deleteHabit);

module.exports = router;
