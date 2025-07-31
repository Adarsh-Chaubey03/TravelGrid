import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const HeroSection = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All Categories");

  const handleSearch = () => {
    const isLoggedIn = false;

    if(!isLoggedIn){
      toast.error("Please sign in to search for destinations.");
      return;
    }
    onSearch({ location, category });
  };

  const categories = [
    "All Categories",
    "Restaurants",
    "Hotels",
    "Events",
    "Shopping",
    "Attractions",
    "Transportation"
  ];

  return (
    // removed margin-top to avoid unnecessary space
    <section className="relative w-screen min-h-[80vh] flex items-center justify-center overflow-hidden"> 
     <div
  className="absolute inset-0 bg-cover bg-center opacity-90 z-10"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1695045038427-3acc1c0df23c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fG5pZ2h0JTIwYmVhY2h8ZW58MHx8MHx8fDA%3D')",
      
  }}
></div>


      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-opacity-30 z-15 "/>
      
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          
         <div className="flex-1 text-center lg:text-left text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight font-[Playfair Display]">
              Explore&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 inline-block min-h-[1.5em]">
                <Typewriter
                  options={{
                    strings: ['Restaurants!', 'Events!', 'Shopping!', 'Hotels!', 'Your City!'],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 20,
                  }}
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 font-medium text-gray-100 max-w-2xl font-[Poppins] animate-fadeIn">
              Find great places to stay, eat, shop, or visit from local experts.
            </p>
         </div>


          {/* Right Side - Search Bar and Filters */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
              {/* Search Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: Borivali, Mumbai, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-102 cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Category Filters */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-3">Quick Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {["Restaurants", "Events", "Shopping"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setCategory(filter);
                        handleSearch();
                      }}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      {filter}
                    </button>
                  ))}
                  {/*added the Dynamic Clear button */}
                  {category=="All Categories"?null:<button className="px-3 py-2 inline-flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors duration-200" onClick={()=>{setCategory("All Categories")}}>Clear <X size={16} className="relative top-[1px]"/></button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
