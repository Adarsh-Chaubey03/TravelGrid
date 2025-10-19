import express from 'express';
import { 
  getOrCreateConversation, 
  sendMessage, 
  streamMessage,
  getConversationHistory,
  endConversation
} from '../controller/chatbotController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All chatbot routes require authentication
router.use(auth);

// Get or create a conversation
router.post('/conversation', getOrCreateConversation);

// Send a message and get response
router.post('/message', sendMessage);

// Send a message and stream response
router.post('/stream', streamMessage);

// Get conversation history
router.get('/history', getConversationHistory);

// End a conversation
router.post('/end', endConversation);

export default router;
import { getChatbotResponse, getTravelRecommendations, createItinerary } from '../controller/chatbotController.js';
import { verifyJWT as isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/chat').post(getChatbotResponse);

// Protected routes (require authentication)
router.route('/recommendations').post(isAuthenticated, getTravelRecommendations);
router.route('/itinerary').post(isAuthenticated, createItinerary);

export default router; 
