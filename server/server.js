// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy in-memory store for demonstration
const users = [];

// server.js (Registration endpoint)
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Initialize additional fields as null or false by default
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        graduationDate: null,
        phone: null,
        notifyEmail: false,
        notifySMS: false
      };
      users.push(newUser);
      console.log('Registered User:', newUser);
      res.status(200).json({ message: 'Registration successful', user: newUser });
    } catch (error) {
      console.error('Error during registration', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });
  

// server.js (Login endpoint)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        console.log('User logged in:', email);
        // Return a dummy token and the user object
        res.status(200).json({ 
          message: 'Login successful', 
          token: 'fake-jwt-token', 
          user 
        });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  

// server.js (Profile Update endpoint)
app.put('/api/profile', (req, res) => {
    const { email, graduationDate, phone, notifyEmail, notifySMS } = req.body;
  
    // Find the user by email (in production, use authenticated user ID)
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    // Update profile details
    user.graduationDate = graduationDate;
    user.phone = phone;
    user.notifyEmail = notifyEmail;
    user.notifySMS = notifySMS;
  
    console.log('Updated Profile for:', email, user);
    res.status(200).json({ message: 'Profile updated', user });
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
