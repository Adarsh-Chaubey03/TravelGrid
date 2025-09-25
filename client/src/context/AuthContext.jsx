
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { config } from '../config';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch user from cookie session
//   const fetchUser = async () => {
//     try {
//       console.log('AuthContext: fetchUser called');
//       // Try to get token from localStorage first
//       const token = localStorage.getItem('jwt_token');
//       console.log('AuthContext: Token from localStorage:', token ? 'Present' : 'Missing');

//       const res = await fetch(`${config.API_BASE_URL}/auth/me`, {
//         method: "GET",
//         credentials: "include",
//         headers: token ? {
//           "Authorization": `Bearer ${token}`
//         } : {}
//       });
//       console.log('AuthContext: /auth/me response status:', res.status);
//       const data = await res.json();
//       console.log('AuthContext: /auth/me response data:', data);
//       if (res.ok) {
//         console.log('AuthContext: Setting user:', data.user);
//         setUser(data.user);
//       } else {
//         console.log('AuthContext: /auth/me failed, clearing user');
//         setUser(null);
//       }
//     } catch (err) {
//       console.error("AuthContext: Auth check failed:", err);
//       setUser(null);
//     } finally {
//       console.log('AuthContext: fetchUser completed, setting isLoading to false');
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // Debug effect to track user and isAuthenticated changes
//   useEffect(() => {
//     console.log('AuthContext: user state changed:', user);
//   }, [user]);

//   useEffect(() => {
//     console.log('AuthContext: isAuthenticated state changed:', !!user);
//   }, [user]);

//   // Signup
//   const signup = async ({ name, email, password }) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${config.API_BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();
      
//       if (!res.ok) return { success: false, error: data.error || data.message };

//       setUser(data.user);
//       toast.success("Signup successful! 🎉");
//       return { success: true };
//     } catch (err) {
//       return { success: false, error: "Signup failed" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Login
//   const login = async (email, password) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${config.API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // very important
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) return { success: false, error: data.error || data.message };

//       // Store JWT token in localStorage
//       if (data.token) {
//         localStorage.setItem('jwt_token', data.token);
//       }

//       setUser(data.user);
//       toast.success("Login successful 👋");
//       return { success: true };
//     } catch (err) {
//       return { success: false, error: "Login failed" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       await fetch(`${config.API_BASE_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//       // Remove JWT token from localStorage
//       localStorage.removeItem('jwt_token');
//       setUser(null);
//       toast.success("Logged out 👋");
//     } catch {
//       toast.error("Logout failed");
//     }
//   };

//   // Email verification functions
//   const sendVerificationEmail = async (email) => {
//     try {
//       const res = await fetch(`${config.API_BASE_URL}/email/send-verification`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       if (!res.ok) return { success: false, error: data.error || data.message };

//       return { success: true, message: data.message };
//     } catch (err) {
//       return { success: false, error: "Failed to send verification email" };
//     }
//   };

//   const verifyEmailCode = async (email, code) => {
//     try {
//       const res = await fetch(`${config.API_BASE_URL}/email/verify-code`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, code }),
//       });

//       const data = await res.json();
//       if (!res.ok) return { success: false, error: data.error || data.message };

//       // Update user state if verification successful
//       if (data.user) {
//         setUser(data.user);
//       }

//       return { success: true, message: data.message };
//     } catch (err) {
//       return { success: false, error: "Failed to verify email" };
//     }
//   };

//   const resendVerificationCode = async (email) => {
//     try {
//       const res = await fetch(`${config.API_BASE_URL}/email/resend-code`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       if (!res.ok) return { success: false, error: data.error || data.message };
//       return { success: true, message: data.message };
//     } catch (err) {
//       return { success: false, error: "Failed to resend verification code" };
//     }
//   };

//   const checkVerificationStatus = async (email) => {
//     try {
//       const res = await fetch(`${config.API_BASE_URL}/email/status?email=${encodeURIComponent(email)}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (!res.ok) return { success: false, error: data.error || data.message };

//       return { success: true, isVerified: data.isVerified };
//     } catch (err) {
//       return { success: false, error: "Failed to check verification status" };
//     }
//   };

//     const resetPassword = async (email) => {
//       try {
//         const res = await fetch(`${config.API_BASE_URL}/forgot-password/reset-password-token`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ email }),
//         });

//         const data = await res.json();
//         if (!res.ok) return { success: false, error: data.error || data.message };

//         if (data.user) {
//           setUser(data.user);
//         }

//         return { success: true, message: data.message };
//       } catch (err) {
//         return { success: false, error: "Failed to Send reset link" };
//       }
//     };


// const changePassword = async (password, confirmPassword, token) => {
//   try {
//     const res = await fetch(`${config.API_BASE_URL}/forgot-password/reset-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ password, confirmPassword, token }),
//     });

//     const data = await res.json();
    
//     if (!res.ok) {
//       const error = new Error(data?.msg || "Password reset failed");
//       throw error;
//     }
//     return data.msg; 
//   } catch (err) {
//     throw err;
//   }
// };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isAuthenticated: !!user,
//       isLoading,
//       login,
//       signup,
//       logout,
//       sendVerificationEmail,
//       verifyEmailCode,
//       resendVerificationCode,
//       checkVerificationStatus,
//       resetPassword,
//       changePassword
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useState, useEffect, useContext } from "react";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
      console.error(err);
    } finally {
      setLoading(false);

  // Hardcoded API base URL, kept self-contained as requested
  const API_BASE_URL = 'http://localhost:5000/api/v1';

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

  // Logout
  const logout = async () => {
    const { success, error } = await apiFetch('/auth/logout', { method: 'POST' });
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

  // Email verification functions
  const sendVerificationEmail = async (email) => {
    const { success, data, error } = await apiFetch('/email/send-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (!success) toast.error(error);
    return { success, data, error };
  };

  const verifyEmailCode = async (email, code) => {
    const { success, data, error } = await apiFetch('/email/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    if (success && data.user) {
      setUser(data.user);
    }
    if (!success) toast.error(error);
    return { success, data, error };
  };

  const resendVerificationCode = async (email) => {
    const { success, data, error } = await apiFetch('/email/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (!success) toast.error(error);
    return { success, data, error };
  };

  const checkVerificationStatus = async (email) => {
    const { success, data, error } = await apiFetch(`/email/status?email=${encodeURIComponent(email)}`, { method: 'GET' });
    if (!success) toast.error(error);
    return { success, data, error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
