import React, { useEffect, useState, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    toggleTheme();
  }, [isAnimating, toggleTheme]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && (event.key === 'd' || event.key === 'D')) {
        event.preventDefault();
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleToggle]);

  return (
    <button
      onClick={handleToggle}
      // --- 1. ADDED 'active:scale-95' FOR THE PRESS-DOWN EFFECT ---
      className="relative p-2 rounded-lg overflow-hidden font-medium bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800 hover:from-gray-200 hover:to-gray-400 dark:from-indigo-500 dark:to-blue-600 dark:text-white dark:hover:from-indigo-400 dark:hover:to-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none active:scale-95"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode (Ctrl+Shift+D)`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode (Ctrl+Shift+D)`}
    >
      {/* --- ANIMATION PULSE (No change) --- */}
      <div
        className={`absolute inset-0 rounded-lg transition-all duration-300 ease-in-out ${isDarkMode
          ? 'bg-gradient-to-r from-yellow-400 to-orange-300' // Sun pulse
          : 'bg-gradient-to-r from-blue-500 to-purple-300' // Moon pulse
          } ${isAnimating
            ? 'scale-100 opacity-30' // Animate IN
            : 'scale-0 opacity-0' // Base state
          }`}
        onTransitionEnd={() => {
          if (isAnimating) {
            setIsAnimating(false);
          }
        }}
      />

      {/* --- ICONS --- */}
      <div className="relative w-5 h-5 flex items-center justify-center z-10">
        {/* --- 2. UPDATED ICON ANIMATION --- */}
        <Sun
          className={`absolute transition-all duration-500 ease-in-out ${ // <-- Increased duration
            isDarkMode
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-180 scale-0' // <-- Changed to 180deg spin
            }`}
          size={18}
        />
        <Moon
          className={`absolute transition-all duration-500 ease-in-out ${ // <-- Increased duration
            isDarkMode
              ? 'opacity-0 rotate-180 scale-0' // <-- Changed to 180deg spin
              : 'opacity-100 rotate-0 scale-100'
            }`}
          size={18}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;