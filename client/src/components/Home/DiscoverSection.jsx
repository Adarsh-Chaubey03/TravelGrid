import React, { useState } from "react";
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

const DiscoverSection = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  return(

 
  <section className="w-full bg-gradient-to-br from-blue-50 to-pink-50 py-16 text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
      Discover New Destinations
    </h2>
    <p className="text-gray-600 text-base md:text-lg mb-10">
      Explore trending places, hidden gems, and must-visit spots curated just for you.
    </p>

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-2">
      {destinations.map((place, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
          <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-black mb-2">{place.name}</h3>
            <p className="text-gray-600 text-sm">{place.description}</p>
          </div>
          <div className="p-4">
          <button
                onClick={() => setSelectedPlace(place)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
              >
                Book Now
              </button>
        </div>
        </div>
      ))}
    </div>
{selectedPlace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <img
              src={selectedPlace.image}
              alt={selectedPlace.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold mt-3">{selectedPlace.name}</h2>
            <p className="text-gray-600 mt-2">{selectedPlace.description}</p>

            <button
              onClick={() =>
                alert(`Proceeding to booking for ${selectedPlace.name}`)
              }
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Proceed to Book
            </button>

            <button
              onClick={() => setSelectedPlace(null)}
              className="mt-2 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    <div className="mt-16">
      <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black">
        Ready to plan your next adventure?
      </h3>
      <p className="text-gray-600 mb-6">
        Discover more travel ideas, tips, and personalized recommendations.
      </p>
      <button
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium rounded-full shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
      
      >
        Discover More Destinations
      </button>
    </div>
  </section>

 )
};
export default DiscoverSection;
