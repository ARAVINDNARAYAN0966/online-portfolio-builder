const mongoose = require('mongoose');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/creatorport');
    console.log('Connected to MongoDB');

    // Clear existing dummy data if needed (optional, keeping it simple here)
    
    const dummyUsers = [
      {
        username: 'AliceWriter',
        email: 'alice@example.com',
        password: 'password123',
        portfolio: {
          industry: 'Writing & Content',
          service: 'Copywriter',
          bio: 'I write compelling copy that converts. With 5 years of experience in content marketing.',
          skills: ['SEO Copywriting', 'Blog Posts', 'Email Campaigns'],
          colorTheme: 'purple',
          avatar: 'https://i.pravatar.cc/150?u=1'
        }
      },
      {
        username: 'BobVideo',
        email: 'bob@example.com',
        password: 'password123',
        portfolio: {
          industry: 'Video Production',
          service: 'Video Editor',
          bio: 'Transforming raw footage into cinematic masterpieces for YouTube and Social Media.',
          skills: ['Premiere Pro', 'After Effects', 'Color Grading'],
          colorTheme: 'blue',
          avatar: 'https://i.pravatar.cc/150?u=2'
        }
      },
      {
        username: 'CharlieAudio',
        email: 'charlie@example.com',
        password: 'password123',
        portfolio: {
          industry: 'Audio & Music',
          service: 'Sound Designer',
          bio: 'Creating immersive soundscapes for indie games and podcasts.',
          skills: ['Ableton', 'Mixing', 'Foley'],
          colorTheme: 'green',
          avatar: 'https://i.pravatar.cc/150?u=3'
        }
      },
      {
        username: 'DianaData',
        email: 'diana@example.com',
        password: 'password123',
        portfolio: {
          industry: 'Data Science',
          service: 'Data Analyst',
          bio: 'I make data tell a story. Helping businesses optimize their metrics.',
          skills: ['Python', 'SQL', 'Tableau'],
          colorTheme: 'orange',
          avatar: 'https://i.pravatar.cc/150?u=4'
        }
      },
      {
        username: 'EveConsult',
        email: 'eve@example.com',
        password: 'password123',
        portfolio: {
          industry: 'Consulting',
          service: 'Business Strategist',
          bio: 'Scaling startups from 0 to 1 with actionable insights and growth hacks.',
          skills: ['Leadership', 'Agile', 'Market Research'],
          colorTheme: 'purple',
          avatar: 'https://i.pravatar.cc/150?u=5'
        }
      }
    ];

    for (let u of dummyUsers) {
      // Create user if not exists
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const newUser = new User(u);
        await newUser.save();
        console.log(`Created user: ${u.username}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
