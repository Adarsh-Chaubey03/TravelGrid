import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      // className="relative p-2 rounded-lg 
      //        bg-gradient-to-r from-gray-100 to-gray-300 
      //        hover:from-gray-200 hover:to-gray-400 
      //        dark:from-indigo-500 dark:to-blue-600 
      //        dark:hover:from-indigo-400 dark:hover:to-blue-500 
      //        text-black dark:text-white font-medium
      //        transition-all duration-300 ease-in-out 
      //        transform hover:scale-105 hover:shadow-lg 
      //        focus:outline-none"
      className="relative p-2 rounded-lg 
             bg-gradient-to-r from-indigo-500 to-blue-600 
             hover:from-indigo-400 hover:to-blue-500 
             text-black dark:text-white font-medium
             transition-all duration-300 ease-in-out 
             transform hover:scale-105 hover:shadow-lg 
             focus:outline-none"

      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon - Show when in dark mode (to switch to light) */}
        <Sun 
          className={`absolute transition-all duration-300 ease-in-out ${
            isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          }`}
          size={18}
        />
        
        {/* Moon Icon - Show when in light mode (to switch to dark) */}
        <Moon 
          className={`absolute transition-all duration-300 ease-in-out ${
            isDarkMode 
              ? 'opacity-0 -rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
          size={18}
        />
      </div>
      
      {/* Animated background ring */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-300' 
          : 'bg-gradient-to-r from-blue-500 to-purple-300'
      } opacity-0 hover:opacity-20`} />
    </button>
  );
};

export default ThemeToggle; 