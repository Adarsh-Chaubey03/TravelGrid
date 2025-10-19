import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Bike,
  CarFront,
  IndianRupee,
} from "lucide-react";
import Navbar from "../components/Custom/Navbar";

const demoInventory = [
  { id: "b1", type: "Bike", title: "City Bike 250cc", price: 1200, city: "Mumbai", available: true, image: "https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg" },
  { id: "b2", type: "Bike", title: "Scooter 125cc", price: 800, city: "Pune", available: false, image: "https://images.pexels.com/photos/30600051/pexels-photo-30600051.jpeg" },
  { id: "b3", type: "Bike", title: "Adventure 390cc", price: 1800, city: "Jaipur", available: true, image: "https://images.pexels.com/photos/12173987/pexels-photo-12173987.jpeg" },
  { id: "c1", type: "Car", title: "Hatchback Compact", price: 2600, city: "Delhi", available: true, image: "https://images.unsplash.com/photo-1692619930073-c11f9ece2ba5?auto=format&fit=crop&q=60&w=600" },
  { id: "c2", type: "Car", title: "SUV Premium", price: 5200, city: "Bengaluru", available: false, image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&q=80&w=1632" },
  { id: "c3", type: "Car", title: "Sedan Comfort", price: 3400, city: "Goa", available: true, image: "https://images.unsplash.com/photo-1593142871910-2a967580ecdc?auto=format&fit=crop&q=60&w=600" },
];

const Rentals = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("All");

  const cities = useMemo(() => ["All", ...Array.from(new Set(demoInventory.map(i => i.city)))], []);

  const filtered = useMemo(() => {
    let items = demoInventory.filter(item => {
      const matchesCity = city === "All" || item.city === city;
      const matchesType = type === "All" || item.type === type;
      const matchesQ = q.trim() === "" || `${item.title} ${item.city} ${item.type}`.toLowerCase().includes(q.toLowerCase());
      const matchesMin = minPrice === "" || item.price >= Number(minPrice);
      const matchesMax = maxPrice === "" || item.price <= Number(maxPrice);
      return matchesCity && matchesType && matchesQ && matchesMin && matchesMax;
    });
    if (sort === "lh") items.sort((a, b) => a.price - b.price);
    if (sort === "hl") items.sort((a, b) => b.price - a.price);
    return items;
  }, [q, city, sort, minPrice, maxPrice, type]);

  return (
    <div className={`min-h-screen w-full transition-all duration-700 ${isDarkMode
      ? 'bg-gradient-to-br from-black to-pink-900 text-white'
      : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300'
      }`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[460px] md:min-h-[560px] flex items-center justify-center overflow-hidden pt-10 md:pt-16">
        <img
          src="https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&q=80&w=1170"
          alt="Rentals"
          className="absolute inset-0 w-full h-full object-cover scale-105 transform transition-transform duration-[4000ms] hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-b from-black/70 via-black/60 to-transparent" : "bg-gradient-to-b from-black/40 via-black/30 to-transparent"}`} />
        <div className="relative z-10 w-full px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-700 drop-shadow-[0_4px_12px_rgba(236,72,153,0.5)]">
              Rent{" "}
            </span>
            Bikes & Cars
          </h1>
          <p className={`max-w-2xl mx-auto ${isDarkMode ? "text-pink-100/90" : "text-white"} mb-8 text-lg`}>
            Drive your journey — anywhere, anytime. Flexible rentals at your fingertips.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-700" />
            <div className={`relative flex items-center w-full rounded-2xl px-6 py-5 text-base md:text-lg backdrop-blur-xl border shadow-lg transition-all duration-300 ${isDarkMode
              ? "bg-white/10 border-white/20 text-white placeholder-white/70 focus-within:border-pink-400/50"
              : "bg-white/80 border-white/40 text-gray-900 placeholder-gray-600 focus-within:border-pink-400/50"
              }`}>
              <Search className="mr-3 text-pink-400" size={22} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search model, type, or city..."
                className="flex-1 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      {/* Enhanced Glassmorphism Filter Bar */}
      <div className={`w-[92%] md:w-[85%] lg:w-[80%] mx-auto -mt-6 md:-mt-8 mb-10 relative group`}>
        {/* Background glow effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-2xl group-hover:blur-3xl transition-all duration-700 ${isDarkMode ? 'opacity-40' : 'opacity-30'}`}></div>

        {/* Main filter container */}
        <div className={`relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 p-6 rounded-2xl backdrop-blur-2xl border shadow-2xl group-hover:shadow-pink-500/20 transition-all duration-500 ${isDarkMode
          ? 'bg-white/10 border-white/20 text-white group-hover:bg-white/15 group-hover:border-pink-400/30'
          : 'bg-white/80 border-white/30 text-gray-900 shadow-xl group-hover:bg-white/90 group-hover:border-pink-400/30'
          }`}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-pink-400/90">City</label>
            <div className="relative group/select">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/select:shadow-pink-500/20 group-hover/select:scale-[1.02] ${isDarkMode
                  ? 'bg-white/5 border-white/30 text-white focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white/60 border-white/40 text-gray-900 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  }`}
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-pink-400/90">Type</label>
            <div className="relative group/select">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/select:shadow-pink-500/20 group-hover/select:scale-[1.02] ${isDarkMode
                  ? 'bg-white/5 border-white/30 text-white focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white/60 border-white/40 text-gray-900 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  }`}
              >
                {['All', 'Bike', 'Car'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-pink-400/90">Sort by price</label>
            <div className="relative group/select">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/select:shadow-pink-500/20 group-hover/select:scale-[1.02] ${isDarkMode
                  ? 'bg-white/5 border-white/30 text-white focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white/60 border-white/40 text-gray-900 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  }`}
              >
                <option value="relevance">Relevance</option>
                <option value="lh">Low to High</option>
                <option value="hl">High to Low</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-pink-400/90">Min Price (₹)</label>
            <div className="relative group/input">
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="0"
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/input:shadow-pink-500/20 group-hover/input:scale-[1.02] ${isDarkMode
                  ? 'bg-white/5 border-white/30 text-white placeholder-white/60 focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  }`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-pink-400/90">Max Price (₹)</label>
            <div className="relative group/input">
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                min="0"
                placeholder="∞"
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/input:shadow-pink-500/20 group-hover/input:scale-[1.02] ${isDarkMode
                  ? 'bg-white/5 border-white/30 text-white placeholder-white/60 focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
                  }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <section className="max-w-7xl w-full px-4 pb-20 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`group relative flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl border shadow-lg hover:shadow-pink-500/40 hover:-translate-y-2 transition-all duration-500 ${isDarkMode
              ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 border-white/20 text-white"
              : "bg-white/90 border-gray-200 text-gray-900"
              }`}
          >
            {/* Image */}
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-xs font-semibold bg-pink-600/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md flex items-center gap-1">
                  {item.type === "Bike" ? <Bike size={12} /> : <CarFront size={12} />} {item.type}
                </span>
              </div>

              <span
                className={`absolute top-3 right-3 text-[0.7rem] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-500 ${item.available
                  ? "bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 text-white border border-emerald-300/40 animate-pulse"
                  : "bg-gradient-to-r from-gray-500 to-gray-700 text-white border border-gray-500/50 opacity-80"
                  }`}
              >
                {item.available ? "Available" : "Not Available"}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-pink-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-sm opacity-80 mb-3">
                <MapPin size={16} /> {item.city}
              </div>
              <div className="text-pink-500 font-extrabold text-xl mb-5 tracking-wide">
                ₹ {item.price} <span className="text-sm font-normal opacity-70">/day</span>
              </div>

              <button
                onClick={() => navigate(`/rentals/${item.type.toLowerCase()}/${item.id}`, { state: { item } })}
                className={`mt-auto py-3 px-6 rounded-xl font-semibold transition-all duration-500 shadow-md hover:shadow-lg hover:scale-105 ${isDarkMode
                  ? "bg-gradient-to-r from-pink-600/90 to-purple-600/90 text-white hover:from-pink-500 hover:to-purple-500"
                  : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500"
                  }`}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            className={`col-span-full text-center p-10 rounded-2xl backdrop-blur-xl border shadow-xl ${isDarkMode
              ? "bg-white/10 border-white/20 text-white/80"
              : "bg-white/80 border-white/30 text-gray-700"
              }`}
          >
            <SlidersHorizontal className="mx-auto mb-4 text-pink-400" size={48} />
            <p className="text-lg font-medium mb-2">No rentals match your filters</p>
            <p className="text-sm opacity-70">Try adjusting your search criteria</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Rentals;