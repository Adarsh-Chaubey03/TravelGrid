import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../context/ThemeContext";

// Main Component
const TravelItineraryPage = () => {
  const [stops, setStops] = useState([
    { name: "Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  ]);

  // use global theme from ThemeContext so page follows app-wide light/dark
  const { isDarkMode } = useTheme();

  // Update stop
  const updateStop = (index, newStop) => {
    const updated = [...stops];
    updated[index] = newStop;
    setStops(updated);
  };

  // Add stop
  const addStop = () => {
    setStops([...stops, { name: "", lat: 0, lng: 0 }]);
  };

  // Remove stop
  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  // Calculate total distance (haversine formula)
  const [totalDistance, setTotalDistance] = useState(0);
  useEffect(() => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    let dist = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      const R = 6371;
      const dLat = toRad(stops[i + 1].lat - stops[i].lat);
      const dLng = toRad(stops[i + 1].lng - stops[i].lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(stops[i].lat)) *
          Math.cos(toRad(stops[i + 1].lat)) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      dist += R * c;
    }
    setTotalDistance(dist.toFixed(2));
  }, [stops]);

  return (
    <div
      className={`min-h-screen px-6 py-12 flex flex-col items-center ${
        isDarkMode
          ? "bg-gradient-to-br from-black to-pink-900"
          : "bg-gradient-to-br from-pink-200/50 via-white/70 to-blue-200/50"
      }`}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold mt-20 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500 dark:from-pink-400 dark:to-purple-500">
        🗺️ Itinerary Stops
      </h2>

      {/* Stop Inputs */}
      <div className="w-full max-w-3xl flex flex-col gap-4 mb-6">
        {stops.map((stop, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow-md flex flex-col gap-2 ${
              isDarkMode
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-gradient-to-r from-pink-200 to-rose-200 text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold">{idx + 1}. Stop</h3>
            <input
              type="text"
              placeholder="Location name"
              value={stop.name}
              onChange={(e) => updateStop(idx, { ...stop, name: e.target.value })}
              className={`p-2 rounded-md border focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-purple-300 bg-white text-gray-900"
              }`}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Lat"
                value={stop.lat}
                onChange={(e) => updateStop(idx, { ...stop, lat: parseFloat(e.target.value) })}
                className={`p-2 rounded-md border focus:outline-none flex-1 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-purple-300 bg-white text-gray-900"
                }`}
              />
              <input
                type="number"
                placeholder="Lng"
                value={stop.lng}
                onChange={(e) => updateStop(idx, { ...stop, lng: parseFloat(e.target.value) })}
                className={`p-2 rounded-md border focus:outline-none flex-1 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-purple-300 bg-white text-gray-900"
                }`}
              />
            </div>
            <button
              className="self-end bg-pink-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-pink-600"
              onClick={() => removeStop(idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="self-start bg-purple-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-purple-700"
          onClick={addStop}
        >
          Add Stop
        </button>
      </div>

      {/* Map */}
      <div className="w-full max-w-3xl h-[400px] rounded-lg shadow-lg mb-6">
        <MapContainer
          center={stops[0] ? [stops[0].lat, stops[0].lng] : [0, 0]}
          zoom={5}
          className="w-full h-full rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {stops.map((stop, idx) => (
            <Marker key={idx} position={[stop.lat, stop.lng]} />
          ))}
          <Polyline positions={stops.map((s) => [s.lat, s.lng])} color="purple" />
        </MapContainer>
      </div>

      {/* Summary */}
      <div
        className={`p-6 rounded-xl shadow-lg w-full max-w-3xl mt-6 flex flex-col items-center ${
          isDarkMode
            ? "bg-gray-800 text-white border border-gray-700"
            : "bg-gradient-to-r from-pink-300 to-rose-300 text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-2 text-purple-700 dark:text-pink-400">
          Travel Summary
        </h2>
        <p>Total Stops: {stops.length}</p>
        <p>Total Distance: {totalDistance} km</p>
        <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TravelItineraryPage;
