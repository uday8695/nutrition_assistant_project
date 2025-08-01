import React, { useContext, useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import axios from 'axios';
import DietPlanList from './DietPlanList';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [selectedDate, setSelectedDate] = useState(date);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [dietPlans, setDietPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  const [assistData, setAssistData] = useState(null);
  const [goalMet, setGoalMet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await axios.get(`http://localhost:5000/api/getsuggestion/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDietPlans(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        alert('Failed to fetch diet plans');
      }
    };
    fetchPlans();
  }, []);

  const handleDateConfirm = () => {
    setSelectedDate(date);
  };

  const handleMealLogged = () => setReloadFlag(f => f + 1);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchAssist = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/assist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssistData(res.data);
    } catch (err) {
      alert('Failed to fetch assistant data');
    }
  };

  const fetchAllPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5000/api/getsuggestion/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDietPlans(Array.isArray(res.data) ? res.data : []);
      setShowPlans(true);
    } catch (err) {
      alert('Failed to fetch diet plans');
    }
  };

  // Get the latest diet plan
  const latestPlan = dietPlans.length > 0 ? dietPlans[0] : null;

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">NutriAssist</div>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/newplan">Generate Diet Plan</Link>
          <Link to="/profile">Profile</Link>
          <Link to="#" onClick={handleLogout}>Logout</Link>
        </div>
      </div>

      {/* Carousel */}
      <div className="carousel">
        <div className="carousel-slide">
          <img src={img1} alt="Healthy food 1" />
          <img src={img2} alt="Healthy food 2" />
          <img src={img3} alt="Healthy food 3" />
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

        {assistData && (
          <div className="diet-assistance-section card">
            <h3>Diet Assistance</h3>
            {latestPlan ? (
              <div className="latest-diet-plan">
                <strong>Latest Suggestion:</strong>
                <p>{latestPlan.suggestion}</p>
                <p><strong>Timing:</strong> {latestPlan.timing}</p>
                <p><strong>Exercise:</strong> {latestPlan.walk}</p>
                <p><strong>Calories:</strong> {latestPlan.calorieIntake}</p>
                <p><strong>Protein:</strong> {latestPlan.proteinNeeds}</p>
                <p><strong>Carbs:</strong> {latestPlan.carbohydrateNeeds}</p>
                {latestPlan.foods && latestPlan.foods.length > 0 && (
                  <div>
                    <h4>Recommended Meals:</h4>
                    <ul>
                      {latestPlan.foods.map((food, i) => (
                        <li key={i}>
                          {food.name} - {food.grams}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Optionally show assistant suggestions */}
                <h4>Assistant Suggestions</h4>
                <p>
                  {assistData.missing.calories > 0 && <span>Missing Calories: {assistData.missing.calories} kcal<br/></span>}
                  {assistData.missing.protein > 0 && <span>Missing Protein: {assistData.missing.protein} g<br/></span>}
                  {assistData.missing.carbs > 0 && <span>Missing Carbs: {assistData.missing.carbs} g<br/></span>}
                </p>
                <div>
                  {assistData.totalCalories >= dailyGoal
                    ? <span className="goal-met">🎉 You have met your daily goal!</span>
                    : <span className="goal-not-met">You are {dailyGoal - assistData.totalCalories} kcal away from your goal.</span>
                  }
                </div>
              </div>
            ) : (
              <p>No diet suggestions available.</p>
            )}
          </div>
        )}

        <MealLogger date={selectedDate} onMealLogged={handleMealLogged} />
        <DailySummary
          date={selectedDate}
          reloadFlag={reloadFlag}
          dailyGoal={dailyGoal}
          onGoalCheck={(goalMet) => setGoalMet(goalMet)}
        />
        {typeof goalMet === 'boolean' && (
          <div className="goal-status">
            {goalMet
              ? <span className="goal-met">🎉 Target Achieved! Great job!</span>
              : <span className="goal-not-met">Keep going! You can reach your goal!</span>
            }
          </div>
        )}
        <MealHistory date={selectedDate} reloadFlag={reloadFlag} />
        <WeeklyChart reloadFlag={reloadFlag} dailyGoal={dailyGoal} />
      </div>
    </div>
  );
};

export default Dashboard;
