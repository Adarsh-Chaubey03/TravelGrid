import React, { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';
import { Filter, SlidersHorizontal, MapPin, Star, Clock, Users, Package, Hotel, User } from 'lucide-react';
import FilterPanel from '../components/Search/FilterPanel';

const SearchResults = () => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    totalResults,
    filters,
    updateFilters,
    resetFilters,
    performSearch
  } = useSearch();

  const { isDarkMode } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Categorize results
  const categorizedResults = {
    all: searchResults,
    hotels: searchResults.filter(item => item.type === 'hotel'),
    packages: searchResults.filter(item => item.type === 'package'),
    guides: searchResults.filter(item => item.type === 'guide')
  };

  const tabs = [
    { key: 'all', label: 'All Results', count: categorizedResults.all.length },
    { key: 'hotels', label: 'Hotels', count: categorizedResults.hotels.length },
    { key: 'packages', label: 'Packages', count: categorizedResults.packages.length },
    { key: 'guides', label: 'Guides', count: categorizedResults.guides.length }
  ];

  useEffect(() => {
    // If there's no search query, redirect or show empty state
    if (!searchQuery && totalResults === 0) {
      // Could redirect to home or show landing page
    }
  }, [searchQuery, totalResults]);

  const ResultCard = ({ item }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'hotel': return <Hotel className="h-5 w-5" />;
        case 'package': return <Package className="h-5 w-5" />;
        case 'guide': return <User className="h-5 w-5" />;
        default: return <MapPin className="h-5 w-5" />;
      }
    };

    const getTypeColor = () => {
      switch (item.type) {
        case 'hotel': return 'text-blue-500';
        case 'package': return 'text-green-500';
        case 'guide': return 'text-purple-500';
        default: return 'text-gray-500';
      }
    };

    return (
      <div className={`rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
            }`}>
              <div className={getTypeColor()}>
                {getIcon()}
              </div>
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {item.location}
                </span>
              </div>
            </div>
          </div>

          {item.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {item.rating}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {item.expertise && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Expertise:
              </span>
              <span className={`text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {item.expertise}
              </span>
            </div>
          )}

          {item.category && (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                isDarkMode 
                  ? 'bg-slate-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {item.category}
              </span>
            </div>
          )}

          {item.price && (
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold text-pink-500`}>
                ₹{item.price.toLocaleString()}
              </span>
              <button className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-500 hover:to-pink-400 transition-all duration-200 transform hover:scale-105">
                {item.type === 'hotel' ? 'Book Now' : item.type === 'package' ? 'View Package' : 'Contact Guide'}
              </button>
            </div>
          )}

          {item.type === 'guide' && !item.price && (
            <button className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-500 hover:to-pink-400 transition-all duration-200">
              Contact Guide
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pt-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Search Results
          </h1>
          {searchQuery && (
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isSearching ? 'Searching...' : `${totalResults} results for "${searchQuery}"`}
            </p>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filter Panel */}
          <div className={`hidden lg:block w-80 ${showFilters ? 'block' : ''}`}>
            <FilterPanel />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
              </div>
            )}

            {/* Results */}
            {!isSearching && (
              <>
                {categorizedResults[activeTab].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categorizedResults[activeTab].map((item, index) => (
                      <ResultCard key={`${item.type}-${item.id}-${index}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className={`text-6xl mb-4 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      🔍
                    </div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      No results found
                    </h3>
                    <p className={`text-gray-500 mb-6`}>
                      {searchQuery 
                        ? `We couldn't find any ${activeTab === 'all' ? 'results' : activeTab} matching "${searchQuery}"`
                        : 'Try searching for hotels, packages, or destinations'
                      }
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={resetFilters}
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Clear Filters
                      </button>
                      <button
                        onClick={() => window.history.back()}
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
            <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-xl">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4">
                <FilterPanel />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
