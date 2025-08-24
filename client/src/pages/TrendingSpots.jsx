import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Star, Users, Calendar, Heart, Share2, Eye } from 'lucide-react';
import Navbar from '../components/Custom/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Heart as HeartFilled } from "lucide-react"; // We'll reuse but with fill

const TrendingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  
const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Mock data for trending spots
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
  }

  const toggleFavorite = (spotId) => {
  setFavoriteSpots((prev) =>
    prev.includes(spotId)
      ? prev.filter((id) => id !== spotId) // remove if already in favorites
      : [...prev, spotId]                  // add if not in favorites
   );
  };


  const filteredSpots = filter === 'all'
    ? spots
    : spots.filter(spot => spot.category === filter);

  const categories = [
    { key: 'all', label: 'All Spots', icon: TrendingUp },
    { key: 'beach', label: 'Beach', icon: '🏖️' },
    { key: 'cultural', label: 'Cultural', icon: '🏛️' },
    { key: 'nature', label: 'Nature', icon: '🏔️' },
    { key: 'city', label: 'City', icon: '🏙️' },
    { key: 'adventure', label: 'Adventure', icon: '🏕️' }
  ];

  //function to navigate to location detail
  const handleExploreLocation = (locationId) => {
    navigate(`/location/${locationId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>Loading trending spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-black to-pink-900 text-white' : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-black'}`}
    style={{ marginTop: '5rem' }}
    >

      <Navbar lightBackground />
      {/* Hero Section */}
      <div className="relative text-white py-24 md:py-46 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80"
            alt="World travel destinations"
            loading="lazy" 
            className="w-full h-full object-cover object-center brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-pink-900/40 to-black/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg text-pink-500">
              Trending <span className='text-pink-500'>Spots</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-md">
              Discover the hottest destinations everyone's talking about
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-100 drop-shadow-sm">
              <TrendingUp className="h-5 w-5" />
              <span>Updated daily based on bookings and reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-pink-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start md:justify-center space-x-2 md:space-x-4 py-3 md:py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button aria-label="Search"
                key={category.key}
                onClick={() => setFilter(category.key)}
                className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer text-sm md:text-base ${filter === category.key
                  ? 'bg-white text-pink-600 font-semibold shadow-md'
                  : 'border border-pink-300/20 text-pink-100 hover:bg-white/10 hover:border-pink-200/30'
                  }`}
              >
                {typeof category.icon === 'string' ? (
                  <span className="text-base md:text-lg">{category.icon}</span>
                ) : (
                  <category.icon className="h-4 w-4 md:h-5 md:w-5" />
                )}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Trending Stats Banner */}
      <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 group p-4 md:p-6 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>{filteredSpots.length}+</div>
              <div className="text-sm md:text-base" style={{ color: 'var(--accent-secondary)' }}>Trending Destinations</div>
            </div>
            <div className="border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 group p-4 md:p-6 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-2xl md:text-3xl font-bold text-green-400">23%</div>
              <div className="text-sm md:text-base" style={{ color: 'var(--accent-secondary)' }}>Average Growth</div>
            </div>
            <div className="border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 group p-4 md:p-6 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-2xl md:text-3xl font-bold text-purple-400">—</div>
              <div className="text-sm md:text-base" style={{ color: 'var(--accent-secondary)' }}>Monthly Searches</div>
            </div>
            <div className="border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 group p-4 md:p-6 text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-2xl md:text-3xl font-bold text-red-400">4.7★</div>
              <div className="text-sm md:text-base" style={{ color: 'var(--accent-secondary)' }}>Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredSpots.slice(0, visibleCount).map((spot, index) => (
            <div
              key={spot.id}
              className=" hover:border-white/40 hover:scale-105 hover:shadow-pink-500/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-white border border-gray-200"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  loading ="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <div className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold flex items-center space-x-1" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
                    <TrendingUp className="h-3 w-3" />
                    <span>#{index + 1}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button aria-label="Search"
                    onClick={() => toggleFavorite(spot.id)}
                    className="p-1.5 md:p-2 rounded-full transition-all cursor-pointer hover:scale-110"
                    style={{
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    {favoriteSpots.includes(spot.id) ? (
                      <HeartFilled
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="red"
                        color="red"
                      />
                    ) : (
                      <Heart className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </button>
                  <button aria-label="Search" className="p-1.5 md:p-2 rounded-full transition-all cursor-pointer hover:scale-110" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
                    <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div className="px-2 py-1 rounded text-xs font-semibold" style={{ background: 'var(--success-color)', color: '#fff' }}>
                    +{spot.growth_percentage}%
                  </div>
                </div>
              </div>

              {/* Content */}
               {/* Remove "height-full" which causing extra space in content */}
              <div className="p-4 md:p-6 flex flex-col">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 truncate" style={{ color: 'var(--text-primary)' }}>
                      {spot.name}
                    </h3>
                    <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                      <span className="text-sm md:text-base truncate">{spot.country}</span>
                    </div>
                  </div>
                  <div className="text-right ml-2 md:ml-4 flex-shrink-0">
                    <div className="flex items-center justify-end space-x-1 mb-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" style={{ color: 'var(--warning-color)' }} />
                      <span className="text-xs md:text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{spot.rating}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{spot.price_range}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Users className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <span className="truncate" style={{ color: 'var(--text-muted)' }}>{spot.visitors_count} visitors</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <span className="truncate" style={{ color: 'var(--text-muted)' }}>{spot.best_time}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-3 md:mb-4">
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {spot.highlights.slice(0, 2).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium truncate max-w-full"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}
                      >
                        {highlight}
                      </span>
                    ))}
                    {spot.highlights.length > 2 && (
                      <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium" style={{ background: 'var(--accent-secondary)', color: '#fff' }}>
                        +{spot.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="flex items-center justify-between pt-3 md:pt-4 border-t mt-auto" style={{ borderColor: 'var(--border-primary)' }}>
                  <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
                    <Eye className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{spot.recent_reviews} recent reviews</span>
                  </div>
                  <div className="text-xs md:text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                    Trending Score: {spot.trending_score}
                  </div>
                </div>

                {/* CTA Button */}
                <button aria-label="Search" className="w-full mt-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 cursor-pointer duration-200"
                  onClick={() => handleExploreLocation(spot.id)}>
                  Explore {spot.name}
                </button>
              </div>
            </div>
          ))}
          {filteredSpots.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg md:text-xl font-medium" style={{ color: 'var(--text-secondary)' }}>
                No spots match the selected category.
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredSpots.length && (
          <div className="text-center mt-8 md:mt-12">
            <button aria-label="Search"
              onClick={handleLoadMoreSpots}
              className="bg-gradient-to-r from-pink-600 to-pink-500 shadow-md hover:shadow-lg text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 duration-200 cursor-pointer text-sm md:text-base"
            >
              Load More Trending Spots
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingSpots;
