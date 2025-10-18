import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaRegLightbulb } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { GiBullseye } from "react-icons/gi";



const Feedback = () => {
  // Add CSS to force dropdown to open downward
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      select[name="hotel"] {
        direction: ltr !important;
      }
      select[name="hotel"] option {
        direction: ltr !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [formData, setFormData] = useState({
    rating: 0,
    package: "",
    hotel: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isHotelDropdownOpen, setIsHotelDropdownOpen] = useState(false);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (rating) => {
    //ensure user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      toast.error("Please login to rate your experience");
      return;
    }
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //ensure user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      toast.error("Please login to submit feedback. Reloading...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }

    if (!formData.message || formData.rating === 0) {
      toast.error("Please provide your feedback and rating");
      return;
    }

    // Simulate API call
    toast.loading("Submitting your feedback...");

    setTimeout(() => {
      toast.dismiss();
      toast.success(
        "Thank you for your feedback! We appreciate your input. 🎉"
      );
      setIsSubmitted(true);
      setFormData({
        rating: 0,
        package: "",
        hotel: "",
        message: "",
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const travelPackages = [
    {
      value: "tropical-paradise-maldives",
      label: "Tropical Paradise – Maldives",
      icon: "🏝️",
    },
    {
      value: "european-explorer-italy-france",
      label: "European Explorer – Italy & France",
      icon: "🏰",
    },
    {
      value: "desert-delight-dubai",
      label: "Desert Delight – Dubai",
      icon: "🏜️",
    },
    {
      value: "himalayan-adventure-manali",
      label: "Himalayan Adventure – Manali",
      icon: "🏔️",
    },
  ];

  const hotels = [
    {
      value: "taj-mahal-palace",
      label: "The Taj Mahal Palace",
      location: "Mumbai, India",
      icon: "🏛️",
    },
    {
      value: "the-plaza",
      label: "The Plaza",
      location: "New York, USA",
      icon: "🏙️",
    },
    {
      value: "hotel-de-paris",
      label: "Hotel de Paris",
      location: "Monte-Carlo, Monaco",
      icon: "🎰",
    },
    {
      value: "the-ritz-london",
      label: "The Ritz",
      location: "London, UK",
      icon: "🏰",
    },
    {
      value: "the-peninsula",
      label: "The Peninsula",
      location: "Hong Kong, China",
      icon: "🌆",
    },
    {
      value: "four-seasons-george-v",
      label: "Four Seasons George V",
      location: "Paris, France",
      icon: "🗼",
    },
    {
      value: "raffles-singapore",
      label: "Raffles",
      location: "Singapore",
      icon: "🌴",
    },
    {
      value: "the-langham-chicago",
      label: "The Langham",
      location: "Chicago, USA",
      icon: "🏙️",
    },
    {
      value: "the-savoy",
      label: "The Savoy",
      location: "London, UK",
      icon: "🏰",
    },
  ];

  const feedbackCards = [
    { 
      icon: <GiBullseye />, 
      title: 'Improve Our Services', 
      info: 'Help us enhance your travel experience', 
      sub: 'Your insights drive our improvements', 
      bg: 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30', 
      color: 'text-pink-400', 
      iconBg: 'from-pink-500 to-purple-600' 
    },
    { 
      icon: <FaRegLightbulb />, 
      title: 'Share Ideas', 
      info: 'Suggest new features and destinations', 
      sub: 'We love hearing your creative ideas',
      bg: 'bg-gradient-to-br from-purple-500/20 to-blue-600/20 hover:from-purple-500/30 hover:to-blue-600/30', 
      color: 'text-purple-400', 
      iconBg: 'from-purple-500 to-blue-600' 
    },
    { 
      icon: <FaRegStar />, 
      title: 'Rate Your Experience', 
      info: 'Let us know how we\'re doing', 
      sub: 'Your ratings help other travelers', 
      bg: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20 hover:from-yellow-500/30 hover:to-orange-600/30', 
      iconBg: 'from-yellow-500 to-orange-600', 
      color: 'text-yellow-400' 
    }
  ];

  return (
    <div className={`min-h-screen`}>
      {/* Hero Section */}
      <div className={`py-30 px-4 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${
          isDarkMode ? 'bg-black bg-opacity-10' : 'bg-white bg-opacity-20'
        }`}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Feedback</span>
          </h1>
          <p className={`text-2xl opacity-95 max-w-3xl mx-auto ${
            isDarkMode ? 'bg-gradient-to-r from-pink-100 via-fuchsia-400 to-pink-100 bg-clip-text text-transparent font-medium' : 'text-gray-700'
          }`}>
            Help us improve your travel experience! Your feedback is invaluable
            to us and helps us create better adventures for everyone.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Feedback Info */}
          <div className={`backdrop-blur-md rounded-2xl shadow-2xl p-8 border ${
            isDarkMode 
              ? 'bg-white/10 border-white/20'
              : 'bg-white/90 border-pink-200'
          }`}>
            <h3 className={`text-3xl font-bold mb-8 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Feedback</span> Matters
            </h3>
            <div className="space-y-6">
              {feedbackCards.map((card, index) => (
                <div key={index} className={`flex items-center p-6 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? `${card.bg} border border-white/10 hover:border-white/20`
                    : 'bg-white border border-gray-200 hover:border-pink-300'
                }`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.iconBg} rounded-xl flex items-center justify-center text-white text-2xl mr-6 shadow-lg`}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{card.title}</h4>
                    <p className={`${card.color} font-medium mb-1`}>{card.info}</p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <div className={`backdrop-blur-md rounded-2xl shadow-2xl p-8 border ${
            isDarkMode 
              ? 'bg-white/10 border-white/20'
              : 'bg-white/90 border-pink-200'
          }`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tell Us What You <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Think</span>
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  Feedback Submitted!
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Thank you for helping us improve. We'll review your feedback
                  carefully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Package/Destination and Hotel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className={`block text-md font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Package
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPackageDropdownOpen(!isPackageDropdownOpen);
                          setIsHotelDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 ${isDarkMode ? "bg-gradient-to-br from-pink-500/20 to-purple-600/20 text-white border-2 border-white/30" : "bg-white text-gray-900 border-1 border-gray-200"} backdrop-blur-sm rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 transition-all outline-none text-left flex items-center justify-between`}
                      >
                        <span className="truncate">
                          {formData.package
                            ? travelPackages.find(
                                (p) => p.value === formData.package
                              )?.icon +
                              " " +
                              travelPackages.find(
                                (p) => p.value === formData.package
                              )?.label
                            : "Select your package"}
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isPackageDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-gradient-to-br from-pink-500/70 to-purple-600/70 text-white backdrop-blur-md border-2 border-white/30 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto min-w-full w-max">
                          <div
                            className="px-4 py-2 cursor-pointer hover:bg-pink-50 text-white"
                            onClick={() => {
                              setFormData({ ...formData, package: "" });
                              setIsPackageDropdownOpen(false);
                            }}
                          >
                            Select your package
                          </div>
                          {travelPackages.map((pkg) => (
                            <div
                              key={pkg.value}
                              className="px-4 py-2 cursor-pointer hover:bg-pink-50 whitespace-nowrap text-white border-b border-pink-300 hover:text-black"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  package: pkg.value,
                                });
                                setIsPackageDropdownOpen(false);
                              }}
                            >
                              {pkg.icon} {pkg.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label className={`block text-md font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Hotel (if booked)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsHotelDropdownOpen(!isHotelDropdownOpen);
                          setIsPackageDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 ${isDarkMode ? "bg-gradient-to-br from-pink-500/20 to-purple-600/20 text-white border-2 border-white/30" : "bg-white text-gray-900 border-1 border-gray-200"} backdrop-blur-sm rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 transition-all outline-none text-left flex items-center justify-between`}
                      >
                        <span className="truncate">
                          {formData.hotel
                            ? hotels.find((h) => h.value === formData.hotel)
                                ?.icon +
                              " " +
                              hotels.find((h) => h.value === formData.hotel)
                                ?.label +
                              " - " +
                              hotels.find((h) => h.value === formData.hotel)
                                ?.location
                            : "Select your hotel"}
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isHotelDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-md border-2 border-white/30 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto min-w-full w-max">
                          <div
                            className="px-4 py-2 cursor-pointer hover:bg-pink-50 text-black"
                            onClick={() => {
                              setFormData({ ...formData, hotel: "" });
                              setIsHotelDropdownOpen(false);
                            }}
                          >
                            Select your hotel
                          </div>
                          {hotels.map((hotel) => (
                            <div
                              key={hotel.value}
                              className="px-4 py-2 cursor-pointer hover:bg-pink-50 whitespace-nowrap text-black"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  hotel: hotel.value,
                                });
                                setIsHotelDropdownOpen(false);
                              }}
                            >
                              {hotel.icon} {hotel.label} - {hotel.location}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                    <label className={`block text-md font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-600'
                    }`}>
                      Your Feedback *
                    </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${isDarkMode ? "bg-gradient-to-br from-pink-500/20 to-purple-600/20 text-gray-100 border-2 border-white/30" : "bg-white text-gray-600 border-1 border-gray-200"} backdrop-blur-sm rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 transition-all outline-none text-left flex items-center justify-between`}
                    placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                    required
                  />
                </div>

                {/* Rating */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-2 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={36}
                          className={`${
                            star <= (hoveredRating || formData.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"} mt-3`}>
                    {formData.rating === 0 && "Rate your experience"}
                    {formData.rating === 1 && "Poor"}
                    {formData.rating === 2 && "Fair"}
                    {formData.rating === 3 && "Good"}
                    {formData.rating === 4 && "Very Good"}
                    {formData.rating === 5 && "Excellent"}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
