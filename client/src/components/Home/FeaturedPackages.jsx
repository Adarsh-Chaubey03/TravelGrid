import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { FaHeart } from "react-icons/fa";
import { useWishlist } from '../../context/WishlistContext';

import { useTheme } from "../../context/ThemeContext";


const packages = [
  {
    id: 1,
    name: "Santorini Escape",
    location: "Greece",
    price: "From ₹12,999",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Alpine Adventure",
    location: "Switzerland",
    price: "From ₹18,899",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Safari Journey",
    location: "Kenya",
    price: "From ₹20,199",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Bali Bliss",
    location: "Indonesia",
    price: "From ₹9,999",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const FeaturedPackages = () => {
  const navigate = useNavigate();

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = (id) => wishlist.some(item => item.id === id);


  const { isDarkMode } = useTheme();


  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full py-20"
    >
<div
  className={`max-w-7xl mx-auto px-4 py-4 ${
    isDarkMode
      ? 'bg-[#1e293b]'
      : 'bg-gradient-to-r from-[#e694bd] to-white'
  }`}
>        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Travel Packages
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Discover handpicked destinations and exclusive deals curated for unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`group relative backdrop-blur-md rounded-2xl overflow-hidden border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 ${isDarkMode
                  ? 'bg-white/10 border-white/20 hover:border-white/40'
                  : 'bg-white/80 border-gray-200 hover:border-pink-300'
                }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/*wishlist button */}
                <button
                  onClick={() => {
                    isWishlisted(pkg.id)
                      ? removeFromWishlist(pkg.id)
                      : addToWishlist(pkg);
                  }}
                  className="absolute top-3 right-3 text-white hover:scale-110 transition-transform duration-300 z-10"
                >
                  <FaHeart
                    className={`text-xl ${isWishlisted(pkg.id) ? 'text-pink-500' : 'text-white/60'
                      } transition-colors duration-300`}
                  />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-pink-300 text-sm font-medium">{pkg.price}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-2 group-hover:text-pink-300 transition-colors duration-300 ${
                  isDarkMode
                  ? 'text-white group-hover:text-pink-400'
                  : 'text-gray-900 group-hover:text-pink-500'
                  }`}>
                  {pkg.name}
                </h3>
                <p className={`mb-4 transition-colors group-hover:text-gray-800 duration-300 ${
                  isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600'
                  }`}>
                  {pkg.location}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform cursor-pointer shadow-lg hover:shadow-xl"
                  onClick={() => navigate(`/package/${i + 9}`)}
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedPackages;
