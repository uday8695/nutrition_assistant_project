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
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
