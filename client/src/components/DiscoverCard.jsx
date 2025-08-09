import React, { useState } from "react";

function DiscoverCard({ index, place, handleBookNowClick }) {
    const [wishlisted, setWishlisted] = useState(false);

    return (
        <div
            className="group border-white/20 hover:border-white/40 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col min-h-[310px] max-w-xs"
        >
            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="px-4 py-3 flex-1 space-y-2">
                <h3 className="text-lg font-bold text-center text-white group-hover:text-pink-400 transition-colors duration-300">
                    {place.name}
                </h3>
                <p className="text-sm text-center text-white group-hover:text-white transition-colors duration-300 leading-relaxed line-clamp-3">
                    {place.description}
                </p>
            </div>

            {/* Button */}
            <div className="px-4 pb-4 pt-2">
                <button
                    onClick={handleBookNowClick}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-md hover:shadow-xl text-sm"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}

export default DiscoverCard;
