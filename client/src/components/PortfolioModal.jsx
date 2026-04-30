import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { COUNTRIES } from '../utils/countries';

export default function PortfolioModal({ isOpen, onClose, onPortfolioUpdated }) {
  const [formData, setFormData] = useState({
    industry: '',
    service: '',
    bio: '',
    skills: '',
    colorTheme: 'Purple',
    country: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      axios.get('/api/auth/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        const p = res.data.portfolio || {};
        setFormData({
          industry: p.industry || '',
          service: p.service || '',
          bio: p.bio || '',
          skills: p.skills ? p.skills.join(', ') : '',
          colorTheme: p.colorTheme || 'Purple',
          country: p.country || ''
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
      await axios.put('/api/users/portfolio', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      onPortfolioUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Portfolio">
      {loading ? <p>Loading...</p> : (
        <form onSubmit={handleSubmit}>
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1.25rem'}}>
            <div style={{flex: 1}}>
              <label className="modal-label">Industry</label>
              <select name="industry" className="modal-input modal-select" value={formData.industry} onChange={handleChange}>
                <option value="">Select an industry...</option>
                <option value="DESIGN">Design</option>
                <option value="DEVELOPMENT">Development</option>
                <option value="MARKETING">Marketing</option>
                <option value="WRITING">Writing & Content</option>
                <option value="VIDEO PRODUCTION">Video Production</option>
                <option value="AUDIO & MUSIC">Audio & Music</option>
                <option value="DATA SCIENCE">Data Science</option>
                <option value="CONSULTING">Consulting</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label className="modal-label">Service</label>
              <input type="text" name="service" placeholder="e.g. UI/UX Design" className="modal-input" value={formData.service} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Country</label>
            <select name="country" className="modal-input modal-select" value={formData.country} onChange={handleChange}>
              <option value="">Select your country...</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Bio</label>
            <textarea name="bio" placeholder="Tell clients about yourself..." className="modal-input modal-textarea" value={formData.bio} onChange={handleChange}></textarea>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Skills (comma separated)</label>
            <input type="text" name="skills" placeholder="e.g. Figma, React, SEO" className="modal-input" value={formData.skills} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Theme Color</label>
            <div className="theme-options">
              <label className="theme-label">
                <input type="radio" name="colorTheme" value="Purple" checked={formData.colorTheme === 'Purple'} onChange={handleChange} className="theme-radio" style={{borderColor: '#a855f7'}} />
                Purple
              </label>
              <label className="theme-label">
                <input type="radio" name="colorTheme" value="Blue" checked={formData.colorTheme === 'Blue'} onChange={handleChange} className="theme-radio" style={{borderColor: '#3b82f6'}} />
                Blue
              </label>
              <label className="theme-label">
                <input type="radio" name="colorTheme" value="Green" checked={formData.colorTheme === 'Green'} onChange={handleChange} className="theme-radio" style={{borderColor: '#10b981'}} />
                Green
              </label>
              <label className="theme-label">
                <input type="radio" name="colorTheme" value="Orange" checked={formData.colorTheme === 'Orange'} onChange={handleChange} className="theme-radio" style={{borderColor: '#f97316'}} />
                Orange
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary-gradient">Publish / Update</button>
        </form>
      )}
    </Modal>
  );
}
