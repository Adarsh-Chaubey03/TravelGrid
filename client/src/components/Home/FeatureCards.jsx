import React from "react";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: "Great Prices",
    desc: "Save more on every trip with our exclusive deals and discounts.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    title: "Loved by Travelers",
    desc: "Trusted by thousands of travelers worldwide with 4.9/5 ratings.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
    title: "Easy Booking",
    desc: "Book flights, hotels, and experiences in seconds with our streamlined process.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-3.7 4.99c-.47.63-.49 1.49-.05 2.15L14 18h-2v6h4zm-8-2v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 6.54 8H5c-.8 0-1.54.37-2.01 1L-.71 13.99c-.47.63-.49 1.49-.05 2.15L2 18H0v6h12z" />
      </svg>
    ),
    title: "24/7 Support",
    desc: "We're here whenever you need us with round-the-clock customer support.",
  },
];

const FeatureCards = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#3e1f24] to-[#100708] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose TravelGrid?
          </h2>
          <p className="text-lg text-neutral-200 max-w-2xl mx-auto">
            Experience the best in travel with our comprehensive platform
            designed for modern travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group bg-white/10 backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:bg-white/20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 group-hover:bg-white/30 transition-colors duration-200 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
