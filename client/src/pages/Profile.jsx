import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await axios.get(`/api/creators/${id}`);
        setCreator(response.data);
      } catch (err) {
        setError('Failed to fetch creator data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [id]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error || !creator) return <div className="loading" style={{color: 'red'}}>{error || 'Creator not found'}</div>;

  return (
    <div>
      <Link to="/" className="back-link">← Back to Marketplace</Link>
      
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-name">{creator.name}</h2>
          <div className="profile-category">{creator.category}</div>
        </div>

        <div className="profile-section">
          <h3>About</h3>
          <p className="profile-bio">{creator.bio}</p>
        </div>

        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skills-container">
            {creator.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Portfolio & Projects</h3>
          {creator.projects && creator.projects.length > 0 ? (
            <ul className="projects-list">
              {creator.projects.map((project, index) => (
                <li key={index} className="project-item">{project}</li>
              ))}
            </ul>
          ) : (
            <p style={{color: 'var(--text-secondary)'}}>No projects listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
