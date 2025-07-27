const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
});

module.exports = mongoose.model('Food', foodSchema);
