const DietPlan = require('../models/DietPlan');
const Meal = require('../models/Meal');
const Food = require('../models/Food');

exports.getFoodAssistance = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date().toISOString().substring(0, 10);

    const plan = await DietPlan.findOne({ userId }).sort({ createdAt: -1 });
    if (!plan) return res.status(404).json({ message: 'No diet plan found' });

    const meals = await Meal.find({ userId, date: today }).populate('items.foodId');

    let totalCalories = 0, totalProtein = 0, totalCarbs = 0;

    meals.forEach(meal => {
      meal.items.forEach(item => {
        const food = item.foodId;
        totalCalories += food.calories * item.quantity;
        totalProtein += food.protein * item.quantity;
        totalCarbs += food.carbohydrates * item.quantity;
      });
    });

    const missingCalories = plan.calorieIntake - totalCalories;
    const missingProtein = parseInt(plan.proteinNeeds) - totalProtein;
    const missingCarbs = parseInt(plan.carbohydrateNeeds) - totalCarbs;

    const suggestions = await Food.find()
      .sort({ calories: -1 })
      .limit(10);

    res.json({
      missing: {
        calories: missingCalories,
        protein: missingProtein,
        carbs: missingCarbs
      },
      suggestions: suggestions.map(f => ({
        name: f.name,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbohydrates
      }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Assistant error' });
  }
};
