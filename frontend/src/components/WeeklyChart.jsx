import React, { useEffect, useState } from 'react';
import API from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const WeeklyChart = ({ reloadFlag }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await API.get('/meals/weekly');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load weekly data', err);
      }
    };
    fetchWeekly();
  }, [reloadFlag]); // <-- refetch when reloadFlag changes

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Weekly Nutrition Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calories" stroke="#ff6b6b" />
          <Line type="monotone" dataKey="protein" stroke="#4caf50" />
          <Line type="monotone" dataKey="carbs" stroke="#03a9f4" />
          <Line type="monotone" dataKey="fat" stroke="#fbc02d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
