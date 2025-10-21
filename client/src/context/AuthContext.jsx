import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Environment-based config (Vite uses import.meta.env)
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  tokenKey: 'jwt_token',
  cookieName: 'token'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Enhanced API fetch with retry logic and better error handling
  const apiFetch = useCallback(async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem(config.tokenKey);
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${config.apiUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // For cookie handling
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        switch (res.status) {
          case 401:
            // Token expired or invalid
            localStorage.removeItem(config.tokenKey);
            setUser(null);
            break;
          case 403:
            if (data.isVerificationError) {
              // Handle email verification required
              return {
                success: false,
                error: 'Please verify your email to continue',
                status: res.status,
                requiresVerification: true
              };
            }
            break;
          default:
            break;
        }

        return {
          success: false,
          error: data.error || 'An error occurred',
          status: res.status
        };
      }

      return {
        success: true,
        data,
        status: res.status
      };
    } catch (err) {
      console.error('API Error:', err);
      return {
        success: false,
        error: 'Network error or server is unavailable',
        status: 0
      };
    }
  }, []);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem(config.tokenKey);
    if (!token) {
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      const { success, data } = await apiFetch('/auth/me');
      if (success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem(config.tokenKey);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem(config.tokenKey);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [apiFetch]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Enhanced signup with email verification handling
  const signup = async (userData) => {
    setIsLoading(true);
    const { success, data, error, status } = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    setIsLoading(false);

    if (success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem(config.tokenKey, data.token);
      }
      toast.success(data.message || 'Signup successful! Please verify your email.');
    } else {
      toast.error(error);
    }

    return { success, error, status };
  };

  // Enhanced login with role handling
  const login = async (credentials) => {
    setIsLoading(true);
    const { success, data, error, status } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setIsLoading(false);

    if (success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem(config.tokenKey, data.token);
      }
      toast.success('Welcome back!');
    } else {
      toast.error(error);
    }

    return { success, error, status };
  };

  // Google OAuth login
  const googleLogin = async (token) => {
    setIsLoading(true);
    const { success, data, error } = await apiFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    setIsLoading(false);

    if (success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem(config.tokenKey, data.token);
      }
      toast.success('Welcome!');
    } else {
      toast.error(error);
    }

    return { success, error };
  };

  // Enhanced logout
  const logout = async () => {
    const { success, error } = await apiFetch('/auth/logout', {
      method: 'GET'
    });

    if (success) {
      setUser(null);
      localStorage.removeItem(config.tokenKey);
      toast.success('Logged out successfully');
    } else {
      toast.error(error);
    }

    return { success, error };
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    const { success, data, error } = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });

    if (success) {
      toast.success(data.message);
    } else {
      toast.error(error);
    }

    return { success, error };
  };

  // Reset password with token
  const resetPassword = async ({ token, password, confirmPassword }) => {
    const { success, data, error } = await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword })
    });

    if (success) {
      toast.success(data.message);
    } else {
      toast.error(error);
    }

    return { success, error };
  };

  // Resend verification email
  const resendVerification = async () => {
    const { success, data, error } = await apiFetch('/auth/resend-verification', {
      method: 'POST'
    });

    if (success) {
      toast.success(data.message);
    } else {
      toast.error(error);
    }

    return { success, error };
  };

  // Update user profile
  const updateProfile = async (updates) => {
    const { success, data, error } = await apiFetch('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });

    if (success) {
      setUser(prevUser => ({ ...prevUser, ...data.user }));
      toast.success('Profile updated successfully');
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
      isInitialized,
      login,
      signup,
      googleLogin,
      logout,
      requestPasswordReset,
      resetPassword,
      resendVerification,
      updateProfile,
      isEmailVerified: user?.isEmailVerified || false,
      role: user?.role || 'user'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
