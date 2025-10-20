import React, { useState } from 'react';
import useMultiModalData from '../hooks/useMultiModalData';

const TripComparisonDashboard = () => {
  const { 
    transportOptions, 
    itinerary, 
    loading, 
    error, 
    fetchTransportOptions, 
    createOptimizedItinerary 
  } = useMultiModalData();

  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  const [routeSegments, setRouteSegments] = useState([
    { origin: '', destination: '', date: '', preferences: { priority: 'balanced' } }
  ]);

  const [preferences, setPreferences] = useState({
    priority: 'balanced' // balanced, cost, time, eco
  });

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...routeSegments];
    updatedSegments[index][field] = value;
    setRouteSegments(updatedSegments);
  };

  const addSegment = () => {
    setRouteSegments([
      ...routeSegments,
      { origin: '', destination: '', date: '', preferences: { priority: 'balanced' } }
    ]);
  };

  const removeSegment = (index) => {
    if (routeSegments.length > 1) {
      const updatedSegments = routeSegments.filter((_, i) => i !== index);
      setRouteSegments(updatedSegments);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchParams.origin && searchParams.destination && searchParams.date) {
      fetchTransportOptions(
        searchParams.origin,
        searchParams.destination,
        searchParams.date
      );
    }
  };

  const handleOptimize = (e) => {
    e.preventDefault();
    const validSegments = routeSegments.filter(
      segment => segment.origin && segment.destination && segment.date
    );
    
    if (validSegments.length > 0) {
      createOptimizedItinerary(validSegments, preferences);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'train': return '🚂';
      case 'bus': return '🚌';
      case 'car-rental': return '🚗';
      case 'ride-share': return '🚖';
      default: return '🚆';
    }
  };

  const getEcoLabel = (carbonFootprint) => {
    if (carbonFootprint < 30) return 'Eco-Friendly';
    if (carbonFootprint < 60) return 'Moderate Impact';
    return 'High Impact';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Multi-Modal Trip Planner
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Compare prices, durations, and environmental impact across all transportation modes
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Transport Options</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Origin
            </label>
            <input
              type="text"
              name="origin"
              value={searchParams.origin}
              onChange={handleSearchChange}
              placeholder="City or airport code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={searchParams.destination}
              onChange={handleSearchChange}
              placeholder="City or airport code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Multi-Segment Itinerary Planner */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Multi-City Itinerary Planner</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Optimization Priority
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'balanced', label: 'Balanced' },
              { value: 'cost', label: 'Lowest Cost' },
              { value: 'time', label: 'Fastest' },
              { value: 'eco', label: 'Eco-Friendly' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPreferences({ priority: option.value })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  preferences.priority === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {routeSegments.map((segment, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <input
                type="text"
                value={segment.origin}
                onChange={(e) => handleSegmentChange(index, 'origin', e.target.value)}
                placeholder="Origin city"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <input
                type="text"
                value={segment.destination}
                onChange={(e) => handleSegmentChange(index, 'destination', e.target.value)}
                placeholder="Destination city"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={segment.date}
                onChange={(e) => handleSegmentChange(index, 'date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={segment.preferences.priority}
                onChange={(e) => handleSegmentChange(index, 'preferences', { priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="balanced">Balanced</option>
                <option value="cost">Lowest Cost</option>
                <option value="time">Fastest</option>
                <option value="eco">Eco-Friendly</option>
              </select>
            </div>
            
            <div className="flex items-end">
              {routeSegments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSegment(index)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addSegment}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Add Segment
          </button>
          
          <button
            type="button"
            onClick={handleOptimize}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? 'Optimizing...' : 'Optimize Itinerary'}
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Processing your request...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {transportOptions.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Transport Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transportOptions.map((option) => (
              <div key={option._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{getTransportIcon(option.type)}</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {option.provider} - {option.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {option.origin} → {option.destination}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      option.ecoFriendly 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {getEcoLabel(option.carbonFootprint)}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(option.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Arrival</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(option.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDuration(option.duration)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Carbon Footprint</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {option.carbonFootprint} kg CO₂
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(option.dynamicPrice, option.currency)}
                      </p>
                    </div>
                    <a 
                      href={option.bookingUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimized Itinerary */}
      {itinerary && itinerary.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Optimized Itinerary</h2>
          
          <div className="space-y-6">
            {itinerary.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Segment {index + 1}: {item.segment.origin} → {item.segment.destination}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                      {new Date(item.segment.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-1 mb-6">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTransportIcon(item.selectedOption.type)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.selectedOption.provider} - {item.selectedOption.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.selectedOption.origin} → {item.selectedOption.destination}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(item.selectedOption.departureTime).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Arrival</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(item.selectedOption.arrivalTime).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDuration(item.selectedOption.duration)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.selectedOption.dynamicPrice, item.selectedOption.currency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        Carbon Footprint: {item.selectedOption.carbonFootprint} kg CO₂
                      </span>
                    </div>
                    
                    {item.selectedOption.amenities && item.selectedOption.amenities.length > 0 && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          Amenities: {item.selectedOption.amenities.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {item.alternatives && item.alternatives.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Alternative Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {item.alternatives.map((alt, altIndex) => (
                          <div key={altIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{getTransportIcon(alt.type)}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {alt.provider}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alt.ecoFriendly 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                              }`}>
                                {alt.carbonFootprint} kg
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {formatDuration(alt.duration)}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(alt.dynamicPrice, alt.currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Total Estimated Cost</h3>
              <p className="text-3xl font-bold">
                {formatCurrency(
                  itinerary.reduce((sum, item) => sum + item.selectedOption.dynamicPrice, 0),
                  itinerary[0]?.selectedOption?.currency || 'USD'
                )}
              </p>
              <p className="mt-2 opacity-90">
                Total Carbon Footprint: {
                  itinerary.reduce((sum, item) => sum + item.selectedOption.carbonFootprint, 0).toFixed(2)
                } kg CO₂
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && transportOptions.length === 0 && !itinerary && !error && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Plan your multi-modal trip</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Enter your travel details above to compare transportation options and create an optimized itinerary.
          </p>
        </div>
      )}
    </div>
  );
};

export default TripComparisonDashboard;