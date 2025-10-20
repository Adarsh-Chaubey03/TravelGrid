import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ARTravelGuide from "../components/ARTravelGuide";
import { useTheme } from "../context/ThemeContext";

const ARTravelGuidePage = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Sample locations data for demonstration
  const sampleLocations = {
    1: {
      id: 1,
      name: "Santorini, Greece",
      country: "Greece",
      region: "Cyclades Islands",
      coordinates: "36.3932,25.4615",
      overview: {
        description: "A volcanic island paradise famous for its dramatic clifftop villages, stunning sunsets, and distinctive blue-domed churches."
      }
    },
    2: {
      id: 2,
      name: "Kyoto, Japan",
      country: "Japan",
      region: "Kansai",
      coordinates: "35.0116,135.7681",
      overview: {
        description: "Japan's former imperial capital, home to over 2,000 temples and shrines, traditional wooden houses, and perfectly manicured gardens."
      }
    }
  };

  // Get location from state or use default
  const locationData = location.state?.location || sampleLocations[1];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pink-500">AR Travel Guide</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            {locationData.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {locationData.overview?.description || "Explore this location with augmented reality."}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
              {locationData.country}
            </span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {locationData.region}
            </span>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg">
          <ARTravelGuide 
            location={locationData} 
            onClose={() => window.history.back()} 
          />
        </div>
      </div>
    </div>
  );
};

export default ARTravelGuidePage;