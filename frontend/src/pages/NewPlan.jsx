import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewPlan.css'; // Add this import
import { Link } from 'react-router-dom';
import DietPlanList from './DietPlanList';

const NewPlan = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: ''
  });

  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedPlan, setSavedPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [showAllPlans, setShowAllPlans] = useState(false);
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

  // Navigate to diet plans list
  const viewAllPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5000/api/getsuggestion/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllPlans(Array.isArray(res.data) ? res.data : []);
      setShowAllPlans(true);
    } catch (err) {
      alert('Failed to fetch diet plans');
    }
  };

  // 🔁 Fetch existing plan on load
  useEffect(() => {
    const fetchSavedPlan = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/getsuggestion/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data) {
          setSavedPlan(res.data);
          // Pre-fill form with last used values
          setFormData({
            age: res.data.age || '',
            height: res.data.height || '',
            weight: res.data.weight || ''
          });
        }
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
    
    // Validation
    if (!formData.age || !formData.height || !formData.weight) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.age < 10 || formData.age > 100) {
      alert('Please enter a valid age (10-100)');
      return;
    }

    if (formData.height < 100 || formData.height > 250) {
      alert('Please enter a valid height (100-250 cm)');
      return;
    }

    if (formData.weight < 30 || formData.weight > 300) {
      alert('Please enter a valid weight (30-300 kg)');
      return;
    }

    try {
      setLoading(true);

      // 1. Get diet suggestion
      const res = await axios.get('http://localhost:5000/api/suggest-nutrition', {
        params: formData
      });

      const suggestedNutrition = res.data.suggestedNutrition;

      // 2. Save to MongoDB
      const payload = {
        userId: user._id, // <-- fix here
        userName: user.name || user.username,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
        plan: suggestedNutrition,
        bmi: res.data.bmi
      };

      await axios.post('http://localhost:5000/api/newplan', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuggestion(suggestedNutrition);
      alert('✅ Diet plan generated and saved successfully!');
      
      // Refresh saved plan
      const updatedPlan = await axios.get(`http://localhost:5000/api/getsuggestion/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedPlan(updatedPlan.data);

    } catch (err) {
      console.error('Error generating suggestion:', err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert('❌ Something went wrong: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="newplan-navbar">
        <div className="newplan-navbar-logo">NutriMate</div>
        <div className="newplan-navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/newplan">Generate Diet Plan</Link>
          <Link to="/profile">Profile</Link>
          <Link to="#" onClick={handleLogout}>Logout</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="newplan-main">
        <div className="newplan-title">
          <h2>🍎 Generate Your Diet Plan</h2>
          <p className="newplan-subtitle">Get personalized nutrition recommendations based on your body metrics</p>
        </div>

        {/* Navigation Buttons */}
        <div className="newplan-nav-btns">
          <button className="newplan-btn" onClick={viewAllPlans}>
            📋 View All My Plans
          </button>
        </div>

        <form className="newplan-form" onSubmit={handleSubmit}>
          <div>
            <label className="newplan-label">Age (years)</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age (10-100)"
              value={formData.age}
              onChange={handleChange}
              min="10"
              max="100"
              required
              className="newplan-input"
            />
          </div>
          <div>
            <label className="newplan-label">Height (cm)</label>
            <input
              type="number"
              name="height"
              placeholder="Enter your height (100-250 cm)"
              value={formData.height}
              onChange={handleChange}
              min="100"
              max="250"
              required
              className="newplan-input"
            />
          </div>
          <div>
            <label className="newplan-label">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter your weight (30-300 kg)"
              value={formData.weight}
              onChange={handleChange}
              min="30"
              max="300"
              step="0.1"
              required
              className="newplan-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="newplan-submit-btn"
          >
            {loading ? '🔄 Generating Plan...' : '🎯 Generate My Diet Plan'}
          </button>
        </form>

        {/* Current Suggestion */}
        {suggestion && (
          <div className="newplan-suggestion">
            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>🎉 Your New Diet Plan</h3>
            <div className="newplan-suggestion-grid">
              <div className="newplan-suggestion-box">
                <strong>Daily Calories:</strong><br/>{suggestion.calorieIntake}
              </div>
              <div className="newplan-suggestion-box">
                <strong>Protein:</strong><br/>{suggestion.proteinNeeds}
              </div>
              <div className="newplan-suggestion-box">
                <strong>Carbs:</strong><br/>{suggestion.carbohydrateNeeds}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>💡 Recommendation:</strong> {suggestion.suggestion}</p>
              <p><strong>⏰ Meal Timing:</strong> {suggestion.timing}</p>
              <p><strong>🚶‍♂️ Exercise:</strong> {suggestion.walk}</p>
              {suggestion.weightGain > 0 && (
                <p><strong>🎯 Weight Gain Target:</strong> {suggestion.weightGain} kg</p>
              )}
            </div>
            {suggestion.foods && suggestion.foods.length > 0 && (
              <div>
                <h4 style={{ marginBottom: '1rem' }}>🥗 Recommended Foods:</h4>
                <div className="newplan-foods-grid">
                  {suggestion.foods.map((f, i) => (
                    <div key={i} className="newplan-food-box">
                      <strong>{f.name}</strong><br/>
                      <small>{f.grams}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Last Saved Plan */}
        {savedPlan && (
          <div className="newplan-savedplan">
            <h4 className="newplan-savedplan-title">
              📊 Your Current Diet Plan
            </h4>
            <div className="newplan-savedplan-grid">
              <div>
                <p><strong>BMI:</strong> {savedPlan.bmi?.toFixed(2) || 'N/A'}</p>
                <p><strong>Daily Calories:</strong> {savedPlan.calorieIntake || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Protein Needs:</strong> {savedPlan.proteinNeeds || 'N/A'}</p>
                <p><strong>Carb Needs:</strong> {savedPlan.carbohydrateNeeds || 'N/A'}</p>
              </div>
            </div>
            <p style={{ marginTop: '1rem' }}>
              <strong>Created:</strong> {savedPlan.createdAt ? new Date(savedPlan.createdAt).toLocaleDateString() : 'N/A'}
            </p>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button className="newplan-savedplan-btn" onClick={viewAllPlans}>
                📋 View All My Plans
              </button>
            </div>
          </div>
        )}

        {/* All Diet Plans */}
        {showAllPlans && (
          <div className="newplan-allplans">
            <h3>All My Diet Plans</h3>
            <DietPlanList plans={allPlans} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPlan;