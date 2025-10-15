import React, { createContext, useContext, useState, useCallback } from 'react';

// Create context for sharing dashboard statistics across components
// This allows multiple components to access and update dashboard data without prop drilling
const DashboardDataContext = createContext();

// Custom hook to access dashboard data context
// Provides a cleaner API for consuming components: const { tripCount, setTripCount } = useDashboardData()
export const useDashboardData = () => useContext(DashboardDataContext);

export const DashboardDataProvider = ({ children }) => {
  // State to track the number of planned trips
  // This is updated from TripsPlanned component and displayed on Dashboard
  const [tripCount, setTripCount] = useState(0);
  
  // State to track the number of saved places
  // This is updated from SavedPlaces component and displayed on Dashboard
  const [placeCount, setPlaceCount] = useState(0);
  
  // State to track the number of visited countries
  // This is updated from CountriesVisited component and displayed on Dashboard
  const [countryCount, setCountryCount] = useState(0);

  // 🚀 PERFORMANCE OPTIMIZATION: Memoize setter functions with useCallback
  // Why this is important:
  // - Without useCallback, new function references are created on every render
  // - Components using these setters in useEffect dependencies would re-run unnecessarily
  // - useCallback ensures stable function references across renders (referential equality)
  // - Only creates new function if dependencies change (empty array = never changes)
  // 
  // Performance impact:
  // - Prevents unnecessary re-renders in child components
  // - Prevents useEffect re-executions that depend on these setters
  // - Reduces memory allocations from function recreation
  const memoizedSetTripCount = useCallback((count) => {
    setTripCount(count); // Update trip count state with the provided value
  }, []); // Empty dependency array: function reference never changes

  const memoizedSetPlaceCount = useCallback((count) => {
    setPlaceCount(count); // Update place count state with the provided value
  }, []); // Empty dependency array: function reference never changes

  const memoizedSetCountryCount = useCallback((count) => {
    setCountryCount(count); // Update country count state with the provided value
  }, []); // Empty dependency array: function reference never changes

  return (
    // Provide both state values and memoized setter functions to all children
    // Components can destructure what they need: { tripCount, setTripCount }
    <DashboardDataContext.Provider value={{
      tripCount,
      setTripCount: memoizedSetTripCount, // Use memoized version for stable reference
      placeCount,
      setPlaceCount: memoizedSetPlaceCount, // Use memoized version for stable reference
      countryCount,
      setCountryCount: memoizedSetCountryCount // Use memoized version for stable reference
    }}>
      {children}
    </DashboardDataContext.Provider>
  );
};
