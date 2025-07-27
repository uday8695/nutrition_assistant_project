import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      // after successful login
      localStorage.setItem('token', res.data.token);

      // Check if user and token are returned
      if (!res.data.user || !res.data.token) {
        throw new Error('Login response is missing required fields');
      }

      // Save user and token via context
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);

      // Extract backend error message if available
      const message =
        err.response?.data?.message || // Backend custom message
        err.message || // Axios/network-level message
        'Login failed due to unknown error';

      alert(`Login failed: ${message}`);
      console.error('Login error details:', err);
    }
  };

  return (
   <div className="login-container">
  <div className="login-card">
    <h2 className="login-title">Login</h2>
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  </div>
</div>

  );
};

export default Login;
