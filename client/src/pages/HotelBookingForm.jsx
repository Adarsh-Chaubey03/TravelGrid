import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BookingPDF from '../components/PDF/BookingPDF';
import toast from 'react-hot-toast';
import Navbar from '../components/Custom/Navbar';
import './styles/HotelBookingForm.css';

const HotelBookingForm = () => {
  const location = useLocation()  ;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hotel } = location.state || {};

  const [bookingData, setBookingData] = useState({
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: '',
    specialRequests: '',
    countryCode: '+91',
    contactNumber: '',
    email: user?.email || 'guest@example.com'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});

  const roomTypes = [
    { id: 'standard', name: 'Standard Room', price: 1500, description: 'Comfortable room with basic amenities' },
    { id: 'deluxe', name: 'Deluxe Room', price: 2500, description: 'Spacious room with premium amenities' },
    { id: 'suite', name: 'Executive Suite', price: 3500, description: 'Luxury suite with separate living area' },
    { id: 'presidential', name: 'Presidential Suite', price: 4500, description: 'Ultimate luxury with panoramic views' }
  ];

  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' }
  ];

  const generateBookingId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 9000 + 1000);
    return `BOOK-${timestamp}-${random}`;
  };

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.roomType) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Prevent invalid calculations
    if (isNaN(nights) || nights <= 0) return 0;
    
    const selectedRoom = roomTypes.find(room => room.id === bookingData.roomType);
    const roomPrice = selectedRoom ? selectedRoom.price : 500; // Default to standard room price
    
    // Use room price as the total per night price (not base + room)
    return Math.max(nights * roomPrice, 0);
  };

  React.useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.roomType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validatePhone = (countryCode, phone) => {
    // Remove spaces and dashes from phone number
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Different validation patterns for different countries
    const validationPatterns = {
      '+91': /^[6-9]\d{9}$/, // India: 10 digits starting with 6-9
      '+1': /^\d{10}$/, // USA: 10 digits
      '+44': /^\d{10,11}$/, // UK: 10-11 digits
      '+971': /^\d{8,9}$/, // UAE: 8-9 digits
      '+65': /^\d{8}$/, // Singapore: 8 digits
      '+61': /^\d{9}$/, // Australia: 9 digits
      '+49': /^\d{10,12}$/, // Germany: 10-12 digits
      '+33': /^\d{9,10}$/, // France: 9-10 digits
      '+81': /^\d{10,11}$/, // Japan: 10-11 digits
      '+86': /^\d{11}$/ // China: 11 digits
    };
    
    const pattern = validationPatterns[countryCode];
    return pattern ? pattern.test(cleanPhone) : /^\d{7,15}$/.test(cleanPhone); // Default: 7-15 digits
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear all previous errors
    setErrors({});
    const newErrors = {};

    // Check required fields
    if (!bookingData.guestName) {
      newErrors.guestName = 'Guest name is required';
    } else if (!validateName(bookingData.guestName)) {
      newErrors.guestName = 'Enter valid name (2-50 characters, letters only)';
    }

    if (!bookingData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!validatePhone(bookingData.countryCode, bookingData.contactNumber)) {
      const countryName = countryCodes.find(c => c.code === bookingData.countryCode)?.country || 'selected country';
      newErrors.contactNumber = `Enter valid phone number for ${countryName}`;
    }

    if (bookingData.email && !validateEmail(bookingData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!bookingData.roomType) {
      newErrors.roomType = 'Please select a room type';
    }

    if (!bookingData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!bookingData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }

    // Validate dates if both are provided
    if (bookingData.checkIn && bookingData.checkOut) {
      if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }

    // Check if check-in is not in the past
    if (bookingData.checkIn) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(bookingData.checkIn) < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    const id = generateBookingId();
    setBookingId(id);
    setBookingConfirmed(true);
    toast.success('Booking Confirmed Successfully!');
  };

  if (!hotel) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 text-white">
        <Navbar />
        <main className="flex flex-col flex-1 items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Hotel information not found</h2>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Hotels
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-2 sm:px-4 pt-12 pb-8 w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 text-white">
          <div className="mb-6 pt-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words mt-2">Book Your Stay</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-pink-200">
              <span className="text-lg sm:text-xl font-semibold break-words">{hotel.name}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm sm:text-base">{hotel.location}</span>
            </div>
          </div>

          {!bookingConfirmed ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Type Selection */}
              <div>
                <label className="block text-lg font-semibold mb-3">Select Room Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roomTypes.map((room) => (
                    <div
                      key={room.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        bookingData.roomType === room.id
                          ? 'border-pink-400 bg-pink-500/20'
                          : errors.roomType ? 'border-red-400 hover:border-red-300' : 'border-gray-400 hover:border-pink-300'
                      }`}
                      onClick={() => setBookingData(prev => ({ ...prev, roomType: room.id }))}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{room.name}</h3>
                        <span className="text-pink-300">₹{room.price}/night</span>
                      </div>
                      <p className="text-sm text-gray-300">{room.description}</p>
                    </div>
                  ))}
                </div>
                {errors.roomType && (
                  <p className="text-red-400 text-sm mt-2">{errors.roomType}</p>
                )}
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">Check-in Date *</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 rounded-lg bg-white/10 border text-white ${
                      errors.checkIn ? 'border-red-400' : 'border-gray-400'
                    }`}
                    required
                  />
                  {errors.checkIn && (
                    <p className="text-red-400 text-sm mt-1">{errors.checkIn}</p>
                  )}
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">Check-out Date *</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 rounded-lg bg-white/10 border text-white ${
                      errors.checkOut ? 'border-red-400' : 'border-gray-400'
                    }`}
                    required
                  />
                  {errors.checkOut && (
                    <p className="text-red-400 text-sm mt-1">{errors.checkOut}</p>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-lg font-semibold mb-2">Number of Guests</label>
                <select
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-400 text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num} className="bg-gray-800">{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Guest Name */}
              <div>
                <label className="block text-lg font-semibold mb-2">Guest Name *</label>
                <input
                  type="text"
                  name="guestName"
                  value={bookingData.guestName}
                  onChange={handleInputChange}
                  placeholder="Enter guest name"
                  className={`w-full p-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 ${
                    errors.guestName ? 'border-red-400' : 'border-gray-400'
                  }`}
                  minLength="2"
                  maxLength="50"
                  pattern="[a-zA-Z\s]+"
                  required
                />
                {errors.guestName && (
                  <p className="text-red-400 text-sm mt-1">{errors.guestName}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">Contact Number *</label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <select
                      name="countryCode"
                      value={bookingData.countryCode}
                      onChange={handleInputChange}
                      className={`p-3 rounded-lg bg-white/10 border text-white ${
                        errors.contactNumber ? 'border-red-400' : 'border-gray-400'
                      }`}
                      style={{ minWidth: '120px' }}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code} className="bg-gray-800">
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    
                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      name="contactNumber"
                      value={bookingData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className={`flex-1 p-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 ${
                        errors.contactNumber ? 'border-red-400' : 'border-gray-400'
                      }`}
                      required
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.contactNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className={`w-full p-3 rounded-lg bg-white/10 border text-white placeholder-gray-400 ${
                      errors.email ? 'border-red-400' : 'border-gray-400'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-lg font-semibold mb-2">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or requests..."
                  rows="3"
                  className="w-full p-3 rounded-lg bg-white/10 border border-gray-400 text-white placeholder-gray-400"
                />
              </div>

              {/* Price Summary */}
              {totalPrice > 0 && (
                <div className="bg-pink-500/20 rounded-lg p-4 border border-pink-400">
                  <h3 className="text-lg font-semibold mb-3">Booking Summary & Calculation</h3>
                  <div className="space-y-2 text-sm">
                    {/* Room Selection */}
                    {bookingData.roomType && (
                      <div className="flex justify-between">
                        <span>Selected Room ({roomTypes.find(r => r.id === bookingData.roomType)?.name}):</span>
                        <span>₹{roomTypes.find(r => r.id === bookingData.roomType)?.price || 500}/night</span>
                      </div>
                    )}
                    
                    {/* Calculation Breakdown */}
                    {bookingData.checkIn && bookingData.checkOut && bookingData.roomType && (() => {
                      const nights = Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24));
                      const roomPrice = roomTypes.find(r => r.id === bookingData.roomType)?.price || 500;
                      return (
                        <>
                          <div className="border-t border-pink-300 pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span>Number of Nights:</span>
                              <span>{nights > 0 ? nights : 0} nights</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rate per Night:</span>
                              <span>₹{roomPrice}</span>
                            </div>
                          </div>
                          
                          <div className="bg-pink-400/20 rounded p-2 border border-pink-300">
                            <div className="flex justify-between text-xs text-pink-200">
                              <span>Calculation:</span>
                              <span>{nights > 0 ? nights : 0} nights × ₹{roomPrice} = ₹{nights > 0 ? nights * roomPrice : 0}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                    
                    <div className="border-t border-pink-400 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg text-green-300">
                        <span>Total Amount:</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="text-xs text-pink-200 mt-2">
                      <p>Includes all taxes and fees</p>
                      {bookingData.guests > 1 && (
                        <p>Accommodates {bookingData.guests} guests</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          ) : (
            /* Booking Confirmation */
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-400 mb-4">Booking Confirmed!</h2>
              <div className="bg-green-500/20 rounded-lg p-6 border border-green-400">
                <p className="text-lg mb-2">Booking ID: <span className="font-mono font-bold">{bookingId}</span></p>
                <p className="text-lg mb-2">Guest Name: <span className="font-semibold">{bookingData.guestName}</span></p>
                <p className="text-lg mb-2">Hotel: <span className="font-semibold">{hotel.name}</span></p>
                <p className="text-lg mb-2">Room: <span className="font-semibold">{roomTypes.find(r => r.id === bookingData.roomType)?.name}</span></p>
                <p className="text-lg mb-2">Check-in: <span className="font-semibold">{bookingData.checkIn}</span></p>
                <p className="text-lg mb-2">Check-out: <span className="font-semibold">{bookingData.checkOut}</span></p>
                <p className="text-lg mb-4">Total Amount: <span className="font-bold text-green-400">₹{totalPrice}</span></p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PDFDownloadLink
                  document={<BookingPDF user={user} hotel={hotel} bookingId={bookingId} bookingData={bookingData} totalPrice={totalPrice} />}
                  fileName={`Booking-${bookingId}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <button className="bg-gray-600 text-white px-8 py-3 rounded-lg" disabled>
                        Generating PDF...
                      </button>
                    ) : (
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
                        Download Booking PDF
                      </button>
                    )
                  }
                </PDFDownloadLink>
                
                <button
                  onClick={() => navigate('/hotels')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  Back to Hotels
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HotelBookingForm;
