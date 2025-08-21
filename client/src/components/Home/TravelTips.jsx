import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TravelTips = () => {
  const tips = [
    "Always carry a power bank while exploring remote places.",
    "Use TravelGrid's guide filter to find locals who speak your language.",
    "Carry a digital copy of your ID and travel insurance.",
    "Ask your guide about lesser-known photo spots!",
    "Check local weather before finalizing your itinerary.",
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-6 bg-blue-100 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-blue-800">Travel Tip:</h2>
      <div className="h-16 mt-3 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-gray-700 text-base px-4"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TravelTips;
