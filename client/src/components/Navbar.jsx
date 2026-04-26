import { useAuth } from '../context/AuthContext';

export default function Navbar({ isLightMode, setIsLightMode, openModal }) {
  const { user, logout } = useAuth();

  return (
    <nav className="top-nav">
      <button 
        className="theme-toggle" 
        onClick={() => setIsLightMode(!isLightMode)}
      >
        {isLightMode ? '🌙' : '☀️'}
      </button>

      {!user ? (
        <div className="auth-buttons">
          <button className="btn btn-outline" onClick={() => openModal('login')}>Login</button>
          <button className="btn btn-primary" onClick={() => openModal('signup')}>Sign Up</button>
        </div>
      ) : (
        <div className="auth-buttons">
          <button className="btn btn-outline" onClick={() => openModal('profile')}>My Profile</button>
          <button className="btn btn-primary" onClick={() => openModal('portfolio')}>Manage Portfolio</button>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
