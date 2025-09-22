import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Enhanced scroll hook with momentum and performance optimizations
 */
export const useEnhancedScroll = (options = {}) => {
  const {
    threshold = 100,
    debounceDelay = 16,
    enableMomentum = true,
    onScrollStart = null,
    onScrollEnd = null,
    onScroll = null
  } = options;

  const isScrolling = useRef(false);
  const scrollTimeout = useRef(null);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('down');

  const handleScroll = useCallback(() => {
    const currentScrollY = window.pageYOffset;
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY.current) {
      scrollDirection.current = 'down';
    } else if (currentScrollY < lastScrollY.current) {
      scrollDirection.current = 'up';
    }
    
    lastScrollY.current = currentScrollY;

    // Call scroll callback
    onScroll?.({
      scrollY: currentScrollY,
      direction: scrollDirection.current,
      isScrolling: isScrolling.current
    });

    // Handle scroll start
    if (!isScrolling.current) {
      isScrolling.current = true;
      document.body.classList.add('is-scrolling');
      onScrollStart?.();
    }

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set new timeout for scroll end
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
      document.body.classList.remove('is-scrolling');
      onScrollEnd?.();
    }, debounceDelay);
  }, [onScroll, onScrollStart, onScrollEnd, debounceDelay]);

  useEffect(() => {
    // Add momentum scrolling class if enabled
    if (enableMomentum) {
      document.body.classList.add('momentum-scroll');
    }

    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { 
      passive: true,
      capture: false 
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      document.body.classList.remove('is-scrolling', 'momentum-scroll');
    };
  }, [handleScroll, enableMomentum]);

  return {
    isScrolling: isScrolling.current,
    scrollDirection: scrollDirection.current,
    scrollY: lastScrollY.current
  };
};

/**
 * Hook for scroll-based animations with intersection observer
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, isVisible];
};

/**
 * Hook for parallax scrolling effects
 */
export const useParallaxScroll = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [elementRef, offset];
};

export default useEnhancedScroll;
