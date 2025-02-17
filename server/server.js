const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const sequelize = require('./config/database');
const User = require('./models/User');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create user with extra fields initialized to default values
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      graduationDate: null,
      phone: null,
      notifyEmail: false,
      notifySMS: false
    });
    console.log('Registered User:', newUser);
    res.status(200).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Error during registration', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log('User logged in:', email);
      res.status(200).json({
        message: 'Login successful',
        token: 'fake-jwt-token', // Replace with a real JWT in production
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

// Profile Update Endpoint
app.put('/api/profile', async (req, res) => {
  const { email, graduationDate, phone, notifyEmail, notifySMS } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Update profile details
    user.graduationDate = graduationDate;
    user.phone = phone;
    user.notifyEmail = notifyEmail;
    user.notifySMS = notifySMS;
    await user.save();
    console.log('Updated Profile for:', email, user);
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Error during profile update', error);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
