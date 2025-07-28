const express = require('express');
const router = express.Router();
const { getFoodAssistance } = require('../controllers/assistantController');
const protect = require('../middleware/authMiddleware');

router.get('/assist', protect, getFoodAssistance);

module.exports = router;
