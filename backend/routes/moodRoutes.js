const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.post('/', moodController.createMood);
router.get('/', moodController.getMoods);
router.put('/:id', moodController.updateMood);
router.delete('/:id', moodController.deleteMood);

module.exports = router;
