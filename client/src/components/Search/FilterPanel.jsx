import React, { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import { X, Star, MapPin, Calendar, Filter, RotateCcw } from 'lucide-react';

const FilterPanel = () => {
  const { filters, updateFilters, resetFilters } = useSearch();
  const { isDarkMode } = useTheme();

  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    updateFilters({ [key]: value });
  };

  const handlePriceRangeChange = (type, value) => {
    const newPriceRange = { ...localFilters.priceRange, [type]: parseInt(value) || 0 };
    setLocalFilters({ ...localFilters, priceRange: newPriceRange });
    updateFilters({ priceRange: newPriceRange });
  };

  const handleDateChange = (type, value) => {
    const newDateRange = { ...localFilters.dateRange, [type]: value };
    setLocalFilters({ ...localFilters, dateRange: newDateRange });
    updateFilters({ dateRange: newDateRange });
  };

  const handleReset = () => {
    resetFilters();
    setLocalFilters({
      priceRange: { min: 0, max: 100000 },
      rating: 0,
      location: '',
      category: '',
      dateRange: { start: '', end: '' },
      amenities: []
    });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'beach', label: 'Beach' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'city', label: 'City' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'budget', label: 'Budget' }
  ];

  const amenities = [
    'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 
    'Pet Friendly', 'Airport Shuttle', 'Room Service', 'Parking'
  ];

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'goa', label: 'Goa' },
    { value: 'manali', label: 'Manali' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'rajasthan', label: 'Rajasthan' }
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4.5, label: '4.5+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 3.5, label: '3.5+ Stars' },
    { value: 3, label: '3+ Stars' }
  ];

  return (
    <div className={`rounded-xl border p-6 space-y-6 ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        <button
          onClick={handleReset}
          className={`flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 transition-colors ${
            isDarkMode ? 'text-pink-400 hover:text-pink-300' : ''
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Min"
              value={localFilters.priceRange.min || ''}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.priceRange.max === 100000 ? '' : localFilters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value || 100000)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹{localFilters.priceRange.min.toLocaleString()}</span>
          <span>₹{localFilters.priceRange.max === 100000 ? '1,00,000+' : localFilters.priceRange.max.toLocaleString()}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Minimum Rating
        </label>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={localFilters.rating === option.value}
                onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                localFilters.rating === option.value
                  ? 'border-pink-500 bg-pink-500'
                  : isDarkMode 
                    ? 'border-gray-500' 
                    : 'border-gray-300'
              }`}>
                {localFilters.rating === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-sm flex items-center gap-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {option.value > 0 && (
                  <>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    {option.value}+
                  </>
                )}
                {option.value === 0 && 'All Ratings'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <MapPin className="h-4 w-4 inline mr-1" />
          Location
        </label>
        <select
          value={localFilters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
            isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {locations.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Category
        </label>
        <select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
            isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <Calendar className="h-4 w-4 inline mr-1" />
          Travel Dates
        </label>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={`block text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Check-in
            </label>
            <input
              type="date"
              value={localFilters.dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Check-out
            </label>
            <input
              type="date"
              value={localFilters.dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.amenities.includes(amenity)}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...localFilters.amenities, amenity]
                    : localFilters.amenities.filter(a => a !== amenity);
                  handleFilterChange('amenities', newAmenities);
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${
                localFilters.amenities.includes(amenity)
                  ? 'border-pink-500 bg-pink-500'
                  : isDarkMode 
                    ? 'border-gray-500' 
                    : 'border-gray-300'
              }`}>
                {localFilters.amenities.includes(amenity) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3 border-t pt-4">
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Quick Filters
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Luxury', filters: { category: 'luxury', rating: 4.5 } },
            { label: 'Budget', filters: { category: 'budget', priceRange: { min: 0, max: 5000 } } },
            { label: 'Highly Rated', filters: { rating: 4.5 } },
            { label: 'Pet Friendly', filters: { amenities: ['Pet Friendly'] } }
          ].map((quick) => (
            <button
              key={quick.label}
              onClick={() => updateFilters(quick.filters)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {quick.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
