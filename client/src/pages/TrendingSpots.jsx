import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Star, Users, Calendar, Heart, Share2, Eye } from 'lucide-react';
import Navbar from '../components/Custom/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Heart as HeartFilled } from 'lucide-react';

const TrendingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const mockTrendingSpots = [
    {
      id: 1,
      name: "Santorini, Greece",
      country: "Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      trending_score: 95,
      visitors_count: "2.3M",
      category: "beach",
      price_range: "$$",
      best_time: "Apr-Oct",
      highlights: ["Stunning sunsets", "White architecture", "Wine tours"],
      recent_reviews: 1250,
      growth_percentage: 23
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      trending_score: 92,
      visitors_count: "1.8M",
      category: "cultural",
      price_range: "$",
      best_time: "Mar-May, Sep-Nov",
      highlights: ["Ancient temples", "Cherry blossoms", "Traditional culture"],
      recent_reviews: 2100,
      growth_percentage: 18
    },
    {
      id: 3,
      name: "Banff National Park",
      country: "Canada",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      trending_score: 89,
      visitors_count: "4.2M",
      category: "nature",
      price_range: "$",
      best_time: "Jun-Sep",
      highlights: ["Mountain lakes", "Wildlife viewing", "Hiking trails"],
      recent_reviews: 890,
      growth_percentage: 31
    },
    {
      id: 4,
      name: "Dubai, UAE",
      country: "United Arab Emirates",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.6,
      trending_score: 87,
      visitors_count: "16.7M",
      category: "city",
      price_range: "$$",
      best_time: "Nov-Mar",
      highlights: ["Luxury shopping", "Modern architecture", "Desert safari"],
      recent_reviews: 3200,
      growth_percentage: 15
    },
    {
      id: 5,
      name: "Tulum, Mexico",
      country: "Mexico",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.5,
      trending_score: 85,
      visitors_count: "800K",
      category: "beach",
      price_range: "$$",
      best_time: "Dec-Apr",
      highlights: ["Mayan ruins", "Cenotes", "Bohemian vibes"],
      recent_reviews: 670,
      growth_percentage: 42
    },
    {
      id: 6,
      name: "Reykjavik, Iceland",
      country: "Iceland",
      image: "https://images.unsplash.com/photo-1606130503037-6a8ef67c9d2d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      trending_score: 83,
      visitors_count: "1.2M",
      category: "nature",
      price_range: "$$",
      best_time: "Jun-Aug, Sep-Mar",
      highlights: ["Northern lights", "Blue lagoon", "Unique landscapes"],
      recent_reviews: 540,
      growth_percentage: 28
    },
    {
      id: 7,
      name: "Maldives",
      country: "Maldives",
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      trending_score: 91,
      visitors_count: "1.7M",
      category: "beach",
      price_range: "$$",
      best_time: "Nov-Apr",
      highlights: ["Overwater villas", "Crystal clear water", "Luxury resorts"],
      recent_reviews: 980,
      growth_percentage: 35
    },
    {
      id: 8,
      name: "Machu Picchu, Peru",
      country: "Peru",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      trending_score: 88,
      visitors_count: "1.5M",
      category: "cultural",
      price_range: "$",
      best_time: "May-Sep",
      highlights: ["Ancient Inca ruins", "Mountain hiking", "Sacred valley"],
      recent_reviews: 1150,
      growth_percentage: 22
    },
    {
      id: 9,
      name: "Bali, Indonesia",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.6,
      trending_score: 86,
      visitors_count: "6.3M",
      category: "beach",
      price_range: "$",
      best_time: "Apr-Oct",
      highlights: ["Rice terraces", "Temples", "Beach clubs"],
      recent_reviews: 2800,
      growth_percentage: 29
    },
    {
      id: 10,
      name: "Swiss Alps",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      trending_score: 90,
      visitors_count: "3.1M",
      category: "nature",
      price_range: "$$",
      best_time: "Jun-Sep, Dec-Mar",
      highlights: ["Mountain peaks", "Skiing", "Alpine villages"],
      recent_reviews: 750,
      growth_percentage: 19
    },
    {
      id: 11,
      name: "Paris, France",
      country: "France",
      image: "https://images.unsplash.com/photo-1712647016816-7072674bd83f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      trending_score: 84,
      visitors_count: "38M",
      category: "city",
      price_range: "$$",
      best_time: "Apr-Jun, Sep-Oct",
      highlights: ["Eiffel Tower", "Art museums", "French cuisine"],
      recent_reviews: 4200,
      growth_percentage: 12
    },
    {
      id: 12,
      name: "New York City, USA",
      country: "United States",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.5,
      trending_score: 82,
      visitors_count: "65M",
      category: "city",
      price_range: "$$",
      best_time: "Apr-Jun, Sep-Nov",
      highlights: ["Broadway shows", "Central Park", "Museums"],
      recent_reviews: 5800,
      growth_percentage: 8
    },
    {
      id: 13,
      name: "Queenstown, New Zealand",
      country: "New Zealand",
      image: "https://images.unsplash.com/photo-1729297916353-05bc7dc01cb5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      trending_score: 90,
      visitors_count: "3M",
      category: "adventure",
      price_range: "$$$",
      best_time: "Dec-Feb",
      highlights: ["Bungee jumping", "Skiing", "Skydiving"],
      recent_reviews: 1200,
      growth_percentage: 12
    },
    {
      id: 14,
      name: "Interlaken, Switzerland",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1689074521618-6c2b3dc31470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      trending_score: 87,
      visitors_count: "2M",
      category: "adventure",
      price_range: "$$$",
      best_time: "Jun-Sep",
      highlights: ["Paragliding", "Hiking", "Canyoning"],
      recent_reviews: 980,
      growth_percentage: 10
    },
    {
      id: 15,
      name: "Banff National Park, Canada",
      country: "Canada",
      image: "https://images.unsplash.com/photo-1703359330110-fab35ef1c326?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      trending_score: 93,
      visitors_count: "4.1M",
      category: "adventure",
      price_range: "$$",
      best_time: "Jun-Aug",
      highlights: ["Kayaking", "Rock climbing", "Mountain biking"],
      recent_reviews: 2100,
      growth_percentage: 14
    },
    {
      id: 16,
      name: "Moab, Utah, USA",
      country: "United States",
      image: "https://images.unsplash.com/photo-1610332218333-28cf27f6f771?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.6,
      trending_score: 85,
      visitors_count: "1.6M",
      category: "adventure",
      price_range: "$$",
      best_time: "Mar-May, Sep-Oct",
      highlights: ["Off-road driving", "Rock climbing", "Hiking in Arches NP"],
      recent_reviews: 760,
      growth_percentage: 9
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setSpots(mockTrendingSpots);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLoadMoreSpots = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const toggleFavorite = (spotId) => {
    setFavoriteSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };

  const filteredSpots = filter === 'all'
    ? spots
    : spots.filter(spot => spot.category === filter);

  const categories = [
    { key: 'all', label: 'All Spots', icon: TrendingUp },
    { key: 'beach', label: 'Beach', icon: MapPin },
    { key: 'cultural', label: 'Cultural', icon: Star },
    { key: 'nature', label: 'Nature', icon: Calendar },
    { key: 'city', label: 'City', icon: Users },
    { key: 'adventure', label: 'Adventure', icon: Heart }
  ];

  const handleExploreLocation = (locationId) => {
    navigate(`/location/${locationId}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading trending destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80"
            alt="World travel destinations"
            loading="lazy"
            className="w-full h-full object-cover opacity-30"
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900/70' : 'bg-gray-50/70'}`} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="text-blue-500">Trending Destinations</span>
          </h1>
          <p className={`text-lg md:text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore the world's most popular destinations, updated daily based on traveler insights.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-500 font-medium">Real-Time Trends</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-10 bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setFilter(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === category.key
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MapPin, label: 'Destinations', value: `${filteredSpots.length}+`, color: 'text-blue-400' },
              { icon: TrendingUp, label: 'Avg Growth', value: '23%', color: 'text-green-400' },
              { icon: Users, label: 'Travelers', value: '150M+', color: 'text-purple-400' },
              { icon: Star, label: 'Avg Rating', value: '4.7★', color: 'text-yellow-400' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} text-center hover:shadow-lg transition-all duration-200`}
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spots Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.slice(0, visibleCount).map((spot, index) => (
              <div
                key={spot.id}
                className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md hover:shadow-xl transition-all duration-300 flex flex-col`}
              >
                {/* Image Container */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="px-2 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(spot.id)}
                      className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-900/50 text-white' : 'bg-white/80 text-gray-700'} hover:scale-110 transition-all duration-200`}
                    >
                      {favoriteSpots.includes(spot.id) ? (
                        <HeartFilled className="h-4 w-4 text-red-500" fill="red" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </button>
                    <button className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-900/50 text-white' : 'bg-white/80 text-gray-700'} hover:scale-110 transition-all duration-200`}>
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                      +{spot.growth_percentage}%
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-lg font-bold text-white">{spot.name}</h3>
                    <div className="flex items-center text-sm text-gray-200">
                      <MapPin className="h-3 w-3 mr-1" />
                      {spot.country}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {spot.rating}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ({spot.recent_reviews} reviews)
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        spot.price_range === '$' ? 'bg-green-100 text-green-800' :
                        spot.price_range === '$$' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {spot.price_range}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {spot.visitors_count}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {spot.best_time}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {spot.highlights.slice(0, 2).map((highlight, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {highlight}
                        </span>
                      ))}
                      {spot.highlights.length > 2 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          +{spot.highlights.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {spot.recent_reviews} reviews
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-blue-500">
                      Score: {spot.trending_score}
                    </div>
                  </div>

                  <button
                    onClick={() => handleExploreLocation(spot.id)}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Explore {spot.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSpots.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No destinations match the selected category.
              </p>
            </div>
          )}

          {visibleCount < filteredSpots.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMoreSpots}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Load More Destinations
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrendingSpots;