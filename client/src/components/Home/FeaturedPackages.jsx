import React from "react";

const packages = [
  {
    name: "Santorini Escape",
    location: "Greece",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Alpine Adventure",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Safari Journey",
    location: "Kenya",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bali Bliss",
    location: "Indonesia",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
];

const FeaturedPackages = () => (
  <section className="w-full bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-800 dark:to-purple-800 py-16 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8 text-center">
        Featured Travel Packages
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                  {pkg.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{pkg.location}</p>
              </div>
              <button className="mt-auto w-full bg-zinc-800 dark:bg-pink-600 hover:bg-zinc-900 dark:hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 transform hover:scale-105">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedPackages; 