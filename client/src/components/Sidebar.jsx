import { Link } from 'react-router-dom';

export default function Sidebar({ filters, setFilters }) {
  const industries = ['Design', 'Development', 'Marketing', 'Writing & Content', 'Video Production', 'Audio & Music', 'Data Science', 'Consulting', 'Other'];
  const services = ['UI/UX Design', 'Full-Stack Web', 'Social Media', 'Illustration'];

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

      <div className="filter-section">
        <h3>Services</h3>
        <ul className="filter-list">
          <li 
            className={filters.service === '' ? 'active' : ''}
            onClick={() => handleFilter('service', '')}
          >Any Service</li>
          {services.map(srv => (
            <li 
              key={srv}
              className={filters.service === srv ? 'active' : ''}
              onClick={() => handleFilter('service', srv)}
            >{srv}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
