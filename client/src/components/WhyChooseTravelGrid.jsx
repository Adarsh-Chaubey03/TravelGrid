import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const WhyChooseTravelGrid = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Features data - limited to 8 for better 4x2 grid layout
  const features = [
    {
      title: "Travel Booking",
      description:
        "Easily book flights, trains, buses, and more with our intuitive booking system.",
      icon: "✈️",
      path: '/ticket'
    },
    {
      title: "Vehicle Rentals",
      description:
        "Rent or hire vehicles tailored to your travel needs, from cars to bikes.",
      icon: "🚗",
      path: '/ticket'
    },
    {
      title: "Hotel Reservations",
      description:
        "Browse and book hotels based on your preferences and budget.",
      icon: "🏨",
      path: '/hotel-booking'
    },
    {
      title: "Travel Guides",
      description:
        "Discover curated guides to plan your ideal trip with local insights.",
      icon: "📖",
      path: '/guides'
    },
    {
      title: "Essentials Checklist",
      description:
        "Ensure you are not forgetting anything with our checklist feature.",
      icon: "📋",
      path: '/packing-checklist'
    },
    {
      title: "Expense Calculator",
      description:
        "We will manage all your expenses, be it solo travelling or a fun group trip.",
      icon: "💸",
      path: '/trip-calculator'
    },
    {
      title: "Currency Converter",
      description:
        "Convert currencies easily with real-time exchange rates.",
      icon: "💱",
      path: '/enhanced-currency'
    },
    {
      title: "Travel Packages",
      description:
        "Choose pre-designed packages or customize your own adventure.",
      icon: "🎒",
      path: '/packages'
    },
  ];

  // Card variants matching other Home page components
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
    rest: { scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.6, ease: "easeInOut" } },
  };

  // Handle card click navigation
  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full py-20"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-medium mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              TravelGrid
            </span>
            ?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Discover all the features that make TravelGrid your perfect travel companion
          </p>
        </motion.div>

        {/* Feature Cards Grid - 4 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-stretch">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              animate="rest"
              whileHover="hover"
              className={`group relative backdrop-blur-md rounded-2xl overflow-hidden border h-full cursor-pointer transition-all duration-300 ${isDarkMode
                ? "bg-black/30 border-white/20 hover:border-white/40"
                : "bg-white/30 border-gray-300 hover:border-pink-300"
                }`}
              onClick={() => handleCardClick(feature.path)}
            >
              {/* Card Content */}
              <div className="p-6 h-full flex flex-col">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4 transition-all duration-300 shadow-lg"
                >
                  <div className="text-3xl">{feature.icon}</div>
                </motion.div>
                
                {/* Title */}
                <h3 className={`text-lg font-semibold mb-3 group-hover:text-pink-300 transition-colors duration-300 break-words ${
                  isDarkMode
                  ? 'text-white group-hover:text-pink-400'
                  : 'text-gray-900 group-hover:text-pink-500'
                  }`}>
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className={`text-sm leading-relaxed break-words flex-grow transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-800'
                  }`}>
                  {feature.description}
                </p>
                
                {/* Explore Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-4 w-full font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                      : "bg-gradient-to-r from-cyan-200 to-purple-300 hover:from-blue-300 hover:to-purple-300 text-black"
                  }`}
                >
                  Explore
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyChooseTravelGrid;
