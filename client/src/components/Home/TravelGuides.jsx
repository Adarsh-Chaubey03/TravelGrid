import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const guides = [
  {
    name: "Aarav Mehta",
    expertise: "Himalayan Treks",
    bio: "Certified mountain guide with 10+ years of experience leading treks in the Indian Himalayas.",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    name: "Sofia Rossi",
    expertise: "Italian Cities & Culture",
    bio: "Passionate about art, food, and history. Fluent in English and Italian. Rome-based.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "James Carter",
    expertise: "African Safaris",
    bio: "Wildlife expert and safari guide, specializing in Kenya and Tanzania national parks.",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    name: "Mei Lin",
    expertise: "East Asia Tours",
    bio: "Licensed guide for Japan, China, and South Korea. Loves sharing local traditions and cuisine.",
    image: "https://randomuser.me/api/portraits/women/43.jpg",
  },
];

const TravelGuides = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const prev = () => setIndex((index - 1 + guides.length) % guides.length);
  const next = () => setIndex((index + 1) % guides.length);

  const getVisibleIndices = () => {
    const left = (index - 1 + guides.length) % guides.length;
    const center = index;
    const right = (index + 1) % guides.length;
    return [left, center, right];
  };

  const handleguide = (name) => {
    navigate("/guides", { state: { selectedGuideId: name } });
  };

  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Top Travel Guides
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Connect with experienced local guides who will make your journey truly unforgettable.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={prev}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md shadow-lg p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40' 
                : 'bg-white/80 border border-gray-200 hover:bg-white hover:border-pink-300'
            }`}
          >
            <ChevronLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
          </button>
          <button
            onClick={next}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md shadow-lg p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40' 
                : 'bg-white/80 border border-gray-200 hover:bg-white hover:border-pink-300'
            }`}
          >
            <ChevronRight className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
          </button>

          <div className="overflow-hidden px-12">
            <div className="flex justify-center gap-6 flex-wrap">
              <AnimatePresence mode="wait">
                {getVisibleIndices().map((i, pos) => {
                  const guide = guides[i];
                  const isCenter = i === index;

                  return (
                    <motion.div
                      key={guide.name}
                      initial={{ opacity: 0, scale: 0.85, y: 40 }}
                      animate={{ opacity: 1, scale: isCenter ? 1 : 0.9, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 40 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 40px -10px rgba(236, 72, 153, 0.3)",
                      }}
                      className={`flex-shrink-0 w-[280px] md:w-[300px] h-[400px] backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out cursor-pointer ${
                        isDarkMode 
                          ? 'bg-white/10 border border-white/20 hover:border-white/40' 
                          : 'bg-white/80 border border-gray-200 hover:border-pink-300'
                      } ${
                        isCenter ? "z-10 scale-100" : "opacity-80"
                      }`}
                    >
                      <img
                        src={guide.image}
                        alt={guide.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-pink-400 mb-4"
                      />
                      <h3 className={`text-[18px] font-semibold mb-2 transition-all duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {guide.name}
                      </h3>
                      <p className="text-pink-300 text-[15px] font-medium mb-3">
                        {guide.expertise}
                      </p>
                      <p className={`text-[15px] leading-snug px-2 mb-4 transition-all duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {guide.bio}
                      </p>

                      <button
                        onClick={() => handleguide(guide.name)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        View Profile
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelGuides;
