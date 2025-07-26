import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date,
  meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
});

export default mongoose.model("DietPlan", planSchema);
