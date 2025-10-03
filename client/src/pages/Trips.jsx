import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

import {
  Plane,
  Map,
  Package,
  BedDouble,
  QrCode,
} from "lucide-react";
const TRIP_SUPPORT = [
  {
    title: "Ready to book your tickets?",
    path: "/ticket",
    pathName: "Go to Booking Page",
    icon: Plane,
  },
  {
    title: "Explore our travel packages?",
    path: "/packages",
    pathName: "View Packages",
    icon: Package,
  },
  {
    title: "Book your perfect stay?",
    path: "/hotels",
    pathName: "Book a Hotel",
    icon: BedDouble,
  },
  {
    title: "Share your trip with QR codes?",
    path: "/qr-trip-sharing",
    pathName: "QR Trip Sharing",
    icon: QrCode,
  },
  {
    title: "Find the right guide for your trip?",
    path: "/guides",
    pathName: "Consult a Guide",
    icon: Map,
  },
];
function Trips() {
  const navigate = useNavigate();
   const { isDarkMode } = useTheme();

  return (
    <div className={`pt-30 w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 relative `}
    >
      <h2 className="mt-2 px-2 leading-tight text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        Planning a Trip?{" "}
        <span className=" text-pink-500">We've Got You Covered!</span>
      </h2>
      <div className=" pt-16 grid grid-cols-1 md:grid-cols-2 gap-y-6 sm:gap-8 w-full max-w-5xl mb-10 px-4 sm:px-0">
        {TRIP_SUPPORT.map((trip, index) => {
          const Icon = trip.icon;
          return (
            <section
              className={ `shadow-md p-4 rounded-2xl backdrop-blur-lg  transition-all duration-300 border border-pink-400 sm:p-6 ${isDarkMode ? "bg-white/10 hover:bg-white/20":"bg-white/30 hover:bg-white/60"}`} 
              // light transparent bg color in light mode
              key={index}
            >
              <span className={`size-12 flex justify-center items-center rounded-full shadow-md mb-4 ${isDarkMode ? "bg-white/10  text-pink-300":"bg-white text-pink-500"}`}>
              {/* stronger pink for light mode */}
                <Icon className="w-6 h-6"/>
              </span>
              <h3 className="text-left text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {trip.title}
              </h3>
              <button aria-label="Search"
                onClick={() => navigate(trip.path)}
                className="mt-6 px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-pink-500 leading-none hover:scale-105 transform transition-all duration-300 flex justify-start items-center cursor-pointer focus:outline-none focus:ring-pink-400 focus:ring-offset-2">
                {trip.pathName}
              </button>
            </section>
          );
        })}

      
      </div>
    </div>
  );
}

export default Trips;
