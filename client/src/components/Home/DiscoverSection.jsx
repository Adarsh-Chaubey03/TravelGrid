import React from "react";

const destinations = [
  {
    name: "Manali, Himachal",
    description: "A beautiful hill station known for its scenic beauty and adventure sports.",
    image: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww"
  },
  {
    name: "Jaipur, Rajasthan",
    description: "The Pink City with rich history, forts, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFpcHVyfGVufDB8fDB8fHww"
  },
  {
    name: "Goa",
    description: "Popular beach destination with nightlife, water sports, and culture.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29hfGVufDB8fDB8fHww"
  },
  {
    name: "Rishikesh, Uttarakhand",
    description: "The yoga capital of the world, nestled on the banks of the Ganges.",
    image: "https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmlzaGlrZXNofGVufDB8fDB8fHww"
  },
];

const DiscoverSection = () => (
  <section className="w-full bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-800 dark:to-purple-800 py-16 text-center transition-colors duration-300">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">
      Discover New Destinations
    </h2>
    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-10">
      Explore trending places, hidden gems, and must-visit spots curated just for you.
    </p>

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-2">
      {destinations.map((place, index) => (
        <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{place.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{place.description}</p>
          </div>
          <div className="p-4">
          <button className="mt-auto w-full bg-zinc-800 dark:bg-pink-600 hover:bg-zinc-900 dark:hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 transform hover:scale-105">Book Now</button>
        </div>
        </div>
      ))}
    </div>

    <div className="mt-16">
      <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black dark:text-white">
        Ready to plan your next adventure?
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Discover more travel ideas, tips, and personalized recommendations.
      </p>
      <button
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium rounded-full shadow-lg hover:scale-105 transition duration-300"
      
      >
        Discover More Destinations
      </button>
    </div>
  </section>
);

export default DiscoverSection;
