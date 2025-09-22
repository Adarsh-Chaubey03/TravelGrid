import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0
  });

  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: performance.memory ? 
            Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
    </div>
  );
};

export default PerformanceMonitor;
