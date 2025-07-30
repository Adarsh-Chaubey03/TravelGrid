import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Custom/Navbar';
import Footer from '../components/Custom/Footer';
import hotels from '../data/hotels';


function Hotels() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredHotels = hotels.filter((hotel) => {
    const q = query.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(q) ||
      hotel.location.toLowerCase().includes(q)
    );
  });

// Function to handle saving a hotel to the user's dashboard
const handleLike = async (hotel) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("You must be logged in to save places.");
    return;
  }

  const body = {
    placeId: hotel.id, 
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
  };

  try {
    const res = await fetch('http://localhost:5000/api/save/save-place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
    <div className="flex flex-col min-h-screen w-full  overflow-x-hidden">

      {<Navbar lightBackground />}   {/*Added props of lightBackground to this page.*/}


      <main className="flex flex-col flex-1 w-full items-center">
        {/* Hero + Search */}
        <section className="w-full py-24 flex flex-col items-center text-center px-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Explore World-Class <span className="text-pink-600">Hotels</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
            Browse and book from our curated list of the top luxury hotels worldwide.
          </p>
          <div className="w-full max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hotel or destination..."
              className="w-full px-6 py-4 rounded-xl bg-white border-2 border-pink-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 shadow-lg transition-all"
            />
          </div>
        </section>

        {/* Hotel List */}
        <section className="max-w-7xl w-full px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="backdrop-blur-lg bg-white/95 border border-pink-300/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col hover:shadow-pink-200/30 transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-56 object-cover object-center"
              />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                  {hotel.name}
                </h3>
                <span className="text-pink-600 font-medium mb-3">
                  {hotel.location}
                </span>
                <p className="text-sm text-gray-700 line-clamp-3 flex-1">
                  {hotel.description}
                </p>
                <button
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="mt-4 self-start bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Book Hotel
                </button>
                {/* Button to save places */}
                <button
                  onClick={() => handleLike(hotel)}
                  className="mt-2 bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  ❤️ Save to Dashboard
                </button>

              </div>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <p className="col-span-full text-center text-gray-600 text-lg font-medium">
              No hotels match your search.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Hotels; 