import React, { useState, useEffect } from "react";
import FallbackImage from "../components/ui/FallbackImage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  FileText, 
  Shield,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from "lucide-react";

const BikeBookingForm = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Get bike data from navigation state or fallback
  const bike = location.state?.bike || {
    id: params.bikeId || "default",
    modelName: "Urban Velocity X",
    engineSize: "250 cc",
    city: "Bengaluru",
    dailyRentalCost: 1199,
    images: ["https://images.unsplash.com/photo-1517170956903-3e49376f7669?q=80&w=1600&auto=format&fit=crop"],
    specs: { fuelType: "Petrol" },
    guidelines: { minAge: 18, requiredDocs: ["Driving License", "Government ID"], helmetIncluded: true, securityDeposit: "₹2,000 (refundable)" },
    usability: { recommendedRideType: "City" }
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    pickupLocation: bike.city || "",
    licenseNumber: "",
    emergencyContact: "",
    specialRequests: "",
    paymentMethod: "card",
    agreeToTerms: false,
    agreeToInsurance: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate rental duration and total cost
  const calculateTotal = () => {
    // Return an object with default numeric values to avoid undefined when rendering
    if (!formData.pickupDate || !formData.returnDate) {
      return { totalDays: 0, subtotal: 0, securityDeposit: 0, insurance: 0, total: 0 };
    }

    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    if (isNaN(pickup.getTime()) || isNaN(returnDate.getTime())) {
      return { totalDays: 0, subtotal: 0, securityDeposit: 0, insurance: 0, total: 0 };
    }

    const diffTime = Math.abs(returnDate - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDays = Math.max(1, diffDays);
    const dailyCost = Number(bike.dailyRentalCost) || 0;
    const subtotal = totalDays * dailyCost;
    const securityDeposit = Number(bike.guidelines?.securityDeposit?.toString().replace(/[^0-9]/g, "")) || 2000;
    const insurance = 500; // Fixed insurance cost
    const total = subtotal + securityDeposit + insurance;

    return { totalDays, subtotal, securityDeposit, insurance, total };
  };

  const totals = calculateTotal();

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone number must be 10 digits";
    }
    
    if (step === 2) {
      if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required";
      if (!formData.returnDate) newErrors.returnDate = "Return date is required";
      if (!formData.pickupTime) newErrors.pickupTime = "Pickup time is required";
      if (!formData.returnTime) newErrors.returnTime = "Return time is required";
      if (formData.pickupDate && formData.returnDate) {
        const pickup = new Date(formData.pickupDate);
        const returnDate = new Date(formData.returnDate);
        if (returnDate <= pickup) newErrors.returnDate = "Return date must be after pickup date";
      }
      if (!formData.pickupLocation.trim()) newErrors.pickupLocation = "Pickup location is required";
    }
    
    if (step === 3) {
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
    }
    
    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";
      if (!formData.agreeToInsurance) newErrors.agreeToInsurance = "You must agree to the insurance policy";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to confirmation page or show success message
      navigate("/rentals/booking-success", { 
        state: { 
          bookingData: { ...formData, bike, totals },
          bookingId: `BK${Date.now()}`
        } 
      });
    }, 2000);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const containerBg = isDarkMode
    ? "bg-gradient-to-br from-black to-pink-900 text-white"
    : "bg-gradient-to-br from-pink-200/50 via-white/70 to-blue-200/50 text-gray-900";

  return (
    <div className={`min-h-screen pt-20 ${containerBg} transition-all duration-300 font-sans`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 border transition-all duration-200 hover:scale-[1.02] active:scale-95 mb-6 ${
              isDarkMode ? "border-gray-700 text-white hover:bg-gray-800" : "border-gray-300 bg-white/50 text-gray-900 hover:bg-white"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Details
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Book Your <span className="text-pink-400">{bike.modelName}</span>
            </h1>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Complete your booking in just a few steps
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl p-6 border shadow-xl ${
              isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/90 border-gray-200"
            }`}>
              
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step <= currentStep
                          ? "bg-pink-500 text-white"
                          : isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                      }`}>
                        {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                      </div>
                      {step < 4 && (
                        <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                          step < currentStep ? "bg-pink-500" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <span className={currentStep >= 1 ? "text-pink-400" : isDarkMode ? "text-gray-400" : "text-gray-500"}>Personal Info</span>
                  <span className={currentStep >= 2 ? "text-pink-400" : isDarkMode ? "text-gray-400" : "text-gray-500"}>Dates & Location</span>
                  <span className={currentStep >= 3 ? "text-pink-400" : isDarkMode ? "text-gray-400" : "text-gray-500"}>Documents</span>
                  <span className={currentStep >= 4 ? "text-pink-400" : isDarkMode ? "text-gray-400" : "text-gray-500"}>Payment</span>
                </div>
              </div>

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-pink-500" />
                    Personal Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.firstName 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.lastName 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.email 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.phone 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                        placeholder="9876543210"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Dates & Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-pink-500" />
                    Rental Dates & Location
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Date *</label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        min={today}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.pickupDate 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                      />
                      {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Return Date *</label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleInputChange}
                        min={formData.pickupDate || today}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.returnDate 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                      />
                      {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Time *</label>
                      <input
                        type="time"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.pickupTime 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                      />
                      {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Return Time *</label>
                      <input
                        type="time"
                        name="returnTime"
                        value={formData.returnTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                          errors.returnTime 
                            ? "border-red-500" 
                            : isDarkMode 
                              ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                              : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                        }`}
                      />
                      {errors.returnTime && <p className="text-red-500 text-sm mt-1">{errors.returnTime}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pickup Location *</label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.pickupLocation 
                          ? "border-red-500" 
                          : isDarkMode 
                            ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                            : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                      }`}
                      placeholder="Enter pickup address"
                    />
                    {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-pink-500" />
                    Required Documents
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Driving License Number *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.licenseNumber 
                          ? "border-red-500" 
                          : isDarkMode 
                            ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                            : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                      }`}
                      placeholder="Enter your driving license number"
                    />
                    {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact Number *</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.emergencyContact 
                          ? "border-red-500" 
                          : isDarkMode 
                            ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                            : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                      }`}
                      placeholder="Emergency contact phone number"
                    />
                    {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none ${
                        isDarkMode 
                          ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                      }`}
                      placeholder="Any special requests or additional information..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Payment & Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-pink-500" />
                    Payment & Confirmation
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        isDarkMode 
                          ? "bg-gray-800 border-gray-600 text-white focus:border-pink-400" 
                          : "bg-white border-gray-300 text-gray-900 focus:border-pink-400"
                      }`}
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="upi">UPI Payment</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="wallet">Digital Wallet</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-pink-500 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          I agree to the <span className="text-pink-400 underline cursor-pointer">Terms and Conditions</span> and <span className="text-pink-400 underline cursor-pointer">Privacy Policy</span>
                        </p>
                        {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreeToInsurance"
                        checked={formData.agreeToInsurance}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-pink-500 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          I understand the insurance coverage and agree to the <span className="text-pink-400 underline cursor-pointer">insurance policy</span>
                        </p>
                        {errors.agreeToInsurance && <p className="text-red-500 text-sm mt-1">{errors.agreeToInsurance}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                ) : (
                  <div />
                )}
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border shadow-xl sticky top-24 ${
              isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/90 border-gray-200"
            }`}>
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              
              {/* Bike Info */}
              <div className="mb-6">
                <div className="relative h-32 w-full rounded-xl overflow-hidden mb-4">
                  <FallbackImage srcList={bike.images} alt={bike.modelName} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-lg">{bike.modelName}</h4>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {bike.engineSize} • {bike.city}
                </p>
              </div>
              
              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Rental ({totals.totalDays} days)
                  </span>
                  <span className="font-semibold">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Security Deposit
                  </span>
                  <span className="font-semibold">₹{totals.securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Insurance
                  </span>
                  <span className="font-semibold">₹{totals.insurance.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-pink-500">₹{totals.total.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Important Notes */}
              <div className={`p-4 rounded-xl ${isDarkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-200"}`}>
                <h5 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important Notes
                </h5>
                <ul className="text-xs space-y-1">
                  <li>• Security deposit is refundable upon return</li>
                  <li>• Helmet is included with bike rental</li>
                  <li>• Valid driving license required</li>
                  <li>• Minimum age: {bike.guidelines?.minAge || 18} years</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeBookingForm;
