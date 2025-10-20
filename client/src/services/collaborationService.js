// collaborationService.js
import axios from 'axios';

const API_BASE_URL = '/api';

// Enable collaboration for a trip
export const enableCollaboration = async (tripId, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/trips/${tripId}/collaboration`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enable collaboration');
  }
};

// Join a collaborative trip
export const joinCollaborativeTrip = async (collaborationToken, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/trips/collaborative/join`,
      { collaborationToken },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to join collaborative trip');
  }
};

// Get collaborative trip details
export const getCollaborativeTrip = async (collaborationToken) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/trips/collaborative/${collaborationToken}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch collaborative trip');
  }
};

// Update collaborative trip
export const updateCollaborativeTrip = async (collaborationToken, updates, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/trips/collaborative/${collaborationToken}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update collaborative trip');
  }
};

export default {
  enableCollaboration,
  joinCollaborativeTrip,
  getCollaborativeTrip,
  updateCollaborativeTrip
};