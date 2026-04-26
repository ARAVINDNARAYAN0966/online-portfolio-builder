import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ activeModal, closeModal }) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ mobile: '', address: '', linkedin: '', github: '', website: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        mobile: user.mobile || '',
        address: user.address || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      closeModal();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className={`modal-overlay ${activeModal === 'profile' ? 'active' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h2>My Profile</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="e.g. +1 234 567 8900" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="e.g. New York, USA" />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input type="url" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} placeholder="https://github.com/username" />
          </div>
          <div className="form-group">
            <label>Personal Website</label>
            <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://yourwebsite.com" />
          </div>
          <button type="submit" className="btn btn-primary submit-btn">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
