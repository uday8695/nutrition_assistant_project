// foodController.js
const Food = require('../models/Food');

exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foods', error });
  }
};

exports.addFood = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;

    const newFood = new Food({ name, calories, protein, carbs, fat });
    const savedFood = await newFood.save();

    res.status(201).json(savedFood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create food item', error });
  }
};
