// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Landing.css';
// import { FaAppleAlt, FaChartBar, FaUserPlus } from 'react-icons/fa';

// const Landing = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="landing-container">
//       <h1 className="landing-title">
//         <FaAppleAlt style={{ color: '#6366f1', marginRight: '10px' }} />
//         Welcome to NutriMate
//       </h1>
//       <p className="landing-desc">
//         NutriMate helps you track your meals, monitor your nutrition, and achieve your health goals with ease.
//       </p>
//       <ul className="landing-features">
//         <li><FaChartBar /> Visualize your daily and weekly nutrition</li>
//         <li><FaUserPlus /> Log meals and foods easily</li>
//         <li>Personalized dashboard and progress tracking</li>
//       </ul>
//       <div className="landing-buttons">
//         <button
//           className="login-button"
//           onClick={() => navigate('/login')}
//         >
//           Login
//         </button>
//         <button
//           className="register-button"
//           onClick={() => navigate('/register')}
//         >
//           Register
//         </button>
//       </div>
//       <footer className="landing-footer">
//         &copy; {new Date().getFullYear()} NutriAssist. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Landing;
import food1 from '../assets/food1.jpg';
import food2 from '../assets/food2.jpg';
import food3 from '../assets/food3.jpg';
import Slider from 'react-slick';
import Lottie from 'react-lottie';
import animationData from '../assets/lottie-health.json';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import {
  FaAppleAlt, FaChartBar, FaUserPlus, FaStethoscope, FaBalanceScale,
  FaTruck, FaHeartbeat
} from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();
 const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
  };
  
  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
                <Lottie options={lottieOptions} height={200} width={200} />

        <h1>
          NutriMate
        </h1>
        <p>
          NutriMate helps you track meals, monitor nutrition, and reach your health goals. We bring smart meal planning, real-time nutrition tracking, and actionable suggestions to one platform.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
       
      </section>

      {/* Insights */}
     <section className="insights-section-alt">
  <div className="insight-card glass">
    <h3>Real-Time Nutrition Feedback</h3>
    <p>Instantly understand what your body needs based on your meal logs and activity levels.</p>
  </div>

  <div className="insight-card glass">
    <h3>Smart Meal Recommendations</h3>
    <p>Receive suggestions to optimize your macronutrients and micronutrients.</p>
  </div>

  <div className="insight-card glass">
    <h3>Personalized Weekly Plans</h3>
    <p>Create goal-oriented meal plans with smart tracking and visual progress tools.</p>
  </div>

  <div className="insight-card glass">
    <h3>Integrated Assistant Mode</h3>
    <p>Ask “What should I eat now?” and get actionable responses based on your dietary gaps.</p>
  </div>
</section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Simple Steps to Start Your Healing Journey</h2>
        <p>Choose the care you need, create your profile, and start tracking nutrition confidently.</p>
        <ul className="service-steps">
          <li><FaStethoscope /> Explore Services</li>
          <li><FaBalanceScale /> Choose What You Need</li>
          <li><FaTruck /> Create Free Profile</li>
          <li><FaHeartbeat /> Start Your Journey</li>
        </ul>
      </section>
      <section className="cards-section">
        <h2>What We Offer</h2>
        <div className="cards-container">
          <div className="flip-card glass">
    <div className="flip-card-inner">
      <div className="card-front">
        <h3>Meal Suggestions</h3>
      </div>
      <div className="card-back">
        <p>Get suggestions tailored to your logged meals and goals.</p>
      </div>
    </div>
  </div>
  <div className="flip-card glass">
    <div className="flip-card-inner">
      <div className="card-front">
        <h3>Nutrition Gaps</h3>
      </div>
      <div className="card-back">
        <p>Identify deficiencies and get micro-recommendations instantly.</p>
      </div>
    </div>
  </div>
  <div className="flip-card glass">
    <div className="flip-card-inner">
      <div className="card-front">
        <h3>Weekly Plans</h3>
      </div>
      <div className="card-back">
        <p>Plan and visualize weekly diet schedules with personalized macros.</p>
      </div>
    </div>
  </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} NutriAssist. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
