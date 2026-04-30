require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creator-marketplace')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// API Routes

// Get all published portfolios for the Home page
app.get('/api/portfolios', async (req, res) => {
  try {
    const users = await User.find({ 'portfolio.isPublished': true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching portfolios' });
  }
});

// Get current user's profile
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { mobile, address, linkedin, github } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.mobile = mobile || user.mobile;
    user.address = address || user.address;
    user.linkedin = linkedin || user.linkedin;
    user.github = github || user.github;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Update Portfolio
app.put('/api/users/portfolio', auth, async (req, res) => {
  try {
    const { industry, service, bio, skills, colorTheme, country } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Handle string to array conversion for skills if needed
    let skillsArray = skills;
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    user.portfolio = {
      ...user.portfolio,
      industry: industry || user.portfolio?.industry,
      service: service || user.portfolio?.service,
      bio: bio || user.portfolio?.bio,
      skills: skillsArray || user.portfolio?.skills,
      colorTheme: colorTheme || user.portfolio?.colorTheme || 'Purple',
      country: country || user.portfolio?.country,
      isPublished: true,
      avatar: user.portfolio?.avatar || `https://i.pravatar.cc/150?u=${user.id}`
    };

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating portfolio' });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Validate Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });
    
    user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: 'Username already taken' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body; // Screenshot shows "Username" for login

    // Allow login by either email or username
    const user = await User.findOne({ $or: [{ email: username }, { username: username }] });
    if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, "client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
