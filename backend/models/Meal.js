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
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
      },
      quantity: Number,
    },
  ],
  date: {
    type: String, // format: 'YYYY-MM-DD'
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // <-- Add this


module.exports = mongoose.model('Meal', mealSchema);
