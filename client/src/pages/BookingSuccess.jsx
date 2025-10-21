import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { CheckCircle, Download, ArrowLeft, Calendar, MapPin, Clock, CreditCard } from "lucide-react";
import FallbackImage from "../components/ui/FallbackImage";

const BookingSuccess = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { bookingData, bookingId } = location.state || {};
  
  if (!bookingData) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${
        isDarkMode ? "bg-gradient-to-br from-black to-pink-900" : "bg-gradient-to-br from-pink-200/50 via-white/70 to-blue-200/50"
      }`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <button
            onClick={() => navigate("/rentals")}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition-colors"
          >
            Back to Rentals
          </button>
        </div>
      </div>
    );
  }

  const containerBg = isDarkMode
    ? "bg-gradient-to-br from-black to-pink-900 text-white"
    : "bg-gradient-to-br from-pink-200/50 via-white/70 to-blue-200/50 text-gray-900";

  return (
    <div className={`min-h-screen pt-20 ${containerBg} transition-all duration-300 font-sans`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Booking <span className="text-green-400">Confirmed!</span>
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your rental has been successfully booked
          </p>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-4 ${
            isDarkMode ? "bg-green-900/50 text-green-300 border border-green-700" : "bg-green-100 text-green-800 border border-green-200"
          }`}>
            Booking ID: {bookingId}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Booking Details */}
          <div className={`rounded-2xl p-6 border shadow-xl ${
            isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/90 border-gray-200"
          }`}>
            <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-pink-500" />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Pickup Date & Time</p>
                  <p className="font-semibold">{bookingData.pickupDate} at {bookingData.pickupTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-pink-500" />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Return Date & Time</p>
                  <p className="font-semibold">{bookingData.returnDate} at {bookingData.returnTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-pink-500" />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Pickup Location</p>
                  <p className="font-semibold">{bookingData.pickupLocation}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-pink-500" />
                <div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Payment Method</p>
                  <p className="font-semibold capitalize">{bookingData.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Pricing */}
          <div className={`rounded-2xl p-6 border shadow-xl ${
            isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/90 border-gray-200"
          }`}>
            <h2 className="text-2xl font-semibold mb-6">Vehicle & Pricing</h2>
            
            {/* Vehicle Image */}
            <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
              <FallbackImage srcList={bookingData?.bike?.images} alt={bookingData.bike.modelName} className="w-full h-full object-cover" />
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg">{bookingData.bike.modelName}</h3>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {bookingData.bike.engineSize} • {bookingData.bike.city}
              </p>
            </div>
            
            {/* Pricing Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Rental ({bookingData.totals.totalDays} days)
                </span>
                <span className="font-semibold">₹{bookingData.totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Security Deposit
                </span>
                <span className="font-semibold">₹{bookingData.totals.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Insurance
                </span>
                <span className="font-semibold">₹{bookingData.totals.insurance.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-green-500">₹{bookingData.totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className={`rounded-2xl p-6 border shadow-xl mt-8 ${
          isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
        }`}>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Important Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What's Next?</h4>
              <ul className="text-sm space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Bring your driving license and ID on pickup day</li>
                <li>• Arrive 15 minutes before your scheduled pickup time</li>
                <li>• Security deposit will be refunded upon safe return</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <ul className="text-sm space-y-1">
                <li>• Email: {bookingData.email}</li>
                <li>• Phone: {bookingData.phone}</li>
                <li>• Emergency: {bookingData.emergencyContact}</li>
                <li>• Support: +91-9876543210</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
          
          <button
            onClick={() => navigate("/rentals")}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Rentals
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
