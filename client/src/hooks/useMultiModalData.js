import { useState, useEffect } from 'react';
import multiModalService from '../services/multiModalService';

/**
 * Custom hook for managing multi-modal trip planning data
 */
const useMultiModalData = () => {
  const [transportOptions, setTransportOptions] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch transport options between two locations
   * @param {string} origin - Starting location
   * @param {string} destination - Ending location
   * @param {string} date - Travel date (YYYY-MM-DD)
   */
  const fetchTransportOptions = async (origin, destination, date) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await multiModalService.getTransportOptions(origin, destination, date);
      setTransportOptions(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create optimized itinerary
   * @param {Array} routeSegments - Array of route segments
   * @param {Object} preferences - User preferences
   */
  const createOptimizedItinerary = async (routeSegments, preferences = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await multiModalService.getOptimizedItinerary(routeSegments, preferences);
      setItinerary(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear current itinerary
   */
  const clearItinerary = () => {
    setItinerary(null);
  };

  /**
   * Clear transport options
   */
  const clearTransportOptions = () => {
    setTransportOptions([]);
  };

  return {
    // Data
    transportOptions,
    itinerary,
    loading,
    error,
    
    // Functions
    fetchTransportOptions,
    createOptimizedItinerary,
    clearItinerary,
    clearTransportOptions
  };
};

export default useMultiModalData;