// controllers/suggestionController.js
const DietPlan = require('../models/DietPlan');

// Remove duplicate function, keep only this one
exports.suggestNutrition = (req, res) => {
  const { age, height, weight } = req.query;
  const parsedAge = parseInt(age);
  const parsedHeight = parseInt(height);
  const parsedWeight = parseFloat(weight);

  if (isNaN(parsedAge) || isNaN(parsedHeight) || isNaN(parsedWeight)) {
    return res.status(400).json({ error: 'Invalid input values' });
  }

  const calorieIntake = parsedWeight * 25;
  const walk = parsedWeight < 50 ? '2km walk' : '3km walk';

  const foods = [
    { name: 'Oats', grams: '40g' },
    { name: 'Eggs', grams: '2 boiled' },
    { name: 'Apple', grams: '100g' },
    { name: 'Chicken breast', grams: '100g' }
  ];

  const bmi = parsedWeight / ((parsedHeight / 100) ** 2);

  res.json({
    suggestedNutrition: {
      suggestion: 'Balanced high-protein diet with moderate carbs.',
      timing: '3 main meals, 2 snacks',
      foods,
      walk,
      calorieIntake,
      weightGain: parsedWeight < 50 ? 5 : 0,
      carbohydrateNeeds: '150-200g',
      proteinNeeds: '50-70g'
    },
    bmi
  });
};

// Fixed function name to match route import
exports.saveDietPlan = async (req, res) => {
  try {
    const { userId, userName, age, height, weight, suggestions, bmi } = req.body;
    const newPlan = new DietPlan({
      userId,
      userName,
      age,
      height,
      weight,
      ...suggestions,
      bmi
    });

    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save plan' });
  }
};

// Fixed function name to match route import
exports.getUserPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await DietPlan.find({ userId }).sort({ date: -1 });
    
    // Return the most recent plan or empty object
    const latestPlan = plans.length > 0 ? plans[0] : null;
    res.json(latestPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};