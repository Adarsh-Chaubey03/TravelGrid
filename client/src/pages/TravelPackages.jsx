import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../data/PackageData";
import Navbar from "../components/Custom/Navbar";
import { Search, X, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Utility: parse price from string
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const digitsOnly = String(priceStr).replace(/[^\d]/g, "");
  return parseInt(digitsOnly, 10);
};

// Reusable rating stars
const RatingStars = ({ rating, isDarkMode }) => (
  <div className="flex items-center gap-1 mb-3" aria-label={`Rating: ${rating} out of 5`}>
    {[...Array(5)].map((_, idx) => (
      <svg
        key={idx}
        className={`w-4 h-4 ${
          idx < rating
            ? "text-yellow-400"
            : isDarkMode
            ? "text-gray-600"
            : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927a1 1 0 011.902 0l1.517 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.364 1.118l1.517 4.674c.3.921-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.517-4.674z" />
      </svg>
    ))}
  </div>
);

const TravelPackages = () => {
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("")

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Filtering logic memoized
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchContinent =
        selectedContinent === "All" || pkg.continent === selectedContinent;
      const matchCountry =
        selectedCountry === "All" || pkg.country === selectedCountry;
      const matchSeason =
        selectedSeason === "All" || pkg.season === selectedSeason;

      const match = pkg.duration?.match(/^(\d+)/);
      const days = match ? Number(match[1]) : 0;
      const matchDuration =
        selectedDuration === "All" ||
        (selectedDuration === "1-3" && days <= 3) ||
        (selectedDuration === "4-7" && days >= 4 && days <= 7) ||
        (selectedDuration === "8-14" && days >= 8 && days <= 14) ||
        (selectedDuration === "15+" && days > 14);

      const matchRating = (pkg.rating ?? 0) >= minRating;
      const matchPrice = parsePrice(pkg.price) <= maxPrice;

      let matchSearch = true;
      if (debounceSearch) {
        const lowerSearch = debounceSearch.toLowerCase();
        const searchFields = [
          pkg.title,
          pkg.country,
          pkg.continent,
          pkg.description,
          Array.isArray(pkg.highlights) ? pkg.highlights.join(" ") : undefined,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        matchSearch = searchFields.includes(lowerSearch);
      }

      return (
        matchContinent &&
        matchCountry &&
        matchSeason &&
        matchDuration &&
        matchRating &&
        matchPrice &&
        matchSearch
      );
    });
  }, [
    selectedContinent,
    selectedCountry,
    selectedSeason,
    selectedDuration,
    minRating,
    maxPrice,
    debounceSearch,
  ]);
  // debouncing logic
  useEffect(()=> {
    const delay = setTimeout(()=> {
      setDebounceSearch(searchTerm)
    },500);
    return () => clearTimeout(delay)   // cleanup
  },[searchTerm]);

  useEffect(() => {
  if (debounceSearch.trim() !== "") {
    console.log("With debounce", debounceSearch);   // checking it works or not
  }
}, [debounceSearch]);

  const handlePriceChange = (e) => {
    const val = e.target.value;
    if (val === "") setMaxPrice(Infinity);
    else setMaxPrice(Number(val));
  };

  const clearSearch = () => setSearchTerm("");

  const getUniqueOptions = (key) => {
    const values = packages.map((pkg) => {
      if (key === "duration") {
        const match = pkg.duration?.match(/^(\d+)/);
        return match ? Number(match[1]) : 0;
      }
      return pkg[key];
    });
    if (key === "duration") {
      const ranges = new Set();
      values.forEach((val) => {
        if (val <= 3) ranges.add("1-3");
        else if (val <= 7) ranges.add("4-7");
        else if (val <= 14) ranges.add("8-14");
        else ranges.add("15+");
      });
      return Array.from(ranges).sort();
    }
    return [...new Set(values)].filter(Boolean).sort();
  };

  const continentOptions = getUniqueOptions("continent");
  const countryOptions = getUniqueOptions("country");
  const seasonOptions = getUniqueOptions("season");
  const durationOptions = getUniqueOptions("duration");

  const resetAll = () => {
    setSearchTerm("");
    setMinRating(0);
    setMaxPrice(Infinity);
    setSelectedContinent("All");
    setSelectedCountry("All");
    setSelectedSeason("All");
    setSelectedDuration("All");
  };

  return (
    <div className="flex flex-col min-h-screen w-full mt-0 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      <main className="flex flex-col flex-1 w-full items-center pt-0">
        {/* HERO with background + integrated search */}
                 <section className="relative w-full min-h-[680px] md:min-h-[780px] flex items-center justify-center overflow-hidden -mt-20">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1631242431618-268c347fa851?auto=format&fit=crop&q=80"
            alt="Travel background"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay for contrast */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/60' : 'bg-gradient-to-br from-white/30 via-white/10 to-transparent'}`} />  
          {/* Content */}
          <div className="relative z-10 w-full px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Discover Our <span className="text-pink-500">Travel Packages</span>
              </h1>
              <p className={`${isDarkMode ? 'text-pink-100' : 'text-black'} text-base md:text-lg max-w-2xl mx-auto mb-8`}>
                Handpicked vacation deals crafted for unforgettable experiences.
              </p>

              {/* Search + CTA row */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-2xl relative">
                  <input
                    type="text"
                    aria-label="Search travel packages"
                    placeholder="Search destinations, packages, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full rounded-2xl px-5 py-4 pl-14 pr-12 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${
                      isDarkMode
                        ? 'bg-white/15 border border-white/20 text-white placeholder-white'
                        : 'bg-white/90 border border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                    <Search size={22} />
                  </div>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <X size={20} />
                    </button>
                  )}
                  {searchTerm && (
                    <div className={`${isDarkMode ? 'text-pink-200' : 'text-pink-600'} text-xs mt-2 text-left`}>
                      Searching for: <span className="font-semibold">{searchTerm}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate('/travel-plan-generator')}
                  className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-xl">🎯</span> Create Custom Travel Plan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <div
          className={`grid grid-cols-1 -mt-16 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 w-[92%] md:w-[85%] lg:w-[80%] mx-auto p-6 rounded-2xl shadow-xl backdrop-blur-md transition-colors duration-300 border text-gray-900 ${isDarkMode?"bg-white/10 border-white/20":"bg-white/60 border-white/10"}`}
        >
          {/* Selects */}
          {[
            {
              label: "Minimum Rating",
              value: minRating,
              onChange: (e) => setMinRating(Number(e.target.value)),
              options: [
                { value: 0, label: "All" },
                { value: 1, label: "1★ & Up" },
                { value: 2, label: "2★ & Up" },
                { value: 3, label: "3★ & Up" },
                { value: 4, label: "4★ & Up" },
                { value: 5, label: "5★ Only" },
              ],
            },
            {
              label: "Continent",
              value: selectedContinent,
              onChange: (e) => setSelectedContinent(e.target.value),
              options: ["All", ...continentOptions].map((c) => ({ value: c, label: c })),
            },
            {
              label: "Country",
              value: selectedCountry,
              onChange: (e) => setSelectedCountry(e.target.value),
              options: ["All", ...countryOptions].map((c) => ({ value: c, label: c })),
            },
            {
              label: "Season",
              value: selectedSeason,
              onChange: (e) => setSelectedSeason(e.target.value),
              options: ["All", ...seasonOptions].map((s) => ({ value: s, label: s })),
            },
            {
              label: "Duration",
              value: selectedDuration,
              onChange: (e) => setSelectedDuration(e.target.value),
              options: ["All", ...durationOptions].map((d) => ({
                value: d,
                label:
                  d === "1-3"
                    ? "1-3 Days"
                    : d === "4-7"
                    ? "4-7 Days"
                    : d === "8-14"
                    ? "8-14 Days"
                    : d === "15+"
                    ? "15+ Days"
                    : d,
              })),
            },
          ].map(({ label, value, onChange, options }, i) => (
            <div key={i} className="flex flex-col gap-1 relative">
              <label className="text-sm font-semibold text-gray-900">{label}</label>
              <select
                aria-label={label}
                value={value}
                onChange={onChange}
                className={`appearance-none rounded-lg px-3 py-2 text-sm border shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-transparent border-white/40 text-white placeholder-white`}
              >
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className={`absolute right-3 top-9 pointer-events-none ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}
              />
            </div>
          ))}

          {/* Max Price */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-900">Max Price (₹)</label>
            <input
              type="number"
              placeholder="No limit"
              onChange={handlePriceChange}
              min="0"
              aria-label="Max Price"
              className={`rounded-lg px-3 py-2 text-sm border shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition border-white/20 text-gray-900 placeholder:text-gray-400 ${isDarkMode?"bg-black/10":"bg-white/90"}`}
            />
          </div>
        </div>

        {/* Small reset row under filters */}
        <div className="w-[92%] md:w-[85%] lg:w-[80%] mx-auto mt-6 mb-8 flex justify-end relative z-10">
          <button
            type="button"
            onClick={resetAll}
            className={`text-sm underline underline-offset-4 ${
              isDarkMode ? "text-pink-300 hover:text-pink-200" : "text-pink-600 hover:text-pink-700"
            }`}
          >
            Reset all filters
          </button>
        </div>

        {/* PACKAGES */}
        <section className="max-w-7xl w-full px-4 pb-20 mt-20 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`group rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-2 ${
                  isDarkMode
                    ? "backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg hover:shadow-pink-200"
                    : "bg-white border border-gray-200 text-gray-900 hover:shadow-pink-400"
                }`}
                onClick={() => navigate(`/package/${pkg.id}`)}
              >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title || "Travel Package"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-1 leading-snug">
                    {pkg.title}
                  </h3>
                  <span className="text-sm mb-2 text-pink-500 font-medium">
                    {pkg.duration}
                  </span>

                  <RatingStars rating={pkg.rating} isDarkMode={isDarkMode} />

                  {/* Price */}
                  <p className="text-lg font-semibold mb-4 text-pink-600">
                    Rs. {pkg.price}
                  </p>

                  {/* Reviews */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-1 text-pink-600">Reviews</h4>
                    {pkg.reviews && pkg.reviews.length > 0 ? (
                      <ul
                        className={`space-y-1 text-sm max-h-20 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-400/50 ${
                          isDarkMode ? "text-pink-100" : "text-gray-700"
                        }`}
                      >
                        {pkg.reviews.slice(0, 1).map((review, idx) => (
                          <li key={idx} className="truncate">
                            <span className="text-pink-500 font-semibold">
                              {review.name}:
                            </span>{" "}
                            {review.comment}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-gray-500">No reviews yet.</p>
                    )}
                  </div>

                  {/* Button */}
                  <div className="mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/package/${pkg.id}`);
                      }}
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4 text-pink-500">😢</div>
              <h3 className="text-2xl font-bold mb-2 text-pink-600">No packages found</h3>
              <p className={`max-w-md mx-auto ${isDarkMode ? "text-pink-100" : "text-gray-600"}`}>
                {searchTerm
                  ? `No packages match your search for "${searchTerm}"`
                  : "No packages match the selected filters"}
              </p>
              <button
                onClick={resetAll}
                className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TravelPackages;
