import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useMapContext } from "../context/MapContext";
import ItineraryMap from "../components/Map/ItineraryMap";
import { X } from "lucide-react";

const ItineraryMapPage = () => {
  const { itineraryStops, setStops } = useMapContext();
  const [formData, setFormData] = useState({ from: "", to: "" });
  const { isDarkMode } = useTheme();
  //state to show or hide the map
  const [showMap,setShowMap]=useState(false);
  const geocodeLocation = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
        { headers: { "User-Agent": "TravelGrid/1.0" } } // Nominatim requires UA
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          name: place,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      alert(`Location not found: ${place}`);
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Failed to fetch location data.");
      return null;
    }
  };

  const handleRoute = async (e) => {
    e.preventDefault();
    const start = await geocodeLocation(formData.from);
    const end = await geocodeLocation(formData.to);

    if (start && end) {
      setStops([start, end]); // Replace all stops at once
      setShowMap(true); //show the map only when the valid start and end are given
    }
  };

  return (
    <div
      className={`min-h-screen pt-24 px-6 flex flex-col items-center justify-start relative mt-6 ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" : "bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200"
      }`}
    >
      {/* Decorative background image overlay */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"
      ></div>

      {/* Page Title */}
      <h1
        className={`text-4xl font-extrabold mb-8 text-center relative z-10 ${
          isDarkMode ? "bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500" : "bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500"
        }`}
      >
        ✈️ Plan Your Trip Visually
      </h1>

      {/* Add Stop Form */}
      <form
        onSubmit={handleRoute}
        className={`relative z-10 mb-8 p-6 rounded-2xl shadow-2xl w-full max-w-xl backdrop-blur-md ${
          isDarkMode
            ? "bg-gray-800/60 border border-gray-700"
            : "bg-white/70 border border-pink-300"
        }`}
      >
        <input
          type="text"
          placeholder="Departure City"
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          className={`w-full p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all ${
            isDarkMode
              ? "bg-gray-700 text-white border border-gray-600 focus:ring-pink-400"
              : "bg-white text-gray-800 border border-pink-300 focus:ring-pink-500"
          }`}
        />
        <input
          type="text"
          placeholder="Destination City"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className={`w-full p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 transition-all ${
            isDarkMode
              ? "bg-gray-700 text-white border border-gray-600 focus:ring-pink-400"
              : "bg-white text-gray-800 border border-pink-300 focus:ring-pink-500"
          }`}
        />
        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            isDarkMode
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
              : "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-95"
          }`}
        >
          Show Route
        </button>
      </form>

      {/* Map */}
      {showMap && <div
        className={`relative z-10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl h-[500px] mb-6 ${
          isDarkMode
            ? "border border-gray-700"
            : "border border-pink-400"
        }`}
      >
        {/* Close button */}
        <button className={`absolute top-2 right-2.5 p-2 text-gray-900 rounded-full z-20 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl hover:backdrop-blur-xl ${isDarkMode? "hover:bg-white/20" :"  hover:bg-black/20"}`}  aria-label="close Map" onClick={()=>setShowMap(false)}><X size={24} className="w-5 h-5"/></button>

        <ItineraryMap stops={itineraryStops} />
      </div>}
    </div>
  );
};

export default ItineraryMapPage;
