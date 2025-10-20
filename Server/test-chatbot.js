// Test script for chatbot functionality
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testChatbot() {
  try {
    console.log('Testing AI Travel Companion Chatbot...');
    
    // Test basic functionality
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = "Create a brief travel itinerary for a 3-day trip to Paris focusing on art and culture.";
    console.log(`Sending prompt: ${prompt}`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Response received:');
    console.log(text);
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error testing chatbot:', error.message);
    process.exit(1);
  }
}

// Run the test
testChatbot();