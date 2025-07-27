const Meal = require('../models/Meal');
const Food = require('../models/Food'); // ✅ Must be required so mongoose registers it

exports.addMeal = async (req, res) => {
  try {
    const { items, date } = req.body;

    const meal = await Meal.create({
      userId: req.user._id,
      items,
      date,
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Error adding meal', error });
  }
};
exports.getMeals = async (req, res) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.date) {
      query.date = req.query.date; // Filter by specific date
    }
    const meals = await Meal.find(query)
      .sort({ createdAt: -1 })
      .populate('items.foodId');
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meals', error: err.message });
  }
};


exports.getMealSummary = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.user._id };
    if (date) query.date = date;
    const meals = await Meal.find(query).populate('items.foodId');
    let summary = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    meals.forEach(meal => {
      meal.items.forEach(item => {
        const food = item.foodId;
        const qty = item.quantity || 1;
        summary.calories += food.calories * qty;
        summary.protein  += food.protein * qty;
        summary.carbs    += food.carbs * qty;
        summary.fat      += food.fat * qty;
      });
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching summary', error: err.message });
  }
};


exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting meal', error: err.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const { items } = req.body; // Expect updated items array with foodId & quantity

    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, userId: req.user._id },
      { items },
      { new: true }
    ).populate('items.foodId');

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Error updating meal', error: err.message });
  }
};

exports.getWeeklySummary = async (req, res) => {
  const userId = req.user._id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get last 7 days as YYYY-MM-DD strings
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  // Find meals for the last 7 days
  const meals = await Meal.find({
    userId,
    date: { $in: days }, // <-- use date field
  }).populate('items.foodId');

  // Initialize daily totals
  const dailyTotals = {};
  days.forEach(date => {
    dailyTotals[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  });

  meals.forEach((meal) => {
    const key = meal.date;
    if (!dailyTotals[key]) return;
    meal.items.forEach((item) => {
      const f = item.foodId;
      const q = item.quantity || 1;
      dailyTotals[key].calories += (f.calories || 0) * q;
      dailyTotals[key].protein += (f.protein || 0) * q;
      dailyTotals[key].carbs += (f.carbs || 0) * q;
      dailyTotals[key].fat += (f.fat || 0) * q;
    });
  });

  const response = days.map(date => ({ date, ...dailyTotals[date] }));

  res.json(response);
};
