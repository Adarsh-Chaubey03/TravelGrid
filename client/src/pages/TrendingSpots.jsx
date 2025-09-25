import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Star, Users, Calendar, Heart, Share2, Eye } from 'lucide-react';
import Navbar from '../components/Custom/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Heart as HeartFilled } from 'lucide-react';
import { FaSquareWhatsapp, FaSquareXTwitter, FaFacebook } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

const TrendingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Spots");

  const { wishlist, addToWishlist } = useWishlist();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Mock data
  const mockTrendingSpots = [ /* your array of 16 spots */ ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpots(mockTrendingSpots);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const filteredSpots = selectedFilter === "All Spots"
    ? spots
    : spots.filter(spot => spot.category.toLowerCase() === selectedFilter.toLowerCase());

  const categories = [
    { key: 'All Spots', label: 'All Spots', icon: TrendingUp },
    { key: 'Beach', label: 'Beach', icon: MapPin },
    { key: 'Cultural', label: 'Cultural', icon: Star },
    { key: 'Nature', label: 'Nature', icon: Calendar },
    { key: 'City', label: 'City', icon: Users },
    { key: 'Adventure', label: 'Adventure', icon: Heart }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Discovering trending destinations...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar />

      {/* Filter Tabs */}
      <section className="sticky top-0 z-10 bg-gray-900 shadow-md">
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

      {/* Spots Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.slice(0, visibleCount).map((spot, index) => (
              <div key={spot.id} className="backdrop-blur-md rounded-2xl border overflow-hidden">
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button onClick={() => { toggleFavorite(spot.id); AddToWishListHandler(spot); }}>
                      {favoriteSpots.includes(spot.id) ? <HeartFilled /> : <Heart />}
                    </button>
                    <button onClick={handleOpen}>
                      <Share2 />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{spot.name}</h3>
                  <p>{spot.country}</p>
                  <button onClick={() => navigate(`/location/${spot.id}`)}>Explore</button>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filteredSpots.length && (
            <div className="text-center mt-8">
              <button onClick={() => setVisibleCount(prev => prev + 9)}>Load More Trending Spots</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrendingSpots;
