import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

function DiscoverCard({ index, place, handleBookNowClick }) {
    const [wishlisted, setWishlisted] = useState(false);
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();

    return (
        <div
            className={`group  hover:scale-105 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col min-h-[310px] max-w-xs h-full
                ${isDarkMode
                    ? // 🌙 Dark Mode (your existing styles)
                    " border-white/10 hover:border-white/40 shadow-pink-300 hover:shadow-pink-500/20 bg-white/10"
                    : // ☀️ Light Mode (new styles)
                    "border-pink-50-900 hover:border-gray-500 shadow-pink-200 hover:shadow-pink-400/40 bg-white"
                }`}        >
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
                    className={`text-lg font-bold text-center group-hover:text-pink-400 transition-colors duration-300
                        ${isDarkMode
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                >
                    {place.name}
                </h3>
                <p
                    className={`text-sm text-center transition-colors duration-300 leading-relaxed line-clamp-3
                        ${isDarkMode
                            ? "text-white group-hover:text-white"
                            : "text-gray-600 group-hover:text-gray-800"
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
                        ${isDarkMode
                            ? // Dark mode button (your existing gradient)
                            "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-600 hover:to-purple-700 text-black"
                            : // Light mode button (new fresh gradient)
                            "bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-600 text-black"
                        }`}
                >
                    {t("home.booking.bookNow")}
                </button>
            </div>
        </div>
    );
}

export default DiscoverCard;
