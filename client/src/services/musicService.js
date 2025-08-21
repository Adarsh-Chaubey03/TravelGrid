// Music Service for Travel Mood Music Player
// This service provides local music playback and playlist management

import { config } from '../config';
const API_BASE_URL = config.API_BASE_URL;

class MusicService {
  // Get all music with optional filters
  async getAllMusic(type = 'all', page = 1, limit = 20, search = '') {
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.append('type', type);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (search) params.append('search', search);

      const response = await fetch(`${API_BASE_URL}/music?${params}`);
      if (!response.ok) throw new Error('Failed to fetch music');

      return await response.json();
    } catch (error) {
      console.error('Error fetching music:', error);
      throw error;
    }
  }

  // Get music by ID
  async getMusicById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/music/${id}`);
      if (!response.ok) throw new Error('Failed to fetch music');

      return await response.json();
    } catch (error) {
      console.error('Error fetching music by ID:', error);
      throw error;
    }
  }

  // Upload new music (authentication optional)
  async uploadMusic(formData, token = null) {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Uploading music to:', `${API_BASE_URL}/music`);
      console.log('API_BASE_URL:', API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}/music`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload music');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading music:', error);
      throw error;
    }
  }

  // Update music
  async updateMusic(id, musicData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/music/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(musicData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update music');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating music:', error);
      throw error;
    }
  }

  // Delete music
  async deleteMusic(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/music/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete music');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting music:', error);
      throw error;
    }
  }

  // Toggle like on music
  async toggleLike(id, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/music/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle like');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Increment play count
  async incrementPlayCount(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/music/${id}/play`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to increment play count');
      }

      return await response.json();
    } catch (error) {
      console.error('Error incrementing play count:', error);
      throw error;
    }
  }

  // Get music statistics
  async getMusicStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/music/stats`);
      if (!response.ok) throw new Error('Failed to fetch music stats');

      return await response.json();
    } catch (error) {
      console.error('Error fetching music stats:', error);
      throw error;
    }
  }

  // Helper method to create FormData for upload
  createUploadFormData(title, artist, type, audioFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('type', type);
    formData.append('audio', audioFile);
    return formData;
  }

  // Helper method to get file duration (client-side estimation)
  async getAudioDuration(file) {
    return new Promise((resolve) => {
      const audio = new Audio();
      const reader = new FileReader();

      reader.onload = (e) => {
        audio.src = e.target.result;
        audio.addEventListener('loadedmetadata', () => {
          const duration = audio.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        });

        audio.addEventListener('error', () => {
          resolve("0:00"); // Default fallback
        });
      };

      reader.readAsDataURL(file);
    });
  }
}

export default new MusicService();
