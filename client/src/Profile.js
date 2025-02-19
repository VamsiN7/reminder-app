import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  // Get user from local storage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Initialize state for profile form
  const [profileData, setProfileData] = useState({
    email: storedUser.email || '',
    graduationDate: '',
    phone: '',
    notifyEmail: false,
    notifySMS: false,
    goal: '' 
  });

  // State to show messages
  const [message, setMessage] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!storedUser.email) {
      navigate('/login');
    }
  }, [storedUser, navigate]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:3000/api/profile', profileData);
      setMessage('Profile updated successfully!');

      // If we get a motivational message, show it
      if (response.data.motivationalMessage) {
        setMotivationalMessage(response.data.motivationalMessage);
      }

      // Update the stored user
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error(error);
      setMessage('Profile update failed.');
    }
  };

  return (
    <div className="card profile-container">
      <h2>Complete Your Profile</h2>
      {message && <p>{message}</p>}
      {motivationalMessage && (
        <div style={{ margin: '1em 0', fontWeight: 'bold' }}>
          {motivationalMessage}
        </div>
      )}

      <button onClick={() => navigate('/')}>Back</button>
      <form onSubmit={handleSubmit} style={{ marginTop: '1em' }}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={profileData.email}
            readOnly
          />
        </div>
        <div>
          <label>Graduation Date:</label><br />
          <input
            type="date"
            name="graduationDate"
            value={profileData.graduationDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number (optional):</label><br />
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="notifyEmail"
              checked={profileData.notifyEmail}
              onChange={handleChange}
            />
            Receive Email Notifications
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="notifySMS"
              checked={profileData.notifySMS}
              onChange={handleChange}
            />
            Receive SMS Notifications
          </label>
        </div>
        <div>
          <label>Goal or Focus Area:</label><br />
          <input
            type="text"
            name="goal"
            value={profileData.goal}
            onChange={handleChange}
            placeholder="e.g. fitness, coding, career..."
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
