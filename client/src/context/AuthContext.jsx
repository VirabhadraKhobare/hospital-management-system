import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('hms_token'));
  const [user, setUser] = useState(() => {
    const value = localStorage.getItem('hms_user');
    return value ? JSON.parse(value) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('hms_token', token);
    } else {
      localStorage.removeItem('hms_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hms_user');
    }
  }, [user]);

  const login = async (payload) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', payload);
      setToken(data.token);
      setUser(data.user);
      toast.success('Welcome back');
      navigate('/dashboard');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  };

  const value = useMemo(() => ({
    token,
    user,
    role: user?.role || null,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
    setUser
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
