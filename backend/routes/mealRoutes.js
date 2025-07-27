// const express = require('express');
// const router = express.Router();
// const protect = require('../middleware/authMiddleware');
// const { addMeal, getMeals } = require('../controllers/mealController');

// router.post('/', protect, addMeal);
// router.get('/', protect, getMeals);
// const { getMealSummary } = require('../controllers/mealController');
// router.get('/summary', protect, getMealSummary); // ✅ New summary route
// router.get('/summary', protect, getMeals); // ✅ New summary route

// module.exports = router;

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { addMeal, getMeals, getMealSummary,getWeeklySummary, deleteMeal, updateMeal } = require('../controllers/mealController');
router.patch('/:mealId', protect, updateMeal); // ✅ Update quantity

// Add a new meal
router.post('/', protect, addMeal);

// Get all meals
router.get('/', protect, getMeals);

// Get today's meal summary
router.get('/summary', protect, getMealSummary);

// Delete a meal by ID
router.delete('/:id', protect, deleteMeal);

router.get('/weekly', protect, getWeeklySummary);

module.exports = router;
