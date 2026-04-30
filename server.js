require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database
let users = [];

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

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
app.get('/api/portfolios', (req, res) => {
  try {
    const publishedUsers = users
      .filter(user => user.portfolio && user.portfolio.isPublished)
      .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
    
    res.json(publishedUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching portfolios' });
  }
});

// Get current user's profile
app.get('/api/auth/me', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Profile
app.put('/api/users/profile', auth, (req, res) => {
  try {
    const { mobile, address, linkedin, github } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ msg: 'User not found' });

    users[userIndex] = {
      ...users[userIndex],
      mobile: mobile || users[userIndex].mobile,
      address: address || users[userIndex].address,
      linkedin: linkedin || users[userIndex].linkedin,
      github: github || users[userIndex].github
    };

    const { password, ...updatedUser } = users[userIndex];
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Update Portfolio
app.put('/api/users/portfolio', auth, (req, res) => {
  try {
    const { industry, service, bio, skills, colorTheme, country } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ msg: 'User not found' });

    // Handle string to array conversion for skills if needed
    let skillsArray = skills;
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    users[userIndex].portfolio = {
      ...users[userIndex].portfolio,
      industry: industry || users[userIndex].portfolio?.industry,
      service: service || users[userIndex].portfolio?.service,
      bio: bio || users[userIndex].portfolio?.bio,
      skills: skillsArray || users[userIndex].portfolio?.skills,
      colorTheme: colorTheme || users[userIndex].portfolio?.colorTheme || 'Purple',
      country: country || users[userIndex].portfolio?.country,
      isPublished: true,
      avatar: users[userIndex].portfolio?.avatar || `https://i.pravatar.cc/150?u=${users[userIndex].id}`
    };

    const { password, ...updatedUser } = users[userIndex];
    res.json(updatedUser);
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

    let existingEmail = users.find(u => u.email === email);
    if (existingEmail) return res.status(400).json({ error: 'User already exists' });
    
    let existingUsername = users.find(u => u.username === username);
    if (existingUsername) return res.status(400).json({ error: 'Username already taken' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: generateId(),
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body; 

    // Allow login by either email or username
    const user = users.find(u => u.email === username || u.username === username);
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
  const indexPath = path.resolve(__dirname, "client", "dist", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send(`Deployment Error: Cannot find index.html at ${indexPath}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
