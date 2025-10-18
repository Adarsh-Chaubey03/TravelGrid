import { GoogleGenerativeAI } from "@google/generative-ai";
import { TravelPackage } from "../models/travelPackage.js";
import { MoodBoard } from "../models/moodBoard.js";
import { Music } from "../models/music.js";
import { User } from "../models/user.js";
import { Destination } from "../models/destinations.js";
import asyncHandler from "../utils/asyncHandler.js";

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