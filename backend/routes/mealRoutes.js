const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { addMeal, getMeals } = require('../controllers/mealController');

router.post('/', protect, addMeal);
router.get('/', protect, getMeals);

module.exports = router;
