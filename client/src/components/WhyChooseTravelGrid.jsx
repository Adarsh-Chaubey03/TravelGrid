import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { IoCarSportSharp } from "react-icons/io5";
import { FaHotel } from "react-icons/fa";
import { GiBookCover } from "react-icons/gi";
import { LuNotebookPen } from "react-icons/lu";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaRecycle } from "react-icons/fa";
import { BsLuggageFill } from "react-icons/bs";


const WhyChooseTravelGrid = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const features = [
    {
      title: "Travel Booking",
      description:
        "Book flights, trains, and buses instantly — designed for effortless travel.",
      icon: <BiSolidPlaneAlt />,
      path: "/ticket",
    },
    {
      title: "Vehicle Rentals",
      description:
        "Find the perfect ride for your trip — from scooters to SUVs, all in one place.",
      icon: <IoCarSportSharp />,
      path: "/ticket",
    },
    {
      title: "Hotel Reservations",
      description:
        "Stay anywhere you like. Compare, review, and book the best stays globally.",
      icon: <FaHotel />,
      path: "/hotel-booking",
    },
    {
      title: "Travel Guides",
      description:
        "Unlock curated local insights to experience destinations like never before.",
      icon: <GiBookCover />,
      path: "/guides",
    },
    {
      title: "Essentials Checklist",
      description:
        "Keep your packing stress-free with personalized checklists for every journey.",
      icon: <LuNotebookPen />,
      path: "/packing-checklist",
    },
    {
      title: "Expense Calculator",
      description:
        "Plan, split, and manage all your trip expenses seamlessly — solo or group.",
      icon: <RiMoneyRupeeCircleFill />,
      path: "/trip-calculator",
    },
    {
      title: "Currency Converter",
      description:
        "Get real-time exchange rates and quick conversions anywhere in the world.",
      icon: <FaRecycle />,
      path: "/enhanced-currency",
    },
    {
      title: "Travel Packages",
      description:
        "Choose curated travel experiences made by expert or build your dream adventure yourself.",
      icon: <BsLuggageFill />,
      path: "/packages",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
    }),
    hover: { scale: 1.05, rotateX: 4, rotateY: -4 },
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full py-24 overflow-hidden"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-gradient-x"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
           <h2 className={`text-3xl md:text-4xl font-medium mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              TravelGrid
            </span>
            ?
          </h2>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Everything you need to make travel smarter, simpler, and more
            delightful.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
  {features.map((feature, index) => (
    <motion.div
      key={index}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      className={`relative group rounded-xl p-6 cursor-pointer backdrop-blur-xl border transition-all duration-300 overflow-hidden
        ${isDarkMode
                ? "bg-black/30 border-white/20 hover:border-white/40"
                : "bg-white/30 border-gray-300 hover:border-pink-300"
                }`}
      onClick={() => handleCardClick(feature.path)}
    >
      {/* Soft glowing gradient background on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl"></div>

      
      {/* Floating Icon with enhanced gradient + glow */}
      <motion.div
        whileHover={{ y: -8, scale: 1.1, rotate: 2 }}
        className="relative w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-lg"
      >
        {/* Animated gradient background for the icon */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400 animate-gradient-move"></div>

        {/* Inner subtle ring for depth */}
        <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-black/40 to-transparent backdrop-blur-md"></div>

        {/* Icon itself */}
        <div className="relative text-white text-3xl drop-shadow-lg">{feature.icon}</div>
      </motion.div>

      {/* Title */}
      <h3
        className={`text-xl font-semibold mb-3 transition-colors ${
          isDarkMode
            ? "text-white group-hover:text-pink-400"
            : "text-gray-900 group-hover:text-pink-600"
        }`}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className={`text-sm leading-relaxed ${
          isDarkMode
            ? "text-gray-300 group-hover:text-gray-100"
            : "text-gray-700 group-hover:text-gray-800"
        }`}
      >
        {feature.description}
      </p>

      {/* Explore Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className={`mt-6 w-full py-2.5 rounded-xl font-medium shadow-md transition-all ${
          isDarkMode
            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-pink-500/30"
            : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-pink-500/30"
        }`}
      >
        Explore →
      </motion.button>
    </motion.div>
  ))}
</div>

      </div>
    </motion.section>
  );
};

export default WhyChooseTravelGrid;
