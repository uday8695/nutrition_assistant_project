import React, { useEffect, useState } from 'react';
import API from '../services/api';

const MealLogger = ({ date, onMealLogged }) => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load food options from backend
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // Use API utility for consistency and baseURL handling
        const res = await API.get('/foods');
        setFoods(res.data);
      } catch (err) {
        console.error('Error fetching foods:', err.response?.data || err.message);
      }
    };
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFood) return alert('Please select a food');

    try {
      setLoading(true);
      await API.post('/meals', {
        items: [{ foodId: selectedFood, quantity }],
        date, // <-- send selected date
      });
      alert('Meal logged successfully!');
      setSelectedFood('');
      setQuantity(1);
      if (onMealLogged) onMealLogged(); // <-- Notify parent to reload chart
    } catch (err) {
      console.error('Error logging meal:', err);
      alert('Error logging meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Log a Meal</h3>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedFood}
          onChange={(e) => setSelectedFood(e.target.value)}
          required
        >
          <option value="">-- Select Food --</option>
          {foods.map((food) => (
            <option key={food._id} value={food._id}>
              {food.name} ({food.calories} kcal)
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Quantity"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Meal'}
        </button>
      </form>
    </div>
  );
};

export default MealLogger;
