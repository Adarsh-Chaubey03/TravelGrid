import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amit P.",
    location: "Mumbai, India",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    review: "TravelGrid made my trip planning effortless and fun! The smart search feature helped me find amazing deals I never would have discovered otherwise.",
    rating: 5,
    trip: "Goa Beach Holiday"
  },
  {
    name: "Sara L.",
    location: "London, UK",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    review: "The curated guides and easy booking saved me so much time. The weather widget was particularly helpful for planning my activities.",
    rating: 5,
    trip: "Paris City Break"
  },
  {
    name: "John D.",
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    review: "Loved the user community and support. The floating action button made it super easy to get help when I needed it. Will use again!",
    rating: 4,
    trip: "Tokyo Adventure"
  },
  {
    name: "Priya S.",
    location: "Delhi, India",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    review: "A beautiful, intuitive platform for all my travel needs. The quick booking feature is a game-changer for last-minute trips.",
    rating: 5,
    trip: "Dubai Shopping Tour"
  },
  {
    name: "Michael K.",
    location: "Sydney, Australia",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    review: "The interactive stats and testimonials gave me confidence in the platform. Best travel booking experience I've ever had!",
    rating: 5,
    trip: "Bali Retreat"
  },
  {
    name: "Emma R.",
    location: "Toronto, Canada",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    review: "Love the travel tips feature! It helped me pack better and save money on my trip. The animations make the site feel so modern.",
    rating: 5,
    trip: "European Backpacking"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);

  // Responsive card count
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Auto-play functionality - continuous infinite loop
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Calculate the maximum index to show all cards properly
        const maxIndex = testimonials.length - visibleCards;
        // Always loop back to 0 when reaching the end
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000); // Reduced to 3 seconds for better flow

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleCards]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = testimonials.length - visibleCards;
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = testimonials.length - visibleCards;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-pink-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 animate-slideInDown">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideInUp animate-delay-200">
            Don't just take our word for it - hear from thousands of satisfied travelers
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full transition-all duration-300 transform hover:scale-110 -translate-x-1/2 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full transition-all duration-300 transform hover:scale-110 translate-x-1/2 cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / visibleCards}%)`,
                width: `${(testimonials.length * 100) / visibleCards}%`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 h-full flex flex-col hover-lift group">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full group-hover:from-pink-200 group-hover:to-purple-200 transition-all duration-300">
                        <Quote className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed italic">
                      "{testimonial.review}"
                    </p>

                    {/* Trip Info */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full font-medium">
                        {testimonial.trip}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4 justify-center">
                      {[...Array(5)].map((_, idx) => (
                        <svg
                          key={idx}
                          className={`w-5 h-5 transition-colors duration-300 ${
                            idx < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full mb-3 object-cover border-3 border-pink-400 transition-transform duration-300 group-hover:scale-110"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: testimonials.length - visibleCards + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer"
            >
              {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'} Auto-scroll
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 