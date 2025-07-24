import React, { useState, useEffect } from 'react';
import { Lightbulb, X, RefreshCw } from 'lucide-react';

const TravelTips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tips = [
    {
      title: "Pack Smart",
      content: "Roll your clothes instead of folding to save 30% more space in your luggage.",
      category: "Packing"
    },
    {
      title: "Early Bird Savings",
      content: "Book flights on Tuesday afternoons for the best deals - airlines often release discounts then.",
      category: "Booking"
    },
    {
      title: "Local Currency",
      content: "Notify your bank before traveling to avoid card blocks in foreign countries.",
      category: "Finance"
    },
    {
      title: "Stay Connected",
      content: "Download offline maps and translation apps before you travel to save on roaming charges.",
      category: "Technology"
    },
    {
      title: "Travel Insurance",
      content: "Always get travel insurance - it's cheaper than one emergency room visit abroad.",
      category: "Safety"
    },
    {
      title: "Hydration",
      content: "Bring an empty water bottle through airport security and fill it up inside for free hydration.",
      category: "Health"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(interval);
  }, [tips.length]);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 max-w-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl p-4 z-40 animate-slideInLeft">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span className="font-semibold text-sm">Travel Tip</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={nextTip}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Next tip"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Close tips"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
          {tips[currentTip].category}
        </span>
        <h4 className="font-semibold text-sm">{tips[currentTip].title}</h4>
        <p className="text-sm text-blue-100 leading-relaxed">
          {tips[currentTip].content}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex space-x-1 mt-3">
        {tips.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index === currentTip ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TravelTips;
