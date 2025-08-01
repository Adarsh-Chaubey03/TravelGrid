import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('travelgrid_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      const { token, user } = res.data;

      localStorage.setItem('travelgrid_user', JSON.stringify(user));
      localStorage.setItem('travelgrid_token', token);

      setUser(user);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', userData);

      const { token, user } = res.data;

      localStorage.setItem('travelgrid_user', JSON.stringify(user));
      localStorage.setItem('travelgrid_token', token);

      setUser(user);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return {
        success: false,
        error: err.response?.data?.message || 'Signup failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('travelgrid_user');
    localStorage.removeItem('travelgrid_token');
    setUser(null);
  };

  const deleteAccount = async () => {
  const token = localStorage.getItem('travelgrid_token');
  if (!token) return;

  try {
    await api.delete('/users/me/delete', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('travelgrid_user');
    localStorage.removeItem('travelgrid_token');
    setUser(null);
  } catch (error) {
    console.error('Failed to delete account:', error.response?.data?.message || error.message);
  }
};


  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    deleteAccount,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
