const axios = require('axios');

const BASE_URL = 'https://online-portfolio-builder-7xmq.onrender.com';

const seedLive = async () => {
  const dummyData = [
    {
      user: { username: 'SampleWriter', email: 'writer@sample.com', password: 'password123' },
      portfolio: {
        industry: 'Writing & Content',
        service: 'Copywriter',
        bio: 'I craft engaging stories and copy that converts. Over 4 years of content marketing experience.',
        skills: ['SEO', 'Blogging', 'Copywriting'],
        colorTheme: 'purple',
        projects: [
          { title: 'Tech Blog', description: 'Wrote 50+ articles for a tech startup.', imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500', websiteLink: '' }
        ]
      }
    },
    {
      user: { username: 'SampleVideo', email: 'video@sample.com', password: 'password123' },
      portfolio: {
        industry: 'Video Production',
        service: 'Video Editor',
        bio: 'Turning raw footage into cinematic masterpieces for YouTube and Social Media.',
        skills: ['Premiere Pro', 'After Effects', 'Color Grading'],
        colorTheme: 'blue',
        projects: [
          { title: 'Travel Vlog', description: 'Edited a viral travel vlog.', imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500', websiteLink: '' }
        ]
      }
    },
    {
      user: { username: 'SampleDesigner', email: 'design@sample.com', password: 'password123' },
      portfolio: {
        industry: 'Design',
        service: 'UI/UX Designer',
        bio: 'Designing beautiful and intuitive user experiences for modern web and mobile apps.',
        skills: ['Figma', 'Prototyping', 'User Research'],
        colorTheme: 'green',
        projects: [
          { title: 'E-commerce App', description: 'Designed a modern shopping experience.', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500', websiteLink: '' }
        ]
      }
    }
  ];

  try {
    for (const data of dummyData) {
      console.log(`Registering ${data.user.username}...`);
      
      let token;
      try {
        // Try to register
        const regRes = await axios.post(`${BASE_URL}/api/auth/register`, data.user);
        token = regRes.data.token;
      } catch (err) {
        // If user exists, login instead
        if (err.response && err.response.status === 400) {
          console.log(`User exists, logging in...`);
          const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, { username: data.user.username, password: data.user.password });
          token = loginRes.data.token;
        } else {
          throw err;
        }
      }

      console.log(`Updating portfolio for ${data.user.username}...`);
      await axios.put(`${BASE_URL}/api/portfolio`, data.portfolio, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`${data.user.username} portfolio created!`);
    }
    console.log('Finished seeding live database!');
  } catch (error) {
    console.error('Error seeding:', error.response ? error.response.data : error.message);
  }
};

seedLive();
