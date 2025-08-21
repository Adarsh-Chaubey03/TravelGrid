import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUmbrellaBeach, FaUtensils, FaLock, FaBus } from "react-icons/fa";

const TravelTips = ({ city }) => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (!city) {
      // Default tips
      setTips([
        { id: 1, icon: <FaUmbrellaBeach />, text: "Best time to visit: March – May for pleasant weather." },
        { id: 2, icon: <FaUtensils />, text: "Must-try food: Don’t miss the local street markets!" },
        { id: 3, icon: <FaLock />, text: "Safety tip: Always keep digital copies of important documents." },
        { id: 4, icon: <FaBus />, text: "Budget hack: Use local buses and metro for cheaper travel." },
      ]);
    } else {
      // ✅ Later we’ll connect to API. For now, show mock city-based tips.
      setTips([
        { id: 1, icon: <FaUmbrellaBeach />, text: `🌍 Welcome to ${city}! Explore its top attractions.` },
        { id: 2, icon: <FaUtensils />, text: `🍲 Must-try food in ${city}: Local specialties.` },
        { id: 3, icon: <FaLock />, text: "🔑 Pro tip: Keep your belongings safe while exploring." },
        { id: 4, icon: <FaBus />, text: "🚌 Use public transport for the best city experience." },
      ]);
    }
  }, [city]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl mx-auto bg-gradient-to-r from-pink-500/10 to-purple-600/10 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 mt-10"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        ✈️ Travel Tips {city && `for ${city}`}
      </h2>

      <ul className="space-y-4">
        {tips.map((tip) => (
          <motion.li
            key={tip.id}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-4 p-4 bg-white/20 rounded-lg shadow-sm cursor-pointer transition-all"
          >
            <span className="text-xl text-pink-500">{tip.icon}</span>
            <p className="text-gray-200 font-medium">{tip.text}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default TravelTips;