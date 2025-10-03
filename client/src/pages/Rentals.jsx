import React, { useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Custom/Navbar";

const demoInventory = [
  // Bikes
  { id: "b1", type: "Bike", title: "City Bike 250cc", price: 1200, city: "Mumbai", image: "https://th.bing.com/th/id/R.75e28403bbf65f7c23c138b1624fff53?rik=fHpcAZnfs9W5Rg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-dL31KssJy9M%2fUu0L9YrrASI%2fAAAAAAAAAQY%2forJuzwjCcB0%2fs1600%2flatest-heavy-beautiful-bike-hd-wallpaper.jpg&ehk=hC8K%2btk6D8pFfdRvJlN0%2fDJuwET6%2fml4RbKXx4YsmF8%3d&risl=&pid=ImgRaw&r=0" },
  { id: "b2", type: "Bike", title: "Scooter 125cc", price: 800, city: "Pune", image: "https://th.bing.com/th/id/R.498696cef0387857444bb9740f5c46fb?rik=DX2GBAcExPXtpQ&riu=http%3a%2f%2f2.bp.blogspot.com%2f-ccqyXftoVkE%2fUyF0jtlEzmI%2fAAAAAAAAZvU%2fYeJFyPez278%2fs1600%2fBikes%2bWallpapers%2b(22).jpg&ehk=Jt07aUCnIacirwAFX11NYBzLXa38%2feJd7osSkHmLoZc%3d&risl=&pid=ImgRaw&r=0" },
  { id: "b3", type: "Bike", title: "Adventure 390cc", price: 1800, city: "Jaipur", image: "https://4.bp.blogspot.com/-qDD7AiIUUg0/ULD5tyYL2qI/AAAAAAAAK4Y/PcW9UMi29CI/s1600/bikes+wallpapers+(4).jpg" },
  // Cars
  { id: "c1", type: "Car", title: "Hatchback Compact", price: 2600, city: "Delhi", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1400&auto=format&fit=crop" },
  { id: "c2", type: "Car", title: "SUV Premium", price: 5200, city: "Bengaluru", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop" },
  { id: "c3", type: "Car", title: "Sedan Comfort", price: 3400, city: "Goa", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1400&auto=format&fit=crop" },
];

const Rentals = () => {
  const { isDarkMode } = useTheme();
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

            {/* Quick search */}
            <div className="w-full max-w-2xl mx-auto relative">
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Search model, type, or city..."
                className={`w-full rounded-2xl px-5 py-4 pl-12 pr-12 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-white/10 border border-white/20 text-white placeholder-white' : 'bg-white/90 border border-gray-200 text-gray-900 placeholder-gray-600'}`}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className={`w-[92%] md:w-[85%] lg:w-[80%] mx-auto -mt-6 md:-mt-8 mb-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 p-4 rounded-2xl backdrop-blur-xl border ${isDarkMode ? 'bg-white/10 border-white/30 text-white' : 'bg-white/80 border-gray-200 text-gray-900 shadow-xl'}`}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Location</label>
          <div className="relative">
            <MapPin size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`} />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by city" className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-transparent border border-white/40 text-white placeholder-white' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'}`} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">City</label>
          <select value={city} onChange={(e)=>setCity(e.target.value)} className={`rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-transparent border border-white/40 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Type</label>
          <select value={type} onChange={(e)=>setType(e.target.value)} className={`rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-transparent border border-white/40 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}>
            {['All','Bike','Car'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Sort by price</label>
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className={`rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-transparent border border-white/40 text-white' : 'bg-white border border-gray-300 text-gray-900'}`}>
            <option value="relevance">Relevance</option>
            <option value="lh">Low to High</option>
            <option value="hl">High to Low</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Min Price (₹)</label>
          <input value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} type="number" min="0" className={`rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-transparent border border-white/40 text-white placeholder-white' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'}`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Max Price (₹)</label>
          <input value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} type="number" min="0" className={`rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDarkMode ? 'bg-transparent border border-white/40 text-white placeholder-white' : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'}`} />
        </div>
      </div>

      {/* Listings */}
      <section className="max-w-7xl w-full px-4 pb-20 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto justify-items-center">
        {filtered.map(item => (
          <div key={item.id} className={`${isDarkMode ? 'backdrop-blur-xl bg-white/10 border border-white/20 text-white' : 'bg-white border border-gray-200 text-gray-900'} rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col w-full`}> 
            <div className="relative h-48 w-full overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-3 left-3 text-xs font-semibold bg-pink-600 text-white px-2 py-1 rounded-full">{item.type}</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm opacity-80 mb-3">
                <MapPin size={16} /> {item.city}
              </div>
              <div className="text-pink-500 font-extrabold text-lg mb-4">₹ {item.price}/day</div>
              <button className="mt-auto bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-300">Book Now</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center opacity-80">
            <SlidersHorizontal className="mx-auto mb-2" />
            No rentals match your filters.
          </div>
        )}
      </section>
    </div>
  );
};

export default Rentals;


