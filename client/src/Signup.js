import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/register', formData);
      setMessage('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Please try again.');
    }
  };
  return (
    <div className="card">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required 
        />

        <label>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required 
        />

        <label>Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required 
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
