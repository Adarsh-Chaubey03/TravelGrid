import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import "./styles/CustomCarousel.css";

const AUTO_SLIDE_INTERVAL = 3500; // milliseconds

const CustomCarousel = ({ guides, viewprofilehandle, isHome = false }) => {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + guides.length) % guides.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % guides.length);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [guides.length]);

  return (
    <div className="carousel-container relative flex flex-col items-center">
      {/* Left button */}
      <button
        aria-label="Previous"
        onClick={prevSlide}
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md shadow-lg p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? "bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40"
            : "bg-white/80 border border-gray-200 hover:bg-white hover:border-pink-300"
        } cursor-pointer`}
      >
        <ChevronLeft className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-700"}`} />
      </button>

      {/* Carousel cards */}
      <div className="carousel-track flex justify-center items-center gap-4">
        {guides.map((guide, index) => {
          let position = "hidden";
          if (index === currentIndex) position = "center";
          else if (index === (currentIndex + 1) % guides.length) position = "right";
          else if (index === (currentIndex - 1 + guides.length) % guides.length) position = "left";

          return (
            <div
              key={index}
              className={`card w-[280px] sm:w-[300px] h-[400px] flex flex-col items-center justify-center text-center p-6 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isDarkMode
                  ? "bg-black/30 border border-white/20 hover:border-white/40"
                  : "bg-white/30 border border-gray-300 hover:border-pink-300"
              } ${position === "center" ? "scale-100" : "scale-90 opacity-80"}`}
            >
              <img
                src={guide.cardImage || guide.image || "/assets/default-card.jpg"}
                alt={guide.name || "Guide card"}
                loading="lazy"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className={`font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {guide.name}
              </h3>
              <p className="text-pink-500 font-medium text-sm mb-2">{guide.expertise}</p>
              <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {guide.bio}
              </p>
              <button
                onClick={() => viewprofilehandle(guide)}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${
                  isHome
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    : "bg-gradient-to-r from-[#db2777] to-[#ec4899] hover:from-[#be185d] hover:to-[#db2777]"
                }`}
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>

      {/* Right button */}
      <button
        aria-label="Next"
        onClick={nextSlide}
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md shadow-lg p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? "bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40"
            : "bg-white/80 border border-gray-200 hover:bg-white hover:border-pink-300"
        } cursor-pointer`}
      >
        <ChevronRight className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-700"}`} />
      </button>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {guides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-pink-500 scale-110" : isDarkMode ? "bg-gray-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomCarousel;
