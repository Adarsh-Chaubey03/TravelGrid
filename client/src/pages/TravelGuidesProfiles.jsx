import React, { useState, useRef } from 'react';

const guides = [
  {
    name: "Aarav Mehta",
    expertise: "Himalayan Treks",
    bio: "Certified mountain guide with 10+ years of experience leading treks in the Indian Himalayas.",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    details: {
      location: "Manali, Himachal Pradesh",
      languages: "English, Hindi",
      certifications: "Mountaineering Certified (IMF)",
      experience: "Over 50 successful expeditions",
      contact: "aarav.treks@example.com",
    }
  },
  {
    name: "Sofia Rossi",
    expertise: "Italian Cities & Culture",
    bio: "Passionate about art, food, and history. Fluent in English and Italian. Rome-based.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    details: {
      location: "Rome, Italy",
      languages: "Italian, English",
      certifications: "European Cultural Guide",
      experience: "Expert in food tours and city history",
      contact: "sofia.culture@example.com",
    }
  },
  {
    name: "James Carter",
    expertise: "African Safaris",
    bio: "Wildlife expert and safari guide, specializing in Kenya and Tanzania national parks.",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    details: {
      location: "Nairobi, Kenya",
      languages: "English, Swahili",
      certifications: "Wildlife Tourism Certified",
      experience: "Led over 200 safaris",
      contact: "james.safari@example.com",
    }
  },
  {
    name: "Mei Lin",
    expertise: "East Asia Tours",
    bio: "Licensed guide for Japan, China, and South Korea. Loves sharing local traditions and cuisine.",
    image: "https://randomuser.me/api/portraits/women/43.jpg",
    details: {
      location: "Tokyo, Japan",
      languages: "Japanese, Chinese, Korean, English",
      certifications: "East Asia Tourism License",
      experience: "Cultural guide for 8+ years",
      contact: "mei.eastasia@example.com",
    }
  },
];

const TravelGuidesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const profileRef = useRef(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + guides.length) % guides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % guides.length);
  };

  const viewProfile = (guide) => {
    setSelectedGuide(guide);
    setTimeout(() => {
      profileRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <section className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300" style={{ scrollMarginTop: '80px' }}>
        <div className="py-20 px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Travel Guides
          </h1>
          
          {/* Marquee */}
          <div className="text-center mb-16 overflow-hidden">
            <div className="inline-block animate-marquee whitespace-nowrap">
              <span className="text-gray-600 dark:text-gray-400 text-lg">
                Explore the world with our expert local guides – from Himalayan treks to Italian culture and African safaris.
              </span>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-7xl mx-auto">
            {/* Left Navigation Button */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 text-gray-600 dark:text-gray-400 
                       hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-light transition-colors duration-300"
              onClick={prevSlide}
            >
              &#60;
            </button>

            {/* Carousel Track */}
            <div className="flex justify-center items-center h-96 relative">
              {guides.map((guide, index) => {
                let position = 'hidden';
                let transform = 'translate-x-0';
                let scale = 'scale-100';
                let opacity = 'opacity-0';
                let zIndex = 'z-0';
                let blur = '';

                if (index === currentIndex) {
                  position = 'center';
                  transform = 'translate-x-0';
                  scale = 'scale-100';
                  opacity = 'opacity-100';
                  zIndex = 'z-10';
                } else if (index === (currentIndex + 1) % guides.length) {
                  position = 'right';
                  transform = 'translate-x-64';
                  scale = 'scale-90';
                  opacity = 'opacity-70';
                  zIndex = 'z-5';
                } else if (index === (currentIndex - 1 + guides.length) % guides.length) {
                  position = 'left';
                  transform = '-translate-x-64';
                  scale = 'scale-90';
                  opacity = 'opacity-70';
                  zIndex = 'z-5';
                }

                return (
                  <div
                    key={index}
                    className={`absolute w-72 transition-all duration-500 ease-in-out ${transform} ${scale} ${opacity} ${zIndex} ${blur}`}
                  >
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-3xl p-6 
                                  border border-white/20 dark:border-gray-600/20 shadow-xl 
                                  hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                      
                      {/* Profile Image with Pink Border */}
                      <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-pink-400 to-pink-600">
                          <img 
                            src={guide.image} 
                            alt={guide.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Guide Info */}
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                          {guide.name}
                        </h3>
                        
                        <p className="text-pink-500 dark:text-pink-400 font-medium text-sm mb-3">
                          {guide.expertise}
                        </p>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 px-2">
                          {guide.bio}
                        </p>
                        
                        <button 
                          className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 
                                   text-white px-6 py-2 rounded-full text-sm font-medium 
                                   transition-all duration-300 hover:shadow-lg"
                          onClick={() => viewProfile(guide)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Navigation Button */}
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 text-gray-600 dark:text-gray-400 
                       hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-light transition-colors duration-300"
              onClick={nextSlide}
            >
              &#62;
            </button>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      {selectedGuide && (
        <div className="bg-gray-50 dark:bg-gray-800 py-16 px-6 transition-colors duration-300" ref={profileRef}>
          <div className="max-w-4xl mx-auto">
            {/* Profile Heading with Lines */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              <h2 className="mx-8 text-3xl font-bold text-gray-900 dark:text-white text-center">
                {selectedGuide.name}'s Profile
              </h2>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Profile Details Box */}
            <div className="backdrop-blur-md bg-white/80 dark:bg-gray-700/80 rounded-3xl p-8 
                          border border-white/20 dark:border-gray-600/20 shadow-xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-pink-400 to-pink-600">
                    <img 
                      src={selectedGuide.image} 
                      alt={selectedGuide.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Profile Details */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Expertise:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedGuide.expertise}</span>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Bio:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedGuide.bio}</span>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Location:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedGuide.details.location}</span>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Languages:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedGuide.details.languages}</span>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Certifications:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedGuide.details.certifications}</span>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Experience:</strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedGuide.details.experience}</span>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Contact:</strong>
                    <span className="ml-2 text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 
                                   transition-colors cursor-pointer">{selectedGuide.details.contact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        /* Glassmorphism backdrop effects */
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </>
  );
};

export default TravelGuidesCarousel;