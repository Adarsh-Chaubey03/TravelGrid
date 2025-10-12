import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Typewriter from "typewriter-effect";
import { X, ChevronDown, Check, Search, MapPin, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const HeroSection = ({ onSearch }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(t("home.allCategories"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = [
    t("home.allCategories"),
    t("home.restaurants"),
    t("home.hotels"),
    t("home.events"),
    t("home.shopping"),
    t("home.attractions"),
    t("home.transportation"),
    "Package",
  ];

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsDropdownOpen(false);
  };

  const handleSearch = async () => {
    if (!isAuthenticated) {
      toast.error(t("errors.pleaseSignIn"));
      return;
    }

    try {
      setLoading(true);

      if (category === "Package") {
        if (location.trim()) {
          navigate(`/packages?query=${encodeURIComponent(location)}`);
        } else {
          navigate("/packages");
        }
        return;
      }

      if (category === t("home.allCategories") || category === "All Categories") {
        if (location.trim()) {
          navigate(`/hotels?query=${encodeURIComponent(location)}`);
        } else {
          navigate("/hotels");
        }
        return;
      }

      const { data } = await axios.get(
        `/api/search?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`
      );
      setSearchResults(Array.isArray(data) ? data : []);

      if (category === t("home.hotels") || category === "Hotels") {
        navigate(`/hotels?query=${encodeURIComponent(location)}`);
      }
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Theme-aware UI tokens
  const ui = isDarkMode
    ? {
        overlay: "bg-gradient-to-b from-black/60 via-black/40 to-black/70",
        accentText: "text-pink-400",
        card: "backdrop-blur-2xl bg-white/10 border-white/20",
        cardOverlay: "bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent",
        input: "backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder-gray-300",
        dropdown: "backdrop-blur-2xl bg-slate-900/90 border-white/20",
        dropdownItem: "text-gray-200 hover:bg-white/10 hover:text-white",
        dropdownItemActive: "bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300",
        chip: "bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300 border border-pink-400/30",
        quickBtn: "backdrop-blur-xl bg-white/20 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 text-white border-white/30",
        clearBtn: "bg-gradient-to-r from-red-500 to-pink-600 text-white",
        resultsContainer: "backdrop-blur-2xl bg-white/10 border-white/20",
        resultCard: "backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20",
        headingText: "text-white",
        subText: "text-gray-200",
        closeBtn: "hover:bg-white/20 text-gray-300 hover:text-white",
        resultTitle: "text-white",
        resultMeta: "text-gray-300",
      }
    : {
        // Light mode
        overlay: "bg-gradient-to-b from-black/40 via-black/25 to-black/50", // keep some depth for readability
        accentText: "text-pink-600",
        card: "bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl",
        cardOverlay: "bg-gradient-to-br from-pink-50 via-purple-50 to-transparent",
        input: "bg-white border-slate-300 text-slate-900 placeholder-slate-400",
        dropdown: "bg-white border-slate-200 shadow-xl",
        dropdownItem: "text-slate-700 hover:bg-slate-50",
        dropdownItemActive: "bg-pink-50 text-pink-700",
        chip: "bg-pink-50 text-pink-700 border border-pink-200",
        quickBtn: "bg-slate-100 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white text-slate-800 border-slate-200",
        clearBtn: "bg-slate-200 text-slate-800 hover:bg-slate-300",
        resultsContainer: "bg-white/95 border-slate-200 shadow-2xl",
        resultCard: "bg-white border-slate-200 hover:bg-slate-50",
        headingText: "text-white", // keep hero text white over the dark image
        subText: "text-gray-200",
        closeBtn: "hover:bg-slate-100 text-slate-500 hover:text-slate-700",
        resultTitle: "text-slate-900",
        resultMeta: "text-slate-600",
      };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden -mt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1695045038427-3acc1c0df23c?w=1920&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fG5pZ2h0JTIwYmVhY2h8ZW58MHx8MHx8fDA%3D')",
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-slate-900/60"></div>
      </div>

      {/* Overlay for readability */}
      <div className={`absolute inset-0 z-10 ${ui.overlay}`} />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Text Side (kept white for readability) */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`flex-1 text-center lg:text-left space-y-6 ${ui.headingText}`}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight drop-shadow-2xl">
              Explore{" "}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 min-h-[1.2em]">
                <Typewriter
                  options={{
                    strings: ["Restaurants!", "Events!", "Shopping!", "Hotels!", "Your City!"],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 20,
                  }}
                />
              </span>
            </h1>

            <p className={`text-xl md:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-lg ${ui.subText}`}>
              {t("home.heroDescription")}
            </p>
          </motion.div>

          {/* Right Search Card */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex-1 w-full max-w-md"
          >
            <div className={`relative rounded-3xl p-8 border shadow-2xl ${ui.card}`}>
              {/* Subtle overlay for depth */}
              <div className={`absolute inset-0 rounded-3xl pointer-events-none ${ui.cardOverlay}`}></div>

              <div className="relative z-10 space-y-5">
                {/* Location Input */}
                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${ui.accentText}`} />
                  <input
                    type="text"
                    placeholder={t("home.locationPlaceholder")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 font-medium ${ui.input}`}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 ${ui.input} ${
                      isDropdownOpen ? "ring-2 ring-pink-500" : ""
                    }`}
                  >
                    <span className={isDarkMode ? "text-white" : "text-slate-900"}>{category}</span>
                    <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className={`w-5 h-5 ${ui.accentText}`} />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        {/* Backdrop to close dropdown */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />

                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute z-50 w-full mt-2 py-2 rounded-2xl max-h-72 overflow-y-auto border ${ui.dropdown}`}
                        >
                          {categories.map((cat) => {
                            const active = category === cat;
                            return (
                              <button
                                key={cat}
                                onClick={() => handleCategorySelect(cat)}
                                className={`w-full px-5 py-3 text-left flex items-center justify-between transition-all duration-200 ${
                                  active ? ui.dropdownItemActive : ui.dropdownItem
                                }`}
                              >
                                <span className="font-medium">{cat}</span>
                                {active && <Check className={`w-5 h-5 ${ui.accentText}`} />}
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-pink-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundSize: "200% 100%" }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      {t("common.search")}
                    </>
                  )}
                </motion.button>

                {/* Quick Filters */}
                <div className="pt-5 border-t border-white/20">
                  <p
                    className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                      isDarkMode ? "text-gray-200" : "text-slate-600"
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${ui.accentText}`} />
                    {t("home.quickFilters")}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[t("home.restaurants"), t("home.events"), t("home.shopping")].map((filter) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={filter}
                        onClick={() => {
                          setCategory(filter);
                          handleSearch();
                        }}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 shadow-md border ${ui.quickBtn}`}
                      >
                        {filter}
                      </motion.button>
                    ))}

                    {category !== t("home.allCategories") && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(t("home.allCategories"))}
                        className={`px-4 py-2 inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl transition-all duration-300 shadow-md ${ui.clearBtn}`}
                      >
                        {t("common.clear")} <X size={16} />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-12 w-full max-w-4xl mx-auto"
            >
              <div className={`rounded-3xl p-6 border ${ui.resultsContainer}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <Search className={`w-6 h-6 ${ui.accentText}`} />
                    Search Results ({searchResults.length})
                  </h3>
                  <button
                    onClick={() => setSearchResults([])}
                    className={`p-2 rounded-full transition-all duration-300 ${ui.closeBtn}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((item, index) => (
                    <motion.div
                      key={item._id ?? `${item.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-5 border rounded-2xl transition-all duration-300 cursor-pointer ${ui.resultCard}`}
                    >
                      <h4 className={`font-bold text-lg mb-2 ${ui.resultTitle}`}>{item.name}</h4>
                      <div className={`flex items-center gap-2 text-sm mb-3 ${ui.resultMeta}`}>
                        <MapPin className={`w-4 h-4 ${ui.accentText}`} />
                        <span>{item.location}</span>
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${ui.chip}`}>
                        {item.category}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;