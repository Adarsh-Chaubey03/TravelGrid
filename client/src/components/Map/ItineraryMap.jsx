import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const ItineraryMap = ({ stops }) => {
  useEffect(() => {
    if (!stops || stops.length === 0) return;

    // Remove old map container before creating new one
    const existingMap = document.getElementById("map");
    if (existingMap._leaflet_id) {
      existingMap._leaflet_id = null;
    }

    const map = L.map("map").setView([stops[0].lat, stops[0].lng], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

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
  }, [stops]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default ItineraryMap;
