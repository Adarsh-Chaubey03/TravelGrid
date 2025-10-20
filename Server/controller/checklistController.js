import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.js";
import { Trip } from "../models/trips.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Context-aware prompt template for checklist generation
const CHECKLIST_PROMPT_TEMPLATE = `
You are an expert travel assistant helping users prepare for their trips. Generate a comprehensive packing and preparation checklist based on the following information:

Destination: {destination}
Travel Dates: {dates}
Duration: {duration} days
Weather: {weather}
Planned Activities: {activities}
User Preferences: {preferences}
Special Considerations: {considerations}

Please provide a well-organized checklist with these categories:
1. Documentation (passport, visas, tickets, reservations, insurance, etc.)
2. Clothing (based on weather and activities)
3. Toiletries and Personal Care
4. Electronics and Accessories
5. Medications and Health Items
6. Entertainment and Comfort Items
7. Miscellaneous Essentials

For each item, consider:
- Seasonal requirements
- Activity-specific needs
- Destination-specific considerations
- User's personal preferences and travel history

Format the response as a clean, organized list with categories clearly marked.
`;

// Function to get user context
const getUserContext = async (userId) => {
  if (!userId) return null;

  try {
    const user = await User.findById(userId).select('name email preferences travelHistory');
    return {
      user: user ? user.toObject() : null
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return null;
  }
};

// Function to get trip details
const getTripDetails = async (tripId) => {
  if (!tripId) return null;

  try {
    const trip = await Trip.findById(tripId).populate('destination');
    return trip ? trip.toObject() : null;
  } catch (error) {
    console.error('Error fetching trip details:', error);
    return null;
  }
};

// Main function to generate travel checklist
export const generateChecklist = asyncHandler(async (req, res) => {
  const {
    destination,
    startDate,
    endDate,
    activities = [],
    userId,
    tripId,
    weatherInfo,
    specialConsiderations = []
  } = req.body;

  if (!destination) {
    return res.status(400).json({
      success: false,
      message: "Destination is required"
    });
  }

  try {
    // Get user context
    const userContext = await getUserContext(userId);

    // Get trip details if tripId is provided
    const tripDetails = await getTripDetails(tripId);

    // Calculate duration
    let duration = "variable";
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    // Prepare preferences
    let preferences = "No specific preferences provided";
    if (userContext && userContext.user && userContext.user.preferences) {
      preferences = userContext.user.preferences.join(", ");
    }

    // Prepare activities string
    const activitiesStr = activities.length > 0 ? activities.join(", ") : "General travel";

    // Prepare special considerations string
    const considerationsStr = specialConsiderations.length > 0 ? specialConsiderations.join(", ") : "None specified";

    // Prepare weather info string
    const weatherStr = weatherInfo || "Weather information not available";

    // Construct the full prompt
    const fullPrompt = CHECKLIST_PROMPT_TEMPLATE
      .replace("{destination}", destination)
      .replace("{dates}", startDate && endDate ? startDate + " to " + endDate : "Dates not specified")
      .replace("{duration}", duration)
      .replace("{weather}", weatherStr)
      .replace("{activities}", activitiesStr)
      .replace("{preferences}", preferences)
      .replace("{considerations}", considerationsStr);

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const checklist = response.text();

    // Return the checklist
    res.status(200).json({
      success: true,
      checklist,
      context: {
        userContext,
        tripDetails
      }
    });
  } catch (error) {
    console.error('Checklist generation error:', error);
    res.status(500).json({
      success: false,
      message: "Sorry, I'm having trouble generating your checklist right now. Please try again in a moment.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Function to save checklist
export const saveChecklist = asyncHandler(async (req, res) => {
  const { userId, checklist, tripId, title } = req.body;

  if (!userId || !checklist) {
    return res.status(400).json({
      success: false,
      message: "User ID and checklist content are required"
    });
  }

  try {
    // In a real implementation, we would save the checklist to the database
    // For now, we'll just return a success response
    res.status(200).json({
      success: true,
      message: "Checklist saved successfully",
      checklistId: "temp-checklist-id"
    });
  } catch (error) {
    console.error('Save checklist error:', error);
    res.status(500).json({
      success: false,
      message: "Error saving checklist"
    });
  }
});

// Function to get saved checklists
export const getSavedChecklists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    // In a real implementation, we would fetch saved checklists from the database
    // For now, we'll just return an empty array
    res.status(200).json({
      success: true,
      checklists: []
    });
  } catch (error) {
    console.error('Get saved checklists error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching saved checklists"
    });
  }
});