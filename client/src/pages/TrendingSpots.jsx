import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Star, Users, Calendar, Heart, Share2, Eye } from 'lucide-react';
import Navbar from '../components/Custom/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Heart as HeartFilled } from 'lucide-react';
import { FaSquareWhatsapp, FaSquareXTwitter, FaFacebook } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';

const TrendingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [displayedSpots, setDisplayedSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [open, setOpen] = useState(false);
  const { wishlist, addToWishlist } = useWishlist();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Your mock data here (mockTrendingSpots)
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

  const ITEMS_PER_LOAD = 9;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setSpots(mockTrendingSpots);
      setLoading(false);
      setDisplayedSpots(mockTrendingSpots.slice(0, ITEMS_PER_LOAD));
      setHasMore(mockTrendingSpots.length > ITEMS_PER_LOAD);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [selectedFilter, setSelectedFilter] = useState("All Spots");

  useEffect(() => {
    // Re-filter spots and reset displayed spots when the filter changes
    const filtered = selectedFilter === "All Spots"
      ? spots
      : spots.filter(spot => spot.category.toLowerCase() === selectedFilter.toLowerCase());

    setDisplayedSpots(filtered.slice(0, ITEMS_PER_LOAD));
    setHasMore(filtered.length > ITEMS_PER_LOAD);
  }, [selectedFilter, spots]);

  const fetchMoreData = () => {
    const newDisplayedSpots = selectedFilter === "All Spots"
      ? spots
      : spots.filter(spot => spot.category.toLowerCase() === selectedFilter.toLowerCase());

    if (displayedSpots.length >= newDisplayedSpots.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setDisplayedSpots(
        displayedSpots.concat(newDisplayedSpots.slice(displayedSpots.length, displayedSpots.length + ITEMS_PER_LOAD))
      );
    }, 2000); // Simulate network delay
  };

  const toggleFavorite = (spotId) => {
    setFavoriteSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    );
  };
  const AddToWishListHandler = (spot) => {
    const inWishlist = wishlist?.some((p) => p.id === spot.id);
    if (!inWishlist) {
      addToWishlist(spot);
      toast.success("Added to wishlist!");
    } else {
      toast("Already in your wishlist");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const categories = [
    { key: 'All Spots', label: 'All Spots', icon: TrendingUp },
    { key: 'Beach', label: 'Beach', icon: MapPin },
    { key: 'Cultural', label: 'Cultural', icon: Star },
    { key: 'Nature', label: 'Nature', icon: Calendar },
    { key: 'City', label: 'City', icon: Users },
    { key: 'Adventure', label: 'Adventure', icon: Heart }
  ];

  const shareUrl = window.location.href;
  const options = [
    {
      icon: <FaSquareWhatsapp color="green" size={50} cursor={'pointer'} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`)} />,
      text: "WhatsApp"
    },
    {
      icon: <FaFacebook color="blue" size={50} cursor={'pointer'} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")} />,
      text: "Facebook"
    },
    {
      icon: <FaSquareXTwitter size={50} cursor={'pointer'} color="black" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`)} />,
      text: "Twitter"
    },
    {
      icon: <SiGmail size={50} cursor={'pointer'} color="red" onClick={() => window.open(`mailto:?subject=${encodeURIComponent("Check out this Trending Spot!")}&body=${encodeURIComponent(`I found this spot, thought you might like it: ${shareUrl}`)}`)} />,
      text: "Mail"
    }
  ];

  const handleExploreLocation = (locationId) => {
    navigate(`/location/${locationId}`);
  };

  const handleRealTimeTrendsClick = () => {
    // Scroll to the trending destinations section
    const destinationsSection = document.getElementById('trending-destinations');
    if (destinationsSection) {
      // Add offset to account for sticky navigation
      const elementPosition = destinationsSection.offsetTop;
      const offsetPosition = elementPosition - 100; // 100px offset from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Show a toast notification to confirm the action
      toast.success("Showing trending destinations!", {
        duration: 2000,
        icon: '🔥',
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Discovering trending destinations...</p>
        </div>
      </div>
    );
  }

  const statsData = {
    "All Spots": [
      { icon: MapPin, label: "Destinations", value: `${displayedSpots.length}+`, color: "text-blue-400" },
      { icon: TrendingUp, label: "Avg Growth", value: "23%", color: "text-green-400" },
      { icon: Users, label: "Travelers", value: "150M+", color: "text-purple-400" },
      { icon: Star, label: "Avg Rating", value: "4.7★", color: "text-yellow-400" }
    ],
    "Beach": [
      { icon: MapPin, label: "Destinations", value: `${displayedSpots.length}+`, color: "text-blue-400" },
      { icon: TrendingUp, label: "Avg Growth", value: "12%", color: "text-green-400" },
      { icon: Users, label: "Travelers", value: "50M+", color: "text-purple-400" },
      { icon: Star, label: "Avg Rating", value: "4.5★", color: "text-yellow-400" }
    ],
    "Cultural": [
      { icon: MapPin, label: "Destinations", value: `${displayedSpots.length}+`, color: "text-blue-400" },
      { icon: TrendingUp, label: "Avg Growth", value: "18%", color: "text-green-400" },
      { icon: Users, label: "Travelers", value: "70M+", color: "text-purple-400" },
      { icon: Star, label: "Avg Rating", value: "4.6★", color: "text-yellow-400" }
    ],
    "Nature": [
      { icon: MapPin, label: "Destinations", value: `${displayedSpots.length}+`, color: "text-blue-400" },
      { icon: TrendingUp, label: "Avg Growth", value: "20%", color: "text-green-400" },
      { icon: Users, label: "Travelers", value: "90M+", color: "text-purple-400" },
      { icon: Star, label: "Avg Rating", value: "4.8★", color: "text-yellow-400" }
    ],
    "City": [
      { icon: MapPin, label: "Destinations", value: `${displayedSpots.length}+`, color: "text-blue-400" },
      { icon: TrendingUp, label: "Avg Growth", value: "15%", color: "text-green-400" },
      { icon: Users, label: "Travelers", value: "110M+", color: "text-purple-400" },
      { icon: Star, label: "Avg Rating", value: "4.4★", color: "text-yellow-400" }
    ],
    "Adventure": [
      { icon: MapPin, label: "Destinations", value: `${displayedSpots.length}+`, color: "text-blue-400" },
      { icon: TrendingUp, label: "Avg Growth", value: "10%", color: "text-green-400" },
      { icon: Users, label: "Travelers", value: "40M+", color: "text-purple-400" },
      { icon: Star, label: "Avg Rating", value: "4.4★", color: "text-yellow-400" }
    ],
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isDarkMode ? ' from-black/70 via-gray-900/60 to-transparent' : 'from-pink-100/60 via-white/40 to-transparent'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80"
            alt="World travel destinations"
            loading="lazy"
            className={`w-full h-full object-cover ${isDarkMode?"opacity-30":"opacity-60"}`}
          />
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-tr from-black via-blue-500/20 to-blue-400/20' : 'bg-gradient-to-b from-white/70 via-pink-100/50 to-transparent'}`} />
        </div>
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mt-20">
          <h1 className="text-4xl mt-8 md:text-5xl font-bold mb-4">
            Discover <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Trending Destinations</span>
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            Explore the world's most popular destinations, updated daily based on traveler insights.
          </p>
          <button 
            onClick={handleRealTimeTrendsClick}
            className={`inline-flex items-center px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group ${isDarkMode?'bg-pink-500/20 border-pink-500/20 text-pink-400 hover:bg-pink-500/30':'bg-pink-500 border-none text-white hover:bg-pink-600'}`}
          >
            <TrendingUp className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            <span className="font-medium">Real-Time Trends</span>
          </button>
        </div>
      </section>

  {/* Filter Tabs */}
  <section className={`sticky top-0 z-10 shadow-md ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-100/60 via-white/40 to-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedFilter(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedFilter === category.key
                    ? 'bg-pink-500 text-white'
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
            {statsData[selectedFilter].map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${isDarkMode ? 'bg-blue-400/10 border-white/20' : 'bg-white/90 border-gray-300'} text-center hover:shadow-lg transition-all duration-200`}
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spots Grid with InfiniteScroll */}
      <section id="trending-destinations" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InfiniteScroll
            dataLength={displayedSpots.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading more spots...</p>
              </div>
            }
            endMessage={
              <p className={`text-center py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <b>You've seen all the trending spots!</b>
              </p>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSpots.map((spot, index) => (
                <div
                  key={spot.id}
                  className={`backdrop-blur-md rounded-2xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden h-full ${
                    isDarkMode
                      ? 'bg-white/10 border-white/20 hover:border-pink-500/20'
                      : 'bg-white/90 border-black/20 hover:border-pink-500/20'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Trending Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white text-sm font-semibold flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>#{index + 1}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => { toggleFavorite(spot.id); AddToWishListHandler(spot) }}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-700'}`}
                      >
                        {favoriteSpots.includes(spot.id) ? (
                          <HeartFilled className="h-4 w-4 text-red-500" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                      </button>
                      <button className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-700'}`}
                        onClick={handleOpen}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          backdrop: {
                            style: { backgroundColor: "transparent" },
                          },
                        }}
                      >
                        <DialogTitle align="center">Share this Spot</DialogTitle>
                        <DialogContent>
                          <div style={{ display: "flex", alignItems: "center", gap: "1vmax" }}>
                            {options.map((item, index) => (
                              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <IconButton>{item.icon}</IconButton>
                                {item.text}
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Growth Badge */}
                    <div className="absolute bottom-3 right-3">
                      <div className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                        +{spot.growth_percentage}%
                      </div>
                    </div>

                    {/* Location Info Overlay */}
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
                          spot.price_range === '$$' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}
                      >
                        {spot.price_range}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-pink-500" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {spot.visitors_count}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-pink-500" />
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
                            className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : 'bg-pink-100 text-pink-700'
                              }`}
                          >
                            {highlight}
                          </span>
                        ))}
                        {spot.highlights.length > 2 && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                            +{spot.highlights.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-pink-500" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {spot.recent_reviews} reviews
                        </span>
                      </div>
                      <div className="text-sm font-medium text-pink-500">
                        Score: {spot.trending_score}
                      </div>
                    </div>

                    <button
                      onClick={() => handleExploreLocation(spot.id)}
                      className="w-full mt-4 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                    >
                      Explore {spot.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>

          {displayedSpots.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No destinations match the selected category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrendingSpots;