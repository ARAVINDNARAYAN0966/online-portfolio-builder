require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/creator-marketplace';

const seedData = async () => {
  try {
    console.log('MongoDB Connected for Seeding');
    await User.deleteMany({});
    console.log('Cleared existing users');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    const sampleUsers = [
      {
        username: 'alexdesign',
        email: 'alex@example.com',
        password,
        mobile: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/alexdesign',
        github: 'https://github.com/alexdesign',
        portfolio: {
          industry: 'DESIGN',
          service: 'UI/UX DESIGN',
          bio: 'I craft vibrant, user-centric interfaces that breathe life into digital products. With 5 years of experience building scalable design systems, my focus is on seamless user journeys.',
          skills: ['Figma', 'Webflow', 'Prototyping', 'Design Systems'],
          colorTheme: 'Purple',
          avatar: 'https://i.pravatar.cc/150?img=47',
          isPublished: true
        }
      },
      {
        username: 'samdev',
        email: 'sam@example.com',
        password,
        mobile: '+44 7700 900077',
        linkedin: 'https://linkedin.com/in/samdev',
        github: 'https://github.com/samdev',
        portfolio: {
          industry: 'DEVELOPMENT',
          service: 'FULL-STACK WEB',
          bio: 'Building lightning-fast, modern web applications from the ground up. I specialize in the MERN stack and love turning complex problems into elegant code.',
          skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
          colorTheme: 'Blue',
          avatar: 'https://i.pravatar.cc/150?img=11',
          isPublished: true
        }
      },
      {
        username: 'marcusgrowth',
        email: 'marcus@example.com',
        password,
        mobile: '+61 400 123 456',
        linkedin: 'https://linkedin.com/in/marcusgrowth',
        github: '',
        portfolio: {
          industry: 'MARKETING',
          service: 'SOCIAL MEDIA',
          bio: 'Helping bold brands find their unique voice in the crowded digital space. From viral TikTok campaigns to data-driven SEO strategies, I drive growth.',
          skills: ['Content Strategy', 'SEO', 'Copywriting', 'Analytics'],
          colorTheme: 'Orange',
          avatar: 'https://i.pravatar.cc/150?img=12',
          isPublished: true
        }
      },
      {
        username: 'sarahwrites',
        email: 'sarah@example.com',
        password,
        mobile: '+1 (555) 987-6543',
        linkedin: 'https://linkedin.com/in/sarahwrites',
        github: '',
        portfolio: {
          industry: 'WRITING',
          service: 'COPYWRITING',
          bio: 'I weave words that sell. Specializing in high-converting landing pages, engaging email sequences, and brand storytelling that captivates audiences.',
          skills: ['Copywriting', 'SEO', 'Email Marketing', 'Blogging'],
          colorTheme: 'Green',
          avatar: 'https://i.pravatar.cc/150?img=5',
          isPublished: true
        }
      },
      {
        username: 'chrisvideo',
        email: 'chris@example.com',
        password,
        mobile: '+1 (555) 333-2222',
        linkedin: 'https://linkedin.com/in/chrisvideo',
        github: '',
        portfolio: {
          industry: 'VIDEO PRODUCTION',
          service: 'MOTION GRAPHICS',
          bio: 'Bringing stories to life through cinematic video and dynamic motion graphics. I edit commercials, YouTube content, and promotional material.',
          skills: ['Premiere Pro', 'After Effects', 'Color Grading', 'Animation'],
          colorTheme: 'Purple',
          avatar: 'https://i.pravatar.cc/150?img=53',
          isPublished: true
        }
      },
      {
        username: 'emilyaudio',
        email: 'emily@example.com',
        password,
        mobile: '+44 7700 888888',
        linkedin: 'https://linkedin.com/in/emilyaudio',
        github: '',
        portfolio: {
          industry: 'AUDIO & MUSIC',
          service: 'SOUND DESIGN',
          bio: 'Creating immersive auditory experiences. I specialize in sound design for indie games, podcast editing, and custom lo-fi beats.',
          skills: ['Ableton Live', 'Mixing', 'Mastering', 'Foley'],
          colorTheme: 'Blue',
          avatar: 'https://i.pravatar.cc/150?img=44',
          isPublished: true
        }
      },
      {
        username: 'datadan',
        email: 'dan@example.com',
        password,
        mobile: '+1 (555) 444-5555',
        linkedin: 'https://linkedin.com/in/datadan',
        github: 'https://github.com/datadan',
        portfolio: {
          industry: 'DATA SCIENCE',
          service: 'MACHINE LEARNING',
          bio: 'Turning messy data into actionable insights. I build predictive models, recommendation engines, and dynamic data visualization dashboards.',
          skills: ['Python', 'TensorFlow', 'SQL', 'Tableau'],
          colorTheme: 'Orange',
          avatar: 'https://i.pravatar.cc/150?img=33',
          isPublished: true
        }
      },
      {
        username: 'jessicaconsults',
        email: 'jessica@example.com',
        password,
        mobile: '+1 (555) 666-7777',
        linkedin: 'https://linkedin.com/in/jessicaconsults',
        github: '',
        portfolio: {
          industry: 'CONSULTING',
          service: 'BUSINESS STRATEGY',
          bio: 'I help early-stage startups scale efficiently. From go-to-market strategies to operational workflows, I provide actionable roadmaps for success.',
          skills: ['Strategy', 'Operations', 'Leadership', 'Agile'],
          colorTheme: 'Green',
          avatar: 'https://i.pravatar.cc/150?img=32',
          isPublished: true
        }
      },
      {
        username: 'mikeother',
        email: 'mike@example.com',
        password,
        mobile: '+1 (555) 999-0000',
        linkedin: 'https://linkedin.com/in/mikeother',
        github: '',
        portfolio: {
          industry: 'OTHER',
          service: '3D MODELING',
          bio: 'Creating low-poly and high-poly 3D assets for games and AR/VR applications. Expert in optimizing topology for real-time rendering.',
          skills: ['Blender', 'Maya', 'ZBrush', 'Unity'],
          colorTheme: 'Purple',
          avatar: 'https://i.pravatar.cc/150?img=14',
          isPublished: true
        }
      }
    ];

    await User.insertMany(sampleUsers);
    console.log('Sample users with portfolios inserted successfully');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
};

mongoose.connect(MONGODB_URI).then(seedData);
