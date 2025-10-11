import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Example: map component library (replace with your actual one)
import Map from "@/components/Map"; 
import HotelList from "@/components/HotelList"; 

export default function LocationDetail() {
  const { city } = useParams(); // expects route like /location/:city
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocationData() {
      try {
        setLoading(true);
        setError(null);

        // Replace with your actual API endpoint or data source
        const response = await fetch(`/api/locations/${city}`);
        if (!response.ok) throw new Error("Failed to load location data");

        const data = await response.json();
        setLocationData(data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch location details.");
      } finally {
        setLoading(false);
      }
    }

    if (city) fetchLocationData();
  }, [city]);

  if (loading) return <p>Loading details for {city}...</p>;
  if (error) return <p>{error}</p>;
  if (!locationData) return <p>No details found for {city}.</p>;

  return (
    <div className="location-detail">
      <h1>{locationData.name}</h1>

      {/* Map dynamically displays based on city */}
      <Map
        latitude={locationData.coordinates.lat}
        longitude={locationData.coordinates.lng}
        zoom={12}
      />

      {/* Dynamic hotels or points of interest */}
      <section className="hotels">
        <h2>Hotels & Points of Interaction in {locationData.name}</h2>
        <HotelList hotels={locationData.hotels} />
      </section>
    </div>
  );
}
