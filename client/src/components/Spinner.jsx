
import React from 'react';
import { Plane, MapPin } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 to-purple-50 bg-opacity-95 z-50 backdrop-blur-sm">
      {/* Travel-themed animated loader */}
      <div className="relative">
        {/* Rotating world */}
        <div className="h-16 w-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        
        {/* Flying plane */}
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Plane className="h-6 w-6 text-pink-600 animate-pulse" />
        </div>
        
        {/* Pulsing map pins */}
        <div className="absolute -bottom-1 -left-1 animate-ping">
          <MapPin className="h-4 w-4 text-purple-500" />
        </div>
      </div>
      
      {/* Loading text with typewriter effect */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          Planning your journey...
        </p>
        <div className="flex space-x-1 justify-center mt-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
