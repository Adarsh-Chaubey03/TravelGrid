import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SafetyContext = createContext();

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export const SafetyProvider = ({ children }) => {
  const { user } = useAuth();
  const [safetyProfile, setSafetyProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch safety profile
  const fetchSafetyProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/profile/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setSafetyProfile(data.profile);
      } else {
        throw new Error('Failed to fetch safety profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update safety profile
  const updateSafetyProfile = async (updates) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/profile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSafetyProfile(data.profile);
        return data;
      } else {
        throw new Error('Failed to update safety profile');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add trusted contact
  const addTrustedContact = async (contactData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/profile/${user._id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(contactData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSafetyProfile(data.profile);
        return data;
      } else {
        throw new Error('Failed to add trusted contact');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get safety alerts for a destination
  const getSafetyAlerts = async (destination) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/alerts?destination=${encodeURIComponent(destination)}`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts);
        return data;
      } else {
        throw new Error('Failed to fetch safety alerts');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get risk assessment for a destination
  const getRiskAssessment = async (destination) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/risk-assessment?destination=${encodeURIComponent(destination)}${user ? `&userId=${user._id}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        setRiskAssessment(data.assessment);
        return data;
      } else {
        throw new Error('Failed to fetch risk assessment');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Safety check-in
  const checkInSafety = async (destination, location = null) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          destination,
          location
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSafetyProfile(data.profile);
        return data;
      } else {
        throw new Error('Failed to check in');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Trigger SOS
  const triggerSOS = async (location = null, message = null) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/safety/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          location,
          message
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to trigger SOS');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get safety route
  const getSafetyRoute = async (start, end, waypoints = []) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        start,
        end,
        ...(waypoints.length > 0 && { waypoints: JSON.stringify(waypoints) })
      });
      
      const response = await fetch(`/api/safety/route?${params}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to calculate safety route');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize safety profile when user logs in
  useEffect(() => {
    if (user) {
      fetchSafetyProfile();
    } else {
      setSafetyProfile(null);
      setAlerts([]);
      setRiskAssessment(null);
    }
  }, [user]);

  const value = {
    safetyProfile,
    alerts,
    riskAssessment,
    loading,
    error,
    fetchSafetyProfile,
    updateSafetyProfile,
    addTrustedContact,
    getSafetyAlerts,
    getRiskAssessment,
    checkInSafety,
    triggerSOS,
    getSafetyRoute
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};