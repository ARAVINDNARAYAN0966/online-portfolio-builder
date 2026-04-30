import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import { LoginModal, SignUpModal } from './components/AuthModals';
import ProfileModal from './components/ProfileModal';
import PortfolioModal from './components/PortfolioModal';

// Separate Sidebar Component
function Sidebar({ selectedIndustry, setSelectedIndustry }) {
  const industries = [
    'All Industries', 'Design', 'Development', 'Marketing', 
    'Writing', 'Video Production', 'Audio & Music', 
    'Data Science', 'Consulting', 'Other'
  ];

  return (
    <aside className="sidebar">
      <a href="/" style={{textDecoration: 'none'}} onClick={() => setSelectedIndustry('All Industries')}>
        <div className="brand">
          <Sparkles size={24} />
          CreatorPort
        </div>
      </a>

      <div className="sidebar-section">
        <div className="sidebar-title">Filter by Industry</div>
        <nav className="sidebar-nav">
          {industries.map(industry => (
            <button 
              key={industry}
              className={`sidebar-link ${selectedIndustry === industry ? 'active' : ''}`}
              onClick={() => setSelectedIndustry(industry)}
            >
              {industry === 'Writing' ? 'Writing & Content' : industry}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'login', 'signup', 'profile', 'portfolio'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check if user has a token on load
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const closeModal = () => setActiveModal(null);
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePortfolioUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} />
        <div className="main-wrapper">
          <header className="navbar">
            <div onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? (
                <Sun size={20} style={{ color: '#fbbf24', cursor: 'pointer' }} />
              ) : (
                <Moon size={20} style={{ color: '#475569', cursor: 'pointer' }} />
              )}
            </div>
            
            {isLoggedIn ? (
              <>
                <button className="btn-outline" onClick={() => setActiveModal('profile')}>My Profile</button>
                <button className="btn-primary-gradient" style={{width: 'auto', marginTop: 0, padding: '0.5rem 1.25rem'}} onClick={() => setActiveModal('portfolio')}>Create/Edit Portfolio</button>
                <span className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
              </>
            ) : (
              <>
                <span className="nav-link" onClick={() => setActiveModal('login')} style={{ cursor: 'pointer' }}>Login</span>
                <button className="btn-signup" onClick={() => setActiveModal('signup')}>Sign Up</button>
              </>
            )}

          </header>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home refreshTrigger={refreshTrigger} selectedIndustry={selectedIndustry} />} />
            </Routes>
          </main>
        </div>
      </div>

      <LoginModal isOpen={activeModal === 'login'} onClose={closeModal} onLoginSuccess={handleLoginSuccess} />
      <SignUpModal isOpen={activeModal === 'signup'} onClose={closeModal} onLoginSuccess={handleLoginSuccess} />
      <ProfileModal isOpen={activeModal === 'profile'} onClose={closeModal} />
      <PortfolioModal isOpen={activeModal === 'portfolio'} onClose={closeModal} onPortfolioUpdated={handlePortfolioUpdated} />
    </BrowserRouter>
  );
}

export default App;
