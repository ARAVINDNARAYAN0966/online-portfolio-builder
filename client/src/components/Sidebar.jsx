import { Link } from 'react-router-dom';

export default function Sidebar({ filters, setFilters }) {
  const industries = ['Design', 'Development', 'Marketing'];

  const handleFilter = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  return (
    <aside className="sidebar">
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        <span className="logo-icon">✨</span> CreatorPort
      </Link>
      
      <div className="filter-section">
        <h3>Filter by Industry</h3>
        <ul className="filter-list">
          <li 
            className={filters.industry === '' ? 'active' : ''} 
            onClick={() => handleFilter('industry', '')}
          >All Industries</li>
          {industries.map(ind => (
            <li 
              key={ind} 
              className={filters.industry === ind ? 'active' : ''}
              onClick={() => handleFilter('industry', ind)}
            >{ind}</li>
          ))}
        </ul>
      </div>

    </aside>
  );
}
