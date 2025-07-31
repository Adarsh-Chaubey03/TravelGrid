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

    // Check for stored user session on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('travelgrid_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('travelgrid_user');
            }
        }
        setIsLoading(false);
    }, []);

    // login logic using backend API
    const login = async (email, password) => {
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                localStorage.setItem('travelgrid_user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                setIsLoading(false);
                return { success: true };
            } else {
                setIsLoading(false);
                return { success: false, error: data.message };
            }
        } catch (err) {
            setIsLoading(false);
            return { success: false, error: 'Something went wrong' };
        }
    };

    const signup = async (userData) => {
        setIsLoading(true);

        try {
            // First register the user
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            if (!res.ok) {
                setIsLoading(false);
                return { success: false, error: data.message };
            }

            // Immediately login with the same credentials
            const loginRes = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password
                })
            });

            const loginData = await loginRes.json();

            if (loginRes.ok) {
                setUser(loginData.user);
                localStorage.setItem('travelgrid_user', JSON.stringify(loginData.user));
                localStorage.setItem('token', data.token);
                setIsLoading(false);
                return { success: true };
            } else {
                setIsLoading(false);
                return { success: false, error: loginData.message || 'Login failed after signup' };
            }

        } catch (err) {
            setIsLoading(false);
            return { success: false, error: 'Something went wrong during signup' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('travelgrid_user');
        localStorage.removeItem('token');
        toast.success('Logged out successfully 👋');
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('travelgrid_user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        login,
        signup,
        logout,
        updateUser,
        isLoading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


