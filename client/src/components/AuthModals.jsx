import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModals({ activeModal, closeModal }) {
  const { login, register } = useAuth();
  
  const [lusername, setLusername] = useState('');
  const [lpassword, setLpassword] = useState('');
  
  const [susername, setSusername] = useState('');
  const [semail, setSemail] = useState('');
  const [spassword, setSpassword] = useState('');
  
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(lusername, lpassword);
      closeModal();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await register(susername, semail, spassword);
      closeModal();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <>
      {/* Login Modal */}
      <div className={`modal-overlay ${activeModal === 'login' ? 'active' : ''}`}>
        <div className="modal">
          <div className="modal-header">
            <h2>Login</h2>
            <button className="close-btn" onClick={closeModal}>&times;</button>
          </div>
          {error && <p style={{color: '#ef4444', marginBottom: '1rem'}}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={lusername} onChange={e => setLusername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={lpassword} onChange={e => setLpassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary submit-btn">Login</button>
          </form>
        </div>
      </div>

      {/* Signup Modal */}
      <div className={`modal-overlay ${activeModal === 'signup' ? 'active' : ''}`}>
        <div className="modal">
          <div className="modal-header">
            <h2>Sign Up</h2>
            <button className="close-btn" onClick={closeModal}>&times;</button>
          </div>
          {error && <p style={{color: '#ef4444', marginBottom: '1rem'}}>{error}</p>}
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={susername} onChange={e => setSusername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={semail} onChange={e => setSemail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={spassword} onChange={e => setSpassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary submit-btn">Create Account</button>
          </form>
        </div>
      </div>
    </>
  );
}
