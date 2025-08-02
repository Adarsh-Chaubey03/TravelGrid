import React from "react";
import Navbar from "../components/Custom/Navbar";

const Hotels = () => {
  return (
    <>
      <Navbar lightBackground /> {/* Added props of lightBackground to this page */}

      <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#f6f0d6] via-[#f3eada] to-[#e9dfd1]">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-center text-[#6b3e2e] mb-8">
            Explore Our Premium Hotels
          </h1>

          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
            Whether you're traveling for leisure or business, our selection of handpicked luxury hotels ensures comfort, convenience, and a memorable stay. Browse our partners below.
          </p>

          {/* Sample Hotel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "The Taj Mahal Palace",
                location: "Mumbai, India",
                image: "https://source.unsplash.com/400x300/?taj-mahal,hotel",
              },
              {
                name: "The Plaza",
                location: "New York, USA",
                image: "https://source.unsplash.com/400x300/?hotel,newyork",
              },
              {
                name: "Hotel de Paris",
                location: "Monte-Carlo, Monaco",
                image: "https://source.unsplash.com/400x300/?monaco,hotel",
              },
            ].map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[#6b3e2e]">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-500">{hotel.location}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Hotels;
