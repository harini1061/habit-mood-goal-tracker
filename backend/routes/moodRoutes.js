const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.post('/', moodController.createMood);
router.get('/', moodController.getMoods);

module.exports = router;
