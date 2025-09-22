import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for optimized scroll event handling
 * Uses requestAnimationFrame and passive listeners for better performance
 */
export const useScrollOptimization = (callback, dependencies = []) => {
  const ticking = useRef(false);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const optimizedCallback = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        callbackRef.current();
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', optimizedCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', optimizedCallback);
    };
  }, [optimizedCallback, ...dependencies]);
};

/**
 * Hook for throttled scroll events
 */
export const useThrottledScroll = (callback, delay = 16) => {
  const lastCall = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(() => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      callbackRef.current();
      lastCall.current = now;
    }
  }, [delay]);

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback]);
};

export default useScrollOptimization;
