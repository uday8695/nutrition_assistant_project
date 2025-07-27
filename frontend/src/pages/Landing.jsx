import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import { FaAppleAlt, FaChartBar, FaUserPlus } from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">
        <FaAppleAlt style={{ color: '#6366f1', marginRight: '10px' }} />
        Welcome to NutriAssist
      </h1>
      <p className="landing-desc">
        NutriAssist helps you track your meals, monitor your nutrition, and achieve your health goals with ease.
      </p>
      <ul className="landing-features">
        <li><FaChartBar /> Visualize your daily and weekly nutrition</li>
        <li><FaUserPlus /> Log meals and foods easily</li>
        <li>Personalized dashboard and progress tracking</li>
      </ul>
      <div className="landing-buttons">
        <button
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="register-button"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} NutriAssist. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;