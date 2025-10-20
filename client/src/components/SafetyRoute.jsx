import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { MapPin, Navigation, Shield, AlertTriangle } from 'lucide-react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const SafetyRoute = () => {
  const { getSafetyRoute } = useSafety();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [safetyRoute, setSafetyRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!map) {
      const newMap = L.map("safety-map").setView([20, 0], 2);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);
      
      setMap(newMap);
    }
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  // Update route when safetyRoute changes
  useEffect(() => {
    if (map && safetyRoute) {
      // Clear previous routing control
      if (routingControl) {
        routingControl.remove();
      }
      
      // Create new routing control
      const control = L.Routing.control({
        waypoints: [
          L.latLng(safetyRoute.route.start.split(',')[0], safetyRoute.route.start.split(',')[1]),
          ...safetyRoute.route.waypoints.map(wp => L.latLng(wp.split(',')[0], wp.split(',')[1])),
          L.latLng(safetyRoute.route.end.split(',')[0], safetyRoute.route.end.split(',')[1])
        ],
        routeWhileDragging: true,
        show: true,
        createMarker: (i, wp) => {
          const isStart = i === 0;
          const isEnd = i === safetyRoute.route.waypoints.length + 1;
          
          return L.marker(wp.latLng, {
            icon: L.divIcon({
              className: 'custom-waypoint-marker',
              html: `<div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                ${isStart ? 'A' : isEnd ? 'B' : i}
              </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })
          });
        },
      }).addTo(map);
      
      setRoutingControl(control);
    }
  }, [map, safetyRoute, routingControl]);

  const handleCalculateRoute = async () => {
    if (!start || !end) {
      alert('Please enter both start and end locations');
      return;
    }
    
    setLoading(true);
    
    try {
      const routeData = await getSafetyRoute(start, end, waypoints);
      setSafetyRoute(routeData);
    } catch (error) {
      alert('Failed to calculate safety route: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, '']);
  };

  const updateWaypoint = (index, value) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
  };

  const removeWaypoint = (index) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <Navigation className="mr-3 text-blue-500" />
          Safety Route Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Plan your journey with safety-weighted routes that avoid high-risk areas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Input Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Route Planner</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="Enter start location (lat,lng)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  placeholder="Enter end location (lat,lng)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Waypoints
                </label>
                <button
                  onClick={addWaypoint}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {waypoints.map((waypoint, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={waypoint}
                      onChange={(e) => updateWaypoint(index, e.target.value)}
                      placeholder={`Waypoint ${index + 1} (lat,lng)`}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => removeWaypoint(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleCalculateRoute}
              disabled={!start || !end || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Navigation className="mr-2" size={20} />
                  Calculate Safety Route
                </>
              )}
            </button>
          </div>
          
          {safetyRoute && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Route Safety Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Safety Score</span>
                  <span className="font-medium">{safetyRoute.route.safetyScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Estimated Time</span>
                  <span className="font-medium">{safetyRoute.route.estimatedTravelTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Safety Route Map</h2>
            <div id="safety-map" style={{ height: "500px", width: "100%" }} className="rounded-lg overflow-hidden"></div>
          </div>
        </div>
      </div>
      
      {/* Safety Recommendations */}
      {safetyRoute && safetyRoute.route.safetyRecommendations && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Shield className="mr-2 text-blue-500" />
            Safety Recommendations for Your Route
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyRoute.route.safetyRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" size={20} />
                <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyRoute;