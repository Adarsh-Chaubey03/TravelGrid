import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import WeatherWidget from '../components/WeatherWidget';
import NearbyAttractions from '../components/NearbyAttractions';
import {
  StarIcon, MapPinIcon, SparklesIcon, CheckCircleIcon, SunIcon,
  FlagIcon, GiftIcon, BookOpenIcon, ShieldCheckIcon, LockClosedIcon, CreditCardIcon
} from '../heroicons/react/24/outline';

// 🎯 Custom animated pink marker
const pinkGlowMarker = L.divIcon({
  className: '',
  html: `
    <div class="relative w-6 h-6">
      <div class="absolute inset-0 animate-ping bg-pink-500 opacity-50 rounded-full"></div>
      <div class="w-4 h-4 bg-pink-600 rounded-full border-2 border-white shadow-md"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MapBoundsController = ({ hotels, selectedHotel }) => {
  const map = useMap();

  useEffect(() => {
    if (hotels.length > 0) {
      const bounds = L.latLngBounds(hotels.map(h => [h.lat, h.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [hotels, map]);

  useEffect(() => {
    if (selectedHotel) {
      map.flyTo([selectedHotel.lat, selectedHotel.lng], 15, { duration: 1 });
    }
  }, [selectedHotel, map]);

  return null;
};

const HotelMap = ({ hotels }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedHotel ? 'hidden' : 'auto';
  }, [selectedHotel]);
  const tileLayerUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://carto.com/">CartoDB</a> contributors';

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-xl ring-2 ring-pink-400 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
        url={tileLayerUrl}
        attribution={attribution}
        />
        <MapBoundsController hotels={hotels} selectedHotel={selectedHotel} />

        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.lat, hotel.lng]}
            icon={pinkGlowMarker}
            eventHandlers={{ click: () => setSelectedHotel(hotel) }}
          />
        ))}
      </MapContainer>
      <div
        className={`fixed inset-0 z-[9999] backdrop-blur-sm transition-transform duration-500 ease-in-out ${
          selectedHotel ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {selectedHotel && (
          <div className="h-full overflow-y-auto bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
            <div className="flex justify-end p-4 sticky top-0 bg-black/60 z-10">
              <button
                onClick={() => setSelectedHotel(null)}
                className="bg-white/20 p-2 rounded-full backdrop-blur hover:bg-white/30 transition"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-w-4xl mx-auto">\
              <div className="relative h-[45vh] w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-pink-500">
                <img src={selectedHotel.image} alt={selectedHotel.name} loading="lazy"  className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-pink-600/90 px-4 py-1 rounded-full text-white text-sm font-semibold flex items-center shadow-lg">
                  <StarIcon className="h-5 w-5 text-yellow-300 mr-1" />
                  {selectedHotel.rating}.0
                </div>
              </div>

              <h2 className="mt-6 text-4xl font-extrabold text-pink-400">{selectedHotel.name}</h2>
              <p className="text-pink-100 flex items-center mt-1">
                <MapPinIcon className="h-5 w-5 mr-1 text-pink-300" />
                {selectedHotel.location}
              </p>
              <p className="text-2xl font-bold text-rose-300 mt-3">${selectedHotel.price}/night</p>

              <div className="mt-6">
                <h3 className="text-lg font-semibold flex items-center text-pink-300">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-200">
                  {selectedHotel.amenities?.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-pink-100 text-base">{selectedHotel.description}</div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-pink-400 shadow-lg">
                  <div className="flex items-center mb-3 text-white font-semibold">
                    <SunIcon className="h-5 w-5 mr-2 text-yellow-300" />
                    Weather
                  </div>
                  <div className="text-sm text-white">
                    <WeatherWidget lat={selectedHotel.lat} lng={selectedHotel.lng} />
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl border border-purple-400 shadow-sm">
                  <div className="flex items-center mb-2 text-purple-200">
                    <FlagIcon className="h-5 w-5 mr-2" />
                    Nearby Attractions
                  </div>
                  <NearbyAttractions lat={selectedHotel.lat} lng={selectedHotel.lng} />
                </div>
              </div>

              {selectedHotel.offers && (
                <div className="mt-6 bg-pink-100/10 border-l-4 border-pink-500 p-4 rounded-lg">
                  <div className="flex items-start space-x-3 text-rose-200">
                    <GiftIcon className="h-5 w-5 mt-1" />
                    <div>
                      <h4 className="text-lg font-bold">Special Offer</h4>
                      <p>{selectedHotel.offers}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {}}
                className="mt-8 w-full py-3 rounded-lg text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all"
              >
                <BookOpenIcon className="h-5 w-5 inline-block mr-2" />
                Book Now
              </button>

              <div className="mt-6 flex justify-center gap-6 text-pink-300">
                <ShieldCheckIcon className="h-6 w-6" />
                <LockClosedIcon className="h-6 w-6" />
                <CreditCardIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelMap;
