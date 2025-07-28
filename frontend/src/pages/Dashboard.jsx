import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import MealLogger from '../components/MealLogger';
import DailySummary from '../components/DailySummary';
import MealHistory from '../components/MealHistory';
import WeeklyChart from '../components/WeeklyChart';
import './Dashboard.css';
import img1 from '../assets/carousel1.jpg';
import img2 from '../assets/carousel2.jpeg';
import img3 from '../assets/carousel3.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [selectedDate, setSelectedDate] = useState(date);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const navigate = useNavigate();

  const handleDateConfirm = () => {
    setSelectedDate(date);
  };

  const handleMealLogged = () => {
    setReloadFlag((f) => f + 1);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  // 🧠 Assistant logic
 // Improved fetchAssist function for Dashboard.jsx
const fetchAssist = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in first');
      return;
    }
    
    const res = await axios.get('http://localhost:5000/api/assist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { missing, suggestions } = res.data;
    
    if (!suggestions || suggestions.length === 0) {
      alert('No food suggestions available at the moment.');
      return;
    }
    
    const suggestionText = suggestions
      .slice(0, 3)
      .map((s) => `🍽️ ${s.name} - ${s.calories} kcal, ${s.protein}g protein, ${s.carbs}g carbs`)
      .join('\n');

    const missingText = [];
    if (missing.calories > 0) missingText.push(`🔻 ${missing.calories} kcal`);
    if (missing.protein > 0) missingText.push(`🔻 ${missing.protein}g protein`);
    if (missing.carbs > 0) missingText.push(`🔻 ${missing.carbs}g carbs`);

    const message = missingText.length > 0 
      ? `You're missing:\n${missingText.join('\n')}\n\nSuggested foods:\n${suggestionText}`
      : `Great! You've met your daily goals! 🎉\n\nBut if you want more:\n${suggestionText}`;

    alert(message);
  } catch (err) {
    console.error('Assistant error:', err);
    
    if (err.response?.status === 404) {
      alert('No diet plan found. Please create a diet plan first!');
    } else if (err.response?.status === 401) {
      alert('Please log in again');
      localStorage.removeItem('token');
      navigate('/');
    } else {
      alert('Unable to fetch assistant suggestions. Please try again.');
    }
  }
};

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">NutriAssist</div>
        <div className="navbar-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/newplan">Generate Diet Plan</a>
          <a href="/profile">Profile</a>
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </div>

      {/* Carousel */}
      <div className="carousel">
        <div className="carousel-slide">
          <img src={img1} alt="Healthy food 1" />
          <img src={img2} alt="Healthy food 2" />
          <img src={img3} alt="Healthy food 3" />
        </div>
        <div className="carousel-controls">
          <button className="carousel-btn">&#8592;</button>
          <button className="carousel-btn">&#8594;</button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="dashboard-container">
        <h2>Nutrition Dashboard</h2>
        <h2>Welcome, {user?.username}!</h2>
        <p>Email: {user?.email}</p>

        <label>
          Select Date: &nbsp;
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={handleDateConfirm}>Confirm Date</button>
        </label>

        <div className="button-group">
          <button>Today</button>
          <button>This Week</button>
        </div>

        <div className="slider">
          <label>Adjust Daily Goal:</label>
          <input
            type="range"
            min="1200"
            max="3500"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
          />
          <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: '#6366f1' }}>
            {dailyGoal} kcal
          </span>
        </div>

        <p>Selected Date: <strong>{selectedDate}</strong></p>

        {/* ✅ Assistant Button */}
        <button onClick={fetchAssist}>🤖 What Should I Eat Now?</button>

        <MealLogger date={selectedDate} onMealLogged={handleMealLogged} />
        <DailySummary date={selectedDate} dailyGoal={dailyGoal} />
        <MealHistory date={selectedDate} />
        <WeeklyChart reloadFlag={reloadFlag} dailyGoal={dailyGoal} />
      </div>
    </div>
  );
};

export default Dashboard;
