import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, User, MapPin, Sparkles, Plane, Globe, Hotel, Clock, Star, Heart, Wand2, Calendar, Wallet, Music, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Hi there! ✈️ I'm your AI Travel Companion. I can help you plan trips, find destinations, create itineraries, recommend music, and more! What would you like to do today?", 
      timestamp: Date.now(),
      type: "welcome"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const toggleChat = () => {
    if (open) {
      setIsAnimating(true);
      setTimeout(() => {
        setOpen(false);
        setIsAnimating(false);
        setShowVideoSection(false);
        setActiveFeature(null);
      }, 400);
    } else {
      setOpen(true);
      setShowVideoSection(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => console.log("Video autoplay prevented:", err));
          }
        }, 100);
      }, 50);
    }
  };

  const handleStartChat = () => {
    setShowVideoSection(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleVideoEnd = () => {
    setShowVideoSection(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Navigation handlers for pills
  const handlePillClick = (route) => {
    navigate(route);
    toggleChat();
  };

  // Navigation handlers for feature cards
  const handleFeatureCardClick = (route) => {
    navigate(route);
    toggleChat();
  };

  // Feature handlers
  const handleFeatureRequest = (featureType) => {
    setActiveFeature(featureType);
    
    switch(featureType) {
      case 'itinerary':
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "I'd be happy to help you create a travel itinerary! 🗺️\n\nPlease tell me:\n1. Your destination\n2. Trip duration (number of days)\n3. Your interests (e.g., adventure, relaxation, culture, food)\n\nExample: 'Create a 5-day itinerary for Bali focusing on beaches and culture'", 
          timestamp: Date.now(),
          type: "itinerary_prompt"
        }]);
        break;
        
      case 'packages':
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "Let me find some amazing travel packages for you! 🎒\n\nWhat type of trip are you looking for?\n- Adventure trips\n- Relaxation getaways\n- Cultural experiences\n- Family vacations\n- Romantic getaways\n\nTell me your preferences and I'll find the perfect packages!", 
          timestamp: Date.now(),
          type: "packages_prompt"
        }]);
        break;
        
      case 'destinations':
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "I can help you discover amazing destinations! 🌍\n\nWhat kind of place are you interested in?\n- Tropical beaches\n- Mountain retreats\n- Historic cities\n- Wildlife safaris\n- Urban adventures\n\nTell me what you're looking for and I'll suggest some great options!", 
          timestamp: Date.now(),
          type: "destinations_prompt"
        }]);
        break;
        
      case 'music':
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "Let's find the perfect travel playlist for you! 🎵\n\nWhat mood are you going for?\n- Adventure & excitement\n- Relaxation & chill\n- Romance & sunset\n- Cultural exploration\n- Workout & energy\n\nTell me your travel mood and I'll recommend some great music!", 
          timestamp: Date.now(),
          type: "music_prompt"
        }]);
        break;
        
      case 'budget':
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "I can help you plan your travel budget! 💰\n\nWhat do you need help with?\n- Currency conversion\n- Daily budget planning\n- Expense tracking tips\n- Money-saving strategies\n- Best payment methods for travel\n\nLet me know what you'd like to know about travel finances!", 
          timestamp: Date.now(),
          type: "budget_prompt"
        }]);
        break;
        
      default:
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "What would you like help with? I can assist with travel planning, itineraries, destinations, music, and more!", 
          timestamp: Date.now()
        }]);
    }
    
    setShowVideoSection(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Function to send message to backend API
  const sendToBackend = async (message) => {
    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: isAuthenticated ? user._id : null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.response;
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Backend API error:', error);
      return "I'm having trouble connecting to my advanced AI right now. Let me try to help you with my basic knowledge instead.";
    }
  };

  // Handler for AI Travel Checklist
  const handleChecklistClick = () => {
    navigate("/ai-travel-checklist");
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      from: "user", 
      text: input.trim(), 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // For feature-specific requests, use backend API
      if (activeFeature) {
        const response = await sendToBackend(input.trim());
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: response,
          timestamp: Date.now(),
          type: `${activeFeature}_response`
        }]);
      } else {
        // For general chat, use Gemini API as before
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(input.trim());
        const response = await result.response;
        const text = response.text();

        setMessages(prev => [...prev, { 
          from: "bot", 
          text: text,
          timestamp: Date.now() 
        }]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
      setActiveFeature(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Popular destinations data
  const popularDestinations = [
    { name: "Bali", emoji: "🏝️", travelers: "12.5K" },
    { name: "Paris", emoji: "🗼", travelers: "9.8K" },
    { name: "Tokyo", emoji: "🗾", travelers: "8.3K" },
    { name: "New York", emoji: "🗽", travelers: "11.2K" }
  ];

  // Quick action buttons
  const quickActions = [
    { 
      id: 'itinerary', 
      icon: <Calendar className="w-4 h-4" />, 
      label: 'Create Itinerary', 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      id: 'packages', 
      icon: <Plane className="w-4 h-4" />, 
      label: 'Find Packages', 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      id: 'destinations', 
      icon: <Globe className="w-4 h-4" />, 
      label: 'Discover Places', 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      id: 'music', 
      icon: <Music className="w-4 h-4" />, 
      label: 'Travel Music', 
      color: 'from-yellow-500 to-orange-500' 
    },
    { 
      id: 'budget', 
      icon: <Wallet className="w-4 h-4" />, 
      label: 'Plan Budget', 
      color: 'from-rose-500 to-red-500' 
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={toggleChat}
          className="group relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 p-4 rounded-full text-white shadow-2xl hover:shadow-pink-500/25 transform hover:scale-110 transition-all duration-300 ease-out"
          aria-label="Open travel chat"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-75 animate-ping"></div>
        </button>
      )}

      {(open || isAnimating) && (
        <div
          className={`w-[calc(100vw-2rem)] sm:w-96 rounded-3xl shadow-2xl overflow-hidden flex flex-col border transition-all duration-400 origin-bottom-right ${
            isDarkMode 
              ? 'bg-slate-800/95 backdrop-blur-sm border-slate-600' 
              : 'bg-white/95 backdrop-blur-sm border-pink-100'
          } ${
            open && !isAnimating
              ? 'animate-[zoomIn_0.4s_ease-out] shadow-xl'
              : !open && isAnimating
              ? 'animate-[zoomOut_0.4s_ease-in]'
              : 'scale-95 opacity-0'
          }`}
          style={{
            maxHeight: 'min(700px, calc(100vh - 120px))',
            height: 'min(700px, calc(100vh - 120px))',
            minHeight: '400px',
            boxShadow: isDarkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(71, 85, 105, 0.2), 0 0 60px rgba(236, 72, 153, 0.15)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 192, 203, 0.2), 0 0 60px rgba(236, 72, 153, 0.15)'
          }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 text-white overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative flex justify-between items-center p-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-lg">AI Travel Companion</span>
                  <div className="text-xs text-pink-100 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Online & ready to help
                  </div>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90 cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Video Section */}
          {showVideoSection && (
            <div className={`flex flex-col p-4 overflow-y-auto relative custom-scroll ${
  isDarkMode 
    ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900' 
    : 'bg-gradient-to-br from-pink-50 via-white to-rose-50'
}`}
style={{
  flex: '1 1 auto',
  minHeight: '0',
}}>
              {/* Enhanced Animated Background Elements */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-15 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

              {/* Video Container */}
              <div className="relative w-full mb-3 animate-in fade-in slide-in-from-top duration-700">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/50 transform hover:scale-[1.02] transition-transform duration-300">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    playsInline
                  >
                    <source src="/video.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"></div>

                  {/* Enhanced Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ animation: 'shimmer 3s infinite' }}></div>

                  {/* Enhanced Overlay Welcome Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-center animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                    <h3 className="text-lg font-bold mb-0.5 drop-shadow-2xl">
                      Welcome Traveler! 🌍
                    </h3>
                    <p className="text-xs opacity-90 drop-shadow-lg">Your adventure starts here</p>
                  </div>
                </div>
              </div>

              {/* NEW: Popular Destinations Section */}
              <div className="mb-3 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center`}>
                    <Globe className="w-4 h-4 mr-1.5 text-pink-500" />
                    Trending Destinations
                  </h4>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This Month</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {popularDestinations.map((destination, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-2 border transform hover:scale-105 transition-all duration-200 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-slate-700/60 border-slate-600 hover:bg-slate-600/60' 
                          : 'bg-white/80 border-pink-200 hover:bg-white'
                      }`}
                      onClick={() => setInput(`Tell me about ${destination.name}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{destination.emoji}</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {destination.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-rose-500" />
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {destination.travelers}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Features Pills */}
              <div className="flex gap-1.5 justify-center mb-3 flex-wrap animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                <button
                  onClick={() => handlePillClick("/packages")}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-3 py-1.5 shadow-lg text-xs font-medium transform hover:scale-110 transition-transform duration-200 cursor-pointer animate-in fade-in zoom-in duration-100"
                >
                  <MapPin className="w-3 h-3 animate-bounce" style={{ animationDuration: '2s' }} />
                  <span>500+ Cities</span>
                </button>
                <button
                  onClick={() => handlePillClick("/ticket")}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-3 py-1.5 shadow-lg text-xs font-medium transform hover:scale-110 transition-transform duration-200 cursor-pointer animate-in fade-in zoom-in duration-100"
                >
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>Custom Trips</span>
                </button>
                <button
                  onClick={() => handlePillClick("/contact")}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full px-3 py-1.5 shadow-lg text-xs font-medium transform hover:scale-110 transition-transform duration-200 cursor-pointer animate-in fade-in zoom-in duration-100"
                >
                  <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>24/7 Support</span>
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="mb-3">
                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center`}>
                  <Wand2 className="w-4 h-4 mr-1.5 text-pink-500" />
                  Quick Actions
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleFeatureRequest(action.id)}
                      className={`rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group ${
                        isDarkMode 
                          ? 'bg-slate-700/90 backdrop-blur-sm border-slate-600 hover:bg-slate-600/90' 
                          : 'bg-white/90 backdrop-blur-sm border-pink-200 hover:bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center bg-gradient-to-br ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {action.label}
                      </div>
                    </button>
                  ))
                  }
                </div>
              </div>

              {/* Enhanced Feature Cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => handleFeatureCardClick("/trending-spots")}
                  className={`rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group ${
                    isDarkMode 
                      ? 'bg-slate-700/90 backdrop-blur-sm border-slate-600 hover:bg-slate-600/90' 
                      : 'bg-white/90 backdrop-blur-sm border-pink-200 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>🗺️</div>
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Destinations</div>
                </button>
                <button
                  onClick={() => handleFeatureCardClick("/CustomItenary")}
                  className={`rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group ${
                    isDarkMode 
                      ? 'bg-slate-700/90 backdrop-blur-sm border-slate-600 hover:bg-slate-600/90' 
                      : 'bg-white/90 backdrop-blur-sm border-pink-200 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>✈️</div>
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Itineraries</div>
                </button>
                <button
                  onClick={() => handleFeatureCardClick("/hotels")}
                  className={`rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group ${
                    isDarkMode 
                      ? 'bg-slate-700/90 backdrop-blur-sm border-slate-600 hover:bg-slate-600/90' 
                      : 'bg-white/90 backdrop-blur-sm border-pink-200 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>🏨</div>
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Hotels</div>
                </button>
                {/* AI Travel Checklist Card */}
                <button
                  onClick={handleChecklistClick}
                  className={`rounded-xl p-2 text-center border shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer group ${
                    isDarkMode 
                      ? 'bg-slate-700/90 backdrop-blur-sm border-slate-600 hover:bg-slate-600/90' 
                      : 'bg-white/90 backdrop-blur-sm border-pink-200 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl mb-0.5 animate-bounce group-hover:animate-none" style={{ animationDuration: '2s' }}>📋</div>
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Checklist</div>
                </button>
              </div>

              {/* Enhanced Info Text */}
              <div className="text-center mb-3 px-2">
                <p className={`text-xs font-semibold ${
                  isDarkMode 
                    ? 'text-pink-300' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600'
                }`}>
                  ✨ Get personalized recommendations instantly! ✨
                </p>
              </div>

              {/* Enhanced CTA Button */}
              <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-600 mt-auto">
                <button
                  onClick={handleStartChat}
                  className="relative w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden group text-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Start Planning Your Trip</span>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </span>
                </button>
                <div className="flex items-center justify-center mt-2 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Join 10,000+ happy travelers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Container */}
          {!showVideoSection && (
            <>
              <div
  className={`flex-1 overflow-y-auto p-5 space-y-4 custom-scroll ${
    isDarkMode 
      ? 'bg-gradient-to-b from-slate-800 via-slate-700/30 to-slate-800' 
      : 'bg-gradient-to-b from-white via-pink-50/30 to-white'
  }`}
>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""
                    } animate-in slide-in-from-bottom-3 fade-in duration-500`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      msg.from === "user"
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white"
                        : isDarkMode 
                          ? "bg-gradient-to-br from-slate-600 to-slate-700 text-gray-300 border-2 border-slate-500"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border-2 border-white"
                    }`}>
                      {msg.from === "user" ? <User className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    </div>

                    <div className={`flex flex-col max-w-xs ${
                      msg.from === "user" ? "items-end" : "items-start"
                    }`}>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                        msg.from === "user"
                          ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-md shadow-lg"
                          : isDarkMode 
                            ? "bg-slate-700 text-gray-200 rounded-bl-md shadow-md border border-slate-600"
                            : "bg-white text-gray-800 rounded-bl-md shadow-md border border-pink-100/50"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                      <span className={`text-xs mt-2 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-3 fade-in duration-300">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-gray-300 border-slate-500' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border-white'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className={`p-4 rounded-2xl rounded-bl-md shadow-md border ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-white border-pink-100/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {activeFeature 
                            ? `Creating your ${activeFeature}...` 
                            : "Finding the best suggestions..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`border-t p-4 transition-all duration-300 flex-shrink-0 ${
                isDarkMode 
                  ? 'border-slate-600 bg-slate-800/80 backdrop-blur-sm' 
                  : 'border-pink-100 bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={activeFeature 
                        ? `Describe what you need for your ${activeFeature}...` 
                        : "Ask about destinations, travel tips, or anything travel-related..."}
                      className={`w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 overflow-hidden focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400' 
                          : 'bg-gray-50/80 border-pink-200 text-gray-700 placeholder-gray-400'
                      }`}
                      style={{
                        height: 'auto',
                        minHeight: '44px',
                        maxHeight: '80px',
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 disabled:text-gray-400 disabled:from-gray-200 disabled:to-gray-200 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg flex-shrink-0 shadow-md cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className={`text-xs mt-3 text-center flex items-center justify-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs">Press Enter to send • Shift+Enter for new line</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;