import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Custom/Navbar";

const demoInventory = [
  // Bikes
  { id: "b1", type: "Bike", title: "City Bike 250cc", price: 1200, city: "Mumbai", available: true, image: "https://th.bing.com/th/id/R.75e28403bbf65f7c23c138b1624fff53?rik=fHpcAZnfs9W5Rg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-dL31KssJy9M%2fUu0L9YrrASI%2fAAAAAAAAAQY%2forJuzwjCcB0%2fs1600%2flatest-heavy-beautiful-bike-hd-wallpaper.jpg&ehk=hC8K%2btk6D8pFfdRvJlN0%2fDJuwET6%2fml4RbKXx4YsmF8%3d&risl=&pid=ImgRaw&r=0" },
  { id: "b2", type: "Bike", title: "Scooter 125cc", price: 800, city: "Pune", available: false, image: "https://th.bing.com/th/id/R.498696cef0387857444bb9740f5c46fb?rik=DX2GBAcExPXtpQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-ccqyXftoVkE%2fUyF0jtlEzmI%2fAAAAAAAAZvU%2fYeJFyPez278%2fs1600%2fBikes%2bWallpapers%2b(22).jpg&ehk=Jt07aUCnIacirwAFX11NYBzLXa38%2feJd7osSkHmLoZc%3d&risl=&pid=ImgRaw&r=0" },
  { id: "b3", type: "Bike", title: "Adventure 390cc", price: 1800, city: "Jaipur", available: true, image: "https://4.bp.blogspot.com/-qDD7AiIUUg0/ULD5tyYL2qI/AAAAAAAAK4Y/PcW9UMi29CI/s1600/bikes+wallpapers+(4).jpg" },
  // Cars
  { id: "c1", type: "Car", title: "Hatchback Compact", price: 2600, city: "Delhi", available: true, image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1400&auto=format&fit=crop" },
  { id: "c2", type: "Car", title: "SUV Premium", price: 5200, city: "Bengaluru", available: false, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop" },
  { id: "c3", type: "Car", title: "Sedan Comfort", price: 3400, city: "Goa", available: true, image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1400&auto=format&fit=crop" },
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
    if (sort === "lh") items.sort((a,b)=>a.price-b.price);
    if (sort === "hl") items.sort((a,b)=>b.price-a.price);
    return items;
  }, [q, city, sort, minPrice, maxPrice, type]);

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gradient-to-br from-black to-pink-900 text-white' : 'bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-gray-900'}`}>
      <Navbar />

      {/* Hero */}
      <section className="relative w-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden pt-10 md:pt-16">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop"
          alt="Rentals background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-black/35'} backdrop-blur-[2px]`} />

        <div className="relative z-10 w-full px-4">
          <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3">
  <span className="text-gray-300 darkt:text-white">Rent Bikes & </span>
  <span className="text-pink-600">Cars</span>
</h1>


            <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-pink-100' : 'text-white'} mb-6`}>Explore freely with flexible rentals that match your itinerary.</p>

            {/* Enhanced Glassmorphism Search Bar */}
            <div className="w-full max-w-2xl mx-auto relative group">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-500 ${isDarkMode ? 'opacity-30' : 'opacity-20'}`}></div>
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Search model, type, or city..."
                className={`relative w-full rounded-2xl px-6 py-5 pl-14 pr-6 text-base md:text-lg focus:outline-none transition-all duration-300 backdrop-blur-xl border shadow-2xl group-hover:shadow-pink-500/25 group-hover:scale-[1.02] ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/15 focus:border-pink-400/50 focus:ring-4 focus:ring-pink-500/20' 
                    : 'bg-white/80 border-white/30 text-gray-900 placeholder-gray-600 focus:bg-white/90 focus:border-pink-400/50 focus:ring-4 focus:ring-pink-500/20'
                }`}
              />
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover:scale-110 ${
                isDarkMode ? 'text-white/80 group-hover:text-pink-400' : 'text-gray-600 group-hover:text-pink-500'
              }`} size={22} />
              <div className={`absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                q ? 'bg-green-400 shadow-green-400/50 shadow-lg' : 'bg-gray-400'
              }`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Glassmorphism Filter Bar */}
      <div className={`w-[92%] md:w-[85%] lg:w-[80%] mx-auto -mt-6 md:-mt-8 mb-10 relative group`}>
        {/* Background glow effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-2xl group-hover:blur-3xl transition-all duration-700 ${isDarkMode ? 'opacity-40' : 'opacity-30'}`}></div>
        
        {/* Main filter container */}
        <div className={`relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-6 p-6 rounded-2xl backdrop-blur-2xl border shadow-2xl group-hover:shadow-pink-500/20 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/10 border-white/20 text-white group-hover:bg-white/15 group-hover:border-pink-400/30' 
            : 'bg-white/80 border-white/30 text-gray-900 shadow-xl group-hover:bg-white/90 group-hover:border-pink-400/30'
        }`}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-pink-400/90">Location</label>
          <div className="relative group/input">
            <MapPin size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-white/70 group-hover/input:text-pink-400' : 'text-gray-500 group-hover/input:text-pink-500'}`} />
            <input 
              value={q} 
              onChange={(e)=>setQ(e.target.value)} 
              placeholder="Search by city" 
              className={`w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/input:shadow-pink-500/20 group-hover/input:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-white/5 border-white/30 text-white placeholder-white/60 focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30' 
                  : 'bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
              }`} 
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-pink-400/90">City</label>
          <div className="relative group/select">
            <select 
              value={city} 
              onChange={(e)=>setCity(e.target.value)} 
              className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/select:shadow-pink-500/20 group-hover/select:scale-[1.02] ${
                isDarkMode 
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
              onChange={(e)=>setType(e.target.value)} 
              className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/select:shadow-pink-500/20 group-hover/select:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-white/5 border-white/30 text-white focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30' 
                  : 'bg-white/60 border-white/40 text-gray-900 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
              }`}
            >
              {['All','Bike','Car'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-pink-400/90">Sort by price</label>
          <div className="relative group/select">
            <select 
              value={sort} 
              onChange={(e)=>setSort(e.target.value)} 
              className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/select:shadow-pink-500/20 group-hover/select:scale-[1.02] ${
                isDarkMode 
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
              onChange={(e)=>setMinPrice(e.target.value)} 
              type="number" 
              min="0" 
              placeholder="0"
              className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/input:shadow-pink-500/20 group-hover/input:scale-[1.02] ${
                isDarkMode 
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
              onChange={(e)=>setMaxPrice(e.target.value)} 
              type="number" 
              min="0" 
              placeholder="∞"
              className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 backdrop-blur-sm border shadow-lg group-hover/input:shadow-pink-500/20 group-hover/input:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-white/5 border-white/30 text-white placeholder-white/60 focus:bg-white/10 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30' 
                  : 'bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:bg-white/80 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/30'
              }`} 
            />
          </div>
        </div>
        </div>
      </div>

      {/* Listings */}
      <section className="max-w-7xl w-full px-4 pb-20 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto justify-items-center">
        {filtered.map(item => (
          <div key={item.id} className={`group relative backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col w-full rounded-2xl overflow-hidden ${
            isDarkMode 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-pink-400/30 hover:shadow-pink-500/20' 
              : 'bg-white/80 border-white/30 text-gray-900 hover:bg-white/90 hover:border-pink-400/30 hover:shadow-pink-500/20'
          }`}> 
            <div className="relative h-48 w-full overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-3 left-3 text-xs font-semibold backdrop-blur-sm bg-pink-600/90 text-white px-3 py-1.5 rounded-full border border-pink-500/30 shadow-lg">{item.type}</span>
              {/* Enhanced Availability tag */}
              <span className={`absolute top-3 right-3 text-[11px] md:text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm shadow-lg transition-all duration-300 ${
                item.available
                  ? 'bg-green-600/90 text-white border-green-500/50 group-hover:bg-green-500/90'
                  : 'bg-gray-400/90 text-white border-gray-400/50 group-hover:bg-gray-300/90'
              }`}>
                {item.available ? 'Available' : 'Not available'}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm opacity-80 mb-3">
                <MapPin size={16} /> {item.city}
              </div>
              <div className="text-pink-500 font-extrabold text-lg mb-4">₹ {item.price}/day</div>
              <button
                onClick={() => {
                  const parsedCc = /([0-9]{2,4})cc/i.exec(item.title || "");
                  const bikePayload = {
                    id: item.id,
                    modelName: item.title,
                    engineSize: parsedCc ? `${parsedCc[1]} cc` : undefined,
                    city: item.city,
                    dailyRentalCost: item.price,
                    images: [item.image],
                    specs: { fuelType: "Petrol" },
                    guidelines: { minAge: 18, requiredDocs: ["Driving License", "Government ID"], helmetIncluded: true },
                    usability: { recommendedRideType: item.type === "Bike" ? "City" : "City" }
                  };
                  navigate(`/rentals/bike/${item.id}`, { state: { bike: bikePayload } });
                }}
                className={`mt-auto py-3 px-6 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl hover:scale-105 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-pink-600/90 to-purple-600/90 border-pink-500/30 text-white hover:from-pink-500/90 hover:to-purple-500/90 hover:border-pink-400/50 hover:shadow-pink-500/25'
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-500/30 text-white hover:from-pink-500 hover:to-purple-500 hover:border-pink-400/50 hover:shadow-pink-500/25'
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={`col-span-full text-center p-8 rounded-2xl backdrop-blur-xl border shadow-xl ${
            isDarkMode 
              ? 'bg-white/10 border-white/20 text-white/80' 
              : 'bg-white/80 border-white/30 text-gray-700'
          }`}>
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


