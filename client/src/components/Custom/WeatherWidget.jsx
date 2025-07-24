import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer } from 'lucide-react';

const WeatherWidget = ({ city = 'New York' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock weather data (in real implementation, you'd use a weather API)
  const mockWeatherData = {
    'New York': {
      temp: 22,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12,
      description: 'Sunny and warm'
    },
    'London': {
      temp: 15,
      condition: 'cloudy',
      humidity: 78,
      windSpeed: 8,
      description: 'Partly cloudy'
    },
    'Tokyo': {
      temp: 18,
      condition: 'rainy',
      humidity: 85,
      windSpeed: 15,
      description: 'Light rain'
    },
    'Paris': {
      temp: 20,
      condition: 'cloudy',
      humidity: 70,
      windSpeed: 10,
      description: 'Overcast'
    }
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const weatherData = mockWeatherData[city] || mockWeatherData['New York'];
      setWeather(weatherData);
      setLoading(false);
    }, 1000);
  }, [city]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snowy':
        return <Snowflake className="w-8 h-8 text-blue-300" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-2xl p-6 text-red-700">
        <p className="text-sm">Unable to load weather data</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white shadow-lg hover-lift animate-scaleIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{city}</h3>
        <div className="animate-float">
          {getWeatherIcon(weather.condition)}
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <Thermometer className="w-4 h-4" />
          <span className="text-2xl font-bold">{weather.temp}°C</span>
        </div>
      </div>
      
      <p className="text-sm text-blue-100 mb-3">{weather.description}</p>
      
      <div className="flex justify-between text-xs text-blue-100">
        <div className="flex items-center space-x-1">
          <Wind className="w-3 h-3" />
          <span>{weather.windSpeed} km/h</span>
        </div>
        <div>
          <span>Humidity: {weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
