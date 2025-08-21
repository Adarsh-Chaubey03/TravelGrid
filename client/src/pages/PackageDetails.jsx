import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaCalendarAlt,
  FaRupeeSign,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../components/Custom/Navbar";
import { packages } from "../data/PackageData";
import { useWishlist } from "../context/WishlistContext";
import PackageDetailsSkeleton from "../components/Loaders/PackageDetailsSkeleton";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

// For FAQs and Itinerary
const Accordion = ({ title, content, variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isItinerary = variant === "itinerary";

  return (
    <div className={`w-full border-b border-pink-400/20 mb-2`}>
      <button
        className={`flex justify-between items-center w-full py-4 text-left transition duration-200 text-white hover:text-pink-400 hover:cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-lg font-semibold ${isItinerary ? "flex items-center gap-2" : ""
            }`}
        >
          {isItinerary && (
            <span className="text-xs bg-[#2a002e] border border-pink-500 text-pink-300 px-2 py-0.5 rounded-full">
              {title.split(" - ")[0]}
            </span>
          )}
          {title.split(" - ")[1] || title}
        </span>
        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        />
      </button>
      {/* only for Itinerary */}
      {isOpen && isItinerary ? (
        <div className="pb-4 text-sm text-[#ddd]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
            {content.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-white">
                <span className="text-pink-400">✔</span> <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        isOpen && (
          <div className="pb-4 text-[#cfcfcf] text-sm leading-relaxed">
            {content}
          </div>
        )
      )}
    </div>
  );
};

const PackageDetails = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); //
  const { isAuthenticated, user } = useAuth();
  const { wishlist, addToWishlist } = useWishlist();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    travelers: 1,
    date: "",
  });


  // Extract query param ?q=
  // Get query param safely
  const searchParams = new URLSearchParams(location.search || "");
  const query = searchParams.get("q")?.trim() || "";

  // Find package by id or query
  let packageData = null;
  if (id) {
    packageData = packages.find((pkg) => pkg.id.toString() === id);
  } else if (query) {
    const qLower = query.toLowerCase();
    packageData = packages.find(
      (pkg) =>
        pkg.title.toLowerCase().includes(qLower) ||
        pkg.location.toLowerCase().includes(qLower)
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const openForm = (pkg) => {
    if (!isAuthenticated) {
      toast.error("Please login to book this package");
      navigate("/login", { state: { from: { pathname: `/package/${id}` } } });
      return;
    }

    setSelectedPackage(pkg);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      travelers: 1,
      date: "",
    });
    setBookingConfirmed(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const handleAddToWishlist = (pkg) => {
    const isAlreadyInWishlist = wishlist?.some((item) => item.id === pkg.id);

    if (!isAlreadyInWishlist) {
      addToWishlist(pkg);
      toast.success("Added to wishlist!");
    } else {
      toast("Already in your wishlist");
    }
  };

  if (!packageData) {
    return <p className="text-center text-red-500">Package not found</p>;
  }

  if (loading) {
    return <PackageDetailsSkeleton />;
  }

  const {
    title,
    location: pkgLocation,
    duration,
    price,
    rating,
    reviewCount,
    description,
    highlights,
    itinerary,
    inclusions,
    exclusions,
    reviews,
    faqs,
    image,
  } = packageData;

  return (
    <div className="text-white min-h-screen pb-16">
      <Navbar />

      {/* Header Image with Overlay */}
      <div
        className="w-full h-[60vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0"></div>
        <div className="absolute bottom-10 md:bottom-16 left-6 md:left-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-sm md:text-base text-[#d0d0d0]">
            {pkgLocation} • {duration}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-12 pt-16 md:pt-24 space-y-12">
        {/* Floating Bar */}
        <div className="w-[95%] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 backdrop-blur-sm bg-white/5 border border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl z-20 relative sm:relative sm:shadow-lg">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-xl" />
            <div>
              <p className="text-sm text-[#999]">Duration</p>
              <p className="font-semibold text-base">{duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaRupeeSign className="text-pink-400 text-xl" />
            <div>
              <p className="text-sm text-[#999]">Price</p>
              <p className="font-semibold text-base">₹{price}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-400 text-xl" />
            <div>
              <p className="text-sm text-[#999]">Rating</p>
              <p className="text-white font-semibold text-base">
                {rating}{" "}
                <span className="text-[#b0b0b0] text-xs">({reviewCount})</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => openForm(packageData)}
            className="mt-auto self-start bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </button>

          <button
            onClick={() => handleAddToWishlist(packageData)}
            disabled={wishlist?.some((item) => item.id === packageData.id)}
            className={`mt-2 self-start px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${wishlist?.some((item) => item.id === packageData.id)
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white"
              }`}
          >
            {wishlist?.some((item) => item.id === packageData.id)
              ? "Added to Wishlist"
              : "Add to Wishlist"}
          </button>
        </div>

        {/* Description */}
        <div className="flex items-center justify-center">
          <p className="leading-relaxed text-sm md:text-base text-center">
            {description}
          </p>
        </div>

        {/* Highlights */}
        <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Package Highlights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {highlights.map((point, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 backdrop-blur-md bg-white/5 p-3 rounded-xl text-sm"
              >
                <FaCheck className="text-pink-400" />
                {point}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Day-wise Itinerary</h2>
          <div className="divide-y divide-[#2a2a2a]">
            {itinerary.map((item, idx) => (
              <Accordion
                key={idx}
                title={`Day ${item.day} - ${item.title}`}
                content={item.activities}
                variant="itinerary"
              />
            ))}
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-green-400">
              What's Included
            </h2>
            <ul className="space-y-2 text-sm">
              {inclusions.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <span className>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-red-400">
              What's Not Included
            </h2>
            <ul className="space-y-2 text-sm">
              {exclusions.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <FaTimesCircle className="text-red-500 mt-1" />
                  <span className>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <button className="text-sm text-white px-4 py-1.5 rounded-lg hover:text-pink-300 transition-colors duration-200">
              View All Reviews
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-5 shadow-md transition hover:shadow-lg group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shadow-md">
                    {review.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-base">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>

                <blockquote className="mt-3 text-sm italic border-l-3 border-pink-600/0 group-hover:border-pink-600 pl-4">
                  {review.comment}
                </blockquote>
                <div className="flex items-center mt-3 text-yellow-400 text-sm">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <FaStar key={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="backdrop-blur-sm bg-white/5 border border-pink-400/20 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">FAQs</h2>
          <div className="divide-y divide-pink-400/20">
            {faqs.map((faq, i) => (
              <Accordion key={i} title={faq.question} content={faq.answer} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact/Booking Form Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative text-black">
            <button
              className="absolute top-2 right-3 text-xl text-red-500 font-bold"
              onClick={() => setSelectedPackage(null)}
            >
              ×
            </button>

            {!bookingConfirmed ? (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  Book: {selectedPackage.title}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      required
                      readOnly
                      className="w-full border px-3 py-2 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      required
                      readOnly
                      className="w-full border px-3 py-2 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">
                      Number of Travelers:
                    </label>
                    <input
                      type="number"
                      name="travelers"
                      min={1}
                      value={formData.travelers}
                      required
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      required
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
                  >
                    Confirm Booking
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600">
                  Booking Confirmed!
                </h2>
                <p className="mt-2">
                  Thank you, {formData.name}. Your booking for{" "}
                  {selectedPackage.title} on {formData.date} is successful.
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-semibold"
                    onClick={() => setSelectedPackage(null)}
                  >
                    Close
                  </button>
                  <Link
                    to="/feedback"
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold inline-block text-center"
                    onClick={() => setSelectedPackage(null)}
                  >
                    Share Feedback
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;
