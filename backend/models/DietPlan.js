const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: String,
  grams: String
});

const DietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  age: Number,
  height: Number,
  weight: Number,
  suggestion: String,
  timing: String,
  foods: [FoodSchema],
  walk: String,
  calorieIntake: Number,
  weightGain: Number,
  carbohydrateNeeds: String,
  proteinNeeds: String,
  bmi: Number,
  date: { type: Date, default: Date.now }
}, { collection: 'dietplans' }); // Explicitly set collection name

module.exports = mongoose.model('DietPlan', DietPlanSchema);
