import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  // Get the stored user (we assume email was saved during login)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [profileData, setProfileData] = useState({
    email: storedUser.email || '',
    graduationDate: '',
    phone: '',
    notifyEmail: false,
    notifySMS: false
  });
  const [message, setMessage] = useState('');

  // If no email is present in storage, redirect to login
  useEffect(() => {
    if (!storedUser.email) {
      navigate('/login');
    }
  }, [storedUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the profile update along with the user's email.
      const response = await axios.put('http://localhost:3000/api/profile', profileData);
      setMessage('Profile updated successfully!');
      // Optionally update local storage with the new details
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Profile update failed.');
    }
  };

  return (
    <div className="card profile-container">
      <h2>Complete Your Profile</h2>
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/')}>Back</button>
      <form onSubmit={handleSubmit}>
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
            required
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
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
