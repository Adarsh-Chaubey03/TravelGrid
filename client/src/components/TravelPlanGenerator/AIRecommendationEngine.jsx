import React, { useState, useEffect, useCallback } from "react";
import {
  Lightbulb,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  Eye,
  Bookmark,
  Share2,
  Filter,
  Search,
  Zap,
  Target,
  Award,
  Globe,
  Calendar
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const AIRecommendationEngine = ({
  destination,
  interests,
  travelStyle,
  budget,
  groupSize,
  onRecommendationSelect
}) => {
  const [recommendations, setRecommendations] = useState({
    attractions: [],
    restaurants: [],
    activities: [],
    hiddenGems: [],
    localTips: []
  });
  const [filteredRecommendations, setFilteredRecommendations] = useState({});
  const [activeCategory, setActiveCategory] = useState('attractions');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    distance: 'all',
    duration: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [personalizationScore, setPersonalizationScore] = useState(0);
  const {isDarkMode}=useTheme();
  // Generate AI recommendations based on user preferences
  const generateRecommendations = useCallback(async () => {
    setIsLoading(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate personalized recommendations
    const newRecommendations = {
      attractions: generateAttractionRecommendations(),
      restaurants: generateRestaurantRecommendations(),
      activities: generateActivityRecommendations(),
      hiddenGems: generateHiddenGems(),
      localTips: generateLocalTips()
    };

    setRecommendations(newRecommendations);
    setFilteredRecommendations(newRecommendations);
    setIsLoading(false);

    // Calculate personalization score
    calculatePersonalizationScore(newRecommendations);

    // Generate AI insights
    generateAIInsights(newRecommendations);
  }, [destination, interests, travelStyle, budget, groupSize]);

  // Generate attraction recommendations
  const generateAttractionRecommendations = () => {
    const baseAttractions = [
      {
        id: 1,
        name: `${destination} Historical Museum`,
        type: 'culture',
        rating: 4.7,
        price: '$$',
        duration: '2-3 hours',
        distance: '0.5 km',
        description: 'Explore the rich history and cultural heritage of the region',
        bestTime: 'Morning',
        crowdLevel: 'Medium',
        photo: '🏛️',
        tags: ['culture', 'history', 'indoor'],
        aiScore: 95,
        personalization: 'High match with your cultural interests'
      },
      {
        id: 2,
        name: `${destination} Central Park`,
        type: 'nature',
        rating: 4.5,
        price: 'Free',
        duration: '1-2 hours',
        distance: '1.2 km',
        description: 'Beautiful green space perfect for relaxation and nature walks',
        bestTime: 'Afternoon',
        crowdLevel: 'Low',
        photo: '🌿',
        tags: ['nature', 'relaxation', 'outdoor'],
        aiScore: 88,
        personalization: 'Perfect for your nature preference'
      },
      {
        id: 3,
        name: `${destination} Art Gallery`,
        type: 'culture',
        rating: 4.6,
        price: '$$',
        duration: '1.5-2 hours',
        distance: '0.8 km',
        description: 'Contemporary and classical art exhibitions',
        bestTime: 'Morning',
        crowdLevel: 'Low',
        photo: '🎨',
        tags: ['culture', 'art', 'indoor'],
        aiScore: 92,
        personalization: 'Excellent cultural experience'
      }
    ];

    // Add more attractions based on interests
    if (interests.includes('adventure')) {
      baseAttractions.push({
        id: 4,
        name: `${destination} Adventure Park`,
        type: 'adventure',
        rating: 4.8,
        price: '$$$',
        duration: '3-4 hours',
        distance: '2.5 km',
        description: 'Thrilling outdoor activities and adventure sports',
        bestTime: 'Morning',
        crowdLevel: 'Medium',
        photo: '🏔️',
        tags: ['adventure', 'outdoor', 'thrilling'],
        aiScore: 98,
        personalization: 'Perfect match for your adventure spirit!'
      });
    }

    if (interests.includes('food')) {
      baseAttractions.push({
        id: 5,
        name: `${destination} Food Market`,
        type: 'food',
        rating: 4.4,
        price: '$',
        duration: '1-2 hours',
        distance: '0.3 km',
        description: 'Local food stalls and traditional cuisine',
        bestTime: 'Evening',
        crowdLevel: 'High',
        photo: '🍽️',
        tags: ['food', 'local', 'culture'],
        aiScore: 89,
        personalization: 'Great for experiencing local flavors'
      });
    }

    return baseAttractions;
  };

  // Generate restaurant recommendations
  const generateRestaurantRecommendations = () => {
    const restaurants = [
      {
        id: 1,
        name: `${destination} Fine Dining`,
        cuisine: 'International',
        rating: 4.8,
        price: '$$$',
        distance: '0.4 km',
        description: 'Upscale dining with international cuisine',
        bestTime: 'Dinner',
        crowdLevel: 'Medium',
        photo: '🍷',
        tags: ['fine-dining', 'international', 'romantic'],
        aiScore: 94,
        personalization: 'Perfect for special occasions',
        specialties: ['Wine Pairing', 'Chef Specials'],
        reservation: 'Recommended'
      },
      {
        id: 2,
        name: `${destination} Local Bistro`,
        cuisine: 'Local',
        rating: 4.6,
        price: '$$',
        distance: '0.6 km',
        description: 'Authentic local cuisine in cozy atmosphere',
        bestTime: 'Lunch',
        crowdLevel: 'High',
        photo: '🍽️',
        tags: ['local', 'authentic', 'cozy'],
        aiScore: 96,
        personalization: 'Excellent for cultural immersion',
        specialties: ['Local Dishes', 'Seasonal Menu'],
        reservation: 'Walk-in welcome'
      }
    ];

    if (interests.includes('food')) {
      restaurants.push({
        id: 3,
        name: `${destination} Street Food Hub`,
        cuisine: 'Street Food',
        rating: 4.3,
        price: '$',
        distance: '0.2 km',
        description: 'Best street food vendors in the area',
        bestTime: 'Lunch/Dinner',
        crowdLevel: 'Very High',
        photo: '🌮',
        tags: ['street-food', 'budget', 'local'],
        aiScore: 91,
        personalization: 'Perfect for food exploration',
        specialties: ['Street Tacos', 'Local Snacks'],
        reservation: 'Not needed'
      });
    }

    return restaurants;
  };

  // Generate activity recommendations
  const generateActivityRecommendations = () => {
    const activities = [
      {
        id: 1,
        name: `${destination} Walking Tour`,
        type: 'culture',
        rating: 4.7,
        price: '$$',
        duration: '2-3 hours',
        distance: 'Self-guided',
        description: 'Self-guided walking tour of historical sites',
        bestTime: 'Morning',
        crowdLevel: 'Low',
        photo: '🚶',
        tags: ['culture', 'walking', 'historical'],
        aiScore: 93,
        personalization: 'Great cultural experience',
        difficulty: 'Easy',
        groupSize: '1-10 people'
      }
    ];

    if (interests.includes('adventure')) {
      activities.push({
        id: 2,
        name: `${destination} Hiking Trail`,
        type: 'adventure',
        rating: 4.9,
        price: 'Free',
        duration: '4-5 hours',
        distance: '5 km',
        description: 'Scenic hiking trail with beautiful views',
        bestTime: 'Morning',
        crowdLevel: 'Low',
        photo: '🥾',
        tags: ['adventure', 'hiking', 'nature'],
        aiScore: 97,
        personalization: 'Perfect adventure activity!',
        difficulty: 'Moderate',
        groupSize: '1-8 people'
      });
    }

    return activities;
  };

  // Generate hidden gems
  const generateHiddenGems = () => {
    return [
      {
        id: 1,
        name: `${destination} Secret Garden`,
        type: 'nature',
        rating: 4.9,
        price: 'Free',
        duration: '1 hour',
        distance: '1.5 km',
        description: 'Hidden garden known only to locals',
        bestTime: 'Sunset',
        crowdLevel: 'Very Low',
        photo: '🌸',
        tags: ['hidden', 'nature', 'peaceful'],
        aiScore: 99,
        personalization: 'Exclusive local experience',
        discovery: 'Local recommendation'
      }
    ];
  };

  // Generate local tips
  const generateLocalTips = () => {
    return [
      {
        id: 1,
        tip: 'Visit museums on free admission days (usually first Sunday of the month)',
        category: 'money-saving',
        rating: 4.8,
        photo: '💰',
        tags: ['money-saving', 'culture'],
        aiScore: 95,
        personalization: 'Helps stretch your budget'
      },
      {
        id: 2,
        tip: 'Best time to visit popular attractions is early morning (before 9 AM)',
        category: 'timing',
        rating: 4.7,
        photo: '⏰',
        tags: ['timing', 'crowds'],
        aiScore: 92,
        personalization: 'Optimizes your experience'
      }
    ];
  };

  // Calculate personalization score
  const calculatePersonalizationScore = (recs) => {
    let totalScore = 0;
    let totalItems = 0;

    Object.values(recs).forEach(category => {
      category.forEach(item => {
        totalScore += item.aiScore;
        totalItems++;
      });
    });

    const averageScore = totalItems > 0 ? totalScore / totalItems : 0;
    setPersonalizationScore(Math.round(averageScore));
  };

  // Generate AI insights
  const generateAIInsights = (recs) => {
    const insights = [
      {
        id: 1,
        message: `Based on your ${interests.join(', ')} interests, I've prioritized cultural and authentic experiences`,
        type: 'personalization',
        icon: '🎯'
      },
      {
        id: 2,
        message: `Your budget of $${budget} allows for a mix of free and premium experiences`,
        type: 'budget',
        icon: '💰'
      },
      {
        id: 3,
        message: `Group size of ${groupSize} is perfect for shared experiences and cost splitting`,
        type: 'group',
        icon: '👥'
      }
    ];

    setAiInsights(insights);
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = { ...recommendations };

    Object.keys(filtered).forEach(category => {
      filtered[category] = filtered[category].filter(item => {
        // Price filter
        if (filters.priceRange !== 'all') {
          const priceMap = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
          if (priceMap[item.price] !== priceMap[filters.priceRange]) return false;
        }

        // Rating filter
        if (filters.rating !== 'all') {
          const minRating = parseFloat(filters.rating);
          if (item.rating < minRating) return false;
        }

        // Distance filter
        if (filters.distance !== 'all') {
          const distanceMap = { 'near': 1, 'medium': 3, 'far': 5 };
          const itemDistance = parseFloat(item.distance);
          if (itemDistance > distanceMap[filters.distance]) return false;
        }

        return true;
      });
    });

    setFilteredRecommendations(filtered);
  }, [recommendations, filters]);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle recommendation selection
  const handleRecommendationSelect = (item, category) => {
    onRecommendationSelect?.(item, category);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      attractions: '🏛️',
      restaurants: '🍽️',
      activities: '🎯',
      hiddenGems: '💎',
      localTips: '💡'
    };
    return iconMap[category] || '⭐';
  };

  // Get category title
  const getCategoryTitle = (category) => {
    const titleMap = {
      attractions: 'Attractions & Landmarks',
      restaurants: 'Restaurants & Dining',
      activities: 'Activities & Experiences',
      hiddenGems: 'Hidden Gems',
      localTips: 'Local Tips & Tricks'
    };
    return titleMap[category] || category;
  };

  useEffect(() => {
    if (destination && interests.length > 0) {
      generateRecommendations();
    }
  }, [destination, interests, travelStyle, budget, groupSize, generateRecommendations]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const categories = ['attractions', 'restaurants', 'activities', 'hiddenGems', 'localTips'];

  return (
    <div className="space-y-6">
      {/* AI Personalization Header */}
      <div className={`backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 ${isDarkMode ? "bg-white/10 ":"bg-white/90"}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold flex items-center text-pink-400 justify-start gap-2">
              <Zap className="w-5 h-5" />
              AI-Powered Recommendations
            </h3>
            <p className="text-sm text-gray-900 mt-1">
              Personalized suggestions based on your preferences and AI analysis
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-400">{personalizationScore}%</div>
            <div className="text-sm text-gray-900">AI Match Score</div>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-3 rounded-lg  border border-pink-500/30 ${isDarkMode ? " bg-white/10":" bg-gradient-to-r from-pink-100 via-gray-200 to-blue-100 border-pink-500"}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{insight.icon}</span>
                  <span className="text-xs font-medium text-gray-900 uppercase">
                    {insight.type}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{insight.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/10":" bg-white/90"}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold flex items-center text-pink-400">
            <Filter className="w-5 h-5 mr-2" />
            Smart Filters
          </h4>
          <button
            onClick={() => setFilters({
              priceRange: 'all',
              rating: 'all',
              distance: 'all',
              duration: 'all'
            })}
            className="text-sm font-medium text-pink-400 hover:text-pink-400 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Price Range</label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full px-3 py-2 text-pink-400 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="$">Budget ($)</option>
              <option value="$$">Mid-range ($$)</option>
              <option value="$$$">Premium ($$$)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Min Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-sm  transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Distance</label>
            <select
              value={filters.distance}
              onChange={(e) => handleFilterChange('distance', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            >
              <option value="all">Any Distance</option>
              <option value="near">Near (0-1 km)</option>
              <option value="medium">Medium (1-3 km)</option>
              <option value="far">Far (3+ km)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            >
              <option value="all">Any Duration</option>
              <option value="short">Short (1-2 hours)</option>
              <option value="medium">Medium (2-4 hours)</option>
              <option value="long">Long (4+ hours)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="backdrop-blur-sm rounded-xl p-6 border border-pink-700">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 text-sm font-medium cursor-pointer ${activeCategory === category
                  ? 'bg-pink-500 text-white'
                  : 'bg-pink-50/30 text-gray-900 hover:bg-pink-100'
                }`}
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{getCategoryTitle(category)}</span>
              <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                {filteredRecommendations[category]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-900">AI is analyzing your preferences...</p>
          </div>
        )}

        {/* Recommendations Display */}
        {!isLoading && filteredRecommendations[activeCategory] && (
          <div className="space-y-4">
            {filteredRecommendations[activeCategory].map((item) => (
              <div
                key={item.id}
                className={`backdrop-blur-md shadow-md rounded-lg p-4 hover:border-pink-500 transition-all cursor-pointer ${isDarkMode ? "bg-white/10 ":"bg-white/30"}`}
                onClick={() => handleRecommendationSelect(item, activeCategory)}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{item.photo}</div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-lg text-pink-400">{item.name}</h5>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center gap-1 justify-center text-yellow-400">
                          <Star className="w-4 h-4" />
                          {item.rating}
                        </span>
                        <span className="text-sm text-gray-900">{item.price}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{item.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-900 mb-3">
                      {item.duration && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {item.duration}
                        </span>
                      )}
                      {item.distance && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.distance}
                        </span>
                      )}
                      {item.bestTime && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {item.bestTime}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-4 py-1.5 ${isDarkMode ? "bg-white/20 text-pink-50":"bg-white/90 text-pink-500"} text-xs rounded-full`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm text-blue-400 font-medium">
                            AI Score: {item.aiScore}%
                          </div>
                          <div className="text-xs text-gray-700">
                            {item.personalization}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecommendations[activeCategory]?.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-900 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              No recommendations found
            </h4>
            <p className="text-gray-500">
              Try adjusting your filters or check back later for more suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationEngine;
