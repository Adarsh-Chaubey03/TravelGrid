import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0f17] via-[#1f0f2f] to-[#1a051e] py-24 px-4">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl bg-[rgba(30, 10, 60, 0.95)] backdrop-blur-sm text-white p-10 rounded-2xl shadow-2xl border border-pink-500">
          <h1 className="text-3xl font-semibold mb-2 flex items-center gap-2">
            <span role="img" aria-label="globe">🌐</span> Travel Recommendation Engine
          </h1>
          <p className="text-pink-200 mb-6">
            Get personalized AI-based travel ideas based on your inputs.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="p-3 rounded-lg text-rgb(153,153,153) bg-white"
              placeholder="🌴 Interests (e.g. beach, hiking)"
              onChange={(e) => handleChange('interests', e.target.value)}
            />
            <input
              className="p-3 rounded-lg text-[rgb(153,153,153)] bg-white"
              placeholder="💰 Budget (e.g. ₹20k or $500)"
              onChange={(e) => handleChange('budget', e.target.value)}
            />
            <input
              className="p-3 rounded-lg text-[rgb(153,153,153)] bg-white"
              placeholder="📍 Current location"
              onChange={(e) => handleChange('location', e.target.value)}
            />
            <input
              className="p-3 rounded-lg text-[rgb(153,153,153)] bg-white"
              placeholder="🎯 Travel type (e.g. adventure, honeymoon)"
              onChange={(e) => handleChange('type', e.target.value)}
            />
            <input
              className="p-3 rounded-lg text-[rgb(153,153,153)] bg-white md:col-span-2"
              placeholder="🏨 Hotel preference (e.g. budget, luxury)"
              onChange={(e) => handleChange('hotel', e.target.value)}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
          </div>

          {recommendation && (
            <div className="mt-8 bg-[#0f1220] text-white p-6 rounded-xl whitespace-pre-wrap font-sans shadow-md leading-relaxed border border-pink-400">
              {recommendation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
