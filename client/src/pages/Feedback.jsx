import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Feedback = () => {
  // Add CSS to force dropdown to open downward
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      select[name="hotel"] {
        direction: ltr !important;
      }
      select[name="hotel"] option {
        direction: ltr !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [formData, setFormData] = useState({
    rating: 0,
    package: '',
    hotel: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isHotelDropdownOpen, setIsHotelDropdownOpen] = useState(false);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.message || formData.rating === 0) {
      toast.error('Please provide your feedback and rating');
      return;
    }

    // Simulate API call
    toast.loading('Submitting your feedback...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Thank you for your feedback! We appreciate your input. 🎉');
      setIsSubmitted(true);
      setFormData({
        rating: 0,
        package: '',
        hotel: '',
        message: ''
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const travelPackages = [
    { value: 'tropical-paradise-maldives', label: 'Tropical Paradise – Maldives', icon: '🏝️' },
    { value: 'european-explorer-italy-france', label: 'European Explorer – Italy & France', icon: '🏰' },
    { value: 'desert-delight-dubai', label: 'Desert Delight – Dubai', icon: '🏜️' },
    { value: 'himalayan-adventure-manali', label: 'Himalayan Adventure – Manali', icon: '🏔️' }
  ];

  const hotels = [
    { value: 'taj-mahal-palace', label: 'The Taj Mahal Palace', location: 'Mumbai, India', icon: '🏛️' },
    { value: 'the-plaza', label: 'The Plaza', location: 'New York, USA', icon: '🏙️' },
    { value: 'hotel-de-paris', label: 'Hotel de Paris', location: 'Monte-Carlo, Monaco', icon: '🎰' },
    { value: 'the-ritz-london', label: 'The Ritz', location: 'London, UK', icon: '🏰' },
    { value: 'the-peninsula', label: 'The Peninsula', location: 'Hong Kong, China', icon: '🌆' },
    { value: 'four-seasons-george-v', label: 'Four Seasons George V', location: 'Paris, France', icon: '🗼' },
    { value: 'raffles-singapore', label: 'Raffles', location: 'Singapore', icon: '🌴' },
    { value: 'the-langham-chicago', label: 'The Langham', location: 'Chicago, USA', icon: '🏙️' },
    { value: 'the-savoy', label: 'The Savoy', location: 'London, UK', icon: '🏰' }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-600 via-pink-700 to-pink-800 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Share Your <span className="text-yellow-400">Feedback</span>
          </h1>
          <p className="text-xl opacity-95 max-w-2xl mx-auto">
            Help us improve your travel experience! Your feedback is invaluable to us.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Feedback Info */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Your Feedback Matters</h3>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  🎯
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Improve Our Services</h4>
                  <p className="text-green-600 font-medium">Help us enhance your travel experience</p>
                  <p className="text-gray-500 text-sm">Your insights drive our improvements</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  💡
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Share Ideas</h4>
                  <p className="text-blue-600 font-medium">Suggest new features and destinations</p>
                  <p className="text-gray-500 text-sm">We love hearing your creative ideas</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl mr-4">
                  ⭐
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Rate Your Experience</h4>
                  <p className="text-purple-600 font-medium">Let us know how we're doing</p>
                  <p className="text-gray-500 text-sm">Your ratings help other travelers</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feedback Form */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-2xl p-8 border border-pink-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tell Us What You Think</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">✓</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Feedback Submitted!</h3>
                <p className="text-gray-600">Thank you for helping us improve. We'll review your feedback carefully.</p>
              </div>
            ) : (
                             <form onSubmit={handleSubmit} className="space-y-6">

                



                                 {/* Package/Destination and Hotel */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="relative">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Package</label>
                     <div className="relative">
                       <button
                         type="button"
                         onClick={() => {
                           setIsPackageDropdownOpen(!isPackageDropdownOpen);
                           setIsHotelDropdownOpen(false);
                         }}
                         className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none bg-white text-left flex items-center justify-between"
                       >
                         <span className="truncate">
                           {formData.package ? 
                             travelPackages.find(p => p.value === formData.package)?.icon + ' ' + 
                             travelPackages.find(p => p.value === formData.package)?.label
                             : 'Select your package'
                           }
                         </span>
                         <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>
                       
                       {isPackageDropdownOpen && (
                         <div className="absolute top-full left-0 mt-1 bg-white border-2 border-pink-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto min-w-full w-max">
                           <div
                             className="px-4 py-2 cursor-pointer hover:bg-pink-50"
                             onClick={() => {
                               setFormData({ ...formData, package: '' });
                               setIsPackageDropdownOpen(false);
                             }}
                           >
                             Select your package
                           </div>
                           {travelPackages.map((pkg) => (
                             <div
                               key={pkg.value}
                               className="px-4 py-2 cursor-pointer hover:bg-pink-50 whitespace-nowrap"
                               onClick={() => {
                                 setFormData({ ...formData, package: pkg.value });
                                 setIsPackageDropdownOpen(false);
                               }}
                             >
                               {pkg.icon} {pkg.label}
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                   <div className="relative">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel (if booked)</label>
                     <div className="relative">
                       <button
                         type="button"
                         onClick={() => {
                           setIsHotelDropdownOpen(!isHotelDropdownOpen);
                           setIsPackageDropdownOpen(false);
                         }}
                         className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none bg-white text-left flex items-center justify-between"
                       >
                         <span className="truncate">
                           {formData.hotel ? 
                             hotels.find(h => h.value === formData.hotel)?.icon + ' ' + 
                             hotels.find(h => h.value === formData.hotel)?.label + ' - ' + 
                             hotels.find(h => h.value === formData.hotel)?.location
                             : 'Select your hotel'
                           }
                         </span>
                         <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>
                       
                       {isHotelDropdownOpen && (
                         <div className="absolute top-full left-0 mt-1 bg-white border-2 border-pink-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto min-w-full w-max">
                           <div
                             className="px-4 py-2 cursor-pointer hover:bg-pink-50"
                             onClick={() => {
                               setFormData({ ...formData, hotel: '' });
                               setIsHotelDropdownOpen(false);
                             }}
                           >
                             Select your hotel
                           </div>
                           {hotels.map((hotel) => (
                             <div
                               key={hotel.value}
                               className="px-4 py-2 cursor-pointer hover:bg-pink-50 whitespace-nowrap"
                               onClick={() => {
                                 setFormData({ ...formData, hotel: hotel.value });
                                 setIsHotelDropdownOpen(false);
                               }}
                             >
                               {hotel.icon} {hotel.label} - {hotel.location}
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                 </div>

                                 {/* Message */}
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback *</label>
                   <textarea
                     name="message"
                     rows="3"
                     value={formData.message}
                     onChange={handleChange}
                     className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all outline-none resize-none bg-white"
                     placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                     required
                   />
                 </div>

                 {/* Rating */}
                 <div className="text-center">

                   <div className="flex items-center justify-center space-x-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                       <button
                         key={star}
                         type="button"
                         onClick={() => handleRatingClick(star)}
                         onMouseEnter={() => setHoveredRating(star)}
                         onMouseLeave={() => setHoveredRating(0)}
                         className="p-2 hover:scale-110 transition-transform"
                       >
                         <Star
                           size={32}
                           className={`${
                             star <= (hoveredRating || formData.rating)
                               ? 'fill-yellow-400 text-yellow-400'
                               : 'text-gray-300'
                           }`}
                         />
                       </button>
                     ))}
                   </div>
                   <p className="text-sm text-gray-500 mt-2">
                     {formData.rating === 0 && 'Rate your experience'}
                     {formData.rating === 1 && 'Poor'}
                     {formData.rating === 2 && 'Fair'}
                     {formData.rating === 3 && 'Good'}
                     {formData.rating === 4 && 'Very Good'}
                     {formData.rating === 5 && 'Excellent'}
                   </p>
                 </div>

                 {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 