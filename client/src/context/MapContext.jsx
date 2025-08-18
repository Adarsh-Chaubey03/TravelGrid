import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [itineraryStops, setItineraryStops] = useState([]);

  const addStop = (stop) => {
    setItineraryStops((prev) => [...prev, stop]);
  };

  const setStops = (stops) => {
    setItineraryStops(stops);
  };

  return (
    <MapContext.Provider value={{ itineraryStops, addStop, setStops }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
