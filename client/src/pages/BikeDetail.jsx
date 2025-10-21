import React, { useMemo, useState } from "react";
// Import necessary React Router elements
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// --- FALLBACK DATA ---
const FALLBACK_BIKE = {
  id: "sample-1",
  modelName: "Urban Velocity X",
  engineSize: "250 cc",
  city: "Bengaluru",
  dailyRentalCost: 1199,
  images: [
    "https://images.unsplash.com/photo-1517170956903-3e49376f7669?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1600&auto=format&fit=crop",
  ],
  specs: {
    mileageKmPerL: 35,
    totalKmDriven: 18250,
    fuelType: "Petrol",
    topSpeedKmph: 120,
    requiredLicense: "LMV / Two-wheeler"
  },
  guidelines: {
    minAge: 18,
    requiredDocs: ["Driving License", "Government ID"],
    securityDeposit: "₹2,000 (refundable)",
    helmetIncluded: true,
    cancellationPolicy: "Free cancellation up to 24 hours before pickup. 50% charge thereafter."
  },
  usability: {
    maxRangeFullTankKm: 350,
    recommendedRideType: "City",
    insuranceIncluded: true
  }
};

/**
 * Helper Component: InfoItem
 * Renders a single statistic box.
 */
function InfoItem({ label, value }) {
  const { isDarkMode } = useTheme();
  return (
    <div className={`rounded-xl p-4 border transition-colors ${isDarkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/70 border-gray-200"}`}>
      <div className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</div>
      <div className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value ?? "-"}</div>
    </div>
  );
}


/**
 * Main Bike Detail Component (Relies on Router Context)
 */
function BikeDetail() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Determine the bike data: prioritize route state, then use fallback constant
  const bike = useMemo(() => {
    return location.state?.bike || FALLBACK_BIKE;
  }, [location.state]);
  
  // Use route params for mock booking ID, defaulting to the fallback ID.
  const mockBikeId = params.bikeId || bike.id; 

  const [active, setActive] = useState(0);
  // Normalize images: remove falsy items and fall back to guaranteed list
  const images = (bike.images || []).filter(Boolean);
  const usingFallbackImages = images.length === 0;
  const effectiveImages = usingFallbackImages ? FALLBACK_BIKE.images : images;

  // Track which images have failed (optional, could be useful for cycling)
  const [failedIndices, setFailedIndices] = useState([]);

  // Carousel handlers are concise and robust
  const goPrev = () => setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Determine background based on dark mode state
  const containerBg = isDarkMode
    ? "bg-gradient-to-br from-gray-900 to-pink-950 text-white"
    : "bg-gradient-to-br from-pink-100/50 via-white/70 to-blue-100/50 text-gray-900";

  return (
    <div className={`min-h-screen pt-20 ${containerBg} transition-all duration-300 font-sans`}>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Back Button */}
        <button aria-label="Back"
          onClick={() => navigate(-1)}
          className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 border transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
            isDarkMode ? "border-gray-700 text-white hover:bg-gray-800" : "border-gray-300 bg-white/50 text-gray-900 hover:bg-white"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Listings (Mock)
        </button>

        {/* Hero / Carousel (Using responsive aspect ratio for better mobile handling) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border bg-black/20 border-white/10 aspect-video max-h-[500px]">
          <img
            src={effectiveImages[active]}
            alt={`${bike.modelName} - image ${active + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
            loading="lazy"
            onError={(e) => {
              // Prevent infinite error loop
              e.target.onerror = null;
              // Mark this index as failed
              setFailedIndices(prev => (prev.includes(active) ? prev : [...prev, active]));
              // Try to find another non-failed image from effectiveImages
              const nextIdx = effectiveImages.findIndex((_, i) => i !== active && !failedIndices.includes(i));
              if (nextIdx !== -1) {
                setActive(nextIdx);
                e.target.src = effectiveImages[nextIdx];
                return;
              }
              // Final fallback to bundled fallback image (guaranteed to exist)
              e.target.src = FALLBACK_BIKE.images[0];
            }}
          />
          {images.length > 1 && (
            <>
              {/* Navigation Buttons */}
              <button aria-label="Previous image"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full p-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button aria-label="Next image"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full p-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              {/* Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <span key={i} className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ${i === active ? "bg-pink-400 scale-125 shadow-md" : "bg-white/50 hover:bg-white/80"}`} onClick={() => setActive(i)}></span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Header Info Card & CTA */}
        <div className={`mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6`}>
          {/* Bike Details Header */}
          <div className={`lg:col-span-2 rounded-2xl p-6 border shadow-xl ${
            isDarkMode ? "bg-gray-900/60 border-gray-800 text-white" : "bg-white/90 border-gray-200 text-gray-900"
          }`}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold">{bike.modelName}</h1>
                <p className={`mt-2 text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {bike.engineSize} • Location: {bike.city}
                </p>
              </div>
              <div className="text-right pt-2">
                <div className="text-sm uppercase tracking-widest text-pink-400">
                  Daily Rental
                </div>
                {/* Price Gradient is highly visible */}
                <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                  ₹{Number(bike.dailyRentalCost).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card (Call to Action) */}
          <div className={`rounded-2xl p-6 border shadow-xl flex flex-col justify-center items-stretch space-y-4 transition-colors ${
            isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className={`text-sm flex items-center gap-2 ${isDarkMode ? "text-pink-400" : "text-indigo-600"}`}>
              <Info className="w-4 h-4" />
              Book Today, Pay Later! Secure this rental now.
            </div>
            <button aria-label="Proceed to Booking"
              onClick={() => navigate(`/rentals/bike/${mockBikeId}/booking`, { state: { bike } })}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/50"
            >
              Confirm Rental
            </button>
            <button aria-label="Check Availability"
              onClick={() => navigate('/')} // Mocking return to home
              className={`${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-900 hover:bg-gray-200"} w-full border border-transparent rounded-xl px-4 py-3 transition-all duration-200 font-medium`}
            >
              Check Availability Calendar
            </button>
          </div>
        </div>

        {/* Sections: Specifications, Usability, Guidelines */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Technical Specifications Section */}
          <section className={`rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200/50">Technical Specs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Mileage" value={`${bike.specs?.mileageKmPerL ?? "-"} km/l`} />
              {/* Consistent use of optional chaining and fallbacks */}
              <InfoItem label="Total Kilometers" value={`${bike.specs?.totalKmDriven?.toLocaleString?.('en-IN') ?? bike.specs?.totalKmDriven ?? "-"} km`} />
              <InfoItem label="Fuel Type" value={bike.specs?.fuelType} />
              <InfoItem label="Top Speed" value={`${bike.specs?.topSpeedKmph ?? "-"} km/h`} />
              <InfoItem label="License Type" value={bike.specs?.requiredLicense} />
              <InfoItem label="Engine Volume" value={bike.engineSize} />
            </div>
          </section>

          {/* Usability Information Section */}
          <section className={`rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200/50">Usability & Coverage</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Max Range (Full Tank)" value={`${bike.usability?.maxRangeFullTankKm ?? "-"} km`} />
              <InfoItem label="Recommended Ride" value={bike.usability?.recommendedRideType} />
              <InfoItem label="Insurance Coverage" value={bike.usability?.insuranceIncluded ? "Included" : "Not Included"} />
              <InfoItem label="Helmet Provided" value={bike.guidelines?.helmetIncluded ? "Yes" : "No"} />
            </div>
          </section>

          {/* Rental Guidelines Section (Use a clean list structure) */}
          <section className={`rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200/50">Rental Guidelines</h2>
            <ul className={`space-y-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {/* Structured list items for readability */}
              <li className="flex items-start gap-2">
                <span className="text-lg font-semibold w-20">Age:</span>
                <span>{bike.guidelines?.minAge}+ years required.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg font-semibold w-20">Documents:</span>
                <span>{(bike.guidelines?.requiredDocs || []).join(" / ")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg font-semibold w-20">Deposit:</span>
                <span>{bike.guidelines?.securityDeposit || "N/A"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg font-semibold w-20">Cancel:</span>
                <span className="text-sm italic">{bike.guidelines?.cancellationPolicy}</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer CTA - Always visible/prominent at the end of the page */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button aria-label="Final Proceed to Booking"
            onClick={() => navigate(`/rentals/bike/${mockBikeId}/booking`, { state: { bike } })}
            className="sm:w-1/2 lg:w-1/3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl shadow-purple-500/50"
          >
            Confirm Rental for ₹{Number(bike.dailyRentalCost).toLocaleString("en-IN")} / Day
          </button>
        </div>
      </div>
    </div>
  );
}

export default BikeDetail;
