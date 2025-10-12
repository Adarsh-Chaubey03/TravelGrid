import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

function DiscoverCard({ index, place, handleBookNowClick }) {
    const [wishlisted, setWishlisted] = useState(false);
    const { isDarkMode } = useTheme();

    return (
        <div
            className={`group hover:scale-105 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col min-h-[310px] max-w-xs h-full
                ${
                    isDarkMode
                        ? // 🌙 Dark Mode
                          "bg-black/30 border-white/20 border  hover:border-white/40 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-pink-500/20"
                        : // ☀️ Light Mode - Glass Effect
                          "bg-white/10 border border-gray-300 hover:border-pink-300  backdrop-blur-sm  shadow-md shadow-purple-300/20 hover:shadow-lg hover:shadow-purple-400/30"
                }`}
        >
            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="px-4 py-3 flex-1 space-y-2">
                <h3
                    className={`text-lg font-bold text-center group-hover:text-pink-500 transition-colors duration-300
                        ${
                            isDarkMode
                                ? "text-white"
                                : "text-gray-900"
                        }`}
                >
                    {place.name}
                </h3>
                <p
                    className={`text-sm text-center transition-colors duration-300 leading-relaxed line-clamp-3
                        ${
                            isDarkMode
                                ? "text-gray-300 group-hover:text-white"
                                : "text-gray-700 group-hover:text-gray-900"
                        }`}
                >
                    {place.description}
                </p>
            </div>

            {/* Button */}
            <div className="px-4 pb-6 pt-4">
                <button
                    onClick={handleBookNowClick}
                    className={`w-full font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-md hover:shadow-xl text-sm
                        ${
                            isDarkMode
                                ? // Dark mode button
                                  "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
                                : // Light mode button
                                  "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white"
                        }`}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}

export default DiscoverCard;