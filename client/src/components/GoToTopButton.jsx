import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

const GoToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const { pathname } = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <button 
        className={`w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
          showButton ? "" : "opacity-0"
        }`}
        onClick={scrollToTop}
        aria-label="Go to top of page"
      >
        <ArrowUp className="stroke-white" />
      </button>
    </div>
  );
};

export default GoToTopButton;
