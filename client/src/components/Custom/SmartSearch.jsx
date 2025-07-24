import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock, Plane, Train, Bus, X } from 'lucide-react';

const SmartSearch = ({ onSearch, placeholder = "Search destinations..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef();
  const suggestionsRef = useRef();

  // Mock data for destinations and suggestions
  const destinations = [
    { name: 'Paris, France', type: 'city', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Tokyo, Japan', type: 'city', icon: <MapPin className="w-4 h-4" /> },
    { name: 'New York, USA', type: 'city', icon: <MapPin className="w-4 h-4" /> },
    { name: 'London, UK', type: 'city', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Sydney, Australia', type: 'city', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Dubai, UAE', type: 'city', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Flight to Rome', type: 'flight', icon: <Plane className="w-4 h-4" /> },
    { name: 'Train to Amsterdam', type: 'train', icon: <Train className="w-4 h-4" /> },
    { name: 'Bus to Barcelona', type: 'bus', icon: <Bus className="w-4 h-4" /> },
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    saveRecentSearch(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const searchItem = { name: query, type: 'search', icon: <Search className="w-4 h-4" /> };
      saveRecentSearch(searchItem);
      if (onSearch) {
        onSearch(searchItem);
      }
      setShowSuggestions(false);
    }
  };

  const saveRecentSearch = (search) => {
    const updated = [search, ...recentSearches.filter(item => item.name !== search.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white shadow-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slideInDown"
        >
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors flex items-center space-x-3 cursor-pointer ${
                    selectedIndex === index ? 'bg-pink-50' : ''
                  }`}
                >
                  <span className="text-pink-500">{suggestion.icon}</span>
                  <span className="text-gray-800">{suggestion.name}</span>
                  <span className="text-xs text-gray-500 ml-auto capitalize">{suggestion.type}</span>
                </button>
              ))}
            </div>
          ) : query.length > 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No destinations found</p>
              <p className="text-xs mt-1">Try searching for a different location</p>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="border-t border-gray-100 py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-pink-500 hover:text-pink-600 cursor-pointer"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">{search.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
