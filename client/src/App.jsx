import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PortfolioDetail from './pages/PortfolioDetail';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuthModals from './components/AuthModals';
import ProfileModal from './components/ProfileModal';
import PortfolioModal from './components/PortfolioModal';
import { useAuth } from './context/AuthContext';

function App() {
  const [isLightMode, setIsLightMode] = useState(localStorage.getItem('theme') === 'light');
  const [activeModal, setActiveModal] = useState(null); // 'login', 'signup', 'profile', 'portfolio'
  const [currentFilters, setCurrentFilters] = useState({ industry: '', service: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, loading } = useAuth();

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  if (loading) return null; // Or a global spinner

  return (
    <div className="app-container">
      <Sidebar filters={currentFilters} setFilters={setCurrentFilters} />
      
      <main className="main-content">
        <Navbar 
          isLightMode={isLightMode} 
          setIsLightMode={setIsLightMode} 
          openModal={setActiveModal} 
        />
        
        <Routes>
          <Route path="/" element={<Home filters={currentFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} openModal={setActiveModal} />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
        </Routes>
      </main>

      {/* Modals */}
      <AuthModals activeModal={activeModal} closeModal={() => setActiveModal(null)} />
      {user && (
        <>
          <ProfileModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
          <PortfolioModal activeModal={activeModal} closeModal={() => setActiveModal(null)} />
        </>
      )}
    </div>
  );
}

export default App;
