import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { ChevronLeft, ChevronRight, ArrowLeft, Info } from "lucide-react";

const fallbackBike = {
  id: "sample-1",
  modelName: "City Bike 250cc",
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

export default function BikeDetail() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const bike = useMemo(() => {
    // Prefer data from route state; fall back to sample
    return location.state?.bike || fallbackBike;
  }, [location.state]);

  const [active, setActive] = useState(0);
  const images = bike.images && bike.images.length > 0 ? bike.images : fallbackBike.images;

  const goPrev = () => setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const containerBg = isDarkMode
    ? "bg-gradient-to-br from-black to-pink-900"
    : "bg-gradient-to-br from-pink-200/50 via-white/70 to-blue-200/50";

  return (
    <div className={`min-h-screen mt-20 ${containerBg} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Back */}
        <button aria-label="Back"
          onClick={() => navigate(-1)}
          className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 border transition-all duration-200 hover:scale-105 ${
            isDarkMode ? "border-gray-700 text-white hover:bg-gray-800" : "border-gray-300 text-gray-900 hover:bg-white"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Listings
        </button>

        {/* Hero / Carousel */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border bg-black/20 border-white/10">
          <img
            src={images[active]}
            alt={`${bike.modelName} - image ${active + 1}`}
            className="w-full h-[260px] sm:h-[380px] md:h-[460px] object-cover"
            loading="lazy"
          />
          {images.length > 1 && (
            <>
              <button aria-label="Previous"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button aria-label="Next"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <span key={i} className={`h-2 w-2 rounded-full ${i === active ? "bg-pink-400" : "bg-white/50"}`}></span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Header Info Card */}
        <div className={`mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6`}>
          <div className={`lg:col-span-2 rounded-2xl p-6 border shadow-lg ${
            isDarkMode ? "bg-gray-900/60 border-gray-700 text-white" : "bg-white/80 border-gray-200 text-gray-900"
          }`}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{bike.modelName}</h1>
                <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {bike.engineSize} • {bike.city}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm uppercase tracking-wide">
                  Daily
                </div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                  ₹{Number(bike.dailyRentalCost).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className={`rounded-2xl p-6 border shadow-lg flex flex-col justify-between ${
            isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"
          }`}>
            <div className={`text-sm mb-4 flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Info className="w-4 h-4" />
              Limited availability. Prices may vary on weekends and holidays.
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button aria-label="Proceed to Booking"
                onClick={() => navigate('/rentals', { state: { bikeId: params.id || bike.id } })}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Proceed to Booking
              </button>
              <button aria-label="Return to Listings"
                onClick={() => navigate(-1)}
                className={`${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"} border rounded-xl px-4 py-3 transition-all duration-200`}
              >
                Return to Listings
              </button>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <section className={`rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Model Name" value={bike.modelName} />
              <InfoItem label="Engine Size" value={bike.engineSize} />
              <InfoItem label="City" value={bike.city} />
              <InfoItem label="Daily Cost" value={`₹${Number(bike.dailyRentalCost).toLocaleString('en-IN')}`} />
            </div>
          </section>

          {/* Technical Specifications */}
          <section className={`rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Mileage" value={`${bike.specs?.mileageKmPerL ?? "-"} km/l`} />
              <InfoItem label="Total Kilometers" value={`${bike.specs?.totalKmDriven?.toLocaleString?.('en-IN') ?? bike.specs?.totalKmDriven ?? "-"} km`} />
              <InfoItem label="Fuel Type" value={bike.specs?.fuelType} />
              <InfoItem label="Top Speed" value={`${bike.specs?.topSpeedKmph ?? "-"} km/h`} />
              <InfoItem label="License Type" value={bike.specs?.requiredLicense} />
            </div>
          </section>

          {/* Usability Information */}
          <section className={`rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
            <h2 className="text-xl font-semibold mb-4">Usability Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem label="Max Range (Full Tank)" value={`${bike.usability?.maxRangeFullTankKm ?? "-"} km`} />
              <InfoItem label="Recommended Ride" value={bike.usability?.recommendedRideType} />
              <InfoItem label="Insurance Coverage" value={bike.usability?.insuranceIncluded ? "Included" : "Not Included"} />
            </div>
          </section>
        </div>

        {/* Rental Guidelines - full width */}
        <section className={`mt-6 rounded-2xl p-6 border shadow-lg ${isDarkMode ? "bg-gray-900/60 border-gray-700" : "bg-white/80 border-gray-200"}`}>
          <h2 className="text-xl font-semibold mb-4">Rental Guidelines</h2>
          <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <li><span className="font-semibold">Minimum Age:</span> {bike.guidelines?.minAge}+ years</li>
            <li><span className="font-semibold">Required Documents:</span> {(bike.guidelines?.requiredDocs || []).join(", ")}</li>
            <li><span className="font-semibold">Security Deposit:</span> {bike.guidelines?.securityDeposit || "N/A"}</li>
            <li><span className="font-semibold">Helmet:</span> {bike.guidelines?.helmetIncluded ? "Included" : "Bring your own"}</li>
            <li><span className="font-semibold">Cancellation & Refund:</span> {bike.guidelines?.cancellationPolicy}</li>
          </ul>
        </section>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button aria-label="Proceed to Booking bottom"
            onClick={() => navigate('/rentals', { state: { bikeId: params.id || bike.id } })}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg"
          >
            Proceed to Booking
          </button>
          <button aria-label="Return to Listings bottom"
            onClick={() => navigate(-1)}
            className={`${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"} border rounded-2xl px-6 py-4 transition-all duration-200`}
          >
            Return to Listings
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  const { isDarkMode } = useTheme();
  return (
    <div className={`rounded-xl p-4 border ${isDarkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/70 border-gray-200"}`}>
      <div className={`text-xs uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</div>
      <div className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value ?? "-"}</div>
    </div>
  );
}


