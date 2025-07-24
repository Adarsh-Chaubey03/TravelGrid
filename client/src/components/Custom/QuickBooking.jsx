import React, { useState } from 'react';
import { Plane, Train, Bus, Car, Calendar, MapPin, Users } from 'lucide-react';

const QuickBooking = () => {
  const [selectedType, setSelectedType] = useState('flight');
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });

  const bookingTypes = [
    { id: 'flight', label: 'Flight', icon: <Plane className="w-5 h-5" /> },
    { id: 'train', label: 'Train', icon: <Train className="w-5 h-5" /> },
    { id: 'bus', label: 'Bus', icon: <Bus className="w-5 h-5" /> },
    { id: 'car', label: 'Car', icon: <Car className="w-5 h-5" /> }
  ];

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickBook = () => {
    // Here you would typically navigate to the full booking page
    console.log('Quick booking:', { type: selectedType, ...bookingData });
    alert(`Quick booking for ${selectedType} from ${bookingData.from} to ${bookingData.to}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto animate-scaleIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Quick <span className="gradient-text">Booking</span>
      </h3>

      {/* Booking Type Selector */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {bookingTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`p-3 rounded-xl flex flex-col items-center space-y-1 transition-all duration-300 cursor-pointer ${
              selectedType === type.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.icon}
            <span className="text-xs font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* From */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="from"
            placeholder="From"
            value={bookingData.from}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* To */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="to"
            placeholder="To"
            value={bookingData.to}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Date and Passengers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleInputChange}
              className="w-full pl-10 pr-2 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="passengers"
              value={bookingData.passengers}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleQuickBook}
          disabled={!bookingData.from || !bookingData.to || !bookingData.date}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
        >
          Search {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s
        </button>
      </div>
    </div>
  );
};

export default QuickBooking;
