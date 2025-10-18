import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useTheme } from "../context/ThemeContext";
import { Sparkles, MapPin, Globe2, Hotel, Compass, Wallet } from "lucide-react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function Recommendation() {
  const [inputs, setInputs] = useState({
    interests: "",
    budget: "",
    location: "",
    type: "",
    hotel: "",
  });
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const handleChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { interests, budget, location, type, hotel } = inputs;
    if (!interests && !budget && !location && !type && !hotel) return;

    setLoading(true);
    setRecommendation("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You're a smart travel planner. Based on the user's preferences below, recommend ideal destinations, hotel types, and activities.

User Preferences:
- Interests: ${interests}
- Budget: ${budget}
- Location: ${location}
- Travel Type: ${type}
- Hotel Preferences: ${hotel}

Provide the suggestions in plain text (no markdown) with bullet points and short reasoning.
`;

      const result = await model.generateContent(prompt);
      const resText = await result.response.text();
      setRecommendation(resText.trim());
    } catch (err) {
      console.error("Gemini error:", err);
      setRecommendation("⚠️ Failed to generate travel suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-all duration-500 `}
    >
      <div className="flex-grow flex items-center justify-center py-24 px-6">
        <div
          className={`w-full max-w-4xl rounded-md p-10 border transition-all duration-500 shadow-2xl backdrop-blur-xl ${
            isDarkMode
              ? "bg-white/10 border-white/20 hover:border-pink-400/30"
              : "bg-white/80 border-gray-200 hover:border-pink-300/40"
          }`}
        >
          {/* --- Heading --- */}
          <div className="text-center mb-6">
            <h1
              className={`text-5xl font-semibold flex justify-center items-center gap-3 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500`}
            >
              <Globe2 className="w-8 h-8" /> Travel Recommendation Engine
            </h1>
            <p className="text-pink-600 dark:text-pink-400 text-sm tracking-wide">
              Get AI-powered personalized travel plans instantly ✨
            </p>
          </div>

          {/* --- Input Fields --- */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: Compass, placeholder: "Interests (e.g. beach, hiking)", key: "interests" },
              { icon: Wallet, placeholder: "Budget (e.g. ₹20k or $500)", key: "budget" },
              { icon: MapPin, placeholder: "Current location", key: "location" },
              { icon: Sparkles, placeholder: "Travel type (e.g. adventure, honeymoon)", key: "type" },
            ].map(({ icon: Icon, placeholder, key }) => (
              <div key={key} className="relative">
                <Icon
                  className={`absolute left-3 top-3.5 w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                />
                <input
                  className={`w-full pl-10 p-3 rounded-md border transition-all duration-300 focus:ring-2 focus:ring-pink-500/40 ${
                    isDarkMode
                      ? "bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300"
                  }`}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}
            <div className="relative md:col-span-2">
              <Hotel
                className={`absolute left-3 top-3.5 w-5 h-5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-500"
                }`}
              />
              <input
                className={`w-full pl-10 p-3 rounded-md border transition-all duration-300 focus:ring-2 focus:ring-pink-500/40 ${
                  isDarkMode
                    ? "bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300"
                }`}
                placeholder="Hotel preference (e.g. budget, luxury)"
                onChange={(e) => handleChange("hotel", e.target.value)}
              />
            </div>
          </div>

          {/* --- Button --- */}
          <div className="mt-8 flex justify-center">
            <button
              aria-label="Search"
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/30 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Get Recommendations"}
            </button>
          </div>

          {/* --- Output --- */}
          {recommendation && (
            <div
              className={`mt-10 rounded-2xl p-6 border shadow-lg transition-all duration-500 animate-fadeIn ${
                isDarkMode
                  ? "bg-white/10 border-white/20 text-gray-200"
                  : "bg-white/90 border-gray-200 text-gray-800"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-3 ${
                  isDarkMode ? "text-pink-400" : "text-pink-600"
                }`}
              >
                ✈️ Your Personalized Travel Suggestions:
              </h2>
              <div className="whitespace-pre-wrap leading-relaxed tracking-wide">
                {recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
