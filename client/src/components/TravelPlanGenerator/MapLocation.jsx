import React, { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import ARExperience from "../ARExperience";

const MapLocation = ({ location }) => {
  const openInMaps = () => {
    // This would open the location in Google Maps or another mapping service
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`;
    window.open(url, '_blank');
  };
  const [arMode, setArMode] = useState(false);
  return (
    <div className="bg-black/20 rounded-lg p-4 border border-pink-400/20">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-pink-400 font-semibold flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Location
        </h5>
        <button
          onClick={openInMaps}
          className="text-pink-400 text-sm hover:text-pink-300 transition-colors flex items-center"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View on Map
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="text-white text-sm">
          <span className="font-medium">{location.name}</span>
        </div>
        <button className="mt-2 px-4 py-2 rounded bg-purple-600 text-white text-xs font-semibold" onClick={() => setArMode(true)}>AR Mode</button>
        {/* Placeholder for map */}
        <div className="w-full h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-lg flex items-center justify-center border border-pink-400/30">
          <div className="text-center text-pink-300 text-sm">
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <p>Map View</p>
            <p className="text-xs opacity-75">Click to open in Google Maps</p>
          </div>
        </div>
        <div className="text-xs text-pink-300 opacity-75">
          Coordinates: {location.coordinates}
        </div>
        {arMode && (
          <ARExperience location={location} onClose={() => setArMode(false)} />
        )}
      </div>
    </div>
  );
};

export default MapLocation;