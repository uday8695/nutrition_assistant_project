import React, { useContext ,useState } from 'react';
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
    setReloadFlag((f) => f + 1); // Increment to trigger WeeklyChart update
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Clear auth info (if any)
    localStorage.removeItem('token');
    // ...any other logout logic...
    navigate('/'); // Go to landing page
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">NutriAssist</div>
        <div className="navbar-links">
          {/* <a href="/">Home</a> */}
          <a href="/dashboard">Dashboard</a>
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

      {/* Main Dashboard Content */}
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
          {/* <button>This Month</button> */}
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
        <MealLogger date={selectedDate} onMealLogged={handleMealLogged} />
        <DailySummary date={selectedDate} dailyGoal={dailyGoal} />
        <MealHistory date={selectedDate} />
        <WeeklyChart reloadFlag={reloadFlag} dailyGoal={dailyGoal} />
      </div>
    </div>
  );
};

export default Dashboard;
