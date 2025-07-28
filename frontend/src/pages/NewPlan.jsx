import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS for navbar styling

const NewPlan = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: ''
  });

  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedPlan, setSavedPlan] = useState(null);
  const navigate = useNavigate();

  // Add error handling for localStorage
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return {};
    }
  };

  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  };

  const user = getUser();
  const token = getToken();

  // Logout handler
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // 🔁 Fetch existing plan on load
  useEffect(() => {
    const fetchSavedPlan = async () => {
      try {
        // Fixed: Added /api prefix
        const res = await axios.get(`http://localhost:5000/api/getsuggestion/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSavedPlan(res.data);
      } catch (err) {
        console.log('No existing plan:', err.message);
      }
    };
    if (user.id && token) {
      fetchSavedPlan();
    }
  }, [user.id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 1. Get diet suggestion - Fixed: Added /api prefix
      const res = await axios.get('http://localhost:5000/api/suggest-nutrition', {
        params: formData
      });

      const suggestedNutrition = res.data.suggestedNutrition;

      // 2. Save to MongoDB - Fixed: Added /api prefix
      const payload = {
        userId: user.id,
        userName: user.name,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
        suggestions: suggestedNutrition,
        bmi: res.data.bmi
      };

      await axios.post('http://localhost:5000/api/newplan', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuggestion(suggestedNutrition);
      alert('Plan generated and saved!');
    } catch (err) {
      console.error('Error generating suggestion:', err.response?.data || err.message);
      alert('Something went wrong: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar - Same as Dashboard */}
      <div className="navbar">
        <div className="navbar-logo">NutriAssist</div>
        <div className="navbar-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/newplan">Generate Diet Plan</a>
          <a href="/profile">Profile</a>
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
        <h2>Generate Diet Plan</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Get Suggestion'}
          </button>
        </form>

        {suggestion && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Suggested Plan</h3>
            <p><strong>Calories:</strong> {suggestion.calorieIntake}</p>
            <p><strong>Proteins:</strong> {suggestion.proteinNeeds}</p>
            <p><strong>Carbs:</strong> {suggestion.carbohydrateNeeds}</p>
            <p><strong>Suggestion:</strong> {suggestion.suggestion}</p>
            <p><strong>Timing:</strong> {suggestion.timing}</p>
            <p><strong>Exercise:</strong> {suggestion.walk}</p>
            {suggestion.weightGain > 0 && (
              <p><strong>Weight Gain Target:</strong> {suggestion.weightGain} kg</p>
            )}
            <h4>Recommended Foods:</h4>
            <ul>
              {suggestion.foods?.map((f, i) => (
                <li key={i}>{f.name} - {f.grams}</li>
              ))}
            </ul>
          </div>
        )}

        {savedPlan && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e8', borderRadius: '4px' }}>
            <h4>Last Saved Plan</h4>
            {/* Fixed: Remove .suggestions since data is stored flat in the model */}
            <p><strong>Suggestion:</strong> {savedPlan.suggestion || 'No previous suggestion found.'}</p>
            <p><strong>BMI:</strong> {savedPlan.bmi?.toFixed(2) || 'N/A'}</p>
            <p><strong>Calories:</strong> {savedPlan.calorieIntake || 'N/A'}</p>
            <p><strong>Date:</strong> {savedPlan.date ? new Date(savedPlan.date).toLocaleDateString() : 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPlan;