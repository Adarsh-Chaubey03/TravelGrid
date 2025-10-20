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
  BarChart3,
} from "lucide-react";
import { fastTravelPlanner } from "../../utils/fastTravelPlanner";
import AIIteraryBuilder from "./AIIteraryBuilder";
import AIRecommendationEngine from "./AIRecommendationEngine";
import PredictiveAnalytics from "./PredictiveAnalytics";
import SmartBudgetOptimizer from "./SmartBudgetOptimizer";
import AIPlanningInterface from "./AIPlanningInterface";
import { useTheme } from "@/context/ThemeContext";

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
    transportation: "mixed",
  });
  const {isDarkMode}=useTheme();

  const [aiPlan, setAiPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [aiInsights, setAiInsights] = useState([]);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState([]);

  // AI planner instance for advanced functionality

  // AI-powered preference learning
  const learnUserPreferences = useCallback((newPreference) => {
    setUserPreferences((prev) => ({
      ...prev,
      ...newPreference,
    }));

    // Simulate AI learning and adaptation
    setTimeout(() => {
      const newInsight = generateAIInsight(newPreference);
      setAiInsights((prev) => [newInsight, ...prev.slice(0, 4)]);
    }, 1000);
  }, []);

  // Generate AI insights based on user behavior
  const generateAIInsight = (preference) => {
    const insights = [
      "Based on your preference for {preference}, I recommend exploring local markets and authentic experiences.",
      "Your {preference} choice suggests you'd enjoy off-the-beaten-path destinations.",
      "I've noticed you prefer {preference} - this aligns with budget-friendly travel options.",
      "Your {preference} selection indicates adventure-seeking behavior. Consider adding some thrill activities!",
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    return randomInsight.replace("{preference}", Object.values(preference)[0]);
  };

  // Advanced AI plan generation with real-time progress
  const generateAITravelPlan = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate complex AI processing with progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
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
    const { destination, duration, budget, interests, travelStyle, groupSize } =
      userPreferences;

    // Step 1: Destination analysis and optimization
    const destinationAnalysis = await analyzeDestination(destination);

    // Step 2: Generate intelligent itinerary
    const itinerary = await generateIntelligentItinerary(
      destination,
      duration,
      interests,
      travelStyle
    );

    // Step 3: Budget optimization
    const budgetPlan = await optimizeBudget(
      budget,
      itinerary,
      destinationAnalysis
    );

    // Step 4: Route optimization
    const optimizedRoute = await optimizeRoute(itinerary, destinationAnalysis);

    // Step 5: Generate recommendations
    const recommendations = await generateRecommendations(
      destination,
      interests,
      travelStyle
    );

    return {
      destinationAnalysis,
      itinerary,
      budgetPlan,
      optimizedRoute,
      recommendations,
      generatedAt: new Date().toISOString(),
      aiVersion: "2.0.1",
      confidence: calculateConfidence(interests, destinationAnalysis),
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
      safetyScore: calculateSafetyScore(destination, region),
    };
  };

  // Intelligent itinerary generation
  const generateIntelligentItinerary = async (
    destination,
    duration,
    interests,
    travelStyle
  ) => {
    const days = [];

    for (let day = 1; day <= duration; day++) {
      const dayPlan = {
        day,
        activities: generateActivitiesForDay(
          destination,
          interests,
          day,
          duration
        ),
        meals: fastTravelPlanner.generateMeals(destination),
        accommodation: fastTravelPlanner.generateAccommodation(destination),
        transportation: fastTravelPlanner.generateTransportation(destination),
        timing: calculateOptimalTiming(day, duration, interests, travelStyle),
        energyLevel: calculateEnergyLevel(day, duration, interests),
        flexibility: calculateFlexibility(day, duration),
      };

      days.push(dayPlan);
    }

    return days;
  };

  // Budget optimization with AI
  const optimizeBudget = async (
    totalBudget,
    itinerary,
    destinationAnalysis
  ) => {
    const budgetBreakdown = {
      accommodation: totalBudget * 0.4,
      activities: totalBudget * 0.3,
      food: totalBudget * 0.2,
      transportation: totalBudget * 0.1,
    };

    // AI-powered budget adjustments based on destination
    const adjustedBudget = adjustBudgetForDestination(
      budgetBreakdown,
      destinationAnalysis
    );

    return {
      total: totalBudget,
      breakdown: adjustedBudget,
      savings: calculatePotentialSavings(adjustedBudget, destinationAnalysis),
      recommendations: generateBudgetRecommendations(
        adjustedBudget,
        destinationAnalysis
      ),
    };
  };

  // Route optimization
  const optimizeRoute = async (itinerary, destinationAnalysis) => {
    const locations = extractLocations(itinerary);
    const optimizedOrder = optimizeLocationOrder(
      locations,
      destinationAnalysis
    );

    return {
      originalOrder: locations,
      optimizedOrder,
      totalDistance: calculateTotalDistance(optimizedOrder),
      timeSavings: calculateTimeSavings(optimizedOrder),
      transportationMode: recommendTransportationMode(
        optimizedOrder,
        destinationAnalysis
      ),
    };
  };

  // Generate AI recommendations
  const generateRecommendations = async (
    destination,
    interests,
    travelStyle
  ) => {
    const recommendations = {
      attractions: await getAttractionRecommendations(destination, interests),
      restaurants: await getRestaurantRecommendations(destination, interests),
      activities: await getActivityRecommendations(
        destination,
        interests,
        travelStyle
      ),
      hiddenGems: await getHiddenGems(destination, interests),
      localTips: await getLocalTips(destination, interests),
    };

    return recommendations;
  };

  // Helper functions (simplified for demo)
  const getWeatherForecast = async (destination) => ({
    temperature: "22°C",
    condition: "Sunny",
  });
  const getCrowdPrediction = async (destination) => ({
    level: "Medium",
    bestTime: "Morning",
  });
  const getPriceForecast = async (destination) => ({
    trend: "Stable",
    recommendation: "Book now",
  });
  const calculateBestTime = (weather, crowd, price) => "Morning";
  const getCulturalNotes = (region) => "Respect local customs and traditions";
  const calculateSafetyScore = (destination, region) => 85;
  const calculateOptimalTiming = (day, duration, interests, travelStyle) =>
    "9:00 AM - 6:00 PM";
  const calculateEnergyLevel = (day, duration, interests) => "High";
  const calculateFlexibility = (day, duration) => "Medium";
  const adjustBudgetForDestination = (budget, analysis) => budget;
  const calculatePotentialSavings = (budget, analysis) => 150;
  const generateBudgetRecommendations = (budget, analysis) => [
    "Book in advance",
    "Use local transport",
  ];
  const extractLocations = (itinerary) => [
    "Location 1",
    "Location 2",
    "Location 3",
  ];
  const optimizeLocationOrder = (locations, analysis) => locations;
  const calculateTotalDistance = (locations) => "15 km";
  const calculateTimeSavings = (locations) => "2 hours";
  const recommendTransportationMode = (locations, analysis) =>
    "Public Transport";
  const getAttractionRecommendations = async (destination, interests) => [
    "Attraction 1",
    "Attraction 2",
  ];
  const getRestaurantRecommendations = async (destination, interests) => [
    "Restaurant 1",
    "Restaurant 2",
  ];
  const getActivityRecommendations = async (
    destination,
    interests,
    travelStyle
  ) => ["Activity 1", "Activity 2"];
  const getHiddenGems = async (destination, interests) => [
    "Hidden Gem 1",
    "Hidden Gem 2",
  ];
  const getLocalTips = async (destination, interests) => ["Tip 1", "Tip 2"];
  const calculateConfidence = (interests, analysis) => 92;

  // Generate activities for a specific day
  const generateActivitiesForDay = (destination, interests, day, duration) => {
    const baseActivities = [
      `${destination} City Tour`,
      `${destination} Local Market Visit`,
      `${destination} Cultural Experience`,
    ];

    if (interests.includes("food")) {
      baseActivities.push(`${destination} Food Tasting`);
    }
    if (interests.includes("culture")) {
      baseActivities.push(`${destination} Museum Visit`);
    }
    if (interests.includes("nature")) {
      baseActivities.push(`${destination} Park Walk`);
    }
    if (interests.includes("adventure")) {
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
      processed: false,
    };

    setVoiceCommands((prev) => [newCommand, ...prev]);

    // Simulate AI processing
    setTimeout(() => {
      setVoiceCommands((prev) =>
        prev.map((cmd) =>
          cmd.id === newCommand.id ? { ...cmd, processed: true } : cmd
        )
      );
    }, 2000);
  };

  

  return (
<div
  className="min-h-screen 
             backdrop-blur-xl 
              
             "
>      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="text-center mb-12 p-4">
          {" "}
          
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-12 h-12 text-pink-500 mr-4" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              AI Travel Planner
            </h1>
          </div>
          <p className="text-base text-gray-700 max-w-3xl mx-auto">
            Experience the future of travel planning with our advanced
            AI-powered system. Get personalized recommendations, intelligent
            itineraries, and predictive insights.
          </p>
        </div>

        

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className={` shadow-xl rounded-xl p-6 border border-pink-500/30 ${isDarkMode ? "bg-white/10":"bg-white/90"}`}>
              <h3 className="flex gap-2 text-2xl font-semibold mb-4 items-center text-gray-900 justify-start">
                <Settings className="w-7 h-7 text-pink-400 font-bold" />
                Travel Preferences
              </h3>

              <div className="space-y-4">
                {/* Destination Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={userPreferences.destination}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        destination: e.target.value,
                      })
                    }
                    placeholder="Where do you want to go?"
                    className={`w-full px-4 py-2 border ${isDarkMode ? "border-white/20 placeholder:text-gray-400":"border-black/20 placeholder: text-gray-600"}  rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400`}
                  />
                </div>

                {/* Duration Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={userPreferences.duration}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        duration: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="30"
                    className={`w-full px-4 py-2 border ${isDarkMode ? "border-white/20 placeholder:text-gray-400":"border-black/20 placeholder: text-gray-600"}  rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400`}
                  />
                </div>

                {/* Budget Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={userPreferences.budget}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        budget: parseInt(e.target.value),
                      })
                    }
                    min="100"
                    className={`w-full px-4 py-2 border ${isDarkMode ? "border-white/20 placeholder:text-gray-400":"border-black/20 placeholder: text-gray-600"}  rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400`}
                  />
                </div>

                {/* Interests Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "culture",
                      "food",
                      "nature",
                      "adventure",
                      "shopping",
                      "relaxation",
                    ].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => {
                          const newInterests =
                            userPreferences.interests.includes(interest)
                              ? userPreferences.interests.filter(
                                  (i) => i !== interest
                                )
                              : [...userPreferences.interests, interest];
                          setUserPreferences({
                            ...userPreferences,
                            interests: newInterests,
                          });
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                          userPreferences.interests.includes(interest)
                            ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow"
                            : isDarkMode ? "bg-white/10 text-gray-900 hover:bg-white/20" :"bg-black/10 text-gray-900 hover:bg-black/20"
                        }`}
                      >
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => console.log("Generate AI Plan")}
                  className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 justify-center shadow-md cursor-pointer"
                >
                  <Brain className="w-7 h-7" />
                  Generate AI Travel Plan
                </button>
              </div>
            </div>

            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <div className={`shadow-lg rounded-xl p-6 border border-pink-500/30 ${isDarkMode ? "bg-white/10":"bg-white/90"}`}>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-pink-500 justify-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-700"
                    >
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center + Right Panels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Default Empty State */}
            {!aiPlan && !isGenerating && (
              <div className={`rounded-xl p-12 border border-pink-500/30  shadow-md text-center ${isDarkMode ? "bg-white/10":"bg-white/90 "}`}>
                <Brain className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Ready to Plan Your Adventure?
                </h3>
                <p className="text-gray-700">
                  Fill in your travel preferences and let our AI create a
                  personalized travel plan for you.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Collaboration Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setCollaborationMode(!collaborationMode)}
            className={`px-6 py-3 rounded-lg font-medium transition-all shadow-lg cursor-pointer ${
              collaborationMode
                ? "bg-gradient-to-r from-pink-500 to-blue-500 text-white"
                : "bg-gray-200  hover:bg-pink-200 text-black"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            {collaborationMode
              ? "Collaboration Mode Active"
              : "Enable Collaboration Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITravelPlannerComponent;
