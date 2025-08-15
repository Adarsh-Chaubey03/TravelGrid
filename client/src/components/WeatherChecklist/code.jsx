import React, { useState, useEffect } from 'react';
import { FaSearch, FaMoon, FaSun, FaTimes, FaExclamationTriangle, FaSnowflake, FaTemperatureLow, FaJacket, FaTshirt, FaUmbrella, FaSnowman, FaSunglasses, FaWind, FaExchangeAlt, FaCrown } from 'react-icons/fa';

const WeatherWiseTravelPlanner = () => {
  // API Configuration
  const API_KEY = 'L07m9jF6VoWuObvhR3FAbMpWomtzqoiG'; // Replace with your Tomorrow.io key
  const BASE_URL = 'https://api.tomorrow.io/v4';

  // State management
  const [currentUnit, setCurrentUnit] = useState('metric');
  const [currentLocation, setCurrentLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showSelectedDay, setShowSelectedDay] = useState(false);

  // Refs
  const locationInputRef = React.useRef(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setIsDarkMode(savedTheme === 'dark');
    updateTheme(savedTheme === 'dark');
    
    // Initialize with default location
    fetchWeatherData('London');
  }, []);

  // Theme management
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    updateTheme(newDarkMode);
  };

  const updateTheme = (darkMode) => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  };

  // Fetch weather data
  const fetchWeatherData = async (location) => {
    const loc = location || locationInput;
    if (!loc) return;

    setCurrentLocation(loc);
    setLoading(true);
    setWeatherDisplay(false);
    setError(null);
    setShowSelectedDay(false);

    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `${BASE_URL}/weather/realtime?location=${loc}&units=${currentUnit}&apikey=${API_KEY}`
      );
      if (!currentResponse.ok) {
        const errorData = await currentResponse.json();
        throw new Error(errorData.message || 'Location not found');
      }
      const currentData = await currentResponse.json();
      setWeatherData(currentData);

      // Fetch daily forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/weather/forecast?location=${loc}&timesteps=1d&units=${currentUnit}&apikey=${API_KEY}`
      );
      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Forecast data not available');
      }
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);

      // Fetch hourly data
      const hourlyResponse = await fetch(
        `${BASE_URL}/weather/forecast?location=${loc}&timesteps=1h&units=${currentUnit}&apikey=${API_KEY}`
      );
      if (!hourlyResponse.ok) {
        const errorData = await hourlyResponse.json();
        throw new Error(errorData.message || 'Hourly data not available');
      }
      const hourlyData = await hourlyResponse.json();
      setHourlyData(hourlyData);

      setWeatherDisplay(true);
    } catch (err) {
      console.error('Tomorrow.io API Error:', err);
      setError(err.message || 'Error loading weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatDate = (date, short = false) => {
    if (!date) return '--';
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    if (short) {
      options.weekday = 'short';
      options.month = 'short';
    }
    
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatDay = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString(undefined, { weekday: 'long' });
  };

  const formatTime = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Unknown',
      1000: 'Clear',
      1001: 'Cloudy',
      1100: 'Mostly Clear',
      1101: 'Partly Cloudy',
      1102: 'Mostly Cloudy',
      2000: 'Fog',
      2100: 'Light Fog',
      3000: 'Light Wind',
      3001: 'Wind',
      3002: 'Strong Wind',
      4000: 'Drizzle',
      4001: 'Rain',
      4100: 'Light Rain',
      4101: 'Heavy Rain',
      5000: 'Snow',
      5001: 'Flurries',
      5100: 'Light Snow',
      5101: 'Heavy Snow',
      6000: 'Freezing Drizzle',
      6001: 'Freezing Rain',
      6200: 'Light Freezing Rain',
      6201: 'Heavy Freezing Rain',
      7000: 'Ice Pellets',
      7101: 'Heavy Ice Pellets',
      7102: 'Light Ice Pellets',
      8000: 'Thunderstorm'
    };
    return weatherCodes[code] || 'Unknown';
  };

  const getWeatherIcon = (code) => {
    const iconMap = {
      0: 'unknown',
      1000: 'clear-day',
      1001: 'cloudy',
      1100: 'partly-cloudy-day',
      1101: 'partly-cloudy-day',
      1102: 'cloudy',
      2000: 'fog',
      2100: 'fog',
      3000: 'wind',
      3001: 'wind',
      3002: 'wind',
      4000: 'rain',
      4001: 'rain',
      4100: 'rain',
      4101: 'rain',
      5000: 'snow',
      5001: 'snow',
      5100: 'snow',
      5101: 'snow',
      6000: 'sleet',
      6001: 'sleet',
      6200: 'sleet',
      6201: 'sleet',
      7000: 'sleet',
      7101: 'sleet',
      7102: 'sleet',
      8000: 'thunderstorm'
    };
    return `https://cdn.jsdelivr.net/gh/tomorrow-io/tomorrow-weather-icons@1.1.1/icons/${iconMap[code]}.svg`;
  };

  // UI rendering functions
  const renderCurrentWeather = () => {
    if (!weatherData) return null;

    const wind = currentUnit === 'metric' ? 
      `${Math.round(weatherData.data.values.windSpeed)} km/h` : 
      `${Math.round(weatherData.data.values.windSpeed * 0.621371)} mph`;

    const feels = Math.round(weatherData.data.values.temperatureApparent);

    return (
      <div className="current-weather bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md animate-fade-in delay-100">
        <div className="flex flex-wrap justify-between gap-6">
          <div className="location-info flex-1 min-w-[250px]">
            <h2 id="location-name" className="text-3xl font-bold text-primary dark:text-accent mb-1">
              {`${weatherData.location.name || 'Unknown'}, ${weatherData.location.country || 'Unknown'}`}
            </h2>
            <p id="current-date" className="text-gray-600 dark:text-gray-400 mb-4">
              {formatDate(new Date())}
            </p>
            
            <div className="weather-main flex items-center mb-4">
              <img 
                id="current-icon" 
                className="weather-icon w-24 h-24 mr-5" 
                src={getWeatherIcon(weatherData.data.values.weatherCode)} 
                alt={getWeatherDescription(weatherData.data.values.weatherCode)} 
              />
              <div>
                <div id="current-temp" className="text-5xl font-bold">
                  {`${Math.round(weatherData.data.values.temperature)}°${currentUnit === 'metric' ? 'C' : 'F'}`}
                </div>
                <div id="weather-desc" className="text-xl text-secondary dark:text-pink-300 capitalize">
                  {getWeatherDescription(weatherData.data.values.weatherCode)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="weather-details flex-1 min-w-[250px] grid grid-cols-2 gap-4">
            <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="detail-label text-sm text-secondary dark:text-gray-400">Humidity</div>
              <div id="humidity" className="detail-value text-xl font-bold">
                {`${weatherData.data.values.humidity}%`}
              </div>
            </div>
            <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="detail-label text-sm text-secondary dark:text-gray-400">Wind Speed</div>
              <div id="wind-speed" className="detail-value text-xl font-bold">
                {wind}
              </div>
            </div>
            <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="detail-label text-sm text-secondary dark:text-gray-400">Feels Like</div>
              <div id="feels-like" className="detail-value text-xl font-bold">
                {`${feels}°${currentUnit === 'metric' ? 'C' : 'F'}`}
              </div>
            </div>
            <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="detail-label text-sm text-secondary dark:text-gray-400">UV Index</div>
              <div id="uv-index" className="detail-value text-xl font-bold">
                {weatherData.data.values.uvIndex}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyForecast = () => {
    if (!forecastData) return null;

    return (
      <div className="forecast-section mb-8 animate-fade-in delay-200">
        <h3 className="section-title text-2xl font-semibold text-primary dark:text-accent mb-4 pb-2 border-b-2 border-accent">
          7-Day Forecast
        </h3>
        <div id="weekly-forecast" className="forecast-container flex overflow-x-auto gap-4 py-2 custom-scroll">
          {forecastData.timelines.daily.slice(1, 8).map((dayData, index) => {
            const date = new Date(dayData.time);
            const maxTemp = Math.round(dayData.values.temperatureMax);
            const minTemp = Math.round(dayData.values.temperatureMin);
            const weatherCode = dayData.values.weatherCode;
            
            return (
              <div 
                key={dayData.time}
                className="forecast-card bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md text-center cursor-pointer relative"
                onClick={() => {
                  setSelectedDayData(dayData);
                  setShowSelectedDay(true);
                  setShowDetailedView(true);
                }}
              >
                <div className="forecast-day font-bold text-secondary dark:text-pink-300 mb-2">
                  {formatDay(date)}
                </div>
                <div className="forecast-date text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {formatDate(date, true)}
                </div>
                <img 
                  className="forecast-icon w-12 h-12 mx-auto mb-3" 
                  src={getWeatherIcon(weatherCode)} 
                  alt={getWeatherDescription(weatherCode)} 
                />
                <div className="forecast-temp flex justify-center gap-3">
                  <span className="temp-max font-bold text-danger dark:text-red-400">
                    {`${maxTemp}°`}
                  </span>
                  <span className="temp-min text-success dark:text-green-400">
                    {`${minTemp}°`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBestTimes = () => {
    if (!showSelectedDay || !selectedDayData || !hourlyData) return null;

    const selectedDate = new Date(selectedDayData.time).toDateString();
    const dayHours = hourlyData.timelines.hourly.filter(hour => 
      new Date(hour.time).toDateString() === selectedDate
    );

    const bestTimes = findBestTimes(dayHours);

    return (
      <div id="selected-day-details" className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
        <h3 className="section-title text-2xl font-semibold text-primary dark:text-accent mb-4">
          Best Times to Travel
        </h3>
        <div id="best-times-container" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestTimes.map((timeSlot, index) => {
            const time = new Date(timeSlot.time);
            const temp = Math.round(timeSlot.values.temperature);
            const weatherDesc = getWeatherDescription(timeSlot.values.weatherCode);
            
            return (
              <div key={timeSlot.time} className="best-time-card bg-pink-50 dark:bg-gray-700 rounded-lg p-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-primary dark:text-accent">
                    {formatTime(time)}
                  </div>
                  <div className="text-xl font-bold">
                    {`${temp}°${currentUnit === 'metric' ? 'C' : 'F'}`}
                  </div>
                </div>
                <div className="flex items-center">
                  <img 
                    className="w-10 h-10 mr-2" 
                    src={getWeatherIcon(timeSlot.values.weatherCode)} 
                    alt={weatherDesc} 
                  />
                  <div className="text-gray-700 dark:text-gray-300">
                    {weatherDesc}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-secondary dark:text-gray-400">Wind:</span> 
                    <span>{`${Math.round(timeSlot.values.windSpeed)} ${currentUnit === 'metric' ? 'km/h' : 'mph'}`}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-secondary dark:text-gray-400">Rain:</span> 
                    <span>{`${Math.round(timeSlot.values.precipitationProbability * 100)}%`}</span>
                  </div>
                </div>
                {index === 0 && (
                  <div className="best-time-badge">
                    <FaCrown />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!showDetailedView || !selectedDayData || !hourlyData) return null;

    const selectedDate = new Date(selectedDayData.time).toDateString();
    const vis = currentUnit === 'metric' ? 
      `${Math.round(selectedDayData.values.visibility / 1000)} km` : 
      `${Math.round(selectedDayData.values.visibility / 1609)} miles`;

    return (
      <div id="detailed-view" className="detailed-view bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
        <div className="detailed-header flex justify-between items-center mb-6">
          <div>
            <div id="detailed-day" className="text-2xl font-bold text-primary dark:text-accent">
              {formatDay(new Date(selectedDayData.time))}
            </div>
            <div id="detailed-date" className="text-gray-600 dark:text-gray-400">
              {formatDate(new Date(selectedDayData.time))}
            </div>
          </div>
          <button 
            id="close-detail" 
            className="close-detail bg-transparent border-none text-2xl cursor-pointer text-danger dark:text-red-400"
            onClick={() => setShowDetailedView(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        <div id="hourly-forecast" className="hourly-forecast flex overflow-x-auto gap-4 mb-6 py-2 custom-scroll">
          {hourlyData.timelines.hourly.filter(hour => 
            new Date(hour.time).toDateString() === selectedDate
          ).map(hour => (
            <div key={hour.time} className="hourly-card bg-pink-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <div className="hourly-time font-medium mb-1">
                {formatTime(new Date(hour.time))}
              </div>
              <img 
                className="hourly-icon w-10 h-10 mx-auto mb-1" 
                src={getWeatherIcon(hour.values.weatherCode)} 
                alt={getWeatherDescription(hour.values.weatherCode)} 
              />
              <div className="hourly-temp font-bold">
                {`${Math.round(hour.values.temperature)}°`}
              </div>
              <div className="hourly-desc text-xs text-gray-600 dark:text-gray-300">
                {getWeatherDescription(hour.values.weatherCode)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="weather-details grid grid-cols-2 gap-4">
          <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="detail-label text-sm text-secondary dark:text-gray-400">Sunrise</div>
            <div id="sunrise" className="detail-value text-xl font-bold">
              {formatTime(new Date(selectedDayData.values.sunriseTime))}
            </div>
          </div>
          <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="detail-label text-sm text-secondary dark:text-gray-400">Sunset</div>
            <div id="sunset" className="detail-value text-xl font-bold">
              {formatTime(new Date(selectedDayData.values.sunsetTime))}
            </div>
          </div>
          <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="detail-label text-sm text-secondary dark:text-gray-400">Precipitation</div>
            <div id="precipitation" className="detail-value text-xl font-bold">
              {`${Math.round(selectedDayData.values.precipitationProbability * 100)}%`}
            </div>
          </div>
          <div className="detail-item bg-pink-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="detail-label text-sm text-secondary dark:text-gray-400">Visibility</div>
            <div id="visibility" className="detail-value text-xl font-bold">
              {vis}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!weatherData || !forecastData) return null;

    const recommendations = [];
    const currentTemp = weatherData.data.values.temperature;
    const weatherCode = weatherData.data.values.weatherCode;
    const windSpeed = weatherData.data.values.windSpeed;

    // Temperature-based recommendations
    if (currentUnit === 'metric') {
      if (currentTemp < 0) {
        recommendations.push({
          icon: <FaSnowflake />,
          text: 'Extremely cold! Pack heavy winter clothing including thermal layers, gloves, and a warm hat.'
        });
      } else if (currentTemp < 10) {
        recommendations.push({
          icon: <FaTemperatureLow />,
          text: 'Chilly weather. Bring a warm coat, scarf, and gloves.'
        });
      } else if (currentTemp < 20) {
        recommendations.push({
          icon: <FaJacket />,
          text: 'Mild temperatures. Pack light jackets or sweaters for cooler evenings.'
        });
      } else if (currentTemp < 30) {
        recommendations.push({
          icon: <FaTshirt />,
          text: 'Pleasant weather. Light clothing is recommended, with a jacket for evenings.'
        });
      } else {
        recommendations.push({
          icon: <FaSun />,
          text: 'Hot weather. Wear light, breathable clothing and stay hydrated.'
        });
      }
    } else {
      // Fahrenheit recommendations
      if (currentTemp < 32) {
        recommendations.push({
          icon: <FaSnowflake />,
          text: 'Freezing temperatures! Pack heavy winter clothing including thermal layers, gloves, and a warm hat.'
        });
      } else if (currentTemp < 50) {
        recommendations.push({
          icon: <FaTemperatureLow />,
          text: 'Chilly weather. Bring a warm coat, scarf, and gloves.'
        });
      } else if (currentTemp < 68) {
        recommendations.push({
          icon: <FaJacket />,
          text: 'Mild temperatures. Pack light jackets or sweaters for cooler evenings.'
        });
      } else if (currentTemp < 86) {
        recommendations.push({
          icon: <FaTshirt />,
          text: 'Pleasant weather. Light clothing is recommended, with a jacket for evenings.'
        });
      } else {
        recommendations.push({
          icon: <FaSun />,
          text: 'Hot weather. Wear light, breathable clothing and stay hydrated.'
        });
      }
    }
    
    // Weather condition recommendations
    if ([4000, 4001, 4100, 4101].includes(weatherCode)) {
      recommendations.push({
        icon: <FaUmbrella />,
        text: 'Rain expected. Pack a waterproof jacket, umbrella, and waterproof shoes.'
      });
    }
    
    if ([5000, 5001, 5100, 5101].includes(weatherCode)) {
      recommendations.push({
        icon: <FaSnowman />,
        text: 'Snow expected. Wear insulated, waterproof boots and warm layers.'
      });
    }
    
    if (weatherCode === 1000) {
      recommendations.push({
        icon: <FaSunglasses />,
        text: 'Clear skies. Don\'t forget sunglasses and sunscreen!'
      });
    }
    
    if (windSpeed > 8) {
      recommendations.push({
        icon: <FaWind />,
        text: 'Windy conditions. Secure loose items and consider a windproof jacket.'
      });
    }
    
    // Check forecast for upcoming changes
    const tomorrowTemp = forecastData.timelines.daily[1].values.temperatureAvg;
    if (Math.abs(tomorrowTemp - currentTemp) > (currentUnit === 'metric' ? 8 : 15)) {
      const change = tomorrowTemp > currentTemp ? 'warmer' : 'cooler';
      recommendations.push({
        icon: <FaExchangeAlt />,
        text: `Tomorrow will be significantly ${change}. Pack accordingly.`
      });
    }

    return (
      <div className="recommendations bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md animate-fade-in delay-300">
        <h3 className="section-title text-2xl font-semibold text-primary dark:text-accent mb-6 pb-2 border-b-2 border-accent">
          Travel Recommendations
        </h3>
        <div id="recommendations-list" className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`recommendation-item flex items-center p-3 rounded-lg bg-pink-50 dark:bg-gray-700 animate-fade-in delay-${(index + 1) * 100}`}
            >
              <div className="rec-icon w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center mr-4">
                {rec.icon}
              </div>
              <div className="rec-text text-gray-700 dark:text-gray-200">
                {rec.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const findBestTimes = (hourlyData) => {
    if (!hourlyData || hourlyData.length === 0) return [];
    
    // Score each hour based on ideal conditions
    const scoredHours = hourlyData.map(hour => {
      let score = 100; // Start with perfect score
      
      // Temperature scoring (ideal between 18-24°C or 65-75°F)
      const temp = hour.values.temperature;
      if (currentUnit === 'metric') {
        if (temp < 10 || temp > 30) score -= 30;
        else if (temp < 15 || temp > 25) score -= 15;
        else if (temp >= 18 && temp <= 24) score += 20;
      } else {
        if (temp < 50 || temp > 86) score -= 30;
        else if (temp < 59 || temp > 77) score -= 15;
        else if (temp >= 65 && temp <= 75) score += 20;
      }
      
      // Precipitation scoring
      const rainProb = hour.values.precipitationProbability;
      if (rainProb > 0.5) score -= 40;
      else if (rainProb > 0.3) score -= 20;
      else if (rainProb === 0) score += 10;
      
      // Wind scoring
      const windSpeed = hour.values.windSpeed;
      if (windSpeed > 20) score -= 30; // Strong wind
      else if (windSpeed > 10) score -= 10; // Moderate wind
      else if (windSpeed < 5) score += 5; // Light wind
      
      // Visibility scoring
      const visibility = hour.values.visibility;
      if (visibility < 2000) score -= 30; // Poor visibility
      else if (visibility < 5000) score -= 10; // Moderate visibility
      else score += 5; // Good visibility
      
      // Daylight scoring (prefer daytime)
      const hourOfDay = new Date(hour.time).getHours();
      if (hourOfDay >= 6 && hourOfDay <= 18) score += 15;
      
      return {
        ...hour,
        score: score
      };
    });
    
    // Sort by score (highest first)
    scoredHours.sort((a, b) => b.score - a.score);
    
    // Return top 3 best times
    return scoredHours.slice(0, 3);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Theme Toggle */}
      <button 
        id="theme-toggle" 
        className="theme-toggle p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg"
        onClick={toggleTheme}
      >
        {isDarkMode ? (
          <FaSun className="text-yellow-300" />
        ) : (
          <FaMoon className="text-gray-800" />
        )}
      </button>

      {/* Header */}
      <header className="text-center mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md animate-fade-in">
        <h1 className="text-4xl font-bold text-primary dark:text-accent mb-2">
          WeatherWise Travel Planner
        </h1>
        <p className="text-lg text-secondary dark:text-pink-300 mb-6">
          Plan your perfect trip based on weather forecasts
        </p>
        
        <div className="flex justify-center mb-4">
          <input 
            type="text" 
            id="location-input" 
            ref={locationInputRef}
            placeholder="Enter city name..." 
            className="w-full max-w-md px-4 py-3 rounded-l-full border-2 border-primary focus:border-accent focus:outline-none dark:bg-gray-700 dark:border-pink-600 dark:text-white"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') fetchWeatherData();
            }}
          />
          <button 
            id="search-btn" 
            className="px-6 bg-primary hover:bg-secondary text-white font-medium rounded-r-full transition-colors duration-300 dark:bg-pink-600 dark:hover:bg-pink-700"
            onClick={() => fetchWeatherData()}
          >
            <FaSearch className="mr-2 inline" /> Search
          </button>
        </div>
        
        {/* Unit Toggle */}
        <div className="unit-toggle-container">
          <div className="unit-toggle" data-unit={currentUnit}>
            <div className="unit-toggle-slider"></div>
            <div 
              className={`unit-toggle-option ${currentUnit === 'metric' ? 'active' : ''}`}
              data-unit="metric"
              onClick={() => {
                setCurrentUnit('metric');
                if (weatherData) fetchWeatherData(currentLocation);
              }}
            >
              °C
            </div>
            <div 
              className={`unit-toggle-option ${currentUnit === 'imperial' ? 'active' : ''}`}
              data-unit="imperial"
              onClick={() => {
                setCurrentUnit('imperial');
                if (weatherData) fetchWeatherData(currentLocation);
              }}
            >
              °F
            </div>
          </div>
        </div>
      </header>
      
      {/* Loading State */}
      {loading && (
        <div id="loading" className="text-center py-12">
          <div className="spinner w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-secondary dark:text-gray-300">
            Fetching weather data...
          </p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div id="error-message" className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl mb-8">
          <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-3xl mb-3 mx-auto" />
          <p id="error-text" className="text-red-600 dark:text-red-300">
            {error}
          </p>
        </div>
      )}
      
      {/* Weather Display */}
      {weatherData && (
        <div id="weather-display">
          {renderCurrentWeather()}
          {renderWeeklyForecast()}
          {showSelectedDay && renderBestTimes()}
          {renderRecommendations()}
          {showDetailedView && renderDetailedView()}
        </div>
      )}
    </div>
  );
};

export default WeatherWiseTravelPlanner;