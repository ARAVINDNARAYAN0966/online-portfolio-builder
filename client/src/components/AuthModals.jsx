import { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { Eye, EyeOff } from 'lucide-react';

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on mount
  useState(() => {
    const savedUser = localStorage.getItem('savedUsername');
    const savedPass = localStorage.getItem('savedPassword');
    if (savedUser && savedPass) {
      setFormData({ username: savedUser, password: savedPass });
      setRememberMe(true);
    }
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      
      if (rememberMe) {
        localStorage.setItem('savedUsername', formData.username);
        localStorage.setItem('savedPassword', formData.password);
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
      }

      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login">
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label className="modal-label">Username</label>
          <input type="text" name="username" className="modal-input" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              className="modal-input" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <div 
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="checkbox" 
            id="rememberMe" 
            checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="rememberMe" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
            Remember Me
          </label>
        </div>
        <button type="submit" className="btn-primary-gradient">Login</button>
      </form>
    </Modal>
  );
}

export function SignUpModal({ isOpen, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Password validation checks
  const hasLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[@$!%*?&]/.test(formData.password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  // Email validation check
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || formData.email === '';

  const isFormValid = formData.username && formData.email && isPasswordValid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please resolve the errors below before submitting.');
      return;
    }
    
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const checkColor = (isValid) => isValid ? '#10b981' : 'var(--text-secondary)';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up">
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label className="modal-label">Username</label>
          <input type="text" name="username" className="modal-input" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Email</label>
          <input 
            type="email" 
            name="email" 
            className="modal-input" 
            value={formData.email} 
            onChange={handleChange} 
            style={{ borderColor: !isEmailValid ? '#ef4444' : undefined }}
            required 
          />
          {!isEmailValid && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>Please enter a valid email address.</div>}
        </div>
        <div className="modal-form-group">
          <label className="modal-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              className="modal-input" 
              value={formData.password} 
              onChange={handleChange} 
              style={{ borderColor: formData.password && !isPasswordValid ? '#ef4444' : undefined }}
              required 
            />
            <div 
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ color: checkColor(hasLength) }}>✓ At least 8 characters</div>
            <div style={{ color: checkColor(hasUpper) }}>✓ One uppercase letter</div>
            <div style={{ color: checkColor(hasLower) }}>✓ One lowercase letter</div>
            <div style={{ color: checkColor(hasNumber) }}>✓ One number</div>
            <div style={{ color: checkColor(hasSpecial) }}>✓ One special character (@$!%*?&)</div>
          </div>
        </div>
        <button 
          type="submit" 
          className="btn-primary-gradient" 
          style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
          disabled={!isFormValid}
        >
          Create Account
        </button>
      </form>
    </Modal>
  );
}
