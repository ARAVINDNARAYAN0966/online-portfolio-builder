import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PortfolioModal({ activeModal, closeModal }) {
  const { user, updatePortfolio } = useAuth();
  
  const [formData, setFormData] = useState({
    industry: 'Design',
    service: '',
    bio: '',
    skills: '',
    colorTheme: 'purple',
    projects: []
  });

  useEffect(() => {
    if (user?.portfolio) {
      setFormData({
        industry: user.portfolio.industry || 'Design',
        service: user.portfolio.service || '',
        bio: user.portfolio.bio || '',
        skills: (user.portfolio.skills || []).join(', '),
        colorTheme: user.portfolio.colorTheme || 'purple',
        projects: user.portfolio.projects || []
      });
    }
  }, [user]);

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', imageUrl: '', websiteLink: '' }]
    }));
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const removeProject = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: newProjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        avatar: `https://i.pravatar.cc/150?u=${user._id}`
      };
      await updatePortfolio(submitData);
      closeModal();
    } catch (err) {
      alert('Failed to update portfolio');
    }
  };

  return (
    <div className={`modal-overlay ${activeModal === 'portfolio' ? 'active' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h2>Manage Portfolio</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Industry</label>
              <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} required>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing & Content</option>
                <option value="Video">Video Production</option>
                <option value="Audio">Audio & Music</option>
                <option value="Data">Data Science</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Service</label>
              <input type="text" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} required placeholder="e.g. UI/UX Design" />
            </div>
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea rows="3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} required placeholder="Tell clients about yourself..."></textarea>
          </div>
          
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} required placeholder="e.g. Figma, React, SEO" />
          </div>
          
          <div className="form-group">
            <label>Theme Color</label>
            <div className="theme-selector">
              {['purple', 'blue', 'green', 'orange'].map(color => (
                <label key={color}>
                  <input type="radio" name="ftheme" value={color} checked={formData.colorTheme === color} onChange={e => setFormData({...formData, colorTheme: e.target.value})} />
                  <span className="color-dot" style={{ background: `var(--${color})` }}></span> {color.charAt(0).toUpperCase() + color.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem', marginBottom: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Projects Showcase</h3>
              <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={addProject}>+ Add Project</button>
            </div>
            
            {formData.projects.map((proj, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', position: 'relative' }}>
                <button type="button" onClick={() => removeProject(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                <div className="form-group">
                  <label>Project Title</label>
                  <input type="text" value={proj.title} onChange={e => updateProject(index, 'title', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="2" value={proj.description} onChange={e => updateProject(index, 'description', e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="url" value={proj.imageUrl} onChange={e => updateProject(index, 'imageUrl', e.target.value)} placeholder="https://..." required />
                </div>
                <div className="form-group">
                  <label>Project Link</label>
                  <input type="url" value={proj.websiteLink || ''} onChange={e => updateProject(index, 'websiteLink', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary submit-btn">Publish / Update Portfolio</button>
        </form>
      </div>
    </div>
  );
}
