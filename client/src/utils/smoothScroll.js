/**
 * Advanced smooth scrolling utility with custom easing functions
 */

// Easing functions for different scroll behaviors
const easingFunctions = {
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeOutQuart: (t) => 1 - (--t) * t * t * t,
  easeInOutExpo: (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  }
};

/**
 * Smooth scroll to a specific element or position
 * @param {HTMLElement|number} target - Element to scroll to or Y position
 * @param {Object} options - Scroll options
 */
export const smoothScrollTo = (target, options = {}) => {
  const {
    duration = 800,
    easing = 'easeInOutCubic',
    offset = 0,
    onComplete = null,
    onStart = null
  } = options;

  const startTime = performance.now();
  const startPosition = window.pageYOffset;
  
  let targetPosition;
  
  if (typeof target === 'number') {
    targetPosition = target;
  } else if (target instanceof HTMLElement) {
    targetPosition = target.offsetTop - offset;
  } else {
    console.warn('Invalid target for smooth scroll');
    return;
  }

  const distance = targetPosition - startPosition;
  
  if (distance === 0) {
    onComplete?.();
    return;
  }

  onStart?.();

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easedProgress = easingFunctions[easing] ? 
      easingFunctions[easing](progress) : 
      easingFunctions.easeInOutCubic(progress);
    
    const currentPosition = startPosition + (distance * easedProgress);
    
    window.scrollTo(0, currentPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      onComplete?.();
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Smooth scroll to top
 */
export const smoothScrollToTop = (options = {}) => {
  smoothScrollTo(0, { duration: 600, easing: 'easeOutCubic', ...options });
};

/**
 * Smooth scroll to bottom
 */
export const smoothScrollToBottom = (options = {}) => {
  smoothScrollTo(document.body.scrollHeight, { duration: 800, easing: 'easeInOutCubic', ...options });
};

/**
 * Smooth scroll to element by ID
 */
export const smoothScrollToElement = (elementId, options = {}) => {
  const element = document.getElementById(elementId);
  if (element) {
    smoothScrollTo(element, { offset: 80, ...options });
  }
};

/**
 * Smooth scroll to element by selector
 */
export const smoothScrollToSelector = (selector, options = {}) => {
  const element = document.querySelector(selector);
  if (element) {
    smoothScrollTo(element, { offset: 80, ...options });
  }
};

/**
 * Enhanced scroll behavior with momentum
 */
export const enableMomentumScrolling = () => {
  let isScrolling = false;
  let scrollTimeout;
  
  const handleScroll = () => {
    if (!isScrolling) {
      document.body.classList.add('is-scrolling');
      isScrolling = true;
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
      isScrolling = false;
    }, 150);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
};

/**
 * Initialize smooth scrolling for the entire page
 */
export const initSmoothScrolling = () => {
  // Add smooth scroll class to body
  document.body.classList.add('ultra-smooth-scroll');
  
  // Enable momentum scrolling
  const cleanup = enableMomentumScrolling();
  
  // Override default scroll behavior for anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      if (targetId) {
        smoothScrollToElement(targetId, {
          duration: 800,
          easing: 'easeInOutCubic',
          offset: 80
        });
      }
    }
  });
  
  return cleanup;
};

export default {
  smoothScrollTo,
  smoothScrollToTop,
  smoothScrollToBottom,
  smoothScrollToElement,
  smoothScrollToSelector,
  enableMomentumScrolling,
  initSmoothScrolling
};
