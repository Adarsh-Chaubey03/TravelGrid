import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
/* test */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button aria-label="Search"
      className={`
        fixed bottom-24 right-6 w-12 h-12 rounded-full
        bg-blue-600 dark:bg-dark-700
        text-white dark:text-dark-100
        flex items-center justify-center shadow-lg
        transition-all duration-300
        hover:bg-blue-700 dark:hover:bg-dark-600
        transform hover:-translate-y-1
        focus:outline-none
        z-40
        border border-blue-500 dark:border-dark-600
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
        animate-scale-in
      `}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;