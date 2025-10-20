import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DiscoverCard from "../DiscoverCard.jsx";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

// const localDestinations = [
//   {
//     id: 1,
//     name: "Manali, Himachal",
//     category: "Mountain",
//     rating: 4.7,
//     popularity: 800,
//     price: 4500,
//     description: "A beautiful hill station known for its scenic beauty and adventure sports.",
//     image: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?w=600&auto=format&fit=crop&q=60",
//   },
//   {
//     id: 2,
//     name: "Jaipur, Rajasthan",
//     category: "Historical",
//     rating: 4.5,
//     popularity: 700,
//     price: 3500,
//     description: "The Pink City with rich history, forts, and vibrant culture.",
//     "image": "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60",
//   },
//   {
//     id: 3,
//     name: "Goa",
//     category: "Beach",
//     rating: 4.8,
//     popularity: 950,
//     price: 5000,
//     description: "Popular beach destination with nightlife, water sports, and culture.",
//     "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60",
//   },
//   {
//     id: 4,
//     name: "Rishikesh, Uttarakhand",
//     category: "Mountain",
//     rating: 4.6,
//     popularity: 650,
//     price: 3000,
//     description: "The yoga capital of the world, nestled on the banks of the Ganges.",
//     "image": "https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?w=600&auto=format&fit=crop&q=60",
//   },
// ];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

const DiscoverSection = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const translatedDestinations = t("home.discover.destinations", { returnObjects: true });
  const destinationsList = Array.isArray(translatedDestinations) && translatedDestinations.length
    ? translatedDestinations
    : localDestinations;

  const handleBookNowClick = () => navigate("/packages");
  const handleDiscoverMore = () => navigate("/destinations");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");

  const filteredDestinations = destinationsList
    .filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(place => category === "All" || place.category === category)
    .sort((a, b) => {
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.price - b.price;
      return 0;
    });

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h2 className={`text-3xl md:text-3xl font-medium mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {t("home.discover.headingPrefix")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              {t("home.discover.headingHighlight")}
            </span>
          </motion.h2>
          <motion.p className={`text-lg md:text-xl mx-auto max-w-2xl ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {t("home.discover.description")}
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map(place => (
              <motion.div key={place.id} variants={item} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="h-full">
                <DiscoverCard place={place} handleBookNowClick={handleBookNowClick} />
              </motion.div>
            ))
          ) : (
            <motion.div className="col-span-full text-center text-gray-500 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t("home.discover.noDestinations")}
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <motion.h3 className={`text-2xl md:text-3xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t("home.discover.ctaTitle")}
          </motion.h3>
          <motion.p className={`text-lg mb-8 mx-auto max-w-2xl ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {t("home.discover.ctaDescription")}
          </motion.p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDiscoverMore} className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-600 hover:to-purple-700 text-black font-medium rounded-full shadow-lg transition-all duration-300 cursor-pointer">
            {t("home.discover.ctaButton")}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default DiscoverSection;
