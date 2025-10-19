import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Custom/Navbar";
import Footer from "../components/Custom/Footer";
import hotels from "../data/hotels";
import { useTheme } from "../context/ThemeContext";
import { config } from "../config";
import { Search } from "lucide-react";

function Hotels() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const { isDarkMode } = useTheme();

  // Get query param from URL on initial render
  const getInitialQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("query") || "";
  };

  // Update query state when URL search params change
  useEffect(() => {
    setQuery(getInitialQuery());
    // eslint-disable-next-line
  }, [location.search]);

  const filteredHotels = hotels.filter((hotel) => {
    const q = query.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(q) ||
      hotel.location.toLowerCase().includes(q)
    );
  });

  const handleLike = async (hotel) => {
    const body = {
      placeId: hotel.id,
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    };

    try {
      const res = await fetch(`${config.API_BASE_URL}/save/save-place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Place saved successfully to dashboard!");
      } else {
        toast.error(data.message || "⚠️ This place is already saved.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("🚨 Failed to save place. Please try again.");
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full overflow-x-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-black to-pink-900"
          : "from-pink-200/50 via-white/70 to-blue-200/50"
      }`}
    >
      <Navbar lightBackground={false} />

      <main className="flex flex-col flex-1 w-full items-center">
        <section className="relative w-full py-24 flex flex-col items-center text-center px-4">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1570591070094-f9b1cc333b71?auto=format&fit=crop&q=60"
            aria-hidden="true"
            className="absolute  w-full h-full inset-0 z-10 object-cover"
            loading="lazy"
          />

          {/* Gradient overlay to preserve original look in both themes */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 z-20 ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900/60 to-pink-900/30"
                : "bg-gradient-to-b from-blue-200/30 via-pink-100/30 to-purple-100/30"
            }`}
          />

          {/* Content layer */}
          <div className="relative z-30">
            <h1
              className={`text-4xl md:text-5xl font-extrabold mb-6 ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Explore World-Class <span className="text-pink-500">Hotels</span>
            </h1>
            <p
              className={`text-lg md:text-xl max-w-2xl mb-6 ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Experience the world’s best luxury hotels, carefully curated for
              you.
            </p>
            <div className="w-full max-w-2xl mx-auto relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by hotel or destination..."
                className={`w-full rounded-xl px-4 py-5 pl-16 pr-6 text-base md:text-lg focus:outline-none transition-all duration-300  border backdrop-blur-lg group-hover:shadow-pink-500/25 ${
                  isDarkMode
                    ? "bg-white/15 border-white/30 text-white placeholder-white/80 focus:bg-white/10 focus:border-pink-400/50 focus:ring-4 focus:ring-pink-500/40"
                    : "bg-white/80 border-black/30 text-gray-900 placeholder-gray-600 focus:bg-white/90 focus:border-pink-400/50 focus:ring-4 focus:ring-pink-500/40"
                }`}
              />
              <Search
                className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isDarkMode
                    ? "text-white/90"
                    : "text-gray-600"
                }`}
                size={22}
              />
            </div>
          </div>
        </section>

        <section className="max-w-7xl w-full pt-12 px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className={`group flex flex-col rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer hover:translate-y-2 ${
                isDarkMode
                  ? "bg-white/10 border-white/40 text-white hover:bg-white/15 hover:border-pink-500/30 hover:shadow-pink-500/20"
                  : "bg-white/80 border-white/30 text-gray-900 hover:bg-white/90 hover:border-pink-500/30 hover:shadow-pink-500/20"
              }`}
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                loading="lazy"
                className="w-full h-56 object-cover object-center rounded-t-2xl"
              />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`text-md sm:text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {hotel.name}
                  </h3>
                  {hotel.isPetFriendly && (
                    <div
                      className={`text-sm sm:text-lg cursor-pointer ${
                        isDarkMode ? "text-pink-400" : "text-pink-600"
                      }`}
                      title="Pet-friendly hotel"
                    >
                      🐾
                    </div>
                  )}
                </div>

                <span
                  className={`text-sm sm:text-md font-medium mb-3 ${
                    isDarkMode ? "text-pink-400" : "text-pink-500"
                  }`}
                >
                  {hotel.location}
                </span>
                <p
                  className={`text-xs sm:text-sm line-clamp-3 flex-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {hotel.description}
                </p>
                <button
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="mt-4 self-center w-full bg-gradient-to-r from-pink-500/90 to-purple-500/90 hover:from-pink-600/90 hover:to-purple-600/90 text-white py-2 rounded-lg font-semibold transition-all duration-300 cursor-pointer"
                >
                  Book Hotel
                </button>
                <button
                  onClick={() => handleLike(hotel)}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-fuchsia-400/10 hover:bg-fuchsia-400/30 text-pink-200"
                      : "bg-fuchsia-200 hover:bg-fuchsia-300 text-pink-500"
                  }`}
                >
                  ❤️ Save to Dashboard
                </button>
              </div>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <p
              className={`col-span-full text-center text-lg font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No hotels match your search.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Hotels;
