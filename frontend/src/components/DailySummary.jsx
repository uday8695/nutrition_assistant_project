import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { FaFire, FaDrumstickBite, FaBreadSlice, FaTint } from 'react-icons/fa';
import SummaryCard from './SummaryCard';

const DailySummary = ({ date, reloadFlag, onGoalCheck }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000); // Example default goal
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await API.get(`/meals/summary?date=${date}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSummary(res.data);
        setMeals(res.data.meals || []);
      } catch (err) {
        console.error('Error fetching summary:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (date) fetchSummary();
  }, [date, reloadFlag]);

  useEffect(() => {
    const total = meals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    setTotalCalories(total);

    if (onGoalCheck) {
      onGoalCheck(totalCalories >= dailyGoal); // This should be >=
    }
  }, [meals, dailyGoal, onGoalCheck, totalCalories]);

  if (loading) return <p>Loading summary...</p>;

  if (!summary) return <p>No meals logged today.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '2rem' }}>
      <SummaryCard title="Calories" value={summary.calories} unit="kcal" Icon={FaFire} color="#ff6b6b" />
      <SummaryCard title="Protein" value={summary.protein} unit="g" Icon={FaDrumstickBite} color="#4caf50" />
      <SummaryCard title="Carbs" value={summary.carbs} unit="g" Icon={FaBreadSlice} color="#03a9f4" />
      <SummaryCard title="Fat" value={summary.fat} unit="g" Icon={FaTint} color="#fbc02d" />
    </div>
  );
};

export default DailySummary;
