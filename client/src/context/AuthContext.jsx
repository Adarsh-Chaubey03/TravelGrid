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
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
