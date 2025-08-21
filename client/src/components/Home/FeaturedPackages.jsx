import React, { useState } from "react";

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

const FeaturedPackages = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
  return(
  <section className="w-full bg-gradient-to-br from-blue-50 to-pink-50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
        Featured Travel Packages
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-800">
                  {pkg.name}
                </h3>
                <p className="text-gray-500 mb-4">{pkg.location}</p>
              </div>
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200"   onClick={() => setSelectedPackage(pkg)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
       {selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-lg relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                ✖
              </button>

              <img
                src={selectedPackage.image}
                alt={selectedPackage.name}
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">{selectedPackage.name}</h3>
              <p className="text-gray-600 mb-4">{selectedPackage.location}</p>
              <p className="text-gray-700 mb-4">{selectedPackage.description}</p>

              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200">
                Proceed to Book
              </button>
            </div>
          </div>
        )}
    </div>
  </section>
 )
};

export default FeaturedPackages; 