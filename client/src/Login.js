import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    setErrors({...errors, [name]: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage('Please fix the errors before submitting.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/login', formData);
      setMessage('Login successful!');
      const { user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (!user.graduationdate) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="you@example.com"
            required
          />
          {errors.email && <small style={{ color: '#e74c3c' }}>{errors.email}</small>}
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Your password"
            required
          />
          {errors.password && <small style={{ color: '#e74c3c' }}>{errors.password}</small>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
