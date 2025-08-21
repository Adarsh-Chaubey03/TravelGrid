import React, { useState, useEffect, useCallback } from "react";
import {
  Brain,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Route,
  Star,
  Download,
  Share2,
  Settings,
  Zap,
  Globe,
  Cloud,
  Target,
  BarChart3
} from "lucide-react";
import { fastTravelPlanner } from "../../utils/fastTravelPlanner";
import AIIteraryBuilder from "./AIIteraryBuilder";
import AIRecommendationEngine from "./AIRecommendationEngine";
import PredictiveAnalytics from "./PredictiveAnalytics";
import SmartBudgetOptimizer from "./SmartBudgetOptimizer";
import AIPlanningInterface from "./AIPlanningInterface";

const AITravelPlannerComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState({
    destination: "",
    duration: 3,
    budget: 1000,
    interests: [],
    travelStyle: "balanced",
    groupSize: 1,
    accommodation: "hotel",
    transportation: "mixed"
  });

  const [aiPlan, setAiPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [aiInsights, setAiInsights] = useState([]);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState([]);

  // AI planner instance for advanced functionality

  // AI-powered preference learning
  const learnUserPreferences = useCallback((newPreference) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreference
    }));

    // Simulate AI learning and adaptation
    setTimeout(() => {
      const newInsight = generateAIInsight(newPreference);
      setAiInsights(prev => [newInsight, ...prev.slice(0, 4)]);
    }, 1000);
  }, []);

  // Generate AI insights based on user behavior
  const generateAIInsight = (preference) => {
    const insights = [
      "Based on your preference for {preference}, I recommend exploring local markets and authentic experiences.",
      "Your {preference} choice suggests you'd enjoy off-the-beaten-path destinations.",
      "I've noticed you prefer {preference} - this aligns with budget-friendly travel options.",
      "Your {preference} selection indicates adventure-seeking behavior. Consider adding some thrill activities!"
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    return randomInsight.replace('{preference}', Object.values(preference)[0]);
  };

  // Advanced AI plan generation with real-time progress
  const generateAITravelPlan = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate complex AI processing with progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Multi-step AI generation process
      const plan = await generateComprehensivePlan();

      clearInterval(progressInterval);
      setGenerationProgress(100);

      setTimeout(() => {
        setAiPlan(plan);
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);

    } catch (error) {
      console.error("AI Plan generation failed:", error);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Comprehensive AI plan generation
  const generateComprehensivePlan = async () => {
    const { destination, duration, budget, interests, travelStyle, groupSize } = userPreferences;

    // Step 1: Destination analysis and optimization
    const destinationAnalysis = await analyzeDestination(destination);

    // Step 2: Generate intelligent itinerary
    const itinerary = await generateIntelligentItinerary(destination, duration, interests, travelStyle);

    // Step 3: Budget optimization
    const budgetPlan = await optimizeBudget(budget, itinerary, destinationAnalysis);

    // Step 4: Route optimization
    const optimizedRoute = await optimizeRoute(itinerary, destinationAnalysis);

    // Step 5: Generate recommendations
    const recommendations = await generateRecommendations(destination, interests, travelStyle);

    return {
      destinationAnalysis,
      itinerary,
      budgetPlan,
      optimizedRoute,
      recommendations,
      generatedAt: new Date().toISOString(),
      aiVersion: "2.0.1",
      confidence: calculateConfidence(interests, destinationAnalysis)
    };
  };

  // Destination analysis with AI insights
  const analyzeDestination = async (destination) => {
    const region = "Europe"; // Default region for demo
    const weatherData = await getWeatherForecast(destination);
    const crowdData = await getCrowdPrediction(destination);
    const priceData = await getPriceForecast(destination);

    return {
      region,
      weather: weatherData,
      crowdLevels: crowdData,
      priceTrends: priceData,
      bestTimeToVisit: calculateBestTime(weatherData, crowdData, priceData),
      culturalNotes: getCulturalNotes(region),
      safetyScore: calculateSafetyScore(destination, region)
    };
  };

  // Intelligent itinerary generation
  const generateIntelligentItinerary = async (destination, duration, interests, travelStyle) => {
    const days = [];

    for (let day = 1; day <= duration; day++) {
      const dayPlan = {
        day,
        activities: generateActivitiesForDay(destination, interests, day, duration),
        meals: fastTravelPlanner.generateMeals(destination),
        accommodation: fastTravelPlanner.generateAccommodation(destination),
        transportation: fastTravelPlanner.generateTransportation(destination),
        timing: calculateOptimalTiming(day, duration, interests, travelStyle),
        energyLevel: calculateEnergyLevel(day, duration, interests),
        flexibility: calculateFlexibility(day, duration)
      };

      days.push(dayPlan);
    }

    return days;
  };

  // Budget optimization with AI
  const optimizeBudget = async (totalBudget, itinerary, destinationAnalysis) => {
    const budgetBreakdown = {
      accommodation: totalBudget * 0.4,
      activities: totalBudget * 0.3,
      food: totalBudget * 0.2,
      transportation: totalBudget * 0.1
    };

    // AI-powered budget adjustments based on destination
    const adjustedBudget = adjustBudgetForDestination(budgetBreakdown, destinationAnalysis);

    return {
      total: totalBudget,
      breakdown: adjustedBudget,
      savings: calculatePotentialSavings(adjustedBudget, destinationAnalysis),
      recommendations: generateBudgetRecommendations(adjustedBudget, destinationAnalysis)
    };
  };

  // Route optimization
  const optimizeRoute = async (itinerary, destinationAnalysis) => {
    const locations = extractLocations(itinerary);
    const optimizedOrder = optimizeLocationOrder(locations, destinationAnalysis);

    return {
      originalOrder: locations,
      optimizedOrder,
      totalDistance: calculateTotalDistance(optimizedOrder),
      timeSavings: calculateTimeSavings(optimizedOrder),
      transportationMode: recommendTransportationMode(optimizedOrder, destinationAnalysis)
    };
  };

  // Generate AI recommendations
  const generateRecommendations = async (destination, interests, travelStyle) => {
    const recommendations = {
      attractions: await getAttractionRecommendations(destination, interests),
      restaurants: await getRestaurantRecommendations(destination, interests),
      activities: await getActivityRecommendations(destination, interests, travelStyle),
      hiddenGems: await getHiddenGems(destination, interests),
      localTips: await getLocalTips(destination, interests)
    };

    return recommendations;
  };

  // Helper functions (simplified for demo)
  const getWeatherForecast = async (destination) => ({ temperature: "22°C", condition: "Sunny" });
  const getCrowdPrediction = async (destination) => ({ level: "Medium", bestTime: "Morning" });
  const getPriceForecast = async (destination) => ({ trend: "Stable", recommendation: "Book now" });
  const calculateBestTime = (weather, crowd, price) => "Morning";
  const getCulturalNotes = (region) => "Respect local customs and traditions";
  const calculateSafetyScore = (destination, region) => 85;
  const calculateOptimalTiming = (day, duration, interests, travelStyle) => "9:00 AM - 6:00 PM";
  const calculateEnergyLevel = (day, duration, interests) => "High";
  const calculateFlexibility = (day, duration) => "Medium";
  const adjustBudgetForDestination = (budget, analysis) => budget;
  const calculatePotentialSavings = (budget, analysis) => 150;
  const generateBudgetRecommendations = (budget, analysis) => ["Book in advance", "Use local transport"];
  const extractLocations = (itinerary) => ["Location 1", "Location 2", "Location 3"];
  const optimizeLocationOrder = (locations, analysis) => locations;
  const calculateTotalDistance = (locations) => "15 km";
  const calculateTimeSavings = (locations) => "2 hours";
  const recommendTransportationMode = (locations, analysis) => "Public Transport";
  const getAttractionRecommendations = async (destination, interests) => ["Attraction 1", "Attraction 2"];
  const getRestaurantRecommendations = async (destination, interests) => ["Restaurant 1", "Restaurant 2"];
  const getActivityRecommendations = async (destination, interests, travelStyle) => ["Activity 1", "Activity 2"];
  const getHiddenGems = async (destination, interests) => ["Hidden Gem 1", "Hidden Gem 2"];
  const getLocalTips = async (destination, interests) => ["Tip 1", "Tip 2"];
  const calculateConfidence = (interests, analysis) => 92;

  // Generate activities for a specific day
  const generateActivitiesForDay = (destination, interests, day, duration) => {
    const baseActivities = [
      `${destination} City Tour`,
      `${destination} Local Market Visit`,
      `${destination} Cultural Experience`
    ];

    if (interests.includes('food')) {
      baseActivities.push(`${destination} Food Tasting`);
    }
    if (interests.includes('culture')) {
      baseActivities.push(`${destination} Museum Visit`);
    }
    if (interests.includes('nature')) {
      baseActivities.push(`${destination} Park Walk`);
    }
    if (interests.includes('adventure')) {
      baseActivities.push(`${destination} Adventure Activity`);
    }

    return baseActivities.slice(0, 3); // Return max 3 activities per day
  };

  // Voice command processing
  const processVoiceCommand = (command) => {
    const newCommand = {
      id: Date.now(),
      command,
      timestamp: new Date().toISOString(),
      processed: false
    };

    setVoiceCommands(prev => [newCommand, ...prev]);

    // Simulate AI processing
    setTimeout(() => {
      setVoiceCommands(prev =>
        prev.map(cmd =>
          cmd.id === newCommand.id ? { ...cmd, processed: true } : cmd
        )
      );
    }, 2000);
  };

  const steps = [
    { id: 1, title: "Preferences", icon: Brain },
    { id: 2, title: "AI Analysis", icon: Zap },
    { id: 3, title: "Itinerary", icon: Route },
    { id: 4, title: "Budget", icon: DollarSign },
    { id: 5, title: "Optimization", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-purple-400 mr-4" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent">
              AI Travel Planner
            </h1>
          </div>
          <p className="text-xl text-black-300 max-w-3xl mx-auto">
            Experience the future of travel planning with our advanced AI-powered system.
            Get personalized recommendations, intelligent itineraries, and predictive insights.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${currentStep >= step.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400"
                  }`}
              >
                <step.icon className="w-5 h-5" />
                <span className="font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - User Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                Travel Preferences
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={userPreferences.destination}
                    onChange={(e) => learnUserPreferences({ destination: e.target.value })}
                    placeholder="Where do you want to go?"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={userPreferences.duration}
                    onChange={(e) => learnUserPreferences({ duration: parseInt(e.target.value) })}
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={userPreferences.budget}
                    onChange={(e) => learnUserPreferences({ budget: parseInt(e.target.value) })}
                    min="100"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Interests
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['culture', 'food', 'nature', 'adventure', 'shopping', 'relaxation'].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          const newInterests = userPreferences.interests.includes(interest)
                            ? userPreferences.interests.filter(i => i !== interest)
                            : [...userPreferences.interests, interest];
                          learnUserPreferences({ interests: newInterests });
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${userPreferences.interests.includes(interest)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateAITravelPlan}
                  disabled={isGenerating || !userPreferences.destination}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating AI Plan...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Generate AI Travel Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Insights Panel */}
            {aiInsights.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-200">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generation Progress */}
            {isGenerating && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  AI Processing
                </h3>
                <div className="space-y-4">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-gray-300">
                    {generationProgress < 30 && "Analyzing destination and cultural context..."}
                    {generationProgress >= 30 && generationProgress < 60 && "Generating intelligent itinerary..."}
                    {generationProgress >= 60 && generationProgress < 90 && "Optimizing routes and budget..."}
                    {generationProgress >= 90 && "Finalizing recommendations..."}
                  </p>
                </div>
              </div>
            )}

            {/* Generated Plan Display */}
            {aiPlan && !isGenerating && (
              <div className="space-y-6">
                {/* Plan Overview */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-400" />
                      AI-Generated Travel Plan
                    </h3>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{aiPlan.confidence}%</div>
                      <div className="text-sm text-gray-400">AI Confidence</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{aiPlan.itinerary.length}</div>
                      <div className="text-sm text-gray-400">Days Planned</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">v{aiPlan.aiVersion}</div>
                      <div className="text-sm text-gray-400">AI Version</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    Generated on {new Date(aiPlan.generatedAt).toLocaleDateString()} at {new Date(aiPlan.generatedAt).toLocaleTimeString()}
                  </div>
                </div>

                {/* Itinerary Display */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Route className="w-5 h-5 mr-2 text-blue-400" />
                    Intelligent Itinerary
                  </h3>

                  <div className="space-y-4">
                    {aiPlan.itinerary.map((day, index) => (
                      <div key={index} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">Day {day.day}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {day.timing}
                            </span>
                            <span className="flex items-center">
                              <Zap className="w-4 h-4 mr-1" />
                              {day.energyLevel}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-purple-400 mb-2">Activities</h5>
                            <ul className="space-y-1 text-sm">
                              {day.activities.slice(0, 3).map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-400 mr-2" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-green-400 mb-2">Details</h5>
                            <div className="text-sm space-y-1">
                              <div>🏨 {day.accommodation}</div>
                              <div>🍽️ {day.meals.breakfast}, {day.meals.lunch}, {day.meals.dinner}</div>
                              <div>🚗 {day.transportation}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Optimization */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Smart Budget Optimization
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-300 mb-3">Budget Breakdown</h5>
                      <div className="space-y-2">
                        {Object.entries(aiPlan.budgetPlan.breakdown).map(([category, amount]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="capitalize text-gray-400">{category}</span>
                            <span className="font-medium">${amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-300 mb-3">AI Recommendations</h5>
                      <div className="space-y-2">
                        {aiPlan.budgetPlan.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-medium">Potential Savings</span>
                      <span className="text-green-400 font-bold">${aiPlan.budgetPlan.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default State */}
            {!aiPlan && !isGenerating && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center">
                <Brain className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Ready to Plan Your Adventure?
                </h3>
                <p className="text-gray-500">
                  Fill in your travel preferences and let our AI create a personalized travel plan for you.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Collaboration Mode Toggle */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setCollaborationMode(!collaborationMode)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${collaborationMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            {collaborationMode ? 'Collaboration Mode Active' : 'Enable Collaboration Mode'}
          </button>
        </div>

        {/* Voice Commands Display */}
        {voiceCommands.length > 0 && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-400" />
              Voice Commands
            </h3>
            <div className="space-y-2">
              {voiceCommands.map((cmd) => (
                <div key={cmd.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">{cmd.command}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(cmd.timestamp).toLocaleTimeString()}
                    </span>
                    {cmd.processed ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITravelPlannerComponent;

