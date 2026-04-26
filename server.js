require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Import Model
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_for_student_project';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/creatorport';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Auth Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// ---------------- API ROUTES ----------------

// 1. Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. Get Profile (Protected)
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Update Profile (Protected)
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { mobile, address, linkedin, github, website } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { mobile, address, linkedin, github, website },
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. Update/Create Portfolio (Protected)
app.put('/api/portfolio', authenticateToken, async (req, res) => {
    try {
        const portfolioData = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.portfolio = { ...user.portfolio?.toObject(), ...portfolioData };
        await user.save();
        
        res.json({ message: 'Portfolio updated successfully', portfolio: user.portfolio });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. Get All Published Portfolios (Public) - with Filters & Search
app.get('/api/portfolios', async (req, res) => {
    try {
        const { industry, service, search } = req.query;
        let query = { portfolio: { $exists: true, $ne: null } };
        
        if (industry) query['portfolio.industry'] = new RegExp(`^${industry}$`, 'i');
        if (service) query['portfolio.service'] = new RegExp(`^${service}$`, 'i');
        
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { username: searchRegex },
                { 'portfolio.skills': searchRegex },
                { 'portfolio.service': searchRegex }
            ];
        }

        const users = await User.find(query).select('-password');
        
        // Map to flat structure for easier frontend consumption
        const freelancers = users.map(u => ({
            id: u._id,
            name: u.username,
            email: u.email,
            mobile: u.mobile,
            linkedin: u.linkedin,
            github: u.github,
            website: u.website,
            ...u.portfolio.toObject()
        }));

        res.json(freelancers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching portfolios' });
    }
});

// 7. Get Single Portfolio Detail (Public)
app.get('/api/portfolios/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user || !user.portfolio) return res.status(404).json({ error: 'Portfolio not found' });
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ---------------- STATIC FILE SERVING FOR REACT ----------------

// Serve static React build files
app.use(express.static(path.join(__dirname, 'client/dist')));

// CATCH-ALL ROUTE: Send all non-API requests to the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
});
