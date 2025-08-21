import { useEffect } from "react";
import { useTheme } from '../../context/ThemeContext';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const ItineraryMap = ({ stops }) => {
  const { isDarkMode } = useTheme();
  useEffect(() => {
    if (!stops || stops.length === 0) return;

    // Remove old map container before creating new one
    const existingMap = document.getElementById("map");
    if (existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    const map = L.map("map").setView([stops[0].lat, stops[0].lng], 6);

    const tileLayerUrl = isDarkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const attribution = isDarkMode 
      ? '&copy; <a href="https://carto.com/">CartoDB</a> contributors'
      : '&copy; <a href="https://carto.com/">CartoDB</a> contributors';

    L.tileLayer(tileLayerUrl, { attribution, subdomains: "abcd", maxZoom: 19 }).addTo(map);


    if (stops.length >= 2) {
      L.Routing.control({
        waypoints: stops.map((stop) => L.latLng(stop.lat, stop.lng)),
        routeWhileDragging: true,
        show: true,
        createMarker: (i, wp) => {
          return L.marker(wp.latLng).bindPopup(stops[i].name);
        },
      }).addTo(map);
    }

    return () => {
      map.remove();
    };
  }, [stops, isDarkMode]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default ItineraryMap;
