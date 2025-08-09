import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Typewriter from "typewriter-effect";
import { X, ChevronDown, Check } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const HeroSection = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleSearch = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to search for destinations.");
      return;
    }
    onSearch({ location, category });
    console.log("Search button clicked:", searchTerm, location);
  };

  const categories = [
    "All Categories",
    "Restaurants",
    "Hotels",
    "Events",
    "Shopping",
    "Attractions",
    "Transportation"
  ];

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsDropdownOpen(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full min-h-[90vh] flex items-center justify-center py-20 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100 z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1695045038427-3acc1c0df23c?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fG5pZ2h0JTIwYmVhY2h8ZW58MHx8MHx8fDA%3D')",
        }}
      ></div>

      <div className={`absolute inset-0 z-15 ${isDarkMode
        ? 'bg-gradient-to-b from-black/60 via-black/40 to-black/70'
        : 'bg-gradient-to-b from-black/30 via-black/20 to-black/50'
        }`} />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

          {/* Left Text Side */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex-1 text-center lg:text-left text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight font-[Playfair Display]">
              Explore&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 inline-block min-h-[1.5em]">
                <Typewriter
                  options={{
                    strings: ['Restaurants!', 'Events!', 'Shopping!', 'Hotels!', 'Your City!'],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 20,
                  }}
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 font-medium text-gray-200 max-w-2xl font-[Poppins] leading-relaxed">
              Find great places to stay, eat, shop, or visit from local experts. Discover hidden gems and create unforgettable memories.
            </p>
          </motion.div>

          {/* Right Search Box Side */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex-1 w-full max-w-md"
          >
            <div className={`backdrop-blur-md rounded-2xl shadow-2xl p-6 space-y-4 border transition-all duration-300 ${isDarkMode
              ? 'bg-white/10 border-white/20'
              : 'bg-white/90 border-white/30'
              }`}>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Borivali, Mumbai, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full px-4 py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ${isDarkMode
                      ? 'bg-white/90 text-gray-950 placeholder-gray-950 border-white/30'
                      : 'bg-white/90 text-gray-700 placeholder-gray-500 border-white/30'
                      }`}
                  />
                </div>

                <div className="relative">
                  {/* Modern Custom Dropdown */}
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full px-4 py-3 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 flex items-center justify-between ${isDarkMode
                        ? 'bg-white/90 text-gray-950 border-white/30 hover:bg-white/95'
                        : 'bg-white/90 text-gray-700 border-white/30 hover:bg-white/95'
                        } ${isDropdownOpen ? 'ring-2 ring-pink-500 border-transparent' : ''}`}
                    >
                      <span className="font-medium">{category}</span>
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`absolute z-50 w-full mt-2 py-2 rounded-xl shadow-2xl border backdrop-blur-xl ${isDarkMode
                            ? 'bg-slate-800/95 border-slate-700/50'
                            : 'bg-white/95 border-gray-200/50'
                            }`}
                        >
                          {categories.map((cat, index) => (
                            <motion.button
                              key={cat}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleCategorySelect(cat)}
                              className={`w-full px-4 py-3 text-left flex items-center justify-between transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 ${category === cat
                                ? `bg-gradient-to-r from-pink-500/20 to-purple-500/20 ${isDarkMode ? 'text-pink-300' : 'text-pink-600'
                                }`
                                : isDarkMode
                                  ? 'text-gray-200 hover:text-white'
                                  : 'text-gray-700 hover:text-gray-900'
                                }`}
                            >
                              <span className="font-medium">{cat}</span>
                              {category === cat && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <Check className={`w-4 h-4 ${isDarkMode ? 'text-pink-300' : 'text-pink-600'
                                    }`} />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Click outside to close dropdown */}
                  {isDropdownOpen && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-in-out transform cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Search
                </motion.button>
              </div>

              {/* Category Filters */}
              <div className={`pt-4 border-t ${isDarkMode ? 'border-white/20' : 'border-white/20'
                }`}>
                <p className="text-sm font-medium text-white/80 mb-3">Quick Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {["Restaurants", "Events", "Shopping"].map((filter) => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={filter}
                      onClick={() => {
                        setCategory(filter);
                        handleSearch();
                      }}
                      className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    >
                      {filter}
                    </motion.button>
                  ))}

                  {category !== "All Categories" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCategory("All Categories")}
                      className="px-3 py-2 inline-flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      Clear <X size={16} className="relative top-[1px]" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
