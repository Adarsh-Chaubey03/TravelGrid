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
    // Add animation effect when component mounts
    setAnimate(true);

    // Reset page to 1 when wishlist changes
    setPage(1);
  }, [wishlist.length]);

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginated = wishlist.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleNavigateToTrending = () => {
    navigate("/trending-spots");
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar lightBackground />

      {/* Hero Section */}
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transition-all duration-700 transform ${
              animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full">
                <Heart
                  className="h-8 w-8 text-pink-600 dark:text-pink-400"
                  fill="currentColor"
                />
              </div>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Your{" "}
              <span className="text-pink-600 dark:text-pink">Wishlist</span>
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--text-primary)" }}
            >
              All your favorite destinations saved in one place for your future
              adventures.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {wishlist.length === 0 ? (
            <div
              className={`text-center py-16 rounded-xl bg-white dark:bg-gradient-to-br from-black to-[#ec4899] shadow-md transition-all duration-700 transform ${
                animate
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex justify-center mb-6">
                <img
                  src={travelIllustration}
                  alt="No items in your wishlist yet"
                  className="h-64 mb-4"
                />
              </div>
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Your wishlist is empty
              </h3>
              <p
                className="text-md max-w-md mx-auto mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Start saving your dream destinations to plan your next
                adventure!
              </p>
              <button
                onClick={handleNavigateToTrending}
                aria-label="Explore trending spots"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Explore Trending Spots
              </button>
            </div>
          ) : (
            <>
              <div
                className={`mb-8 transition-all duration-700 transform ${
                  animate
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Saved Destinations ({wishlist.length})
                  </h2>
                  <button
                    aria-label="Search"
                    onClick={handleNavigateToTrending}
                    className="text-sm flex items-center  text-black dark:text-white hover:underline"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    View Trending
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginated.map((item, index) => (
                    <div
                      key={item.id}
                      className={`transition-all duration-700 transform ${
                        animate
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
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
                      aria-label="Search"
                      className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-shadow flex items-center"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" />
                      <span>Previous</span>
                    </button>
                    <span
                      className="text-sm font-medium px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Page {page} of {totalPages}
                    </span>
                    <button
                      aria-label="Search"
                      className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-shadow flex items-center"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      <span>Next</span>
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
