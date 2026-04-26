import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/profile');
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user", error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    setToken(res.data.token);
  };

  const register = async (username, email, password) => {
    const res = await axios.post('/api/auth/register', { username, email, password });
    setToken(res.data.token);
  };

  const logout = () => {
    setToken(null);
  };

  const updateProfile = async (data) => {
    const res = await axios.put('/api/profile', data);
    setUser(res.data.user);
  };

  const updatePortfolio = async (data) => {
    const res = await axios.put('/api/portfolio', data);
    fetchUser(); // Refresh user data to get updated portfolio
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, updatePortfolio }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
