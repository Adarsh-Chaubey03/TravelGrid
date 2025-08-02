import React from "react";
import { useNavigate } from "react-router-dom";

const packages = [
  {
    name: "Santorini Escape",
    location: "Greece",
    price: "From ₹12,999",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Alpine Adventure",
    location: "Switzerland",
    price: "From ₹18,899",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Safari Journey",
    location: "Kenya",
    price: "From ₹20,199",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bali Bliss",
    location: "Indonesia",
    price: "From ₹9,999",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
];

const FeaturedPackages = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-br from-[#3e1f24] to-[#100708] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Travel Packages
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover handpicked destinations and exclusive deals curated for unforgettable
            experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col border border-white/20"
            >
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                  <p className="text-sm text-white/80 mb-4">{pkg.location}</p>
                </div>
                <button
                  className="mt-auto w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate("/book")}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
