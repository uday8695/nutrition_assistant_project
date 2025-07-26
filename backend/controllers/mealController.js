const Meal = require('../models/Meal');
const Food = require('../models/Food'); // ✅ Must be required so mongoose registers it

exports.addMeal = async (req, res) => {
  try {
    const { items } = req.body;

    const meal = await Meal.create({
      userId: req.user._id,
      items
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding meal', error });
  }
};
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user._id }).populate('items.foodId');
    res.json(meals);
  } catch (error) {
    console.error("Meal fetch error:", error); // 🔍 Print full error to terminal
    res.status(500).json({
      message: 'Error fetching meals',
      error: error.message || error,
    });
  }
};
