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
import { GoogleGenerativeAI } from "@google/generative-ai";
import TravelPackage from "../models/travelPackage.js";
import { MoodBoard } from "../models/moodBoard.js";
import { Music } from "../models/music.js";
import Destination from "../models/destinations.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Context-aware prompt templates
const PROMPT_TEMPLATES = {
  travel_planning: `
You are an expert travel assistant helping users plan trips. You have access to the following information:
- User preferences and travel history
- Available travel packages
- Mood boards for visual planning
- Music recommendations for travel moods
- Currency conversion information
- Destination details

When responding, be helpful, enthusiastic, and provide specific recommendations based on the user's needs.
If asked about specific features, provide detailed information and guide users on how to use them.
`,

  itinerary_creation: `
When helping users create itineraries, consider:
- Duration of trip
- User interests (adventure, relaxation, culture, food, etc.)
- Budget considerations
- Seasonal factors
- Local events and festivals
- Transportation options
- Accommodation recommendations
`,

  destination_info: `
When providing destination information, include:
- Key attractions and landmarks
- Local culture and customs
- Best times to visit
- Weather patterns
- Currency and payment methods
- Language information
- Safety considerations
- Local cuisine highlights
`,

  mood_board_integration: `
When integrating with mood boards:
- Help users visualize their travel dreams
- Suggest images, themes, and color palettes
- Recommend activities and experiences
- Connect with user's saved mood boards
`,

  music_recommendation: `
When recommending music:
- Match music to travel moods (adventure, relaxation, romance, etc.)
- Suggest local music from destinations
- Recommend playlists for different travel activities
- Connect with user's saved music preferences
`,

  currency_assistance: `
When helping with currency:
- Provide current exchange rates
- Offer budgeting tips
- Suggest payment methods
- Warn about fees and charges
- Recommend when to exchange currency
`
};

// Function to get user context
const getUserContext = async (userId) => {
  if (!userId) return null;

  try {
    const user = await User.findById(userId).select('name email preferences travelHistory');
    const moodBoards = await MoodBoard.find({ owner: userId }).limit(5);
    const savedPackages = []; // Would need to implement saved packages feature

    return {
      user: user ? user.toObject() : null,
      moodBoards: moodBoards.map(mb => ({
        id: mb._id,
        title: mb.title,
        themes: mb.themes,
        activities: mb.activities
      })),
      savedPackages
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
};

// Function to get relevant travel packages
const getRelevantPackages = async (query, limit = 5) => {
  try {
    const packages = await TravelPackage.find({
      $or: [
        { destination: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { activities: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(limit)
      .select('title destination duration price rating images');

    return packages;
  } catch (error) {
    console.error('Error fetching travel packages:', error);
    return [];
  }
};

// Function to get relevant destinations
const getRelevantDestinations = async (query, limit = 5) => {
  try {
    const destinations = await Destination.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(limit)
      .select('name country description images climate');

    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
};

// Function to get relevant music
const getRelevantMusic = async (query, limit = 5) => {
  try {
    const music = await Music.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { artist: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(limit)
      .select('title artist type duration');

    return music;
  } catch (error) {
    console.error('Error fetching music:', error);
    return [];
  }
};

// Function to categorize user intent
const categorizeIntent = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('plan') || lowerMessage.includes('itinerary') || lowerMessage.includes('schedule')) {
    return 'itinerary_creation';
  }

  if (lowerMessage.includes('package') || lowerMessage.includes('tour') || lowerMessage.includes('deal')) {
    return 'package_recommendation';
  }

  if (lowerMessage.includes('destination') || lowerMessage.includes('place') || lowerMessage.includes('visit')) {
    return 'destination_info';
  }

  if (lowerMessage.includes('mood') || lowerMessage.includes('board') || lowerMessage.includes('inspiration')) {
    return 'mood_board_integration';
  }

  if (lowerMessage.includes('music') || lowerMessage.includes('song') || lowerMessage.includes('playlist')) {
    return 'music_recommendation';
  }

  if (lowerMessage.includes('currency') || lowerMessage.includes('money') || lowerMessage.includes('exchange')) {
    return 'currency_assistance';
  }

  return 'general_travel_assistance';
};

// Main chatbot response function
export const getChatbotResponse = asyncHandler(async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required"
    });
  }

  try {
    // Get user context
    const userContext = await getUserContext(userId);

    // Categorize user intent
    const intent = categorizeIntent(message);

    // Get relevant data based on intent
    let contextData = {};

    if (intent === 'package_recommendation' || intent === 'itinerary_creation') {
      contextData.packages = await getRelevantPackages(message);
    }

    if (intent === 'destination_info') {
      contextData.destinations = await getRelevantDestinations(message);
    }

    if (intent === 'music_recommendation') {
      contextData.music = await getRelevantMusic(message);
    }

    // Construct the full prompt
    const fullPrompt = `
${PROMPT_TEMPLATES[intent] || PROMPT_TEMPLATES.travel_planning}

User Message: "${message}"

${userContext ? `User Context: ${JSON.stringify(userContext, null, 2)}` : 'No user context available'}

${Object.keys(contextData).length > 0 ? `Relevant Data: ${JSON.stringify(contextData, null, 2)}` : ''}

Please provide a helpful, concise response to the user's query.
`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Return the response
    res.status(200).json({
      success: true,
      response: text,
      intent: intent,
      context: {
        userContext,
        contextData
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Function to get travel recommendations
export const getTravelRecommendations = asyncHandler(async (req, res) => {
  const { userId, preferences = {} } = req.body;

  try {
    // Get user context
    const userContext = await getUserContext(userId);

    // Get recommendations based on preferences
    const recommendations = {
      packages: [],
      destinations: [],
      music: []
    };

    // Get packages based on user preferences
    if (preferences.interests && preferences.interests.length > 0) {
      const interestQuery = preferences.interests.join('|');
      recommendations.packages = await getRelevantPackages(interestQuery, 3);
    } else {
      recommendations.packages = await TravelPackage.find().limit(3).select('title destination duration price rating images');
    }

    // Get popular destinations
    recommendations.destinations = await Destination.find({ popular: true }).limit(3).select('name country description images climate');

    // Get music based on mood
    if (preferences.mood) {
      recommendations.music = await getRelevantMusic(preferences.mood, 3);
    } else {
      recommendations.music = await Music.find().limit(3).select('title artist type duration');
    }

    res.status(200).json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations"
    });
  }
});

// Function to create a travel itinerary
export const createItinerary = asyncHandler(async (req, res) => {
  const { destination, duration, interests, userId } = req.body;

  if (!destination || !duration || !interests) {
    return res.status(400).json({
      success: false,
      message: "Destination, duration, and interests are required"
    });
  }

  try {
    // Generate itinerary using AI
    const prompt = `
Create a detailed ${duration}-day travel itinerary for ${destination} focusing on ${interests.join(', ')}.
Include:
1. Daily schedule with morning, afternoon, and evening activities
2. Recommended accommodations
3. Local dining options
4. Transportation suggestions
5. Estimated costs
6. Tips for each day

Format the response in a clear, organized way with day-by-day breakdowns.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const itinerary = response.text();

    res.status(200).json({
      success: true,
      itinerary
    });
  } catch (error) {
    console.error('Itinerary creation error:', error);
    res.status(500).json({
      success: false,
      message: "Error creating itinerary"
    });
  }
});
