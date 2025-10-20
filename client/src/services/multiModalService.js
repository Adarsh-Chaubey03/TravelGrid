import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/multimodal`;

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * Multi-Modal Trip Planning Service
 * Handles API calls for multi-modal trip planning
 */

class MultiModalService {
  /**
   * Get transport options between two locations
   * @param {string} origin - Starting location
   * @param {string} destination - Ending location
   * @param {string} date - Travel date (YYYY-MM-DD)
   * @returns {Promise} Promise that resolves to transport options
   */
  async getTransportOptions(origin, destination, date) {
    try {
      const response = await api.get('/options', {
        params: { origin, destination, date }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transport options');
    }
  }

  /**
   * Get optimized itinerary based on route segments and preferences
   * @param {Array} routeSegments - Array of route segments
   * @param {Object} preferences - User preferences for optimization
   * @returns {Promise} Promise that resolves to optimized itinerary
   */
  async getOptimizedItinerary(routeSegments, preferences = {}) {
    try {
      const response = await api.post('/itinerary', {
        routeSegments,
        preferences
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create optimized itinerary');
    }
  }

  /**
   * Create a new transport option (admin only)
   * @param {Object} transportOption - Transport option data
   * @returns {Promise} Promise that resolves to created transport option
   */
  async createTransportOption(transportOption) {
    try {
      const response = await api.post('/transport-options', transportOption);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create transport option');
    }
  }

  /**
   * Get all transport options (admin only)
   * @returns {Promise} Promise that resolves to all transport options
   */
  async getAllTransportOptions() {
    try {
      const response = await api.get('/transport-options');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transport options');
    }
  }

  /**
   * Update a transport option (admin only)
   * @param {string} id - Transport option ID
   * @param {Object} updateData - Updated data
   * @returns {Promise} Promise that resolves to updated transport option
   */
  async updateTransportOption(id, updateData) {
    try {
      const response = await api.put(`/transport-options/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update transport option');
    }
  }

  /**
   * Delete a transport option (admin only)
   * @param {string} id - Transport option ID
   * @returns {Promise} Promise that resolves to deletion confirmation
   */
  async deleteTransportOption(id) {
    try {
      const response = await api.delete(`/transport-options/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete transport option');
    }
  }
}

export default new MultiModalService();