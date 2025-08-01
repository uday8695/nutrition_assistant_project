const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const mealRoutes = require('./routes/mealRoutes');
app.use('/api/meals', mealRoutes);

const foodRoutes = require('./routes/foodRoutes');
app.use('/api/foods', foodRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

const suggestionRoutes = require('./routes/suggestionRoutes');
app.use('/api', suggestionRoutes);

// ADD THIS LINE - Register assistant routes
const assistantRoutes = require('./routes/assistantRoutes');
app.use('/api', assistantRoutes);

app.get('/', (req, res) => {
  res.send('Nutrition Assistant API running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});