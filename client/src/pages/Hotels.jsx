import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Custom/Navbar';
import Footer from '../components/Custom/Footer';
import hotels from '../data/hotels';
import { useTheme } from '../context/ThemeContext';
import { config } from '../config';

function Hotels() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const { isDarkMode } = useTheme();

  // Get query param from URL on initial render
  const getInitialQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('query') || '';
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Place saved successfully to dashboard!');
      } else {
        toast.error(data.message || '⚠️ This place is already saved.');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('🚨 Failed to save place. Please try again.');
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full overflow-x-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-black to-pink-900'
          : 'bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50'
      }`}
    >
      <Navbar lightBackground={false} />

      <main className="flex flex-col flex-1 w-full items-center">
        <section
          className={`w-full py-24 flex flex-col items-center text-center px-4 ${
            isDarkMode
              ? 'bg-gradient-to-br from-black to-pink-900'
              : 'bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700 mb-6">
            Explore World-Class <span className="text-pink-600">Hotels</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
            Browse and book from our curated list of the top luxury hotels worldwide.
          </p>
          <div className="w-full max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hotel or destination..."
              className="w-full px-6 py-4 rounded-xl bg-white border-2 border-pink-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 shadow-lg transition-all"
            />
          </div>
        </section>

        <section className="max-w-7xl w-full pt-12 px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className={`flex flex-col rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-800/90 border border-pink-400/30 hover:bg-gray-800/95'
                  : 'bg-white/95 border border-pink-300/50 hover:bg-white/100 hover:scale-105'
              }`}
            >
              <img
                src={hotel.image}
                alt={hotel.name}

                loading="lazy" 
                className="w-full h-56 object-cover object-center"

              />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`text-2xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-950'
                    }`}
                  >
                    {hotel.name}
                  </h3>
                  {hotel.isPetFriendly && (
                    <div
                      className={`text-xl cursor-pointer ${
                        isDarkMode ? 'text-pink-400' : 'text-pink-600'
                      }`}
                      title="Pet-friendly hotel"
                    >
                      🐾
                    </div>
                  )}
                </div>

                <span
                  className={`font-medium mb-3 ${
                    isDarkMode ? 'text-pink-400' : 'text-pink-600'
                  }`}
                >
                  {hotel.location}
                </span>
                <p
                  className={`text-sm line-clamp-3 flex-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {hotel.description}
                </p>
                <button
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="mt-4 self-start bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Book Hotel
                </button>
                <button
                  onClick={() => handleLike(hotel)}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-pink-900/30 hover:bg-pink-900/50 text-pink-400'
                      : 'bg-pink-100 hover:bg-pink-200 text-pink-600'
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
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
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