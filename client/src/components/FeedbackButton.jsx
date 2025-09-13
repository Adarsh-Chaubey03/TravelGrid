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
        <div className={`h-14 ${isHovered ? 'px-4' : 'w-14'} bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease transform hover:scale-110 flex items-center justify-center cursor-pointer`}>
          {isHovered ? <span className="text-white font-medium whitespace-nowrap">Share Feedback</span> : <MessageSquare size={24} className="text-white" />}
        </div>

        {/* Pulse Animation */}
        <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-20"></div>
      </Link>
    </div>
  );
};

export default FeedbackButton; 