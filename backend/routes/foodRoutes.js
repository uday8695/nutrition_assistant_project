const express = require('express');
const router = express.Router();
const Food = require('../models/Food'); // your mongoose model
const protect = require('../middleware/authMiddleware'); // for secured access

const { getFoods } = require('../controllers/foodController');

// router.get('/', async (req, res) => {
//   const foods = await Food.find(); // This queries the foods collection
//   res.json(foods);
// });
router.get('/', getFoods); // Remove 'protect' here
// @route   POST /api/foods

// @desc    Add a new food item
// @access  Private (protected route)
router.post('/', protect, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;

    const food = new Food({ name, calories, protein, carbs, fat });
    const createdFood = await food.save();

    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create food item' });
  }
});

module.exports = router;
