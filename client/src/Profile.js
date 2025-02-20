import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [profileData, setProfileData] = useState({
    email: storedUser.email || '',
    graduationDate: '',
    phone: '',
    notifyEmail: false,
    notifySMS: false,
    goal: '' 
  });
  const [message, setMessage] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storedUser.email) {
      navigate('/login');
    }
  }, [storedUser, navigate]);

  const validate = () => {
    const newErrors = {};
    if (profileData.graduationDate && new Date(profileData.graduationDate) < new Date()) {
      newErrors.graduationDate = 'Graduation date must be in the future.';
    }
    if (profileData.phone && !/^\+?\d{7,15}$/.test(profileData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage('Please correct the highlighted errors.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put('http://localhost:3000/api/profile', profileData);
      setMessage('Profile updated successfully!');
      if (response.data.motivationalMessage) {
        setMotivationalMessage(response.data.motivationalMessage);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error(error);
      setMessage('Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card profile-container">
      <div className="profile-header">
        <h2>Complete Your Profile</h2>
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      </div>

      {message && <p className="feedback-message">{message}</p>}
      {motivationalMessage && (
        <div className="motivational-message">
          {motivationalMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="profile-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Graduation Date:</label>
          <input
            type="date"
            name="graduationDate"
            value={profileData.graduationDate}
            onChange={handleChange}
            className={errors.graduationDate ? 'error' : ''}
          />
          {errors.graduationDate && <small className="error-text">{errors.graduationDate}</small>}
        </div>
        <div className="form-group">
          <label>Phone Number (optional):</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="+1234567890"
          />
          {errors.phone && <small className="error-text">{errors.phone}</small>}
        </div>
        <div className="form-group checkbox-group">
  <input
    type="checkbox"
    id="notifyEmail"
    name="notifyEmail"
    checked={profileData.notifyEmail}
    onChange={handleChange}
  />
  <label htmlFor="notifyEmail">Receive Email Notifications</label>
</div>

<div className="form-group checkbox-group">
  <input
    type="checkbox"
    id="notifySMS"
    name="notifySMS"
    checked={profileData.notifySMS}
    onChange={handleChange}
  />
  <label htmlFor="notifySMS">Receive SMS Notifications</label>
</div>


        <div className="form-group">
          <label>Goal or Focus Area:</label>
          <input
            type="text"
            name="goal"
            value={profileData.goal}
            onChange={handleChange}
            placeholder="e.g. fitness, coding, career..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
