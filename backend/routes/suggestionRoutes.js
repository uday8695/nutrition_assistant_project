const express = require('express');
const router = express.Router();
const {
  suggestNutrition,
  saveDietPlan,    // Fixed: was saveNutritionPlan
  getUserPlans     // Fixed: was getNutritionPlan
} = require('../controllers/suggestionController');
const suggestionController = require('../controllers/suggestionController'); // <-- Add this line

// Accepts age, height, weight → returns suggestions
router.get('/suggest-nutrition', suggestNutrition);

// Saves the plan to MongoDB
router.post('/newplan', saveDietPlan);  // Fixed function name

// Gets saved plan by userId  
router.get('/getsuggestion/:userId', suggestionController.getUserPlans);

module.exports = router;