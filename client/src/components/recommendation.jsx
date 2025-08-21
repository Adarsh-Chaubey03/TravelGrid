import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTheme } from '../context/ThemeContext';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export default function Recommendation() {
  const [inputs, setInputs] = useState({
    interests: '',
    budget: '',
    location: '',
    type: '',
    hotel: '',
  });

  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const handleChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { interests, budget, location, type, hotel } = inputs;
    if (!interests && !budget && !location && !type && !hotel) return;

    setLoading(true);
    setRecommendation('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      console.error('Gemini error:', err);
      setRecommendation('⚠️ Failed to generate travel suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-all duration-300`}>
      <div className="flex-grow flex items-center justify-center py-24 px-4">
        <div className={`w-full max-w-3xl backdrop-blur-md rounded-2xl p-10 border transition-all duration-500 shadow-lg ${
          isDarkMode
            ? 'bg-white/10 border-white/20 hover:border-white/40 hover:shadow-pink-500/20'
            : 'bg-white/80 border-gray-200 hover:border-pink-300 hover:shadow-pink-500/20'
        }`}>
          <h1 className={`text-3xl font-semibold mb-2 flex items-center gap-2 transition-all duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <span role="img" aria-label="globe">🌐</span> Travel Recommendation Engine
          </h1>
          <p className="text-pink-600 dark:text-[#FF4081] mb-6">
            Get personalized AI-based travel ideas based on your inputs.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300'
              } border focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
              placeholder="🌴 Interests (e.g. beach, hiking)"
              onChange={(e) => handleChange('interests', e.target.value)}
            />
            <input
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300'
              } border focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
              placeholder="💰 Budget (e.g. ₹20k or $500)"
              onChange={(e) => handleChange('budget', e.target.value)}
            />
            <input
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300'
              } border focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
              placeholder="📍 Current location"
              onChange={(e) => handleChange('location', e.target.value)}
            />
            <input
              className={`p-3 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300'
              } border focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
              placeholder="🎯 Travel type (e.g. adventure, honeymoon)"
              onChange={(e) => handleChange('type', e.target.value)}
            />
            <input
              className={`p-3 rounded-lg transition-all duration-300 md:col-span-2 ${
                isDarkMode 
                  ? 'bg-white/20 border-white/20 text-white placeholder-gray-300 focus:border-white/40' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-pink-300'
              } border focus:outline-none focus:ring-2 focus:ring-pink-500/20`}
              placeholder="🏨 Hotel preference (e.g. budget, luxury)"
              onChange={(e) => handleChange('hotel', e.target.value)}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button aria-label="Search"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-shrink-0 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
          </div>

          {recommendation && (
            <div className={`mt-8 backdrop-blur-md rounded-xl p-6 transition-all duration-300 shadow-md leading-relaxed border ${
              isDarkMode
                ? 'bg-white/10 border-white/20 text-gray-300'
                : 'bg-white/80 border-gray-200 text-gray-900'
            }`}>
              <div className="whitespace-pre-wrap font-sans">
                {recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}