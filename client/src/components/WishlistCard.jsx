import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { MapPin, Star, Users, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const WishlistCard = ({ item }) => {
  const { removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const {isDarkMode}=useTheme();

  const handleRemoveFromWishlist = (e) => {
    e.stopPropagation();
    removeFromWishlist(item.id);
  };

  const handleNavigateToDetails = () => {
    // Navigate to location details page
    navigate(`/location/${item.id}`);
  };

  return (
    <div 
      className={`rounded-xl shadow-md overflow-hidden border border-gray-500/20 ${isDarkMode?"bg-gray-500/20":"bg-white/30"} hover:shadow-xl transition-all duration-300 h-full flex flex-col relative group`}
      onClick={handleNavigateToDetails}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <button aria-label="Search"
            className={`p-2 rounded-full shadow-md  transition-colors ${isDarkMode?"bg-red-900/30 border-white/20 ":"bg-white/80 border-white/60"} cursor-pointer`}
            onClick={handleRemoveFromWishlist}
            title="Remove from wishlist"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
          
          <button aria-label="Search"
            className={`p-2 rounded-full shadow-md  transition-colors ${isDarkMode?" border-white/20 bg-blue-900/50":"bg-white/80 border-white/60"} cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/location/${item.id}`, '_blank');
            }}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4 text-blue-500" />
          </button>
        </div>

        {/* Category badge */}
        {item.category && (
          <div className="absolute top-3 left-3">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-pink-500 text-gray-900">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </div>
          </div>
        )}

        {/* Rating badge */}
        {item.rating && (
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-300 text-gray-800 flex items-center">
              <Star className="h-3 w-3 mr-1" fill="currentColor" />
              {item.rating}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
        
        <div className="flex items-center text-gray-700 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className='text-gray-700'>{item.country || 'Unknown Location'}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          {item.visitors_count && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1 text-pink-500" />
              <span className="text-gray-700">{item.visitors_count} visitors</span>
            </div>
          )}
          {item.best_time && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-pink-500" />
              <span className="text-gray-700">{item.best_time}</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1">
              {item.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${isDarkMode?"bg-gray-500/20 text-pink-300":"bg-pink-500/10 text-pink-500"}`}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistCard;
