import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home({ filters, searchTerm, setSearchTerm, openModal }) {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounced Search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPortfolios();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, filters]);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.industry) params.industry = filters.industry;
      if (filters.service) params.service = filters.service;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get('/api/portfolios', { params });
      setPortfolios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const themeColors = {
    purple: { hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
    blue: { hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
    green: { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    orange: { hex: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' }
  };

  return (
    <div className="content-pad">
      <header className="hero">
        <div className="hero-content">
          <h1>Discover Top <span className="text-gradient">Freelancers</span> & Creators</h1>
          <p>Browse colorful portfolios and find the perfect talent for your next big project.</p>
          <div style={{ marginTop: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Search by name or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', maxWidth: '400px', padding: '0.8rem 1rem', 
                borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--card-bg)', color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="portfolio-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card skeleton-loader" style={{ height: '300px', background: 'rgba(255,255,255,0.05)' }}></div>
          ))}
        </div>
      ) : (
        <section className="portfolio-grid">
          {portfolios.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>No portfolios found.</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Be the first to publish your portfolio in this category!</p>
              <button className="btn btn-primary" onClick={() => openModal('signup')}>Create Your Portfolio</button>
            </div>
          ) : (
            portfolios.map(p => {
              const theme = themeColors[p.colorTheme] || themeColors.purple;
              return (
                <Link to={`/portfolio/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card" style={{ '--theme-color': theme.hex, '--theme-color-glow': theme.glow }}>
                    <div className="card-header">
                      <img src={p.avatar || 'https://i.pravatar.cc/150'} alt={p.name} className="avatar" />
                      <div className="user-info">
                        <h2>{p.name}</h2>
                        <span className="user-title">{p.service} • {p.industry}</span>
                      </div>
                    </div>
                    <p className="card-bio">{p.bio}</p>
                    <div className="skills-list">
                      {(p.skills || []).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </section>
      )}
    </div>
  );
}
