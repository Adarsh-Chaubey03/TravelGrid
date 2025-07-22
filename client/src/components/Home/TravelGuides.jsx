import React from "react";

const guides = [
  {
    name: "Sarah Johnson",
    location: "Paris, France",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    specialty: "Art & Culture"
  },
  {
    name: "Marco Rodriguez",
    location: "Barcelona, Spain", 
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    specialty: "Food & Nightlife"
  },
  {
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5.0,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    specialty: "Traditional Culture"
  },
  {
    name: "Emma Wilson",
    location: "London, UK",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    specialty: "History & Museums"
  }
];

const TravelGuides = () => (
  <section className="w-full bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Meet Our Expert Guides
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with local experts who know their cities inside and out. Get personalized recommendations and insider tips.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {guides.map((guide, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={guide.image}
              alt={guide.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {guide.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{guide.location}</p>
            <p className="text-sm text-pink-600 dark:text-pink-400 font-medium mb-3">{guide.specialty}</p>
            
            <div className="flex items-center justify-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(guide.rating) ? 'fill-current' : 'fill-gray-300 dark:fill-gray-600'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {guide.rating} ({guide.reviews})
              </span>
            </div>
            
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200">
              Contact Guide
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TravelGuides;