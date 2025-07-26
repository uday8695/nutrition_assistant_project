// import mongoose from 'mongoose';

// const mealSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   date: Date,
//   foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
// });

// export default mongoose.model("Meal", mealSchema);


const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: { type: Date, default: Date.now },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: Number, // e.g., in grams or servings
    }
  ]
});

module.exports = mongoose.model('Meal', mealSchema);
