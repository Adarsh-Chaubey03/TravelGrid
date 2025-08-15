import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Initial state
const initialState = {
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  filters: {
    priceRange: { min: 0, max: 100000 },
    rating: 0,
    location: '',
    category: '',
    dateRange: { start: '', end: '' },
    amenities: []
  },
  searchHistory: [],
  suggestions: [],
  showSuggestions: false,
  totalResults: 0,
  currentPage: 1,
  resultsPerPage: 12
};

// Action types
const SEARCH_ACTIONS = {
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_IS_SEARCHING: 'SET_IS_SEARCHING',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SHOW_SUGGESTIONS: 'SHOW_SUGGESTIONS',
  HIDE_SUGGESTIONS: 'HIDE_SUGGESTIONS',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_SEARCH: 'CLEAR_SEARCH'
};

// Reducer function
const searchReducer = (state, action) => {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case SEARCH_ACTIONS.SET_SEARCH_RESULTS:
      return { 
        ...state, 
        searchResults: action.payload.results,
        totalResults: action.payload.total,
        isSearching: false 
      };
    
    case SEARCH_ACTIONS.SET_IS_SEARCHING:
      return { ...state, isSearching: action.payload };
    
    case SEARCH_ACTIONS.UPDATE_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
    
    case SEARCH_ACTIONS.RESET_FILTERS:
      return { ...state, filters: initialState.filters };
    
    case SEARCH_ACTIONS.ADD_TO_HISTORY:
      const newHistory = [action.payload, ...state.searchHistory.filter(item => item !== action.payload)].slice(0, 10);
      return { ...state, searchHistory: newHistory };
    
    case SEARCH_ACTIONS.SET_SUGGESTIONS:
      return { ...state, suggestions: action.payload };
    
    case SEARCH_ACTIONS.SHOW_SUGGESTIONS:
      return { ...state, showSuggestions: true };
    
    case SEARCH_ACTIONS.HIDE_SUGGESTIONS:
      return { ...state, showSuggestions: false };
    
    case SEARCH_ACTIONS.SET_PAGINATION:
      return { ...state, currentPage: action.payload };
    
    case SEARCH_ACTIONS.CLEAR_SEARCH:
      return { 
        ...state, 
        searchQuery: '', 
        searchResults: [], 
        totalResults: 0,
        showSuggestions: false 
      };
    
    default:
      return state;
  }
};

// Popular destinations and keywords for suggestions
const POPULAR_SUGGESTIONS = [
  'Paris', 'Tokyo', 'New York', 'London', 'Dubai', 'Bali', 'Rome', 'Barcelona',
  'beach resorts', 'mountain hiking', 'city tours', 'adventure packages',
  'luxury hotels', 'budget travel', 'family trips', 'solo travel',
  'honeymoon packages', 'weekend getaways', 'cultural tours', 'food tours'
];

// Create context
const SearchContext = createContext();

// Search Provider component
export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const navigate = useNavigate();

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('travelgrid_search_history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        dispatch({ type: SEARCH_ACTIONS.ADD_TO_HISTORY, payload: history });
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('travelgrid_search_history', JSON.stringify(state.searchHistory));
  }, [state.searchHistory]);

  // Mock data for search (in real app, this would come from API)
  const getMockData = () => {
    // Import actual data from existing files
    const mockHotels = [
      { id: 1, name: 'Luxury Resort Goa', type: 'hotel', location: 'Goa', price: 5000, rating: 4.5, category: 'beach' },
      { id: 2, name: 'Mountain View Hotel', type: 'hotel', location: 'Manali', price: 3000, rating: 4.2, category: 'mountain' },
      { id: 3, name: 'City Center Hotel', type: 'hotel', location: 'Mumbai', price: 4000, rating: 4.0, category: 'city' }
    ];

    const mockPackages = [
      { id: 1, name: 'Goa Beach Package', type: 'package', location: 'Goa', price: 15000, rating: 4.7, category: 'beach' },
      { id: 2, name: 'Himalayan Adventure', type: 'package', location: 'Himachal', price: 25000, rating: 4.8, category: 'adventure' },
      { id: 3, name: 'Cultural Tour Delhi', type: 'package', location: 'Delhi', price: 8000, rating: 4.3, category: 'cultural' }
    ];

    const mockGuides = [
      { id: 1, name: 'Rahul Sharma', type: 'guide', expertise: 'Mountain Treks', location: 'Manali', rating: 4.9 },
      { id: 2, name: 'Priya Patel', type: 'guide', expertise: 'Beach Tours', location: 'Goa', rating: 4.6 },
      { id: 3, name: 'Kumar Singh', type: 'guide', expertise: 'City Tours', location: 'Delhi', rating: 4.4 }
    ];

    return [...mockHotels, ...mockPackages, ...mockGuides];
  };

  // Debounced search function
  const performSearch = async (query, filters = state.filters) => {
    if (!query.trim()) return;

    dispatch({ type: SEARCH_ACTIONS.SET_IS_SEARCHING, payload: true });

    // Simulate API delay
    setTimeout(() => {
      const allData = getMockData();
      const filteredResults = allData.filter(item => {
        const matchesQuery = 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase()) ||
          (item.expertise && item.expertise.toLowerCase().includes(query.toLowerCase())) ||
          (item.category && item.category.toLowerCase().includes(query.toLowerCase()));

        const matchesPrice = !item.price || (item.price >= filters.priceRange.min && item.price <= filters.priceRange.max);
        const matchesRating = !item.rating || item.rating >= filters.rating;
        const matchesLocation = !filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesCategory = !filters.category || item.category === filters.category;

        return matchesQuery && matchesPrice && matchesRating && matchesLocation && matchesCategory;
      });

      dispatch({ 
        type: SEARCH_ACTIONS.SET_SEARCH_RESULTS, 
        payload: { results: filteredResults, total: filteredResults.length } 
      });
    }, 500);
  };

  // Generate suggestions based on query
  const generateSuggestions = (query) => {
    if (!query.trim()) {
      dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: [] });
      return;
    }

    const filteredSuggestions = POPULAR_SUGGESTIONS.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    // Add search history matches
    const historySuggestions = state.searchHistory.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const allSuggestions = [...new Set([...filteredSuggestions, ...historySuggestions])];
    dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: allSuggestions });
  };

  // Context value
  const contextValue = {
    // State
    ...state,

    // Actions
    setSearchQuery: (query) => {
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_QUERY, payload: query });
      generateSuggestions(query);
      if (query.trim()) {
        dispatch({ type: SEARCH_ACTIONS.SHOW_SUGGESTIONS });
      } else {
        dispatch({ type: SEARCH_ACTIONS.HIDE_SUGGESTIONS });
      }
    },

    performSearch: (query = state.searchQuery) => {
      if (query.trim()) {
        dispatch({ type: SEARCH_ACTIONS.ADD_TO_HISTORY, payload: query });
        dispatch({ type: SEARCH_ACTIONS.HIDE_SUGGESTIONS });
        performSearch(query);
        navigate('/search-results');
      }
    },

    updateFilters: (newFilters) => {
      dispatch({ type: SEARCH_ACTIONS.UPDATE_FILTERS, payload: newFilters });
      if (state.searchQuery) {
        performSearch(state.searchQuery, { ...state.filters, ...newFilters });
      }
    },

    resetFilters: () => {
      dispatch({ type: SEARCH_ACTIONS.RESET_FILTERS });
      if (state.searchQuery) {
        performSearch(state.searchQuery, initialState.filters);
      }
    },

    clearSearch: () => {
      dispatch({ type: SEARCH_ACTIONS.CLEAR_SEARCH });
    },

    showSuggestions: () => dispatch({ type: SEARCH_ACTIONS.SHOW_SUGGESTIONS }),
    hideSuggestions: () => dispatch({ type: SEARCH_ACTIONS.HIDE_SUGGESTIONS }),

    setCurrentPage: (page) => {
      dispatch({ type: SEARCH_ACTIONS.SET_PAGINATION, payload: page });
    }
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;
