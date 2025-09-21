import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Cloud,
  Sun,
  CloudRain,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Calendar,
  MapPin,
  Zap,
  Target,
  Activity,
  Thermometer,
  Wind,
  Eye
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const PredictiveAnalytics = ({
  destination,
  travelDates,
  interests,
  budget
}) => {
  const [analytics, setAnalytics] = useState({
    crowdPredictions: [],
    priceForecasts: [],
    weatherAnalysis: [],
    riskAssessment: [],
    optimizationTips: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('crowds');
  const [aiInsights, setAiInsights] = useState([]);
  const {isDarkMode}=useTheme();
  // Generate predictive analytics
  const generateAnalytics = useCallback(async () => {
    setIsLoading(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newAnalytics = {
      crowdPredictions: generateCrowdPredictions(),
      priceForecasts: generatePriceForecasts(),
      weatherAnalysis: generateWeatherAnalysis(),
      riskAssessment: generateRiskAssessment(),
      optimizationTips: generateOptimizationTips()
    };

    setAnalytics(newAnalytics);
    setIsLoading(false);

    // Generate AI insights
    generateAIInsights(newAnalytics);
  }, [destination, travelDates, interests, budget]);

  // Generate crowd predictions
  const generateCrowdPredictions = () => {
    const predictions = [];
    const baseDate = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      // Simulate crowd patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = Math.random() < 0.1; // 10% chance of holiday

      let crowdLevel, crowdScore, recommendation;

      if (isHoliday) {
        crowdLevel = 'Very High';
        crowdScore = 90 + Math.random() * 10;
        recommendation = 'Avoid if possible, consider alternative dates';
      } else if (isWeekend) {
        crowdLevel = 'High';
        crowdScore = 70 + Math.random() * 20;
        recommendation = 'Expect crowds, plan accordingly';
      } else {
        crowdLevel = 'Medium';
        crowdScore = 40 + Math.random() * 30;
        recommendation = 'Good time to visit popular attractions';
      }

      predictions.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        crowdLevel,
        crowdScore: Math.round(crowdScore),
        recommendation,
        factors: isHoliday ? ['Holiday', 'Weekend'] : isWeekend ? ['Weekend'] : ['Weekday'],
        bestTime: isWeekend ? 'Early Morning' : 'Mid-Morning',
        alternativeDate: isHoliday ? new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
      });
    }

    return predictions;
  };

  // Generate price forecasts
  const generatePriceForecasts = () => {
    const forecasts = [];
    const baseDate = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      // Simulate price trends
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPeakSeason = Math.random() < 0.3; // 30% chance of peak season

      let priceTrend, priceChange, recommendation;

      if (isPeakSeason) {
        priceTrend = 'Rising';
        priceChange = 15 + Math.random() * 25;
        recommendation = 'Book now before prices increase further';
      } else if (isWeekend) {
        priceTrend = 'Stable';
        priceChange = -5 + Math.random() * 10;
        recommendation = 'Prices are stable, good time to book';
      } else {
        priceTrend = 'Falling';
        priceChange = -10 + Math.random() * 15;
        recommendation = 'Prices are decreasing, consider waiting';
      }

      forecasts.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        priceTrend,
        priceChange: Math.round(priceChange),
        recommendation,
        confidence: 75 + Math.random() * 20,
        factors: isPeakSeason ? ['Peak Season', 'High Demand'] : isWeekend ? ['Weekend'] : ['Off-Peak'],
        bestBookingTime: isPeakSeason ? 'Immediate' : isWeekend ? 'Within 1 week' : 'Within 2 weeks'
      });
    }

    return forecasts;
  };

  // Generate weather analysis
  const generateWeatherAnalysis = () => {
    const analysis = [];
    const baseDate = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      // Simulate weather patterns
      const month = date.getMonth();
      const isSummer = month >= 5 && month <= 8;
      const isWinter = month <= 2 || month === 11;

      let weather, temperature, impact, recommendation;

      if (isSummer) {
        weather = 'Sunny';
        temperature = 25 + Math.random() * 15;
        impact = 'Positive';
        recommendation = 'Perfect weather for outdoor activities';
      } else if (isWinter) {
        weather = Math.random() > 0.7 ? 'Snowy' : 'Cold';
        temperature = -5 + Math.random() * 15;
        impact = 'Mixed';
        recommendation = 'Dress warmly, some activities may be limited';
      } else {
        weather = Math.random() > 0.6 ? 'Rainy' : 'Partly Cloudy';
        temperature = 10 + Math.random() * 20;
        impact = 'Neutral';
        recommendation = 'Check weather updates, have backup plans';
      }

      analysis.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        weather,
        temperature: Math.round(temperature),
        impact,
        recommendation,
        activities: getWeatherBasedActivities(weather, temperature),
        backupPlan: getBackupPlan(weather, interests),
        riskLevel: getWeatherRiskLevel(weather, temperature)
      });
    }

    return analysis;
  };

  // Generate risk assessment
  const generateRiskAssessment = () => {
    return [
      {
        id: 1,
        risk: 'High Crowds',
        probability: 'High',
        impact: 'Medium',
        description: 'Popular attractions will be very crowded during your visit',
        mitigation: 'Visit early morning or late evening, book skip-the-line tickets',
        riskScore: 75
      },
      {
        id: 2,
        risk: 'Weather Disruption',
        probability: 'Medium',
        impact: 'High',
        description: 'Unpredictable weather may affect outdoor activities',
        mitigation: 'Have indoor backup plans, check weather forecasts daily',
        riskScore: 60
      },
      {
        id: 3,
        risk: 'Price Increases',
        probability: 'Medium',
        impact: 'Medium',
        description: 'Accommodation and activity prices may rise closer to travel dates',
        mitigation: 'Book accommodations and major activities in advance',
        riskScore: 55
      },
      {
        id: 4,
        risk: 'Transportation Delays',
        probability: 'Low',
        impact: 'Medium',
        description: 'Public transport may have delays during peak hours',
        mitigation: 'Allow extra time, consider alternative routes',
        riskScore: 40
      }
    ];
  };

  // Generate optimization tips
  const generateOptimizationTips = () => {
    return [
      {
        id: 1,
        category: 'Timing',
        tip: 'Visit popular attractions between 8-10 AM to avoid crowds',
        impact: 'High',
        effort: 'Low',
        savings: 'Time: 2-3 hours, Money: $20-50',
        implementation: 'Adjust your daily schedule to start early'
      },
      {
        id: 2,
        category: 'Booking',
        tip: 'Book accommodations 3-4 weeks in advance for best rates',
        impact: 'High',
        effort: 'Low',
        savings: 'Money: 15-25%',
        implementation: 'Set booking reminders and monitor prices'
      },
      {
        id: 3,
        category: 'Transportation',
        tip: 'Use public transport during off-peak hours (10 AM - 3 PM)',
        impact: 'Medium',
        effort: 'Low',
        savings: 'Money: 30-40%, Time: Variable',
        implementation: 'Plan activities around transport schedules'
      },
      {
        id: 4,
        category: 'Activities',
        tip: 'Combine nearby attractions to reduce travel time and costs',
        impact: 'Medium',
        effort: 'Medium',
        savings: 'Time: 1-2 hours, Money: $10-30',
        implementation: 'Use map planning tools to optimize routes'
      }
    ];
  };

  // Helper functions
  const getWeatherBasedActivities = (weather, temperature) => {
    if (weather === 'Sunny' && temperature > 20) {
      return ['Outdoor dining', 'Walking tours', 'Parks and gardens'];
    } else if (weather === 'Rainy') {
      return ['Museums', 'Indoor markets', 'Cafes and restaurants'];
    } else if (weather === 'Snowy' || temperature < 5) {
      return ['Indoor activities', 'Hot springs', 'Cultural centers'];
    } else {
      return ['Mixed indoor/outdoor', 'Flexible planning recommended'];
    }
  };

  const getBackupPlan = (weather, interests) => {
    if (weather === 'Rainy' && interests.includes('nature')) {
      return 'Visit indoor botanical gardens or nature museums';
    } else if (weather === 'Snowy' && interests.includes('adventure')) {
      return 'Indoor adventure parks or sports facilities';
    } else {
      return 'Have 2-3 indoor alternatives for each outdoor activity';
    }
  };

  const getWeatherRiskLevel = (weather, temperature) => {
    if (weather === 'Snowy' || temperature < -10) {
      return 'High';
    } else if (weather === 'Rainy' || temperature > 35) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  // Generate AI insights
  const generateAIInsights = (analytics) => {
    const insights = [
      {
        id: 1,
        message: `Based on crowd predictions, your best visiting days are ${analytics.crowdPredictions.filter(p => p.crowdScore < 50).slice(0, 3).map(p => p.dayName).join(', ')}`,
        type: 'timing',
        icon: '⏰',
        priority: 'high'
      },
      {
        id: 2,
        message: `Price forecasts show ${analytics.priceForecasts.filter(p => p.priceTrend === 'Falling').length} days with decreasing prices - consider flexible booking`,
        type: 'cost',
        icon: '💰',
        priority: 'medium'
      },
      {
        id: 3,
        message: `Weather analysis indicates ${analytics.weatherAnalysis.filter(w => w.impact === 'Positive').length} days with favorable conditions for your interests`,
        type: 'weather',
        icon: '🌤️',
        priority: 'medium'
      }
    ];

    setAiInsights(insights);
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Rising':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'Falling':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  // Get weather icon
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Sunny':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'Rainy':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Snowy':
        return <Cloud className="w-5 h-5 text-gray-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get risk level color
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  useEffect(() => {
    if (destination && travelDates) {
      generateAnalytics();
    }
  }, [destination, travelDates, interests, budget, generateAnalytics]);

  const timeframes = [
    { value: 'week', label: '1 Week', days: 7 },
    { value: 'fortnight', label: '2 Weeks', days: 14 },
    { value: 'month', label: '1 Month', days: 30 }
  ];

  const metrics = [
    { value: 'crowds', label: 'Crowd Predictions', icon: Users },
    { value: 'prices', label: 'Price Forecasts', icon: DollarSign },
    { value: 'weather', label: 'Weather Analysis', icon: Cloud },
    { value: 'risks', label: 'Risk Assessment', icon: AlertTriangle },
    { value: 'tips', label: 'Optimization Tips', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className={`backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 ${isDarkMode ? "bg-white/10 ":"bg-white/90"} backdrop-blur-sm rounded-xl p-6 border border-green-700`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold flex items-center text-pink-400">
              <Zap className="w-5 h-5 mr-2" />
              AI Predictive Analytics
            </h3>
            <p className="text-sm text-gray-900 mt-1">
              Advanced predictions for crowds, prices, weather, and travel optimization
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-400">95%</div>
            <div className="text-sm text-gray-900">Prediction Accuracy</div>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-3 rounded-lg  border border-pink-500/30 ${isDarkMode ? " bg-white/10":" bg-gradient-to-r from-pink-100 via-gray-200 to-blue-100 border-pink-500"}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{insight.icon}</span>
                  <span className={`text-xs font-medium text-green-500 uppercase ${insight.priority === 'high' ? 'text-red-500' :
                      insight.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                    {insight.priority} priority
                  </span>
                </div>
                <p className="text-xs text-gray-900">{insight.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/10":" bg-white/90"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-pink-400 mb-2">Timeframe</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 bg-gray-200 border border-gray-600 rounded-lg text-sm transition-all focus:ring-1 focus:ring-green-500 focus:outline-none"
              >
                {timeframes.map((tf) => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-400 mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm transition-all focus:ring-1 focus:ring-green-500 focus:outline-none"
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>{metric.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateAnalytics}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors flex items-center text-white font-medium cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Refresh Analytics
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 backdrop-blur-sm rounded-xl border border-pink-500/30">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-900">AI is analyzing patterns and generating predictions...</p>
        </div>
      )}

      {/* Analytics Display */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Crowd Predictions */}
          {selectedMetric === 'crowds' && (
            <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-white/90"}`}>
              <h4 className="text-lg font-semibold mb-4 flex items-center text-pink-400">
                <Users className="w-5 h-5 mr-2" />
                Crowd Predictions (Next {timeframes.find(tf => tf.value === selectedTimeframe)?.days} Days)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.crowdPredictions.slice(0, timeframes.find(tf => tf.value === selectedTimeframe)?.days).map((prediction, index) => (
                  <div key={index} className={`rounded-lg backdrop-blur-md p-4 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-gradient-to-br from-pink-100 to-blue-100 "}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-blue-400">{prediction.dayName}</div>
                        <div className="text-sm text-gray-900">{prediction.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-medium ${prediction.crowdScore > 80 ? 'text-red-400' :
                            prediction.crowdScore > 60 ? 'text-yellow-400' :
                              'text-green-400'
                          }`}>
                          {prediction.crowdScore}%
                        </div>
                        <div className="text-xs text-gray-900">Crowd Level</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Level:</span>
                        <span className={`font-medium ${prediction.crowdLevel === 'Very High' ? 'text-red-400' :
                            prediction.crowdLevel === 'High' ? 'text-yellow-400' :
                              'text-green-400'
                          }`}>
                          {prediction.crowdLevel}
                        </span>
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1 text-gray-700">Recommendation:</div>
                        {prediction.recommendation}
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1 text-gray-700">Best Time:</div>
                        {prediction.bestTime}
                      </div>

                      {prediction.alternativeDate && (
                        <div className="text-xs text-pink-500">
                          <div className="mb-1">Alternative:</div>
                          Consider {new Date(prediction.alternativeDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Forecasts */}
          {selectedMetric === 'prices' && (
            <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-white/90 "}`}>
              <h4 className="text-md font-medium mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                Price Forecasts (Next {timeframes.find(tf => tf.value === selectedTimeframe)?.days} Days)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.priceForecasts.slice(0, timeframes.find(tf => tf.value === selectedTimeframe)?.days).map((forecast, index) => (
                  <div key={index} className={`rounded-lg backdrop-blur-md p-4 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-gradient-to-br from-pink-100 to-blue-100 "}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-blue-400">{forecast.dayName}</div>
                        <div className="text-sm text-gray-900">{forecast.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(forecast.priceTrend)}
                          <span className={`text-lg font-medium ${forecast.priceChange > 0 ? 'text-red-400' :
                              forecast.priceChange < 0 ? 'text-green-400' :
                                'text-yellow-400'
                            }`}>
                            {forecast.priceChange > 0 ? '+' : ''}{forecast.priceChange}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-900">Price Change</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Trend:</span>
                        <span className="font-medium text-gray-900">{forecast.priceTrend}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Confidence:</span>
                        <span className=" text-pink-400">{forecast.confidence}%</span>
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1">Recommendation:</div>
                        {forecast.recommendation}
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1">Best Booking Time:</div>
                        {forecast.bestBookingTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weather Analysis */}
          {selectedMetric === 'weather' && (
            <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-white/90 "}`}>
              <h4 className="text-md font-medium mb-4 flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-400" />
                Weather Analysis (Next {timeframes.find(tf => tf.value === selectedTimeframe)?.days} Days)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.weatherAnalysis.slice(0, timeframes.find(tf => tf.value === selectedTimeframe)?.days).map((weather, index) => (
                  <div key={index} className={`rounded-lg backdrop-blur-md p-4 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-gradient-to-br from-pink-100 to-blue-100 "}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-blue-400">{weather.dayName}</div>
                        <div className="text-sm text-gray-900">{weather.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {getWeatherIcon(weather.weather)}
                          <div>
                            <div className="text-lg font-bold text-gray-900">{weather.temperature}°C</div>
                            <div className="text-xs text-gray-700">Temperature</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Weather:</span>
                        <span className="font-medium text-gray-700">{weather.weather}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Impact:</span>
                        <span className={`font-medium ${weather.impact === 'Positive' ? 'text-green-400' :
                            weather.impact === 'Negative' ? 'text-red-400' :
                              'text-yellow-400'
                          }`}>
                          {weather.impact}
                        </span>
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1">Activities:</div>
                        {weather.activities.join(', ')}
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1">Backup Plan:</div>
                        {weather.backupPlan}
                      </div>

                      <div className="text-xs text-gray-900">
                        <div className="font-medium mb-1">Risk Level:</div>
                        <span className={getRiskLevelColor(weather.riskLevel)}>{weather.riskLevel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {selectedMetric === 'risks' && (
            <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-white/90 "}`}>
              <h4 className="text-md font-medium mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Risk Assessment & Mitigation
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.riskAssessment.map((risk) => (
                  <div key={risk.id} className={`rounded-lg backdrop-blur-md p-4 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-gradient-to-br from-pink-100 to-blue-100 "}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{risk.risk}</h5>
                      <div className="text-right">
                        <div className={`text-md font-medium ${risk.riskScore > 70 ? 'text-red-400' :
                            risk.riskScore > 50 ? 'text-yellow-400' :
                              'text-green-400'
                          }`}>
                          {risk.riskScore}%
                        </div>
                        <div className="text-xs text-gray-900">Risk Score</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-gray-700">{risk.description}</div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-900">Probability:</span>
                          <span className={`ml-2 font-medium ${risk.probability === 'High' ? 'text-red-400' :
                              risk.probability === 'Medium' ? 'text-yellow-400' :
                                'text-green-400'
                            }`}>
                            {risk.probability}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-900">Impact:</span>
                          <span className={`ml-2 font-medium ${risk.impact === 'High' ? 'text-red-400' :
                              risk.impact === 'Medium' ? 'text-yellow-400' :
                                'text-green-400'
                            }`}>
                            {risk.impact}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs">
                        <div className="text-gray-900 font-medium mb-1">Mitigation Strategy:</div>
                        <div className="text-gray-900">{risk.mitigation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimization Tips */}
          {selectedMetric === 'tips' && (
            <div className={`rounded-xl backdrop-blur-md p-6 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-white/90 "}`}>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                AI Optimization Tips
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.optimizationTips.map((tip) => (
                  <div key={tip.id} className={`rounded-lg backdrop-blur-md p-4 border border-pink-500/30 ${isDarkMode ? " bg-white/5":" bg-gradient-to-br from-pink-100 to-blue-100 "}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-medium text-pink-400">{tip.tip}</h5>
                      <div className="text-right">
                        <div className={`text-md font-medium ${tip.impact === 'High' ? 'text-green-400' :
                            tip.impact === 'Medium' ? 'text-yellow-400' :
                              'text-blue-400'
                          }`}>
                          {tip.impact}
                        </div>
                        <div className="text-xs text-gray-900">Impact</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-900">Effort:</span>
                          <span className={`ml-2 font-medium ${tip.effort === 'Low' ? 'text-green-400' :
                              tip.effort === 'Medium' ? 'text-yellow-400' :
                                'text-red-400'
                            }`}>
                            {tip.effort}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-900">Category:</span>
                          <span className="ml-2 font-medium text-blue-400">{tip.category}</span>
                        </div>
                      </div>

                      <div className="text-xs">
                        <div className="text-gray-900 font-medium mb-1">Potential Savings:</div>
                        <div className="text-green-400">{tip.savings}</div>
                      </div>

                      <div className="text-xs">
                        <div className="text-gray-900 font-medium mb-1">Implementation:</div>
                        <div className="text-gray-900">{tip.implementation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalytics;
