import React, { useState, useEffect } from 'react';
import { useEnhancedScroll } from '../hooks/useEnhancedScroll';

const ScrollProgress = ({ 
  show = true, 
  height = '3px', 
  color = 'linear-gradient(90deg, #ec4899, #be185d)',
  position = 'top',
  zIndex = 9999
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEnhancedScroll({
    onScroll: ({ scrollY }) => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / windowHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    }
  });

  if (!show) return null;

  return (
    <div
      className="fixed left-0 w-full bg-transparent transition-opacity duration-300"
      style={{
        top: position === 'top' ? 0 : 'auto',
        bottom: position === 'bottom' ? 0 : 'auto',
        zIndex,
        height
      }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          background: color,
          boxShadow: scrollProgress > 0 ? '0 0 10px rgba(236, 72, 153, 0.3)' : 'none'
        }}
      />
    </div>
  );
};

export default ScrollProgress;
