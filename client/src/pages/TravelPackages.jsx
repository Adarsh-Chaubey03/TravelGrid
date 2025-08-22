import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../data/PackageData";
import Navbar from "../components/Custom/Navbar";
import { Search, X, ChevronDown, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const digitsOnly = String(priceStr).replace(/[^\d]/g, "");
  return parseInt(digitsOnly, 10);
};

const FilterDropdown = ({ title, options, selected, onSelect, isDarkMode, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const displayValue = useMemo(() => {
    if (selected === "All") return `All ${title}`;
    if (type === "duration") {
      const durationMap = {
        "1-3": "1-3 Days",
        "4-7": "4-7 Days",
        "8-14": "8-14 Days",
        "15+": "15+ Days",
      };
      return durationMap[selected] || selected;
    }
    if (type === "rating") {
      const ratingMap = {
        0: "All",
        1: "1 Star & Up",
        2: "2 Stars & Up",
        3: "3 Stars & Up",
        4: "4 Stars & Up",
        5: "5 Stars Only",
      };
      return ratingMap[selected] || selected;
    }
    return selected;
  }, [selected, title, type]);

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className={`w-full flex justify-between items-center rounded-lg px-4 py-3 text-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
          isDarkMode
            ? "bg-slate-800 text-pink-200 hover:bg-slate-700"
            : "bg-white text-gray-800 hover:bg-gray-200"
        }`}
      >
        <span>{displayValue}</span>
        <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className={`absolute z-10 w-full mt-2 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto ${
          isDarkMode ? "bg-slate-800 border border-pink-400/20" : "bg-white border border-gray-300"
        }`}>
          {type !== "rating" && (
            <button
              onClick={() => { onSelect("All"); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                selected === "All" ? (isDarkMode ? "bg-pink-700 text-white" : "bg-pink-200 text-pink-900") : (isDarkMode ? "hover:bg-pink-900 text-pink-200" : "hover:bg-gray-100 text-gray-800")
              }`}
            >
              All {title}
            </button>
          )}
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => { onSelect(option); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors duration-200 ${
                selected === option ? (isDarkMode ? "bg-pink-700 text-white" : "bg-pink-200 text-pink-900") : (isDarkMode ? "hover:bg-pink-900 text-pink-200" : "hover:bg-gray-100 text-gray-800")
              }`}
            >
              {type === "rating" ? `${option} Star${option > 1 ? 's' : ''} & Up` : option}
              {selected === option && <CheckCircle size={20} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TravelPackages = () => {
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const filteredPackages = useCallback(() => {
    return packages.filter((pkg) => {
      const matchContinent =
        selectedContinent === "All" || pkg.continent === selectedContinent;
      const matchCountry =
        selectedCountry === "All" || pkg.country === selectedCountry;
      const matchSeason =
        selectedSeason === "All" || pkg.season === selectedSeason;
      const match = pkg.duration.match(/^(\d+)/);
      const days = match ? Number(match[1]) : 0;
      const matchDuration =
        selectedDuration === "All" ||
        (selectedDuration === "1-3" && days <= 3) ||
        (selectedDuration === "4-7" && days >= 4 && days <= 7) ||
        (selectedDuration === "8-14" && days >= 8 && days <= 14) ||
        (selectedDuration === "15+" && days > 14);
      const matchRating = pkg.rating >= minRating;
      const matchPrice = parsePrice(pkg.price) <= maxPrice;
      let matchSearch = true;
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const searchFields = [
          pkg.title || '',
          pkg.country || '',
          pkg.continent || '',
          pkg.description || '',
          pkg.highlights ? pkg.highlights.join(' ') : ''
        ].join(' ').toLowerCase();
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
    searchTerm
  ]);

  const handlePriceChange = (e) => {
    const val = e.target.value;
    if (val === "") setMaxPrice(Infinity);
    else setMaxPrice(Number(val));
  };
  const clearSearch = () => setSearchTerm("");

  const getUniqueOptions = (key) => {
    const values = packages.map((pkg) => pkg[key]);
    return [...new Set(values)].sort();
  };

  const getDurationOptions = () => {
    const durations = packages.map(pkg => {
      const match = pkg.duration.match(/^(\d+)/);
      return match ? Number(match[1]) : 0;
    });
    const ranges = new Set();
    durations.forEach(val => {
      if (val <= 3) ranges.add("1-3");
      else if (val <= 7) ranges.add("4-7");
      else if (val <= 14) ranges.add("8-14");
      else ranges.add("15+");
    });
    return Array.from(ranges).sort((a, b) => parseInt(a) - parseInt(b));
  };

  const continentOptions = getUniqueOptions("continent");
  const countryOptions = getUniqueOptions("country");
  const seasonOptions = getUniqueOptions("season");
  const durationOptions = getDurationOptions();
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div
      className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 to-purple-950 text-white"
          : "bg-gradient-to-br from-rose-300 via-blue-200 to-gray-300 text-gray-900"
      }`}
    >
      <Navbar />
      <main className="flex flex-col flex-1 w-full items-center pt-24">
        <section className="w-full py-24 text-center px-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${
            isDarkMode ? 'text-pink-300' : 'text-travel-text'
          }`}>
            Discover Our <span className={isDarkMode ? "text-pink-400" : "text-pink-500"}>Travel Packages</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-6 ${
            isDarkMode ? "text-pink-200" : "text-pink-700"
          }`}>
            Handpicked vacation deals crafted for unforgettable experiences.
          </p>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate('/travel-plan-generator')}
              className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center shadow-md"
            >
              <span className="mr-2">🎯</span>
              Create Custom Travel Plan
            </button>
          </div>
          <div className="max-w-3xl mx-auto mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations, packages, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl px-5 py-4 pl-14 pr-12 text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                  isDarkMode
                    ? "bg-slate-800 text-white placeholder-slate-400"
                    : "bg-white text-gray-900 placeholder-gray-500"
                }`}
              />
              <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-pink-300" : "text-gray-500"
              }`}>
                <Search size={24} />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isDarkMode
                      ? "text-pink-300 hover:text-white"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  <X size={24} />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className={`mt-2 text-sm ${isDarkMode ? "text-pink-300" : "text-pink-600"}`}>
                Searching for: <span className="font-semibold">{searchTerm}</span>
              </div>
            )}
          </div>
          {/* Filter dropdowns */}
          <div
 className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full p-6 rounded-3xl shadow-lg mt-4 z-50 transition-colors duration-500 items-end relative ${
    isDarkMode
      ? "bg-slate-900/50 backdrop-blur-md border border-pink-400/20"
      : "bg-white/80 backdrop-blur-sm border border-pink-300"
  }`}
>
  <FilterDropdown
    title="Rating"
    options={ratingOptions}
    selected={minRating}
    onSelect={setMinRating}
    isDarkMode={isDarkMode}
    type="rating"
  />
  <FilterDropdown
    title="Continent"
    options={continentOptions}
    selected={selectedContinent}
    onSelect={setSelectedContinent}
    isDarkMode={isDarkMode}
  />
  <FilterDropdown
    title="Country"
    options={countryOptions}
    selected={selectedCountry}
    onSelect={setSelectedCountry}
    isDarkMode={isDarkMode}
  />
  <FilterDropdown
    title="Season"
    options={seasonOptions}
    selected={selectedSeason}
    onSelect={setSelectedSeason}
    isDarkMode={isDarkMode}
  />
  <FilterDropdown
    title="Duration"
    options={durationOptions}
    selected={selectedDuration}
    onSelect={setSelectedDuration}
    isDarkMode={isDarkMode}
    type="duration"
  />
  <div className="flex flex-col gap-1 text-left">
    <label htmlFor="maxPrice" className={`text-md font-semibold ${isDarkMode ? "text-pink-300" : "text-pink-700"}`}>
      Max Price (₹):
    </label>
    <input
      type="number"
      id="maxPrice"
      placeholder="No limit"
      onChange={handlePriceChange}
      min="0"
      className={`w-full rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors ${
        isDarkMode
          ? "bg-slate-800 text-white placeholder-slate-400"
          : "bg-white text-gray-900 placeholder-gray-500"
      }`}
    />
  </div>
</div>
        </section>
        {/* Filtered Packages */}
        <section className="max-w-7xl w-full px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {filteredPackages().length > 0 ? (
            filteredPackages().map((pkg) => (
              <div
                key={pkg.id}
                className={`group backdrop-blur-sm border border-pink-400/20 rounded-3xl shadow-xl cursor-pointer flex flex-col transition-all duration-500 ${
                  isDarkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-white/80 hover:bg-gray-100/80"
                } hover:scale-[1.02]`}
                onClick={() => navigate(`/package/${pkg.id}`)}
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  className="w-full h-56 object-cover rounded-t-3xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className={`text-2xl font-semibold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {pkg.title}
                  </h3>
                  <span className={isDarkMode ? "text-pink-300" : "text-gray-600"}>{pkg.duration}</span>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, idx) => (
                      <svg
                        key={idx}
                        className={`w-5 h-5 transition-colors duration-300 ${
                          idx < pkg.rating
                            ? "text-yellow-400"
                            : isDarkMode
                              ? "text-gray-600"
                              : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927a1 1 0 011.902 0l1.517 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.364 1.118l1.517 4.674c.3.921-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.517-4.674z" />
                      </svg>
                    ))}
                  </div>
                  <p className={isDarkMode ? "text-pink-200" : "text-black-800"}>{pkg.price} ₹</p>
                  <div className="mb-4">
                    <h4 className={`text-lg font-bold mb-2 ${
                      isDarkMode ? "text-pink-400" : "text-pink-700"
                    }`}>
                      Reviews
                    </h4>
                    {pkg.reviews && pkg.reviews.length > 0 ? (
                      <ul className={`space-y-1 text-sm max-h-28 overflow-y-auto pr-2 ${
                        isDarkMode ? "text-pink-100" : "text-gray-900"
                      }`}>
                        {pkg.reviews.slice(0, 1).map((review, idx) => (
                          <li key={idx}>
                            <span className={isDarkMode ? "text-pink-300" : "text-pink-600"} style={{ fontWeight: "bold" }}>
                              {review.name}:
                            </span>{" "}
                            {review.comment}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-xs italic ${
                        isDarkMode ? "text-pink-300" : "text-pink-800"
                      }`}>
                        No reviews yet.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-4 mt-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/package/${pkg.id}`); }}
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 cursor-pointer transform hover:scale-105"
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
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-pink-300" : "text-pink-800"
              }`}>No packages found</h3>
              <p className={`max-w-md mx-auto ${
                isDarkMode ? "text-pink-200" : "text-pink-700"
              }`}>
                {searchTerm
                  ? `No packages match your search for "${searchTerm}"`
                  : "No packages match the selected filters"}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setMinRating(0);
                  setMaxPrice(Infinity);
                  setSelectedContinent("All");
                  setSelectedCountry("All");
                  setSelectedSeason("All");
                  setSelectedDuration("All");
                }}
                className="mt-6 bg-pink-800 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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