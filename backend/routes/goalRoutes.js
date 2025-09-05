const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Add auth middleware
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

// Create goal (with auth)
router.post('/', auth, createGoal);

// Get goals for authenticated user (no userId param needed)
router.get('/', auth, getGoals);

// Update goal (with auth)
router.put('/:id', auth, updateGoal);

// Delete goal (with auth)
router.delete('/:id', auth, deleteGoal);

module.exports = router;