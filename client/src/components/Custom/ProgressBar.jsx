import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset progress on route change
    setProgress(0);
    setIsVisible(true);

    // Simulate loading progress
    const timer = setTimeout(() => {
      setProgress(30);
    }, 100);

    const timer2 = setTimeout(() => {
      setProgress(60);
    }, 200);

    const timer3 = setTimeout(() => {
      setProgress(100);
    }, 400);

    const timer4 = setTimeout(() => {
      setIsVisible(false);
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
