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

  // Fetch user from cookie session
  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Signup
  const signup = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      setUser(data.user);
      toast.success("Signup successful! 🎉");
      return { success: true };
    } catch (err) {
      return { success: false, error: "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // very important
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      setUser(data.user);
      toast.success("Login successful 👋");
      return { success: true };
    } catch (err) {
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast.success("Logged out 👋");
    } catch {
      toast.error("Logout failed");
    }
  };

  // Email verification functions
  const sendVerificationEmail = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Failed to send verification email" };
    }
  };

  const verifyEmailCode = async (email, code) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      // Update user state if verification successful
      if (data.user) {
        setUser(data.user);
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Failed to verify email" };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: "Failed to resend verification code" };
    }
  };

  const checkVerificationStatus = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/status?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || data.message };

      return { success: true, isVerified: data.isVerified };
    } catch (err) {
      return { success: false, error: "Failed to check verification status" };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      sendVerificationEmail,
      verifyEmailCode,
      resendVerificationCode,
      checkVerificationStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
