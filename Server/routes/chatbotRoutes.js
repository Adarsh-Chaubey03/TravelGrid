import express from 'express';
import { getChatbotResponse, getTravelRecommendations, createItinerary } from '../controller/chatbotController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/chat').post(getChatbotResponse);

// Protected routes (require authentication)
router.route('/recommendations').post(isAuthenticated, getTravelRecommendations);
router.route('/itinerary').post(isAuthenticated, createItinerary);

export default router;