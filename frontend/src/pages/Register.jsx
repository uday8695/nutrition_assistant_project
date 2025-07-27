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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <input name="age" placeholder="Age" onChange={handleChange} />
        <input name="gender" placeholder="Gender" onChange={handleChange} />
        <input name="height" placeholder="Height (cm)" onChange={handleChange} />
        <input name="weight" placeholder="Weight (kg)" onChange={handleChange} />
        <input name="activityLevel" placeholder="Activity Level" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
