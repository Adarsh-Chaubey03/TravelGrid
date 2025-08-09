import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DiscoverCard from "../DiscoverCard.jsx";
import { useTheme } from "../../context/ThemeContext";

const destinations = [
  {
    id: 1,
    name: "Manali, Himachal",
    description: "A beautiful hill station known for its scenic beauty and adventure sports.",
    image: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Jaipur, Rajasthan",
    description: "The Pink City with rich history, forts, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Goa",
    description: "Popular beach destination with nightlife, water sports, and culture.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Rishikesh, Uttarakhand",
    description: "The yoga capital of the world, nestled on the banks of the Ganges.",
    image: "https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?w=600&auto=format&fit=crop&q=60"
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full py-20 text-center"
    >
<div
  className={`max-w-7xl mx-auto px-4 py-4 ${
    isDarkMode
      ? 'bg-[#1e293b]'
      : 'bg-gradient-to-r from-[#e694bd] to-white'
  }`}
>

        {/* Heading */}
        <div className="mb-16">
          <motion.h2
            className={`text-2xl md:text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
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
            className={`text-base md:text-lg mb-10 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore trending places, hidden gems, and must-visit spots curated just for you.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch mb-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {destinations.map((place) => (
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
          ))}
        </motion.div>


        {/* CTA Section */}
        <div className="mt-16">
          <motion.h3
            className={`text-xl md:text-2xl font-semibold mb-4 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Ready to plan your next adventure?
          </motion.h3>
          <motion.p
            className={`mb-6 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
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
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-full shadow-lg transition-all duration-300 cursor-pointer"
          >
            Discover More Destinations
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default DiscoverSection;
