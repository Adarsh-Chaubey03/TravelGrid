import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        console.log('Axios interceptor - Token from localStorage:', token ? 'Present' : 'Missing');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
        } else {
            console.log('No token found, request will be sent without Authorization header');
        }
        console.log('Axios request config:', {
            baseURL: config.baseURL,
            url: config.url,
            fullURL: `${config.baseURL}${config.url}`,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Axios interceptor error:', error);
        return Promise.reject(error);
    }
);

// Mood Board CRUD Operations
export const moodBoardService = {
    // Create a new mood board
    createMoodBoard: async (boardData) => {
        try {
            const response = await api.post('/moodboards', boardData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all mood boards for the current user
    getUserMoodBoards: async () => {
        try {
            console.log('moodBoardService.getUserMoodBoards called');
            console.log('Making request to:', `${API_BASE_URL}/moodboards/user`);
            const response = await api.get('/moodboards/user');
            console.log('getUserMoodBoards response:', response);
            return response.data;
        } catch (error) {
            console.error('getUserMoodBoards error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error.response?.data || error.message;
        }
    },

    // Get a specific mood board by ID
    getMoodBoardById: async (id) => {
        try {
            console.log('moodBoardService.getMoodBoardById called with ID:', id);
            console.log('Making request to:', `${API_BASE_URL}/moodboards/${id}`);
            const response = await api.get(`/moodboards/${id}`);
            console.log('getMoodBoardById response:', response);
            return response.data;
        } catch (error) {
            console.error('getMoodBoardById error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error.response?.data || error.message;
        }
    },

    // Update a mood board
    updateMoodBoard: async (id, updateData) => {
        try {
            const response = await api.put(`/moodboards/${id}`, updateData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete a mood board
    deleteMoodBoard: async (id) => {
        try {
            const response = await api.delete(`/moodboards/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get public mood boards
    getPublicMoodBoards: async () => {
        try {
            const response = await api.get('/moodboards/public');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Collaboration Operations
    addCollaborator: async (boardId, collaboratorData) => {
        try {
            const response = await api.post(`/moodboards/${boardId}/collaborators`, collaboratorData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateCollaboratorStatus: async (boardId, status) => {
        try {
            const response = await api.put(`/moodboards/${boardId}/collaborators/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    removeCollaborator: async (boardId, collaboratorId) => {
        try {
            const response = await api.delete(`/moodboards/${boardId}/collaborators/${collaboratorId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Messaging Operations
    addMessage: async (boardId, messageData) => {
        try {
            const response = await api.post(`/moodboards/${boardId}/messages`, messageData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Auto-save functionality
    autoSave: async (boardId, boardData) => {
        try {
            const response = await api.put(`/moodboards/${boardId}`, boardData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Export mood board as image
    exportMoodBoard: async (boardId, format = 'png', quality = 90) => {
        try {
            const response = await api.get(`/moodboards/${boardId}/export`, {
                params: { format, quality },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Real-time collaboration helpers
export const collaborationHelpers = {
    // Generate unique element ID
    generateElementId: () => `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

    // Check if user can edit board
    canEdit: (board, userId) => {
        if (!board || !userId) return false;
        if (board.owner?._id === userId || board.owner === userId) return true;
        const collaborator = board.collaborators?.find(c =>
            (c.userId?._id === userId || c.userId === userId) &&
            c.status === 'accepted' &&
            ['owner', 'editor'].includes(c.role)
        );
        return !!collaborator;
    },

    // Check if user can view board
    canView: (board, userId) => {
        if (!board) return false;
        if (board.isPublic) return true;
        if (!userId) return false;
        if (board.owner?._id === userId || board.owner === userId) return true;
        const collaborator = board.collaborators?.find(c =>
            (c.userId?._id === userId || c.userId === userId) &&
            c.status === 'accepted'
        );
        return !!collaborator;
    },

    // Get user role in board
    getUserRole: (board, userId) => {
        if (!board || !userId) return null;
        if (board.owner?._id === userId || board.owner === userId) return 'owner';
        const collaborator = board.collaborators?.find(c =>
            (c.userId?._id === userId || c.userId === userId)
        );
        return collaborator?.role || null;
    }
};

// Image handling helpers
export const imageHelpers = {
    // Validate image URL
    isValidImageUrl: (url) => {
        if (!url) return false;
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    },

    // Get image dimensions
    getImageDimensions: (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = url;
        });
    },

    // Generate thumbnail URL
    generateThumbnailUrl: (url, width = 200, height = 150) => {
        if (!url) return '';
        // For Unsplash images, we can generate thumbnails
        if (url.includes('unsplash.com')) {
            return `${url}?w=${width}&h=${height}&fit=crop`;
        }
        return url;
    }
};

export default moodBoardService;
