import express from 'express';
import {
  getOrCreateConversation,
  sendMessage,
  streamMessage,
  getConversationHistory,
  endConversation,
  getChatbotResponse,
  getTravelRecommendations,
  createItinerary
} from '../controller/chatbotController.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// Public chatbot endpoint (no auth)
router.post('/chat', getChatbotResponse);

// Protect all following routes with JWT verification
router.use(verifyJWT);

// Conversation management
router.post('/conversation', getOrCreateConversation);
router.post('/message', sendMessage);
router.post('/stream', streamMessage);
router.get('/history', getConversationHistory);
router.post('/end', endConversation);

// Additional protected features
router.post('/recommendations', getTravelRecommendations);
router.post('/itinerary', createItinerary);

export default router;
