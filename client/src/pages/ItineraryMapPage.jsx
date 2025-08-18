import { useState } from "react";
import { useMapContext } from "../context/MapContext";
import ItineraryMap from "../components/Map/ItineraryMap";

const ItineraryMapPage = () => {
  const { itineraryStops, setStops } = useMapContext();
  const [formData, setFormData] = useState({ from: "", to: "" });

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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 pt-24">
      <h1 className="text-3xl font-extrabold mb-4 text-center text-[var(--accent-primary)]">
        ✈️ Plan Your Trip Visually
      </h1>

      {/* Add Stop Form */}
      <form
        onSubmit={handleRoute}
        className="mb-6 bg-[var(--bg-secondary)] p-6 rounded-xl shadow-lg space-y-3"
      >
        <input
          type="text"
          placeholder="Departure City"
          value={formData.from}
          onChange={e => setFormData({ ...formData, from: e.target.value })}
          className="border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] p-3 rounded w-full focus:outline-none focus:border-[var(--input-focus)]"
        />

        <input
          type="text"
          placeholder="Destination City"
          value={formData.to}
          onChange={e => setFormData({ ...formData, to: e.target.value })}
          className="border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] p-3 rounded w-full focus:outline-none focus:border-[var(--input-focus)]"
        />

        <button
          type="submit"
          className="bg-[var(--button-primary)] hover:bg-[var(--button-hover)] transition-colors w-full py-3 rounded text-[var(--text-primary)] font-semibold cursor-pointer"
        >
          Show Route
        </button>
      </form>

      {/* Map */}
      <div className="rounded-lg overflow-hidden shadow-lg border border-[var(--border-primary)] bg-[var(--card-bg)] ">
        <ItineraryMap stops={itineraryStops} />
      </div>
    </div>
  );
};

export default ItineraryMapPage;
