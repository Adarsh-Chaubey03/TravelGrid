import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTheme } from '../context/ThemeContext';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const cleanMarkdown = (text) => {
  return text
    .replace(/^#+\s?/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/[*`_~]/g, '')
    .trim();
};

export default function Summarizer() {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSummary('');

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You're an AI travel assistant. Based on the provided hotel or flight name and its description, generate a review summary with:

- Estimated Rating (out of 5)
- Customer Experience (1–2 lines)
- Pros (bulleted)
- Cons (bulleted)
- Overall Impression (1–2 lines)

Keep it structured and professional. No markdown formatting.

Input:
"${input}"
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();
      const cleaned = cleanMarkdown(rawText);
      setSummary(cleaned);
    } catch (error) {
      console.error('Gemini summarization failed:', error);
      setSummary('⚠️ Error generating summary. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col py-24 px-4`}>
      <div className="flex-grow flex items-center justify-center">
        <div className={`w-full max-w-3xl backdrop-blur-sm text-white p-10 rounded-2xl shadow-2xl border ${
          isDarkMode 
            ? 'bg-black border-pink-500' 
            : 'bg-white/90 border-pink-200 text-gray-900'
        }`}>
          <h1 className={`text-3xl font-semibold mb-2 flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <span role="img" aria-label="plane">✈️</span> AI Hotel & Flight Review Analyzer
          </h1>
          <p className={`mb-6 ${
            isDarkMode ? 'text-pink-200' : 'text-gray-600'
          }`}>
            Enter a hotel or flight name with brief details to generate a summarized analysis.
          </p>

          <textarea
            className={`w-full p-4 rounded-lg text-base focus:outline-none h-32 resize-none shadow-inner placeholder-gray-500 ${
              isDarkMode 
                ? 'bg-gray-700/50 border-1 text-white focus:border-pink-400 focus:ring-1' 
                : 'bg-gray-100 text-gray-900'
            }`}
            placeholder="e.g. Taj Hotel New Delhi - luxury hotel known for its service and ambience"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button aria-label="Search"
              onClick={handleSummarize}
              disabled={loading}
              className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? 'Analyzing...' : 'Analyze Review'}
            </button>
          </div>

          {summary && (
            <div className={`mt-8 p-6 rounded-xl whitespace-pre-wrap font-sans shadow-md leading-relaxed border ${
              isDarkMode 
                ? 'bg-[#0f1220] text-white border-pink-400' 
                : 'bg-gray-50 text-gray-800 border-pink-200'
            }`}>
              {summary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
