document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const portfolioGrid = document.getElementById('portfolioGrid');
    const industryFilters = document.querySelectorAll('#industryFilter li');
    const serviceFilters = document.querySelectorAll('#serviceFilter li');
    
    // Auth UI
    const loggedOutView = document.getElementById('loggedOutView');
    const loggedInView = document.getElementById('loggedInView');
    
    // Theme
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let isLightMode = localStorage.getItem('theme') === 'light';

    if (isLightMode) {
        document.body.classList.add('light-mode');
        themeToggleBtn.textContent = '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        isLightMode = !isLightMode;
        if (isLightMode) {
            document.body.classList.add('light-mode');
            themeToggleBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Modals
    const modals = {
        login: document.getElementById('loginModal'),
        signup: document.getElementById('signupModal'),
        profile: document.getElementById('profileModal'),
        portfolio: document.getElementById('portfolioModal')
    };

    function openModal(name) {
        modals[name].classList.add('active');
    }
    
    function closeModal(name) {
        // If it's a key in modals object, use it. Otherwise, assume it's the element ID directly.
        if (modals[name]) {
            modals[name].classList.remove('active');
        } else {
            const el = document.getElementById(name);
            if (el) el.classList.remove('active');
        }
    }

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.currentTarget.getAttribute('data-close'));
        });
    });

    // Button Listeners
    document.getElementById('openLoginBtn').addEventListener('click', () => openModal('login'));
    document.getElementById('openSignupBtn').addEventListener('click', () => openModal('signup'));
    document.getElementById('openProfileBtn').addEventListener('click', async () => {
        await loadProfile();
        openModal('profile');
    });
    document.getElementById('openPortfolioBtn').addEventListener('click', async () => {
        await loadProfile(); // to pre-fill portfolio data if exists
        openModal('portfolio');
    });
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        updateAuthUI();
    });

    let currentFilters = { industry: '', service: '' };

    const themeColors = {
        purple: { hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
        blue: { hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
        green: { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
        orange: { hex: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' }
    };

    function updateAuthUI() {
        const token = localStorage.getItem('token');
        if (token) {
            loggedOutView.classList.add('hidden');
            loggedInView.classList.remove('hidden');
        } else {
            loggedOutView.classList.remove('hidden');
            loggedInView.classList.add('hidden');
        }
    }

    // Auth API calls
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('susername').value;
        const email = document.getElementById('semail').value;
        const password = document.getElementById('spassword').value;

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                closeModal('signup');
                updateAuthUI();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Signup failed');
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('lusername').value;
        const password = document.getElementById('lpassword').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                closeModal('login');
                updateAuthUI();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Login failed');
        }
    });

    // Profile Logic
    async function loadProfile() {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const profile = await res.json();
            document.getElementById('pmobile').value = profile.mobile || '';
            document.getElementById('paddress').value = profile.address || '';
            document.getElementById('plinkedin').value = profile.linkedin || '';
            document.getElementById('pgithub').value = profile.github || '';

            if (profile.portfolio) {
                document.getElementById('findustry').value = profile.portfolio.industry || 'Design';
                document.getElementById('fservice').value = profile.portfolio.service || '';
                document.getElementById('fbio').value = profile.portfolio.bio || '';
                document.getElementById('fskills').value = (profile.portfolio.skills || []).join(', ');
                document.querySelector(`input[name="ftheme"][value="${profile.portfolio.colorTheme || 'purple'}"]`).checked = true;
            }
        }
    }

    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = {
            mobile: document.getElementById('pmobile').value,
            address: document.getElementById('paddress').value,
            linkedin: document.getElementById('plinkedin').value,
            github: document.getElementById('pgithub').value,
        };

        const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            closeModal('profile');
            fetchFreelancers(); // Update cards if their links changed
        } else {
            alert('Failed to update profile');
        }
    });

    // Portfolio Form Submission
    document.getElementById('portfolioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const data = {
            industry: document.getElementById('findustry').value,
            service: document.getElementById('fservice').value,
            bio: document.getElementById('fbio').value,
            skills: document.getElementById('fskills').value.split(',').map(s => s.trim()),
            colorTheme: document.querySelector('input[name="ftheme"]:checked').value,
            avatar: `https://i.pravatar.cc/150?u=${token}`
        };

        try {
            const res = await fetch('/api/portfolio', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                closeModal('portfolio');
                fetchFreelancers();
            } else {
                alert('Failed to publish portfolio. Please log in again.');
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Fetch and render Portfolios
    async function fetchFreelancers() {
        try {
            const query = new URLSearchParams();
            if (currentFilters.industry) query.append('industry', currentFilters.industry);
            if (currentFilters.service) query.append('service', currentFilters.service);

            const res = await fetch(`/api/portfolios?${query.toString()}`);
            const data = await res.json();
            renderGrid(data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    function renderGrid(data) {
        portfolioGrid.innerHTML = '';
        if (data.length === 0) {
            portfolioGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No portfolios published yet. Be the first!</p>';
            return;
        }

        data.forEach(freelancer => {
            const theme = themeColors[freelancer.colorTheme] || themeColors.purple;
            
            const card = document.createElement('div');
            card.className = 'card';
            card.style.setProperty('--theme-color', theme.hex);
            card.style.setProperty('--theme-color-glow', theme.glow);

            const skillsHtml = (freelancer.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('');
            
            let linksHtml = '';
            if (freelancer.linkedin) linksHtml += `<a href="${freelancer.linkedin}" target="_blank">LinkedIn</a>`;
            if (freelancer.github) linksHtml += `<a href="${freelancer.github}" target="_blank">GitHub</a>`;
            if (freelancer.mobile) linksHtml += `<span>${freelancer.mobile}</span>`;

            card.innerHTML = `
                <div class="card-header">
                    <img src="${freelancer.avatar || 'https://i.pravatar.cc/150'}" alt="${freelancer.name}" class="avatar">
                    <div class="user-info">
                        <h2>${freelancer.name}</h2>
                        <span class="user-title">${freelancer.service} • ${freelancer.industry}</span>
                    </div>
                </div>
                <p class="card-bio">${freelancer.bio}</p>
                <div class="skills-list">
                    ${skillsHtml}
                </div>
                <div class="social-links">
                    ${linksHtml}
                </div>
            `;
            portfolioGrid.appendChild(card);
        });
    }

    // Filters
    function handleFilterClick(e, filterType, elements) {
        if (e.target.tagName !== 'LI') return;
        
        elements.forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
        
        currentFilters[filterType] = e.target.getAttribute('data-value');
        fetchFreelancers();
    }

    industryFilters.forEach(li => li.addEventListener('click', (e) => handleFilterClick(e, 'industry', industryFilters)));
    serviceFilters.forEach(li => li.addEventListener('click', (e) => handleFilterClick(e, 'service', serviceFilters)));

    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input.type === 'password') {
                input.type = 'text';
                e.currentTarget.textContent = '🙈';
            } else {
                input.type = 'password';
                e.currentTarget.textContent = '👁️';
            }
        });
    });

    // Initialize
    updateAuthUI();
    fetchFreelancers();
});
