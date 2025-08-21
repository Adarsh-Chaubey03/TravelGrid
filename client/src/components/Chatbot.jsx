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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
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
      }, 250);
    } else {
      setOpen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }
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
    <div className="fixed bottom-24 right-6 z-50">
      {!open && (
        <button 
          onClick={toggleChat}
          className="group relative bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 p-4 rounded-full text-white shadow-2xl hover:shadow-pink-500/25 transform hover:scale-110 transition-all duration-300 ease-out"
          aria-label="Open travel chat"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-75 animate-ping"></div>
        </button>
      )}

      {(open || isAnimating) && (
        <div 
          className={`w-96 rounded-3xl shadow-2xl overflow-hidden flex flex-col border transition-all duration-300 ease-out transform origin-bottom-right ${
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
            
            <div className="relative flex justify-between items-center p-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-lg">Travel Assistant</span>
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

          {/* Messages Container */}
          <div 
            className={`flex-1 overflow-y-auto p-5 space-y-4 max-h-96 min-h-80 transition-all duration-300 ${
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
                className={`flex items-start space-x-3 ${
                  msg.from === "user" ? "flex-row-reverse space-x-reverse" : ""
                } animate-in slide-in-from-bottom-3 fade-in duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
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
                  <span className={`text-xs mt-2 px-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
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
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Finding the best suggestions...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`border-t p-4 transition-all duration-300 ${
            isDarkMode 
              ? 'border-slate-600 bg-slate-800/80 backdrop-blur-sm' 
              : 'border-pink-100 bg-white/80 backdrop-blur-sm'
          }`}>
            {/* changed items-end to items-center for better layout consistency */}
            <div className="flex items-center justify-between  space-x-3">
              <div className="flex-1 relative">
                 {/* Reduce padding area and hide scrollbar in textarea for better ux and for long input*/}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about destinations..."
                  className={`w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 overflow-hidden focus:border-transparent transition-all duration-300 max-h-28 min-h-[52px] ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400' 
                      : 'bg-gray-50/80 border-pink-500 text-gray-700 placeholder-gray-400'
                  }`}
                  style={{ 
                    height: 'auto',
                    minHeight: '52px',
                    maxHeight: '128px',
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                  disabled={isLoading}
                />
              </div>
              {/* Update button styles for consistent rounded shape and changed color scheme for better visibility */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 disabled:text-gray-400 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg flex-shrink-0 shadow-md cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className={`text-xs mt-3 text-center flex items-center justify-center space-x-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              <Sparkles className="w-3 h-3" />
              <span>Press Enter to send • Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;