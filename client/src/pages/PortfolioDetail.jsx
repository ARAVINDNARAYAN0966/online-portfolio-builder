import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`/api/portfolios/${id}`);
        setData(res.data);
      } catch (err) {
        setError('Portfolio not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  if (loading) {
    return <div className="content-pad" style={{ textAlign: 'center', marginTop: '3rem' }}>Loading portfolio...</div>;
  }

  if (error || !data || !data.portfolio) {
    return (
      <div className="content-pad" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>{error}</h2>
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>Back Home</Link>
      </div>
    );
  }

  const { portfolio, username, email, mobile, linkedin, github, website } = data;

  return (
    <div className="content-pad">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', '--theme-color': portfolio.colorTheme === 'blue' ? '#3b82f6' : '#a855f7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <img src={portfolio.avatar} alt={username} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{username}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{portfolio.service} • {portfolio.industry}</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>About Me</h3>
          <p style={{ marginTop: '0.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{portfolio.bio}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Skills</h3>
          <div className="skills-list" style={{ marginTop: '0.5rem' }}>
            {portfolio.skills?.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3>Contact & Links</h3>
          <div className="social-links" style={{ marginTop: '0.5rem', gap: '1.5rem', fontSize: '1rem' }}>
            <a href={`mailto:${email}`}>{email}</a>
            {mobile && <span>{mobile}</span>}
            {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {github && <a href={github} target="_blank" rel="noreferrer">GitHub</a>}
            {website && <a href={website} target="_blank" rel="noreferrer">Website</a>}
          </div>
        </div>

        {portfolio.projects && portfolio.projects.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {portfolio.projects.map((proj, i) => (
                <div key={i} style={{ background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {proj.imageUrl && (
                    <img src={proj.imageUrl} alt={proj.title} loading="lazy" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{proj.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{proj.description}</p>
                    {proj.websiteLink && (
                      <a href={proj.websiteLink} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--theme-color)' }}>
                        View Project &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
