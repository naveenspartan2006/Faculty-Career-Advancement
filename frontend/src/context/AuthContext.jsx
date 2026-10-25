import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch initial profile if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data.user);
          setFaculty(res.data.data.faculty);
        }
      } catch (err) {
        console.error('[Auth] Failed to restore session:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setFaculty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      // Fetch full faculty details
      if (userData.role === 'faculty') {
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setFaculty(meRes.data.data.faculty);
        }
      }
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      // Fetch profile
      if (newUser.role === 'faculty') {
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setFaculty(meRes.data.data.faculty);
        }
      }
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setFaculty(null);
  };

  const refreshFaculty = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        setFaculty(res.data.data.faculty);
      }
    } catch (err) {
      console.error('Failed to refresh faculty data:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        faculty,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshFaculty
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
