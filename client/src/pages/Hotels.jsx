import React, { useState } from 'react';

// Mock hotels data for demonstration
const hotels = [
  {
    id: 1,
    name: "Grand Palace Resort",
    location: "Maldives",
    description: "Experience luxury at its finest with overwater bungalows, pristine beaches, and world-class amenities. Perfect for romantic getaways and tropical adventures.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Alpine Mountain Lodge",
    location: "Swiss Alps",
    description: "Nestled in the heart of the Swiss Alps, offering breathtaking mountain views, skiing facilities, and cozy fireplaces for the perfect winter retreat.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Desert Oasis Hotel",
    location: "Dubai, UAE",
    description: "A luxurious escape in the heart of Dubai featuring modern architecture, spa services, and stunning city skyline views from every room.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Coastal Breeze Resort",
    location: "Santorini, Greece",
    description: "Perched on the cliffs of Santorini with panoramic Aegean Sea views, infinity pools, and authentic Greek hospitality in a picturesque setting.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Urban Boutique Hotel",
    location: "Tokyo, Japan",
    description: "Modern minimalist design meets Japanese tradition in the heart of Tokyo, offering easy access to cultural sites and vibrant city life.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Safari Lodge",
    location: "Serengeti, Tanzania",
    description: "An authentic African safari experience with luxury tents, guided wildlife tours, and unforgettable sunsets over the vast Serengeti plains.",
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1000&auto=format&fit=crop"
  }
];

function Hotels() {
  const [query, setQuery] = useState('');

  const filteredHotels = hotels.filter((hotel) => {
    const q = query.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(q) ||
      hotel.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 dark:bg-gray-900 overflow-x-hidden transition-colors duration-300">
      <main className="flex flex-col flex-1 w-full items-center">
        {/* Hero + Search */}
        <section className="w-full py-24 flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 transition-colors duration-300">
            Explore World-Class <span className="text-pink-400">Hotels</span>
          </h1>
          <p className="text-lg md:text-xl text-pink-200 dark:text-gray-300 max-w-2xl transition-colors duration-300">
            Browse and book from our curated list of the top luxury hotels worldwide.
          </p>
          <div className="mt-8 w-full max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hotel or destination..."
              className="w-full px-6 py-3 rounded-lg bg-white/90 dark:bg-gray-800 dark:border dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-500/30 dark:focus:ring-pink-400/30 transition-colors duration-300"
            />
          </div>
        </section>

        {/* Hotel List */}
        <section className="max-w-7xl w-full px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="backdrop-blur-sm bg-white/5 dark:bg-gray-800 border border-pink-400/20 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col transition-colors duration-300"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-56 object-cover object-center"
              />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold text-white dark:text-white mb-1 transition-colors duration-300">
                  {hotel.name}
                </h3>
                <span className="text-pink-300 dark:text-pink-400 font-medium mb-3 transition-colors duration-300">
                  {hotel.location}
                </span>
                <p className="text-sm text-pink-200 dark:text-gray-300 line-clamp-3 flex-1 transition-colors duration-300">
                  {hotel.description}
                </p>
                <button
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="mt-4 self-start bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 dark:from-pink-600 dark:to-pink-500 dark:hover:from-pink-500 dark:hover:to-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Book Hotel
                </button>
              </div>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <p className="col-span-full text-center text-pink-200 dark:text-gray-300 transition-colors duration-300">
              No hotels match your search.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Hotels;