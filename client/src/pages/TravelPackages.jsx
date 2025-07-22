import React from "react";

const packages = [
  {
    id: 1,
    title: "Tropical Paradise – Maldives",
    price: "₹49,999",
    duration: "5 Days / 4 Nights",
    image: "https://plus.unsplash.com/premium_photo-1692897456929-5774bd1c8e28?q=80&w=2090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "European Explorer – Italy & France",
    price: "₹89,999",
    duration: "7 Days / 6 Nights",
    image: "https://images.unsplash.com/photo-1533333980833-8340a468dfec?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Desert Delight – Dubai",
    price: "₹59,999",
    duration: "4 Days / 3 Nights",
    image: "https://images.unsplash.com/photo-1624664929067-5bc278a7c57e?q=80&w=1195&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Himalayan Adventure – Manali",
    price: "₹19,999",
    duration: "6 Days / 5 Nights",
    image: "https://plus.unsplash.com/premium_photo-1661964400999-264ce5993f8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3xxxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const TravelPackages = () => {
  return (
    <div className="bg-[#f5f7fa] dark:bg-gray-900 transition-colors duration-300 py-10 px-5 font-['Segoe_UI',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-center text-[2.5rem] font-normal mb-10 text-[#333] dark:text-white transition-colors duration-300">
          Explore Our Travel Packages
        </h1>
        
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[30px]">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:-translate-y-[5px] transition-all duration-300 ease-out"
            >
              <img 
                src={pkg.image} 
                alt={pkg.title}
                className="w-full h-[200px] object-cover"
              />
              
              <div className="p-5">
                <h2 className="text-[1.25rem] font-normal mb-[10px] mt-0 text-[#222] dark:text-white transition-colors duration-300">
                  {pkg.title}
                </h2>
                
                <p className="text-[0.95rem] text-[#555] dark:text-gray-400 mb-[10px] transition-colors duration-300">
                  {pkg.duration}
                </p>
                
                <p className="text-[1.1rem] font-bold text-[#2c7be5] dark:text-pink-400 mb-[15px] transition-colors duration-300">
                  {pkg.price}
                </p>
                
                <button className="bg-[#2c7be5] dark:bg-pink-600 hover:bg-[#1a5fcc] dark:hover:bg-pink-700 text-white py-[10px] px-5 border-none rounded-lg text-[0.95rem] cursor-pointer transition-colors duration-300">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPackages;