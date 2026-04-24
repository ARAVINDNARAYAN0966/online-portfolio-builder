const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');
const JWT_SECRET = 'supersecretkey_for_student_project';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DB Helpers
async function readDB() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [] };
    }
}

async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

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

// Routes

// 1. Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const db = await readDB();
        
        if (db.users.find(u => u.username === username || u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            mobile: '',
            address: '',
            linkedin: '',
            github: '',
            portfolio: null
        };

        db.users.push(newUser);
        await writeDB(db);

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await readDB();
        
        const user = db.users.find(u => u.username === username);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. Get Profile (Protected)
app.get('/api/profile', authenticateToken, async (req, res) => {
    const db = await readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password, ...profileData } = user; // exclude password
    res.json(profileData);
});

// 4. Update Profile (Protected)
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { mobile, address, linkedin, github } = req.body;
        const db = await readDB();
        const userIndex = db.users.findIndex(u => u.id === req.user.id);
        
        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        db.users[userIndex] = {
            ...db.users[userIndex],
            mobile: mobile !== undefined ? mobile : db.users[userIndex].mobile,
            address: address !== undefined ? address : db.users[userIndex].address,
            linkedin: linkedin !== undefined ? linkedin : db.users[userIndex].linkedin,
            github: github !== undefined ? github : db.users[userIndex].github
        };

        await writeDB(db);
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. Update/Create Portfolio (Protected)
app.put('/api/portfolio', authenticateToken, async (req, res) => {
    try {
        const portfolioData = req.body;
        const db = await readDB();
        const userIndex = db.users.findIndex(u => u.id === req.user.id);
        
        if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

        db.users[userIndex].portfolio = {
            ...db.users[userIndex].portfolio,
            ...portfolioData
        };

        await writeDB(db);
        res.json({ message: 'Portfolio updated successfully', portfolio: db.users[userIndex].portfolio });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. Get All Published Portfolios (Public)
app.get('/api/portfolios', async (req, res) => {
    try {
        const db = await readDB();
        // Return only users that have a portfolio published
        let freelancers = db.users
            .filter(u => u.portfolio !== null)
            .map(u => ({
                id: u.id,
                name: u.username,
                email: u.email,
                mobile: u.mobile,
                linkedin: u.linkedin,
                github: u.github,
                ...u.portfolio
            }));

        const { industry, service } = req.query;
        if (industry) {
            freelancers = freelancers.filter(f => f.industry && f.industry.toLowerCase() === industry.toLowerCase());
        }
        if (service) {
            freelancers = freelancers.filter(f => f.service && f.service.toLowerCase() === service.toLowerCase());
        }

        res.json(freelancers);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
});
