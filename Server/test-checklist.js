import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI (you'll need to set GEMINI_API_KEY in your environment)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test checklist prompt
const CHECKLIST_PROMPT = `
You are an expert travel assistant helping users prepare for their trips. Generate a comprehensive packing and preparation checklist based on the following information:

Destination: Bali, Indonesia
Travel Dates: 2025-12-01 to 2025-12-07
Duration: 7 days
Weather: Warm and tropical with possible rain showers
Planned Activities: Beach relaxation, temple visits, hiking, local food exploration
User Preferences: No specific preferences provided
Special Considerations: None specified

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

async function testChecklistGeneration() {
  try {
    console.log("Testing AI-powered checklist generation...");
    
    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(CHECKLIST_PROMPT);
    const response = await result.response;
    const checklist = response.text();
    
    console.log("Generated Checklist:");
    console.log("===================");
    console.log(checklist);
    
    return checklist;
  } catch (error) {
    console.error("Error generating checklist:", error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testChecklistGeneration()
    .then(() => console.log("Test completed successfully"))
    .catch(error => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

export default testChecklistGeneration;