const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

// Create goal
router.post('/', createGoal);

// Get goals for a specific user
router.get('/:userId', getGoals);

// Update goal
router.put('/:id', updateGoal);

// Delete goal
router.delete('/:id', deleteGoal);

module.exports = router;
