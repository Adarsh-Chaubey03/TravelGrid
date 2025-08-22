import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useMapContext } from "../context/MapContext";
import ItineraryMap from "../components/Map/ItineraryMap";

const ItineraryMapPage = () => {
  const { itineraryStops, setStops } = useMapContext();
  const [formData, setFormData] = useState({ from: "", to: "" });
  const { isDarkMode } = useTheme();

  const geocodeLocation = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
        { headers: { "User-Agent": "TravelGrid/1.0" } } // Nominatim requires UA
      );
      const data = await res.json();
      console.log("Geocode result for", place, data);
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
    }
  };

  return (
    <div
      className={
        isDarkMode
          ? "min-h-screen p-6 pt-24"
          : "min-h-screen p-6 pt-24"
      }
    >
      <h1
        className={
          isDarkMode
            ? "text-3xl font-extrabold mb-4 text-center"
            : "text-3xl font-extrabold mb-4 text-center"
        }
        style={isDarkMode ? undefined : { color: "#be185d" }}
      >
        ✈️ Plan Your Trip Visually
      </h1>

      {/* Add Stop Form */}
      <form
        onSubmit={handleRoute}
        className={
          isDarkMode
            ? "mb-6 p-6 rounded-xl shadow-lg space-y-3"
            : "mb-6 p-6 rounded-xl shadow-lg space-y-3"
        }
        style={
          isDarkMode
            ? undefined
            : {
                background: "#ffffff",
                border: "1px solid #f9a8d4",
              }
        }
      >
        <input
          type="text"
          placeholder="Departure City"
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          className={
            isDarkMode
              ? "border border-gray-600 p-3 rounded w-full focus:outline-none focus:border-blue-500"
              : "border p-3 rounded w-full focus:outline-none"
          }
          style={
            isDarkMode
              ? undefined
              : {
                  borderColor: "#f9a8d4",
                  background: "#fff",
                  color: "#1e293b",
                }
          }
        />
        <input
          type="text"
          placeholder="Destination City"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className={
            isDarkMode
              ? "border border-gray-600 bg-gray-700 text-white p-3 rounded w-full focus:outline-none focus:border-blue-500"
              : "border p-3 rounded w-full focus:outline-none"
          }
          style={
            isDarkMode
              ? undefined
              : {
                  borderColor: "#f9a8d4",
                  background: "#fff",
                  color: "#1e293b",
                }
          }
        />
        <button
          type="submit"
          className={
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-500 transition-colors w-full py-3 rounded text-white font-semibold"
              : "transition-colors w-full py-3 rounded font-semibold"
          }
          style={
            isDarkMode
              ? undefined
              : {
                  background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                  color: "#fff",
                }
          }
        >
          Show Route
        </button>
      </form>

      {/* Map */}
      <div
        className={
          isDarkMode
            ? "rounded-lg overflow-hidden shadow-lg border border-gray-700"
            : "rounded-lg overflow-hidden shadow-lg"
        }
        style={isDarkMode ? undefined : { border: "1px solid #f9a8d4" }}
      >
        <ItineraryMap stops={itineraryStops} />
      </div>
    </div>
  );
};

export default ItineraryMapPage;
