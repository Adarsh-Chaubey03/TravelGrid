import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create context
const AuthContext = createContext();

// 2️⃣ AuthProvider component
export default function AuthProvider({ children }) {
  // Load user from localStorage (if any)
  const initialAuthUser = localStorage.getItem("Users");
  const [user, setUser] = useState(
    initialAuthUser ? JSON.parse(initialAuthUser) : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialAuthUser));

  // Example: login function
  const login = async (email, password) => {
    // Replace this with your real API call
    const mockUser = { email, name: "Yogeshwari", isEmailVerified: false, picture: "" };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("Users", JSON.stringify(mockUser));
    return { success: true };
  };

  // Example: logout function
  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("Users");
  };

  // Example: Google login
  const googleLogin = async (credential) => {
    try {
      // Replace with actual Google login logic
      const mockUser = { email: "googleuser@gmail.com", name: "Google User", isEmailVerified: true };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("Users", JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Google login failed" };
    }
  };

  // Example: send verification email
  const sendVerificationEmail = async (email) => {
    console.log("Sending verification email to:", email);
    return true;
  };

  // Automatically sync with localStorage if user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("Users", JSON.stringify(user));
    } else {
      localStorage.removeItem("Users");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        googleLogin,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3️⃣ Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);
