import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X, Send, Bot, User, Loader2, MapPin, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi there! ✈️ I'm your travel assistant. Ready to plan your next adventure? Ask me about destinations, hotels, or travel tips!", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoSection, setShowVideoSection] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const { isDarkMode } = useTheme();

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
        setShowVideoSection(false); // Reset video section when closing
      }, 250);
    } else {
      setOpen(true);
      setIsAnimating(true);
      setShowVideoSection(true); // Show video section when opening
      setTimeout(() => {
        setIsAnimating(false);
        // Auto-play video when chat opens
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
    // Focus on input after starting chat
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleVideoEnd = () => {
    setShowVideoSection(false);
    // Focus on input after video ends
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(input.trim());
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { 
        from: "bot", 
        text: text, 
        timestamp: Date.now() 
      }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-24">
      {!open && (
        <button 
          onClick={toggleChat}
          className="group relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 p-3 sm:p-4 rounded-full text-white shadow-2xl hover:shadow-pink-500/25 transform hover:scale-110 transition-all duration-300 ease-out"
          aria-label="Open travel chat"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-75 animate-ping"></div>
        </button>
      )}

      {(open || isAnimating) && (
        <div 
          className={`w-[calc(100vw-3rem)] sm:w-96 h-[700px] sm:h-[730px] rounded-3xl shadow-2xl overflow-hidden flex flex-col border transition-all duration-300 ease-out transform origin-bottom-right ${
            isDarkMode 
              ? 'bg-slate-800/95 backdrop-blur-sm border-slate-600' 
              : 'bg-white/95 backdrop-blur-sm border-pink-100'
          } ${
            open && !isAnimating 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-95 opacity-0 translate-y-2'
          }`}
          style={{
            boxShadow: isDarkMode 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(71, 85, 105, 0.2)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 192, 203, 0.1)'
          }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 text-white overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative flex justify-between items-center p-4 sm:p-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <span className="font-bold text-base sm:text-lg">Travel Assistant</span>
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
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Video Section - Enhanced with more content */}
{/* Video Section - Enhanced with more content */}
{showVideoSection && (
  <div 
    className={`flex-1 flex flex-col items-center justify-between p-4 sm:p-5 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-white to-pink-50'
    }`}
  >
    {/* Top Section - Video */}
    <div className="text-center w-full flex-1 flex flex-col justify-center">
      <div className="mb-4 sm:mb-6">
        <video
          ref={videoRef}
          className="w-full max-w-[280px] sm:max-w-sm rounded-2xl shadow-2xl mx-auto border-4 border-white/20"
          onEnded={handleVideoEnd}
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Welcome Traveler! 🌍
      </h3>
      <p className={`text-sm sm:text-base mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Let me help you plan your perfect adventure!
      </p>
    </div>

    {/* Middle Section - Features List */}
    <div className="w-full mb-6">
      {/* Features List */}
      <div className={`space-y-3 mb-4 ${
        isDarkMode 
          ? 'text-gray-200' 
          : 'text-gray-700'
      }`}>
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 flex-shrink-0 text-pink-500" />
          <span className="text-sm font-medium">Destinations & Places to Visit</span>
        </div>
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 text-pink-500" />
          <span className="text-sm font-medium">Custom Itineraries & Trip Planning</span>
        </div>
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 text-pink-500" />
          <span className="text-sm font-medium">Hotel Recommendations & Bookings</span>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className={`text-center p-4 rounded-2xl mb-4 ${
        isDarkMode 
          ? 'bg-slate-800/60 border border-slate-700' 
          : 'bg-white/90 border border-pink-100'
      }`}>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
          I can help you with:
        </p>
        <div className="flex justify-center space-x-6 text-xs">
          <span className={`font-semibold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>500+ Cities</span>
          <span className={`font-semibold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>1000+ Hotels</span>
          <span className={`font-semibold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>24/7 Support</span>
        </div>
      </div>
    </div>

    {/* Bottom Section - CTA */}
    <div className="w-full text-center">
      <button
        onClick={handleStartChat}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
      >
        Start Planning Your Trip
      </button>
      <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Get personalized travel recommendations instantly
      </p>
    </div>
  </div>
)}

          {/* Messages Container - Only show when video section is hidden */}
          {!showVideoSection && (
            <>
              <div 
                className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 ${
                  isDarkMode 
                    ? 'bg-gradient-to-b from-slate-800 via-slate-700/30 to-slate-800' 
                    : 'bg-gradient-to-b from-white via-pink-50/30 to-white'
                }`}
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#ec4899 transparent'
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 sm:space-x-3 ${
                      msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""
                    } animate-in slide-in-from-bottom-3 fade-in duration-500`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      msg.from === "user" 
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white" 
                        : isDarkMode 
                          ? "bg-gradient-to-br from-slate-600 to-slate-700 text-gray-300 border-2 border-slate-500" 
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border-2 border-white"
                    }`}>
                      {msg.from === "user" ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>

                    <div className={`flex flex-col max-w-[70%] sm:max-w-xs ${
                      msg.from === "user" ? "items-end" : "items-start"
                    }`}>
                      <div className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                        msg.from === "user"
                          ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-md shadow-lg"
                          : isDarkMode 
                            ? "bg-slate-700 text-gray-200 rounded-bl-md shadow-md border border-slate-600" 
                            : "bg-white text-gray-800 rounded-bl-md shadow-md border border-pink-100/50"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                      <span className={`text-xs mt-1 sm:mt-2 px-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-400'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-2 sm:space-x-3 animate-in slide-in-from-bottom-3 fade-in duration-300">
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-gray-300 border-slate-500' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border-white'
                    }`}>
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className={`p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-md border ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-white border-pink-100/50'
                    }`}>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className={`text-xs sm:text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Finding the best suggestions...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`border-t p-3 sm:p-4 transition-all duration-300 ${
                isDarkMode 
                  ? 'border-slate-600 bg-slate-800/80 backdrop-blur-sm' 
                  : 'border-pink-100 bg-white/80 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between space-x-2 sm:space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about destinations..."
                      className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 overflow-hidden focus:border-transparent transition-all duration-300 max-h-20 sm:max-h-28 min-h-[44px] sm:min-h-[52px] ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400' 
                          : 'bg-gray-50/80 border-pink-500 text-gray-700 placeholder-gray-400'
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
                    className="p-3 sm:p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 disabled:text-gray-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg flex-shrink-0 shadow-md cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <div className={`text-xs mt-2 sm:mt-3 text-center flex items-center justify-center space-x-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`}>
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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