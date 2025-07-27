import React, { useState } from "react";
import Navbar from "../components/Custom/Navbar";

const packages = [
  {
    id: 1,
    title: "Tropical Paradise – Maldives",
    price: "₹49,999",
    duration: "5 Days / 4 Nights",
    rating: 5,
    image:
      "https://plus.unsplash.com/premium_photo-1692897456929-5774bd1c8e28?q=80&w=2090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reviews: [
      { user: "Alice", comment: "Loved the Tropical Paradise – Maldives! Highly recommend." },
      { user: "Bob", comment: "Great experience, would book again." },
    ],
  },
  {
    id: 2,
    title: "European Explorer – Italy & France",
    price: "₹89,999",
    duration: "7 Days / 6 Nights",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1533333980833-8340a468dfec?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reviews: [
      { user: "Alice", comment: "Loved the European Explorer – Italy & France! Highly recommend." },
      { user: "Bob", comment: "Great experience, would book again." },
    ],
  },
  {
    id: 3,
    title: "Desert Delight – Dubai",
    price: "₹59,999",
    duration: "4 Days / 3 Nights",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1624664929067-5bc278a7c57e?q=80&w=1195&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reviews: [
      { user: "Alice", comment: "Loved the Desert Delight – Dubai! Highly recommend." },
      { user: "Bob", comment: "Great experience, would book again." },
    ],
  },
  {
    id: 4,
    title: "Himalayan Adventure – Manali",
    price: "₹19,999",
    duration: "6 Days / 5 Nights",
    rating: 3,
    image:
      "https://plus.unsplash.com/premium_photo-1661964400999-264ce5993f8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reviews: [
      { user: "Alice", comment: "Loved the Himalayan Adventure – Manali! Highly recommend." },
      { user: "Bob", comment: "Great experience, would book again." },
    ],
  },
  {
    id: 5,
    title: "City Lights – New York",
    price: "₹79,999",
    duration: "6 Days / 5 Nights",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1531671184257-6cfe3235e5d5?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    reviews: [
      { user: "Alice", comment: "Amazing trip to New York, so many things to do!" },
      { user: "Bob", comment: "The city that never sleeps – a must-visit!" },
    ],
  },
  {
    id: 6,
    title: "Tropical Escape – Bali",
    price: "₹39,999",
    duration: "5 Days / 4 Nights",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1710104434425-6ae10f736622?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    reviews: [
      { user: "Alice", comment: "Bali is such a paradise, perfect for a relaxing getaway." },
      { user: "Bob", comment: "Great place for beaches, food, and culture!" },
    ],
  },
  {
    id: 7,
    title: "Wild Safari – Kenya",
    price: "₹99,999",
    duration: "7 Days / 6 Nights",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1536937275673-8a12b3812e8e?q=80&w=762&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    reviews: [
      { user: "Alice", comment: "Kenya safari was an unforgettable experience!" },
      { user: "Bob", comment: "The wildlife experience was incredible!" },
    ],
  },
  {
    id: 8,
    title: "Historical Wonders – Egypt",
    price: "₹89,999",
    duration: "7 Days / 6 Nights",
    rating: 5,
    image:
      "https://plus.unsplash.com/premium_photo-1701172277688-32d05010526a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    reviews: [
      { user: "Alice", comment: "Visiting the pyramids in Egypt was a dream come true!" },
      { user: "Bob", comment: "Incredible history, culture, and architecture." },
    ],
  },
  {
    id: 9,
    title: "Beach Bliss – Seychelles",
    price: "₹69,999",
    duration: "6 Days / 5 Nights",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1608721557534-f3e066444862?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    reviews: [
      { user: "Alice", comment: "Seychelles was a dream destination for a beach lover." },
      { user: "Bob", comment: "Amazing beaches, amazing resorts." },
    ],
  },
  {
    id: 10,
    title: "Cultural Heritage – Japan",
    price: "₹109,999",
    duration: "8 Days / 7 Nights",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1730724376816-02785c9eefe1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    reviews: [
      { user: "Alice", comment: "Japan is the perfect blend of tradition and modernity!" },
      { user: "Bob", comment: "The food, culture, and technology are just out of this world." },
    ],
  },
];

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const digitsOnly = priceStr.replace(/[^\d]/g, "");
  return parseInt(digitsOnly, 10);
};

const TravelPackages = () => {
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", travelers: 1 });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredPackages = packages.filter((pkg) => {
    const numericPrice = parsePrice(pkg.price);
    return pkg.rating >= minRating && numericPrice <= maxPrice;
  });

  const handlePriceChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setMaxPrice(Infinity);
    } else {
      setMaxPrice(Number(val));
    }
  };

  const openForm = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({ name: "", email: "", travelers: 1 });
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 overflow-x-hidden">
      <Navbar />
      <main className="flex flex-col flex-1 w-full items-center pt-24">
        <section className="w-full py-24 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Discover Our <span className="text-pink-400">Travel Packages</span>
          </h1>
          <p className="text-lg md:text-xl text-pink-200 max-w-2xl mx-auto">
            Handpicked vacation deals crafted for unforgettable experiences.
          </p>

          {/* Filters */}
          <div className="mt-6 flex justify-center items-center gap-8 flex-wrap text-white">
            <div className="flex items-center gap-2">
              <label htmlFor="minRating" className="font-semibold whitespace-nowrap">
                Minimum Rating:
              </label>
              <select
                id="minRating"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-black/30 rounded-md px-3 py-1 text-white"
              >
                <option value={0}>All</option>
                <option value={1}>1 Star & Up</option>
                <option value={2}>2 Stars & Up</option>
                <option value={3}>3 Stars & Up</option>
                <option value={4}>4 Stars & Up</option>
                <option value={5}>5 Stars Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="maxPrice" className="font-semibold whitespace-nowrap">
                Max Price (₹):
              </label>
              <input
                type="number"
                id="maxPrice"
                placeholder="No limit"
                onChange={handlePriceChange}
                className="bg-black/30 rounded-md px-3 py-1 text-white w-28"
                min="0"
              />
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="max-w-7xl w-full px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl shadow-xl overflow-hidden flex flex-col"
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-56 object-cover object-center"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-semibold text-white mb-1">{pkg.title}</h3>
                  <span className="text-pink-300 font-medium mb-2">{pkg.duration}</span>

                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, idx) => (
                      <svg
                        key={idx}
                        className={`w-5 h-5 ${
                          idx < pkg.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927a1 1 0 011.902 0l1.517 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.364 1.118l1.517 4.674c.3.921-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.517-4.674z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-pink-200 font-semibold mb-4">{pkg.price}</p>

                  <div className="mb-4">
                    <h4 className="text-pink-400 text-lg font-bold mb-2">Reviews</h4>
                    {pkg.reviews && pkg.reviews.length > 0 ? (
                      <ul className="space-y-1 text-pink-100 text-sm max-h-28 overflow-y-auto pr-2">
                        {pkg.reviews.map((review, idx) => (
                          <li key={idx}>
                            <span className="font-semibold text-pink-300">{review.user}:</span>{" "}
                            {review.comment}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-pink-300 text-xs italic">No reviews yet.</p>
                    )}
                  </div>


                  <button
                    onClick={() => openForm(pkg)}
                    className="mt-auto self-start bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >

                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-pink-300 text-center col-span-full">
              No packages match the selected filters.
            </p>
          )}
        </section>
      </main>

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
                <h2 className="text-2xl font-bold mb-2">Book: {selectedPackage.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">Your Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      required
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Email Address:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      required
                      onChange={handleFormChange}
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Number of Travelers:</label>
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
                      name="Date"
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
                <h2 className="text-2xl font-bold text-green-600">Booking Confirmed!</h2>
                <p className="mt-2">Thank you, {formData.name}. Your booking on {formData.Date} is successful.</p>
                <button
                  className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-semibold"
                  onClick={() => setSelectedPackage(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPackages;
