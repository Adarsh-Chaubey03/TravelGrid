import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";
import { Heart, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Custom/Navbar";
import { useTheme } from "../context/ThemeContext";
import travelIllustration from "../assets/Trip-pana.svg";

const ITEMS_PER_PAGE = 6;

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const [page, setPage] = useState(1);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setAnimate(true);
    setPage(1);
  }, [wishlist.length]);

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginated = wishlist.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleNavigateToTrending = () => {
    navigate("/trending-spots");
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${
      isDarkMode
        ? "bg-gradient-to-br from-black to-pink-900"
        : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300"
    }`}>
      <Navbar />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}>
          <div className="flex justify-center mb-4">
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full">
                <Heart
                  className="h-8 w-8 text-pink-600 dark:text-pink-400"
                  fill="currentColor"
                />
              </div>
          </div>
          <h1 className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Wishlist
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            All your favorite destinations saved in one place for your future adventures.
          </p>
        </div>

        {/* Content Section */}
        {wishlist.length === 0 ? (
          <div className={`backdrop-blur-md rounded-2xl p-8 sm:p-12 border text-center transition-all duration-700 transform ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } ${
            isDarkMode 
              ? "bg-white/10 border-white/20" 
              : "bg-white/30 border-black/10"
          }`}>
            <div className="flex justify-center mb-6">
              <img
                src={travelIllustration}
                alt="No items in your wishlist yet"
                className="h-48 sm:h-64 opacity-80"
              />
            </div>
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Your wishlist is empty
            </h3>
            <p className={`text-base md:text-lg max-w-md mx-auto mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Start saving your dream destinations to plan your next adventure!
            </p>
            <button
              onClick={handleNavigateToTrending}
              aria-label="Explore trending spots"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Explore Trending Spots
            </button>
          </div>
        ) : (
          <div className={`transition-all duration-700 transform ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            {/* Header with Count */}
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl md:text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Saved Destinations ({wishlist.length})
              </h2>
              <button
                aria-label="View Trending"
                onClick={handleNavigateToTrending}
                className={`text-sm flex items-center font-medium transition-colors ${
                  isDarkMode 
                    ? "text-pink-400 hover:text-pink-300" 
                    : "text-pink-600 hover:text-pink-700"
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                View Trending
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginated.map((item, index) => (
                <div
                  key={item.id}
                  className={`transition-all duration-700 transform ${
                    animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <WishlistCard item={item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  aria-label="Previous page"
                  className={`px-4 py-2 rounded-lg font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                    isDarkMode
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                      : "bg-white/50 border border-black/10 text-gray-800 hover:bg-white/70"
                  }`}
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span>Previous</span>
                </button>
                
                <span className={`text-sm font-medium px-4 py-2 rounded-lg shadow-md ${
                  isDarkMode
                    ? "bg-white/10 border border-white/20 text-white"
                    : "bg-white/50 border border-black/10 text-gray-800"
                }`}>
                  Page {page} of {totalPages}
                </span>
                
                <button
                  aria-label="Next page"
                  className={`px-4 py-2 rounded-lg font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                    isDarkMode
                      ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                      : "bg-white/50 border border-black/10 text-gray-800 hover:bg-white/70"
                  }`}
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  <span>Next</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;