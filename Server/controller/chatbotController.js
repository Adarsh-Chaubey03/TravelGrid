import { ChatConversation } from '../models/chatConversation.js';
import { UserPreferences } from '../models/userPreferences.js';
import { User } from '../models/user.js';
import NLPProcessor from '../utils/nlpProcessor.js';
import { v4 as uuidv4 } from 'uuid';

// Use enhanced NLP processor
const analyzeSentiment = (text) => {
  return NLPProcessor.analyzeSentiment(text);
};

const extractEntities = (text) => {
  return NLPProcessor.extractEntities(text);
};

const classifyIntent = (text) => {
  return NLPProcessor.classifyIntent(text);
};

const disambiguateRequest = (text, context) => {
  return NLPProcessor.disambiguateRequest(text, context);
};

// Generate personalized response based on user preferences
const generatePersonalizedResponse = async (userId, message, context) => {
  try {
    // Get user preferences
    const userPreferences = await UserPreferences.findOne({ userId });
    const user = await User.findById(userId);
    
    // Classify intent
    const intents = classifyIntent(message);
    
    // Check for disambiguation needs
    const clarification = disambiguateRequest(message, context);
    if (clarification) {
      return clarification;
    }
    
    // Generate response based on intent
    let response = "";
    
    // Add personalization based on user preferences
    if (userPreferences) {
      // Adjust communication style based on user preferences
      const communicationStyle = userPreferences.communicationStyle || 'casual';
      
      // Add greeting based on communication style
      switch (communicationStyle) {
        case 'formal':
          response += "I'd be delighted to assist with your travel planning. ";
          break;
        case 'enthusiastic':
          response += "I'm excited to help with your travel planning! 🌟 ";
          break;
        case 'concise':
          response += "Happy to help with your travel plans. ";
          break;
        default: // casual
          response += "I'd be happy to help with your travel planning! ";
      }
      
      if (userPreferences.preferredDestinations && userPreferences.preferredDestinations.length > 0) {
        const destinations = userPreferences.preferredDestinations.slice(0, 2).join(' and ');
        switch (communicationStyle) {
          case 'formal':
            response += `I observe that you have previously expressed interest in destinations such as ${destinations}. `;
            break;
          case 'enthusiastic':
            response += `I remember you love places like ${destinations}! 🎉 `;
            break;
          case 'concise':
            response += `Noting your interest in ${destinations}. `;
            break;
          default: // casual
            response += `I see you've shown interest in places like ${destinations}. `;
        }
      }
      
      if (userPreferences.budgetRange) {
        switch (communicationStyle) {
          case 'formal':
            response += "I shall ensure that my recommendations align with your specified budgetary constraints. ";
            break;
          case 'enthusiastic':
            response += "I'll find amazing options that fit your budget! 💰 ";
            break;
          case 'concise':
            response += "Budget considerations will be applied. ";
            break;
          default: // casual
            response += "Based on your budget preferences, I can suggest options that fit your range. ";
        }
      }
      
      if (userPreferences.preferredActivities && userPreferences.preferredActivities.length > 0) {
        const activities = userPreferences.preferredActivities.slice(0, 2).join(' and ');
        switch (communicationStyle) {
          case 'formal':
            response += `I shall incorporate activities that align with your preferences, such as ${activities}. `;
            break;
          case 'enthusiastic':
            response += `I'll make sure to include fun activities like ${activities}! 🎉 `;
            break;
          case 'concise':
            response += `Including preferred activities: ${activities}. `;
            break;
          default: // casual
            response += `I'll make sure to include activities you enjoy, like ${activities}. `;
        }
      }
      
      // Adjust sentiment based on user's sentiment trend
      if (userPreferences.sentimentTrend === 'negative') {
        response += "I'm here to make your travel planning experience better. Let's find something that excites you! ";
      }
    } else {
      // Default response for new users
      response += "I'd be happy to help with your travel planning! As a new user, I'll learn your preferences as we chat. ";
    }
    
    // Add context-aware response
    if (context && Object.keys(context).length > 0) {
      response += "Based on our conversation so far, ";
      
      if (context.lastDestination) {
        response += `you were interested in ${context.lastDestination}. `;
      }
      
      if (context.lastActivity) {
        response += `You mentioned ${context.lastActivity} as an activity of interest. `;
      }
    }
    
    // Customize response based on intent
    if (intents.includes('destination_inquiry')) {
      response += "I can suggest some amazing destinations based on your interests. ";
    } else if (intents.includes('booking_inquiry')) {
      response += "I can help you find the best deals for your travel needs. ";
    } else if (intents.includes('itinerary_request')) {
      response += "I'd be happy to create a personalized itinerary for you. ";
    } else if (intents.includes('weather_inquiry')) {
      response += "I can provide weather information for your destinations. ";
    }
    
    // Add generic travel advice
    response += "What specific information would you like about your travel plans?";
    
    return response;
  } catch (error) {
    console.error('Error generating personalized response:', error);
    return "I'd be happy to help with your travel planning! What would you like to know?";
  }
};

// Create or get conversation
export const getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    let { sessionId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Generate a new session ID if not provided
    if (!sessionId) {
      sessionId = uuidv4();
    }
    
    // Try to find existing active conversation
    let conversation = await ChatConversation.findOne({ 
      userId, 
      sessionId, 
      isActive: true 
    });
    
    // If no active conversation, create a new one
    if (!conversation) {
      conversation = new ChatConversation({
        userId,
        sessionId,
        title: 'Travel Conversation'
      });
      await conversation.save();
    }
    
    res.status(200).json({
      conversationId: conversation._id,
      sessionId: conversation.sessionId,
      messages: conversation.messages,
      context: Object.fromEntries(conversation.context),
      preferences: Object.fromEntries(conversation.preferences)
    });
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send message and get response
export const sendMessage = async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;
    
    if (!userId || !sessionId || !message) {
      return res.status(400).json({ message: 'User ID, session ID, and message are required' });
    }
    
    // Find the conversation
    let conversation = await ChatConversation.findOne({ 
      userId, 
      sessionId, 
      isActive: true 
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Analyze sentiment, extract entities, and classify intent
    const sentiment = analyzeSentiment(message);
    const entities = extractEntities(message);
    const intents = classifyIntent(message);
    
    // Add user message to conversation
    const userMessage = {
      role: 'user',
      content: message,
      sentiment,
      entities,
      intents
    };
    
    conversation.messages.push(userMessage);
    
    // Update context based on entities
    if (entities.destinations && entities.destinations.length > 0) {
      conversation.context.set('lastDestination', entities.destinations[0]);
    }
    
    if (entities.activities && entities.activities.length > 0) {
      conversation.context.set('lastActivity', entities.activities[0]);
    }
    
    if (entities.dates && entities.dates.length > 0) {
      conversation.context.set('lastDate', entities.dates[0]);
    }
    
    if (entities.budgets && entities.budgets.length > 0) {
      conversation.context.set('lastBudget', entities.budgets[0]);
    }
    
    // Save updated conversation
    await conversation.save();
    
    // Generate AI response
    const aiResponse = await generatePersonalizedResponse(userId, message, Object.fromEntries(conversation.context));
    
    // Add AI response to conversation
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      sentiment: analyzeSentiment(aiResponse),
      entities: {},
      intents: []
    };
    
    conversation.messages.push(aiMessage);
    await conversation.save();
    
    // Update user preferences
    await updateUserPreferences(userId, message, entities);
    
    res.status(200).json({
      response: aiResponse,
      conversationId: conversation._id,
      messageId: aiMessage._id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send message with streaming response
export const streamMessage = async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;
    
    if (!userId || !sessionId || !message) {
      return res.status(400).json({ message: 'User ID, session ID, and message are required' });
    }
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();
    
    // Find the conversation
    let conversation = await ChatConversation.findOne({ 
      userId, 
      sessionId, 
      isActive: true 
    });
    
    if (!conversation) {
      res.write(`data: ${JSON.stringify({ error: 'Conversation not found' })}\n\n`);
      return res.end();
    }
    
    // Analyze sentiment, extract entities, and classify intent
    const sentiment = analyzeSentiment(message);
    const entities = extractEntities(message);
    const intents = classifyIntent(message);
    
    // Add user message to conversation
    const userMessage = {
      role: 'user',
      content: message,
      sentiment,
      entities,
      intents
    };
    
    conversation.messages.push(userMessage);
    
    // Update context based on entities
    if (entities.destinations && entities.destinations.length > 0) {
      conversation.context.set('lastDestination', entities.destinations[0]);
    }
    
    if (entities.activities && entities.activities.length > 0) {
      conversation.context.set('lastActivity', entities.activities[0]);
    }
    
    if (entities.dates && entities.dates.length > 0) {
      conversation.context.set('lastDate', entities.dates[0]);
    }
    
    if (entities.budgets && entities.budgets.length > 0) {
      conversation.context.set('lastBudget', entities.budgets[0]);
    }
    
    // Save updated conversation
    await conversation.save();
    
    // Generate AI response in chunks for streaming
    const aiResponse = await generatePersonalizedResponse(userId, message, Object.fromEntries(conversation.context));
    
    // Stream the response word by word
    const words = aiResponse.split(' ');
    let streamedResponse = '';
    
    // Send initial message
    res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
    
    // Stream each word with a small delay
    for (let i = 0; i < words.length; i++) {
      streamedResponse += (i > 0 ? ' ' : '') + words[i];
      
      res.write(`data: ${JSON.stringify({ 
        type: 'chunk', 
        content: words[i] + (i < words.length - 1 ? ' ' : ''),
        completeResponse: streamedResponse
      })}\n\n`);
      
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Add AI response to conversation
    const aiMessage = {
      role: 'assistant',
      content: streamedResponse,
      sentiment: analyzeSentiment(streamedResponse),
      entities: {},
      intents: []
    };
    
    conversation.messages.push(aiMessage);
    await conversation.save();
    
    // Update user preferences
    await updateUserPreferences(userId, message, entities);
    
    // Send end message
    res.write(`data: ${JSON.stringify({ 
      type: 'end', 
      conversationId: conversation._id, 
      messageId: aiMessage._id 
    })}\n\n`);
    
    res.end();
  } catch (error) {
    console.error('Error streaming message:', error);
    res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
    res.end();
  }
};

// Update user preferences based on conversation
const updateUserPreferences = async (userId, message, entities) => {
  try {
    let preferences = await UserPreferences.findOne({ userId });
    
    if (!preferences) {
      preferences = new UserPreferences({ userId });
    }
    
    // Update interaction count and last interaction
    preferences.interactionCount += 1;
    preferences.lastInteraction = new Date();
    
    // Update sentiment trend
    const sentiment = analyzeSentiment(message);
    preferences.sentimentTrend = sentiment;
    
    // Update preferences based on entities
    if (entities.destinations) {
      entities.destinations.forEach(dest => {
        if (!preferences.preferredDestinations.includes(dest)) {
          preferences.preferredDestinations.push(dest);
        }
      });
    }
    
    if (entities.activities) {
      entities.activities.forEach(activity => {
        if (!preferences.preferredActivities.includes(activity)) {
          preferences.preferredActivities.push(activity);
        }
      });
    }
    
    await preferences.save();
  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
};

// Get conversation history
export const getConversationHistory = async (req, res) => {
  try {
    const { userId, limit = 10 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const conversations = await ChatConversation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      conversations: conversations.map(conv => ({
        id: conv._id,
        sessionId: conv.sessionId,
        title: conv.title,
        createdAt: conv.createdAt,
        messageCount: conv.messages.length
      }))
    });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// End conversation
export const endConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;
    
    if (!conversationId) {
      return res.status(400).json({ message: 'Conversation ID is required' });
    }
    
    const conversation = await ChatConversation.findByIdAndUpdate(
      conversationId,
      { isActive: false },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.status(200).json({ message: 'Conversation ended successfully' });
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};