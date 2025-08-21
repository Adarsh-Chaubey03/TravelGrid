import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DiscoverCard from "../DiscoverCard.jsx";
import { useTheme } from "../../context/ThemeContext";


const destinations = [
  {
    id: 1,
    name: "Manali, Himachal",
    category: "Mountain",
    rating: 4.7,
    popularity: 800,
    price: 4500,
    description:
      "A beautiful hill station known for its scenic beauty and adventure sports.",
    image: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Jaipur, Rajasthan",
    category: "Historical",
    rating: 4.5,
    popularity: 700,
    price: 3500,
    description: "The Pink City with rich history, forts, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "Goa",
    category: "Beach",
    rating: 4.8,
    popularity: 950,
    price: 5000,
    description: "Popular beach destination with nightlife, water sports, and culture.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "Rishikesh, Uttarakhand",
    category: "Mountain",
    rating: 4.6,
    popularity: 650,
    price: 3000,
    description: "The yoga capital of the world, nestled on the banks of the Ganges.",
    image: "https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?w=600&auto=format&fit=crop&q=60",
  },
];


const DiscoverSection = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  return(

 
  <section className="w-full bg-gradient-to-br from-blue-50 to-pink-50 py-16 text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
      Discover New Destinations
    </h2>
    <p className="text-gray-600 text-base md:text-lg mb-10">
      Explore trending places, hidden gems, and must-visit spots curated just for you.
    </p>

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-2">
      {destinations.map((place, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
          <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-black mb-2">{place.name}</h3>
            <p className="text-gray-600 text-sm">{place.description}</p>
          </div>
          <div className="p-4">
          <button
                onClick={() => setSelectedPlace(place)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
              >
                Book Now
              </button>
        </div>
        </div>
      ))}
    </div>
{selectedPlace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <img
              src={selectedPlace.image}
              alt={selectedPlace.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold mt-3">{selectedPlace.name}</h2>
            <p className="text-gray-600 mt-2">{selectedPlace.description}</p>

            <button
              onClick={() =>
                alert(`Proceeding to booking for ${selectedPlace.name}`)
              }
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Proceed to Book
            </button>

            <button
              onClick={() => setSelectedPlace(null)}
              className="mt-2 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    <div className="mt-16">
      <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black">
        Ready to plan your next adventure?
      </h3>
      <p className="text-gray-600 mb-6">
        Discover more travel ideas, tips, and personalized recommendations.
      </p>
      <button
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium rounded-full shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
      
      >
        Discover More Destinations
      </button>
    </div>
  </section>



const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleBookNowClick = () => {
    navigate("/packages");
  };

  const handleDiscoverMore = () => {
    navigate("/destinations");
  };
const [searchTerm, setSearchTerm] = useState("");
const [category, setCategory] = useState("All");
const [sortBy, setSortBy] = useState("popularity");

const filteredDestinations = destinations
  .filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((place) => category === "All" || place.category === category)
  .sort((a, b) => {
    if (sortBy === "popularity") return b.popularity - a.popularity;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price") return a.price - b.price;
    return 0;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full py-20"
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 $`}
      >
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h2
            className={`text-3xl md:text-3xl font-medium mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              New Destinations
            </span>
          </motion.h2>
          <motion.p
            className={`text-lg md:text-xl mx-auto max-w-2xl ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore trending places, hidden gems, and must-visit spots curated
            just for you.
          </motion.p>
        </div>


      {/* Cards */}
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
>
  {filteredDestinations.length > 0 ? (
    filteredDestinations.map((place) => (
      <motion.div
        key={place.id}
        variants={item}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="h-full"
      >
        <DiscoverCard
          place={place}
          handleBookNowClick={handleBookNowClick}
        />
      </motion.div>
    ))
  ) : (
    <motion.div
      className="col-span-full text-center text-gray-500 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      No destinations found.
    </motion.div>
  )}
</motion.div>



        {/* CTA Section */}
        <div className="text-center mt-16">
          <motion.h3
            className={`text-2xl md:text-3xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Ready to plan your next adventure?
          </motion.h3>
          <motion.p
            className={`text-lg mb-8 mx-auto max-w-2xl ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover more travel ideas, tips, and personalized recommendations.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDiscoverMore}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 cursor-pointer"
          >
            Discover More Destinations
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};


 )
};
export default DiscoverSection;
