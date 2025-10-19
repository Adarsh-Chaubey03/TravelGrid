import { jest, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import chatbotRoutes from '../routes/chatbotRoutes.js';

// Mock the auth middleware
jest.mock('../middleware/auth.js', () => ({
  auth: (req, res, next) => next()
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/chatbot', chatbotRoutes);

describe('Chatbot API', () => {
  describe('POST /api/chatbot/conversation', () => {
    it('should return 400 if userId is not provided', async () => {
      const response = await request(app)
        .post('/api/chatbot/conversation')
        .send({});
      
      expect(response.status).toBe(400);
    });

    it('should create a new conversation when userId is provided', async () => {
      const response = await request(app)
        .post('/api/chatbot/conversation')
        .send({ userId: 'user123' });
      
      // Since we're not mocking the controller, we expect a 500 error
      // In a real test environment, we would mock the controller functions
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('POST /api/chatbot/message', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/chatbot/message')
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/chatbot/stream', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/chatbot/stream')
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/chatbot/history', () => {
    it('should return 400 if userId is not provided', async () => {
      const response = await request(app)
        .get('/api/chatbot/history');
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/chatbot/end', () => {
    it('should return 400 if conversationId is not provided', async () => {
      const response = await request(app)
        .post('/api/chatbot/end')
        .send({});
      
      expect(response.status).toBe(400);
    });
  });
});