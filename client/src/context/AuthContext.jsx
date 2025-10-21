import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded API base URL - match server routes which are mounted under /api
  const API_BASE_URL = 'http://localhost:5000/api';

  // Helper function for consistent API calls with enhanced error handling
  const apiFetch = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (e) {
          // Fallback if the response is not valid JSON
          errorData.message = `HTTP Error: ${res.status} ${res.statusText}`;
        }
        
        // Return a structured error object with status code and message
        return { 
          success: false, 
          error: errorData.error || errorData.message || 'An unknown API error occurred.', 
          status: res.status 
        };
      }

      const data = await res.json();
      return { success: true, data, status: res.status };
    } catch (err) {
      // Handle network errors or unexpected exceptions
      return { success: false, error: 'Network error or an unexpected issue occurred.' };
    }
  };

  const fetchUser = async () => {
    setIsLoading(true);
    const { success, data, error, status } = await apiFetch('/auth/me', { method: 'GET' });
    if (success) {
      setUser(data.user);
    } else {
      console.error('Failed to fetch user:', error);
      setUser(null);
      // Clear token only for specific unauthorized statuses
      if (status === 401 || status === 403) {
        localStorage.removeItem('jwt_token'); 
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Signup
  const signup = async (userData) => {
    setIsLoading(true);
    const { success, data, error, status } = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setIsLoading(false);

    if (success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
      }
      toast.success("Signup successful! 🎉");
    } else {
      toast.error(error);
    }
    return { success, error, status };
  };

  // Login
  const login = async (credentials) => {
    setIsLoading(true);
    const { success, data, error, status } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setIsLoading(false);

    if (success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
      }
      toast.success("Login successful 👋");
    } else {
      // Provide more specific feedback for common login errors
      let errorMessage = error;
      if (status === 401) {
        errorMessage = "Invalid email or password.";
      }
      toast.error(errorMessage);
    }
    return { success, error, status };
  };

  // Logout (server exposes GET /api/auth/logout)
  const logout = async () => {
    const { success, error } = await apiFetch('/auth/logout', { method: 'GET' });
    if (success) {
      setUser(null);
      localStorage.removeItem('jwt_token');
      toast.success("Logged out 👋");
    } else {
      toast.error(error);
    }
    return { success, error };
  };

  // Password-related functions
  const resetPassword = async (email) => {
    const { success, data, error } = await apiFetch('/forgot-password/reset-password-token', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (success) {
      toast.success(data.message);
    } else {
      toast.error(error);
    }
    return { success, error };
  };

  const changePassword = async (password, confirmPassword, token) => {
    const { success, data, error } = await apiFetch('/forgot-password/reset-password', {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword, token }),
    });
    if (success) {
      toast.success(data.msg);
    } else {
      toast.error(error);
    }
    return { success, error };
  };


  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      // verification functions were removed intentionally; only expose implemented APIs
      resetPassword,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
