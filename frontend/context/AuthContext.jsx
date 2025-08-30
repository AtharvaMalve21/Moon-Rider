import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../src/api.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token, user } = await api.login({ email, password });
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { token, user } = await api.register({ name, email, password });
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const fetchMe = async () => {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
