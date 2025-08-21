import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';

const FeedbackButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        to="/feedback"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative"
      >
        {/* Floating Button */}
        <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer">
          <MessageSquare size={24} className="text-white" />
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 animate-in slide-in-from-bottom-2 duration-200">
            Share Feedback
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* Pulse Animation */}
        <div className="absolute inset-0 w-14 h-14 bg-pink-400 rounded-full animate-ping opacity-20"></div>
      </Link>
    </div>
  );
};

export default FeedbackButton; 