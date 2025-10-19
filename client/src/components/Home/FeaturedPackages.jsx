import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";
import SkeletonCard from "../SkeletonCard";
import { useTranslation } from "react-i18next";

const packages = [
  {
    id: 1,
    nameKey: "santoriniEscape",
    locationKey: "greece",
    priceKey: "santoriniPrice",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    nameKey: "alpineAdventure",
    locationKey: "switzerland",
    priceKey: "alpinePrice",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    nameKey: "safariJourney",
    locationKey: "kenya",
    priceKey: "safariPrice",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    nameKey: "baliBliss",
    locationKey: "indonesia",
    priceKey: "baliPrice",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
];

// Card fade-in + hover
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
  rest: { scale: 1, transition: { duration: 0.5, ease: "easeOut" } }, // smooth hover-out
  hover: { scale: 1.05, transition: { duration: 0.6, ease: "easeInOut" } },
};

// Image zoom (inherits parent hover)
const imageVariants = {
  rest: { scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.2, transition: { duration: 0.8, ease: "easeInOut" } },
};

// Price fade (inherits parent hover)
const priceVariants = {
  rest: { opacity: 0, y: 8 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
};

const FeaturedPackages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full py-20"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl md:text-4xl font-medium mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {t("home.featuredTravelPackages.featured")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              {t("home.featuredTravelPackages.TravelPackages")}
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {t("home.featuredTravelPackages.featuredTravelPackagesDescription")}.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-stretch">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                animate="rest"
                whileHover="hover"      // parent controls hover for ALL children
                className={`group relative backdrop-blur-md rounded-2xl overflow-hidden border h-full transition-all duration-300 ${isDarkMode
                  ? "bg-black/30 border-white/20 hover:border-white/40"
                  : "bg-white/30 border-gray-300 hover:border-pink-300"
                  }`}
              >
                {/* Image + Wishlist */}
                <div className="relative overflow-hidden">
                  {/* Image (inherits parent hover) */}
                  <motion.img
                    variants={imageVariants}
                    src={pkg.image}
                    alt={pkg.name}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                    style={{ willChange: "transform" }}
                  />

                  {/* Wishlist Button */}
                  <button
                    aria-label="Wishlist"
                    onClick={() =>
                      isWishlisted(pkg.id)
                        ? removeFromWishlist(pkg.id)
                        : addToWishlist(pkg)
                    }
                    className="absolute top-3 right-3 hover:scale-110 transition-transform duration-300 z-10"
                  >
                    <FaHeart
                      className={`text-xl transition-colors duration-300 ${isWishlisted(pkg.id)
                          ? isDarkMode
                            ? "text-pink-500"
                            : "text-pink-600"
                          : "text-white/80 hover:text-white"
                        }`}
                    />
                  </button>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Price (inherits parent hover) */}
                  <motion.div
                    variants={priceVariants}
                    className="absolute bottom-4 left-4 right-4"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <p className="text-white text-sm font-medium">{pkg.price}</p>
                  </motion.div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3
                    className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode
                      ? "text-white group-hover:text-pink-400"
                      : "text-gray-900 group-hover:text-pink-600"
                      }`}
                  >
                    {t(`home.featuredTravelPackages.${pkg.nameKey}`)}
                  </h3>
                  <p
                    className={`mb-4 transition-colors duration-300 ${isDarkMode
                        ? "text-gray-300 group-hover:text-gray-200"
                        : "text-gray-700 group-hover:text-gray-800"
                      }`}
                  >
                    {t(`home.featuredTravelPackages.${pkg.locationKey}`)}
                  </p>
                  <p
                    className={`mb-4 transition-colors duration-300 ${isDarkMode
                        ? "text-gray-300 group-hover:text-gray-200"
                        : "text-gray-700 group-hover:text-gray-800"
                      }`}
                  >
                    {t(`home.featuredTravelPackages.${pkg.priceKey}`)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkMode
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        : "bg-gradient-to-r from-cyan-200 to-purple-300 hover:from-blue-300 hover:to-purple-300 text-black"
                      }`}
                    onClick={() => navigate(`/package/${i + 9}`)}
                  >
                    {t("home.featuredTravelPackages.bookNow")}
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* View All Packages Button (below the 4 cards) */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/packages")}
            className="px-6 py-3 bg-pink-300 text-black rounded-xl shadow-md hover:bg-white-100 hover:scale-85 transition-all duration-500 ease-in-out"
          >
            {t("home.featuredTravelPackages.viewAllPackages")}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedPackages;
