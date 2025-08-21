import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Map,
  Package,
  BedDouble,
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
    title: "Find the right guide for your trip?",
    path: "/guides",
    pathName: "Consult a Guide",
    icon: Map,
  },
];
function Trips() {
  const navigate = useNavigate();

  return (
    <div className="pt-30 w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-black to-pink-900 text-white">
      <h2 className="mt-2 px-2 leading-tight text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
        Planning a Trip?{" "}
        <span className=" text-pink-400">We've Got You Covered!</span>
      </h2>
      <div className=" pt-16 grid grid-cols-1 md:grid-cols-2 gap-y-6 sm:gap-8 w-full max-w-5xl mb-10 px-4 sm:px-0">
        {TRIP_SUPPORT.map((trip, index) => {
          const Icon = trip.icon;
          return (
            <section
              className="bg-white/10 shadow-lg p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition duration-300 border border-pink-500 sm:p-6"
              key={index}
            >
              <span className="bg-white/10 text-pink-300 size-12 flex justify-center items-center rounded-full shadow-pink-md mb-4">
                <Icon className="w-6 h-6"/>
              </span>
              <h3 className="text-left text-lg sm:text-xl font-semibold text-white mb-4">
                {trip.title}
              </h3>
              <button aria-label="Search"
                onClick={() => navigate(trip.path)}
                className="mt-6 px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base bg-pink-500 text-white font-medium rounded-lg hover:bg-gradient-to-r from-pink-500 to-pink-600 hover:scale-105 transition-all duration-300 flex justify-items-start cursor-pointer"
              >
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
