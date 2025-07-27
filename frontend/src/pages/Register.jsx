import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
  <div className="register-card">
    <h2 className="register-title">Register</h2>
    <form onSubmit={handleSubmit} className="register-form">
      <label htmlFor="username">Username</label>
      <input name="username" placeholder="Username" onChange={handleChange} required />

      <label htmlFor="email">Email</label>
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />

      <label htmlFor="password">Password</label>
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />

      <label htmlFor="age">Age</label>
      <input name="age" placeholder="Age" type="number" onChange={handleChange} />

      <label htmlFor="gender">Gender</label>
      <input name="gender" placeholder="Gender" onChange={handleChange} />

      <label htmlFor="height">Height (cm)</label>
      <input name="height" placeholder="Height (cm)" type="number" onChange={handleChange} />

      <label htmlFor="weight">Weight (kg)</label>
      <input name="weight" placeholder="Weight (kg)" type="number" onChange={handleChange} />

      <label htmlFor="activityLevel">Activity Level</label>
      <input name="activityLevel" placeholder="Activity Level" onChange={handleChange} />

      <button type="submit" className="register-btn">Register</button>
    </form>
  </div>
</div>

  );
};

export default Register;
