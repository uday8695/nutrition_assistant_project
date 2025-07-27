import React, { useEffect, useState } from 'react';
import API from '../services/api';

const MealHistory = ({ date }) => {
  const [meals, setMeals] = useState([]);
  const [editingMealId, setEditingMealId] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await API.get(`/meals?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });        setMeals(res.data);
      } catch (err) {
        console.error('Error fetching meals:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
   if (date) fetchMeals();
}, [date]);

  const handleDelete = async (mealId) => {
    if (!window.confirm('Delete this meal?')) return;

    try {
      await API.delete(`/meals/${mealId}`);
      setMeals((prev) => prev.filter((m) => m._id !== mealId));
    } catch (err) {
      console.error('Error deleting meal:', err.response?.data || err.message);
    }
  };

  const handleEditClick = (meal) => {
    setEditingMealId(meal._id);
    setEditItems(meal.items.map((item) => ({
      foodId: item.foodId?._id || item.foodId,
      name: item.foodId?.name || '',
      quantity: item.quantity,
    })));
  };

  const handleItemChange = (index, newQuantity) => {
    setEditItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleSave = async () => {
    try {
      await API.patch(`/meals/${editingMealId}`, { items: editItems });
      setEditingMealId(null);

      // Refresh meals for selected date
      const token = localStorage.getItem('token');
      const res = await API.get(`/meals?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(res.data);
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    setEditingMealId(null);
    setEditItems([]);
  };

  if (loading) return <p>Loading meal history...</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Meal History</h3>
      {meals.length === 0 ? (
        <p>No meals logged yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {meals.map((meal) => (
            <li key={meal._id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{new Date(meal.createdAt).toLocaleString()}</strong>
                <div>
                  <button onClick={() => handleEditClick(meal)} style={{ marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(meal._id)} style={{ backgroundColor: '#ff4d4f', color: 'white' }}>
                    Delete
                  </button>
                </div>
              </div>

              {editingMealId === meal._id ? (
                <>
                  <ul>
                    {editItems.map((item, index) => (
                      <li key={item.foodId}>
                        {item.name || 'Unknown'} ×{' '}
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, parseInt(e.target.value))}
                          min="1"
                          style={{ width: '60px' }}
                        />
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleSave} style={{ marginRight: '0.5rem' }}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <ul>
                  {meal.items.map((item, index) => (
                    <li key={index}>
                      {item.foodId?.name || 'Unknown'} × {item.quantity}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealHistory;
