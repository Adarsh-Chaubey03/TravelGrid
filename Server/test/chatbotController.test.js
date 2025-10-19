import { jest, expect } from '@jest/globals';
import { ChatConversation } from '../models/chatConversation.js';
import { UserPreferences } from '../models/userPreferences.js';
import { 
  getOrCreateConversation, 
  sendMessage, 
  streamMessage,
  getConversationHistory,
  endConversation 
} from '../controller/chatbotController.js';
import NLPProcessor from '../utils/nlpProcessor.js';

// Mock the models
jest.mock('../models/chatConversation.js');
jest.mock('../models/userPreferences.js');
jest.mock('../utils/nlpProcessor.js');

describe('Chatbot Controller', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      write: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      flushHeaders: jest.fn().mockReturnThis()
    };
  });

  describe('getOrCreateConversation', () => {
    it('should return 400 if userId is not provided', async () => {
      mockRequest.body = {};
      
      await getOrCreateConversation(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User ID is required' });
    });

    it('should create a new conversation if none exists', async () => {
      mockRequest.body = { userId: 'user123' };
      
      ChatConversation.findOne.mockResolvedValue(null);
      ChatConversation.prototype.save = jest.fn().mockResolvedValue(true);
      
      await getOrCreateConversation(mockRequest, mockResponse);
      
      expect(ChatConversation).toHaveBeenCalled();
      expect(ChatConversation.prototype.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('sendMessage', () => {
    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = {};
      
      await sendMessage(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should process message and return response', async () => {
      mockRequest.body = {
        userId: 'user123',
        sessionId: 'session123',
        message: 'Hello, I want to plan a trip to Paris'
      };
      
      ChatConversation.findOne.mockResolvedValue({
        _id: 'conv123',
        userId: 'user123',
        sessionId: 'session123',
        messages: [],
        context: new Map(),
        save: jest.fn().mockResolvedValue(true)
      });
      
      NLPProcessor.analyzeSentiment.mockReturnValue('neutral');
      NLPProcessor.extractEntities.mockReturnValue({ destinations: ['Paris'] });
      NLPProcessor.classifyIntent.mockReturnValue(['destination_inquiry']);
      
      await sendMessage(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('NLPProcessor', () => {
    it('should analyze sentiment correctly', () => {
      const positiveText = 'This is an amazing trip idea!';
      const negativeText = 'This is a terrible plan.';
      const neutralText = 'I am planning a trip.';
      
      expect(NLPProcessor.analyzeSentiment(positiveText)).toBe('positive');
      expect(NLPProcessor.analyzeSentiment(negativeText)).toBe('negative');
      expect(NLPProcessor.analyzeSentiment(neutralText)).toBe('neutral');
    });

    it('should extract entities correctly', () => {
      const text = 'I want to visit Paris from June 15-20 with a budget of $1000 for sightseeing and shopping';
      
      const entities = NLPProcessor.extractEntities(text);
      
      expect(entities.destinations).toContain('Paris');
      expect(entities.activities).toEqual(expect.arrayContaining(['sightseeing', 'shopping']));
    });

    it('should classify intent correctly', () => {
      const text = 'Can you recommend some places to visit in Paris?';
      
      const intents = NLPProcessor.classifyIntent(text);
      
      expect(intents).toContain('destination_inquiry');
    });
  });
});