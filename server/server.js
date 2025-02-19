require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const sequelize = require('./config/database');
const User = require('./models/user');
const openai = require('./lambda-deployment/services/openaiService'); 
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced (alter) successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });


/* ---------------------------------------------
   Registration Endpoint
---------------------------------------------- */
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      graduationDate: null,
      phone: null,
      notifyEmail: false,
      notifySMS: false,
      goal: null
    });
    console.log('Registered User:', newUser);
    res.status(200).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Error during registration', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/* ---------------------------------------------
   Login Endpoint
---------------------------------------------- */
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

/* ---------------------------------------------
   Profile Update Endpoint
---------------------------------------------- */
app.put('/api/profile', async (req, res) => {
  const { email, graduationDate, phone, notifyEmail, notifySMS, goal } = req.body;
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
    user.goal = goal;
    await user.save();

    // Generate an AI-based motivational message
    const motivationalMessage = await generateMotivationalMessage(goal);

    console.log('Updated Profile for:', email, 'Goal:', goal);
    res.status(200).json({
      message: 'Profile updated',
      user,
      motivationalMessage
    });
  } catch (error) {
    console.error('Error during profile update', error);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

/* ---------------------------------------------
   Helper: generateMotivationalMessage (OpenAI)
---------------------------------------------- */
async function generateMotivationalMessage(userGoal) {
  try {
    if (!userGoal || userGoal.trim().length === 0) {
      return "Keep striving for success! Each day is a new opportunity to learn and grow.";
    }

    // Customize the prompt to your liking
    const prompt = `
      The user’s goal is: "${userGoal}".
      Write a short, positive motivational message to inspire the user 
      to stay focused and achieve their goal.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful motivational coach that provides concise, uplifting messages.'
        },
        {
          role: 'user',
          content: `
        The user’s goal is: "${userGoal}".
        Write a short, positive motivational message to inspire the user 
        to stay focused and achieve their goal.
      `
        }
      ],
      max_tokens: 60,
      temperature: 0.7,
    });
    console.log(JSON.stringify(response.choices[0].message, null, 2));
    const aiMessage = response.choices[0].message.content.trim();

    return aiMessage;
  } catch (err) {
    console.error('Error calling OpenAI API:', err);
    // Return a fallback message on error
    return "Stay positive and keep moving forward!";
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
