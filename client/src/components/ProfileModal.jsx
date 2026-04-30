import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

export default function ProfileModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    mobile: '',
    address: '',
    linkedin: '',
    github: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      axios.get('/api/auth/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        setFormData({
          mobile: res.data.mobile || '',
          address: res.data.address || '',
          linkedin: res.data.linkedin || '',
          github: res.data.github || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
      {loading ? <p>Loading...</p> : (
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Mobile Number</label>
            <input type="text" name="mobile" placeholder="e.g. +1 234 567 8900" className="modal-input" value={formData.mobile} onChange={handleChange} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Address</label>
            <input type="text" name="address" placeholder="e.g. New York, USA" className="modal-input" value={formData.address} onChange={handleChange} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">LinkedIn URL</label>
            <input type="text" name="linkedin" placeholder="https://linkedin.com/in/username" className="modal-input" value={formData.linkedin} onChange={handleChange} />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">GitHub URL</label>
            <input type="text" name="github" placeholder="https://github.com/username" className="modal-input" value={formData.github} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-primary-gradient">Save Profile</button>
        </form>
      )}
    </Modal>
  );
}
