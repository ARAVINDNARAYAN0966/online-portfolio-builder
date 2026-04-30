import { useState, useEffect } from 'react';
import axios from 'axios';

function Home({ refreshTrigger, selectedIndustry }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get('/api/portfolios');
        setCreators(response.data);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, [refreshTrigger]);

  if (loading) return <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>Loading creators...</div>;

  const filteredCreators = creators.filter(user => {
    if (!selectedIndustry || selectedIndustry === 'All Industries') return true;
    return user.portfolio?.industry?.toUpperCase() === selectedIndustry.toUpperCase();
  });

  return (
    <div>
      <div className="hero-section">
        <h2 className="hero-title">
          Discover Top <span className="text-gradient">Freelancers</span> & Creators
        </h2>
        <p className="hero-subtitle">
          Browse colorful portfolios and find the perfect talent for your next big project.
        </p>
      </div>

      {filteredCreators.length === 0 ? (
        <div style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No creators found in this industry.</div>
      ) : (
        <div className="creators-grid">
          {filteredCreators.map(user => {
            const p = user.portfolio;
            const borderColors = {
              'Purple': '#a855f7',
              'Blue': '#3b82f6',
              'Green': '#10b981',
              'Orange': '#f97316'
            };
            const borderColor = borderColors[p.colorTheme] || '#a855f7';

            return (
              <div key={user._id} className="creator-card">
                <div className="card-top-border" style={{ backgroundColor: borderColor }}></div>
                
                <div className="card-header">
                  <img src={p.avatar || `https://i.pravatar.cc/150?u=${user._id}`} alt={user.username} className="avatar" />
                  <div className="header-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span className="username">{user.username}</span>
                      {p.country && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {p.country}</span>}
                    </div>
                    <span className="role-industry">{p.service} • {p.industry}</span>
                  </div>
                </div>
                
                <p className="bio">{p.bio}</p>
                
                <div className="skills-container">
                  {p.skills && p.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                
                <div className="card-footer">
                  {user.linkedin && user.linkedin !== '#' && (
                    <a href={user.linkedin} className="social-link" target="_blank" rel="noreferrer">LinkedIn</a>
                  )}
                  {user.linkedin === '#' && (
                    <span className="social-link" style={{cursor: 'pointer'}}>LinkedIn</span>
                  )}
                  
                  {user.github && user.github !== '#' && (
                    <a href={user.github} className="social-link" target="_blank" rel="noreferrer">GitHub</a>
                  )}
                  {user.github === '#' && (
                    <span className="social-link" style={{cursor: 'pointer'}}>GitHub</span>
                  )}
                  
                  {user.mobile && (
                    <span className="phone-text">{user.mobile}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
