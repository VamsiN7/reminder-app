import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Username is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    // You can add further validation such as email format or password length here
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
      await axios.post('http://localhost:3000/api/register', formData);
      setMessage('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create an Account</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Username</label>
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your username"
          className={errors.name ? 'error' : ''}
          required 
        />
        {errors.name && <small style={{ color: '#e74c3c' }}>{errors.name}</small>}

        <label>Email</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={errors.email ? 'error' : ''}
          required 
        />
        {errors.email && <small style={{ color: '#e74c3c' }}>{errors.email}</small>}

        <label>Password</label>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={errors.password ? 'error' : ''}
          required 
        />
        {errors.password && <small style={{ color: '#e74c3c' }}>{errors.password}</small>}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
