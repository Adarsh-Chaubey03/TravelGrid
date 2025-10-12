import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Feedback = () => {
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
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      toast.error("Please login to rate your experience");
      return;
    }
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      icon: '🎯', 
      title: 'Improve Our Services', 
      info: 'Help us enhance your travel experience', 
      sub: 'Your insights drive our improvements'
    },
    { 
      icon: '💡', 
      title: 'Share Ideas', 
      info: 'Suggest new features and destinations', 
      sub: 'We love hearing your creative ideas'
    },
    { 
      icon: '⭐', 
      title: 'Rate Your Experience', 
      info: 'Let us know how we\'re doing', 
      sub: 'Your ratings help other travelers'
    }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${
      isDarkMode
        ? "bg-gradient-to-br from-black to-pink-900"
        : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300"
    }`}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
            Share Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Feedback
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Help us improve your travel experience! Your feedback is invaluable
            to us and helps us create better adventures for everyone.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Info Cards */}
          <div className={`backdrop-blur-md rounded-2xl p-8 border ${
            isDarkMode 
              ? "bg-white/10 border-white/20" 
              : "bg-white/30 border-black/10"
          }`}>
            <h3 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Why Your Feedback Matters
            </h3>
            <div className="space-y-6">
              {feedbackCards.map((card, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-4 p-6 rounded-xl border transition-all ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 hover:bg-white/10" 
                      : "bg-white/50 border-black/10 hover:bg-white/70"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}>
                      {card.title}
                    </h4>
                    <p className={`font-medium mb-1 ${
                      isDarkMode ? "text-pink-400" : "text-pink-600"
                    }`}>
                      {card.info}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {card.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <div className={`backdrop-blur-md rounded-2xl p-8 border ${
            isDarkMode 
              ? "bg-white/10 border-white/20" 
              : "bg-white/30 border-black/10"
          }`}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Tell Us What You Think
            </h2>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
                  ✓
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}>
                  Feedback Submitted!
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Thank you for helping us improve. We'll review your feedback
                  carefully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Package and Hotel Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Package Dropdown */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
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
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-left flex items-center justify-between ${
                          isDarkMode
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/50 border-black/20 text-gray-800"
                        }`}
                      >
                        <span className="truncate">
                          {formData.package
                            ? travelPackages.find((p) => p.value === formData.package)?.icon +
                              " " +
                              travelPackages.find((p) => p.value === formData.package)?.label
                            : "Select your package"}
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform flex-shrink-0 ml-2"
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
                        <div className={`absolute top-full left-0 mt-1 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto w-full ${
                          isDarkMode 
                            ? "bg-gray-800 border border-white/20" 
                            : "bg-white border border-gray-200"
                        }`}>
                          <div
                            className={`px-4 py-2 cursor-pointer ${
                              isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-pink-50 text-gray-700"
                            }`}
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
                              className={`px-4 py-2 cursor-pointer ${
                                isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-pink-50 text-gray-800"
                              }`}
                              onClick={() => {
                                setFormData({ ...formData, package: pkg.value });
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

                  {/* Hotel Dropdown */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
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
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-left flex items-center justify-between ${
                          isDarkMode
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/50 border-black/20 text-gray-800"
                        }`}
                      >
                        <span className="truncate">
                          {formData.hotel
                            ? hotels.find((h) => h.value === formData.hotel)?.icon +
                              " " +
                              hotels.find((h) => h.value === formData.hotel)?.label
                            : "Select your hotel"}
                        </span>
                        <svg
                          className="w-4 h-4 transition-transform flex-shrink-0 ml-2"
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
                        <div className={`absolute top-full left-0 mt-1 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto w-full ${
                          isDarkMode 
                            ? "bg-gray-800 border border-white/20" 
                            : "bg-white border border-gray-200"
                        }`}>
                          <div
                            className={`px-4 py-2 cursor-pointer ${
                              isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-pink-50 text-gray-700"
                            }`}
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
                              className={`px-4 py-2 cursor-pointer ${
                                isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-pink-50 text-gray-800"
                              }`}
                              onClick={() => {
                                setFormData({ ...formData, hotel: hotel.value });
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

                {/* Message Textarea */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Your Feedback *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      isDarkMode
                        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                        : "bg-white/50 border-black/20 text-gray-800 placeholder-gray-600"
                    }`}
                    placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                    required
                  />
                </div>

                {/* Rating Stars */}
                <div className="text-center">
                  <label className={`block text-sm font-medium mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    Rate Your Experience *
                  </label>
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
                              : isDarkMode 
                              ? "text-gray-600" 
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={`text-sm mt-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
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
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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