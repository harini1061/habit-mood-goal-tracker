const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

// POST /api/habits
router.post('/', habitController.createHabit);

// GET /api/habits
router.get('/', habitController.getHabits);

module.exports = router;
