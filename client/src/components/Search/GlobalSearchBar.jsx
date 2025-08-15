import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';

const GlobalSearchBar = ({ className = '', placeholder = "Search hotels, packages, destinations..." }) => {
  const {
    searchQuery,
    suggestions,
    showSuggestions,
    searchHistory,
    isSearching,
    setSearchQuery,
    performSearch,
    showSuggestions: showSuggestionsAction,
    hideSuggestions,
    clearSearch
  } = useSearch();

  const { isDarkMode } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle keyboard navigation
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        hideSuggestions();
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideSuggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim() || searchHistory.length > 0) {
      showSuggestionsAction();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
    hideSuggestions();
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    const allSuggestions = [...suggestions, ...searchHistory.slice(0, 3)];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && allSuggestions[selectedSuggestionIndex]) {
          handleSuggestionClick(allSuggestions[selectedSuggestionIndex]);
        } else {
          performSearch();
          hideSuggestions();
          setIsFocused(false);
        }
        break;
      
      case 'Escape':
        hideSuggestions();
        setIsFocused(false);
        inputRef.current?.blur();
        break;
      
      default:
        break;
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const displaySuggestions = suggestions.filter(s => !searchHistory.includes(s));
  const displayHistory = searchHistory.slice(0, 3);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div 
        className={`relative flex items-center transition-all duration-300 ${
          isFocused 
            ? 'ring-2 ring-pink-500/50 shadow-lg' 
            : 'shadow-md hover:shadow-lg'
        } ${
          isDarkMode 
            ? 'bg-slate-800/90 border-slate-600' 
            : 'bg-white/95 border-gray-200'
        } border rounded-xl backdrop-blur-sm`}
      >
        <Search 
          className={`absolute left-4 h-5 w-5 transition-colors duration-200 ${
            isFocused 
              ? 'text-pink-500' 
              : isDarkMode 
                ? 'text-gray-400' 
                : 'text-gray-500'
          }`} 
        />
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 bg-transparent border-none outline-none text-sm font-medium placeholder:font-normal ${
            isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'
          }`}
        />

        {/* Loading/Clear Button */}
        <div className="absolute right-4">
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-pink-500 border-t-transparent" />
          ) : searchQuery && (
            <button
              onClick={handleClearSearch}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'hover:bg-slate-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (isFocused || searchQuery) && (displaySuggestions.length > 0 || displayHistory.length > 0) && (
        <div
          ref={suggestionsRef}
          className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-800/95 border-slate-600 backdrop-blur-md' 
              : 'bg-white/95 border-gray-200 backdrop-blur-md'
          }`}
        >
          {/* Search History */}
          {displayHistory.length > 0 && (
            <div className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Recent Searches
              </div>
              {displayHistory.map((item, index) => (
                <button
                  key={`history-${index}`}
                  onClick={() => handleSuggestionClick(item)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150 ${
                    selectedSuggestionIndex === index + suggestions.length
                      ? 'bg-pink-500 text-white'
                      : isDarkMode
                        ? 'hover:bg-slate-700 text-gray-200'
                        : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Clock className="h-4 w-4 opacity-60" />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {displaySuggestions.length > 0 && (
            <div>
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Popular Searches
              </div>
              {displaySuggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150 ${
                    selectedSuggestionIndex === index
                      ? 'bg-pink-500 text-white'
                      : isDarkMode
                        ? 'hover:bg-slate-700 text-gray-200'
                        : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 opacity-60" />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Action */}
          {searchQuery && (
            <div className={`border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <button
                onClick={() => {
                  performSearch();
                  hideSuggestions();
                  setIsFocused(false);
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 font-medium transition-colors duration-150 ${
                  isDarkMode
                    ? 'hover:bg-slate-700 text-pink-400 hover:text-pink-300'
                    : 'hover:bg-gray-50 text-pink-600 hover:text-pink-700'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Search for "{searchQuery}"</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;
