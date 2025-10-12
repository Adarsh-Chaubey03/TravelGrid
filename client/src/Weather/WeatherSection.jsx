import React, { useState, useEffect } from "react";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const WeatherSection = ({ city }) => {
  const { isDarkMode } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states when city is cleared
    if (!city) {
      setWeatherData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    // Debounce timer to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      const fetchWeather = async () => {
        if (!isMounted) return;

        setLoading(true);
        setError(null);

        try {
          const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

          if (!apiKey) {
            throw new Error(
              "Weather API key not configured. Please add VITE_WEATHER_API_KEY to your .env file."
            );
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
              city
            )}&units=metric&appid=${apiKey}`,
            {
              signal: abortController.signal,
            }
          );

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(
                `City "${city}" not found. Please check the spelling.`
              );
            } else if (response.status === 401) {
              throw new Error(
                "Invalid API key. Please check your OpenWeatherMap API key."
              );
            } else if (response.status === 429) {
              throw new Error(
                "Rate limit exceeded. Please wait a moment and try again."
              );
            } else if (response.status === 503) {
              throw new Error(
                "Weather service temporarily unavailable. Please try again later."
              );
            } else {
              throw new Error(`Weather service error: ${response.status}`);
            }
          }

          const data = await response.json();

          // Only update state if component is still mounted
          if (!isMounted) return;
          setWeatherData(data);
        } catch (err) {
          // Handle abort error separately (when request is cancelled)
          if (err.name === "AbortError") {
            console.log("Weather fetch aborted - city changed or component unmounted");
            return;
          }

          // Handle network/timeout errors
          if (err.message === "Failed to fetch" || err.name === "TypeError") {
            if (!isMounted) return;
            setError(
              "Network error. Please check your internet connection and try again."
            );
            console.error("Weather fetch network error:", err);
            return;
          }

          // Only update error state if component is still mounted
          if (!isMounted) return;
          setError(err.message);
          console.error("Weather fetch error:", err);
        } finally {
          // Only update loading state if component is still mounted
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchWeather();
    }, 500); // 500ms debounce delay

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [city]); // Re-run when city changes

  if (!city) return null;

  const getWeatherIcon = (weatherCode) => {
    // Map OpenWeatherMap weather codes to emojis
    const weatherIcons = {
      "01d": "☀️", // clear sky day
      "01n": "🌙", // clear sky night
      "02d": "⛅", // few clouds day
      "02n": "☁️", // few clouds night
      "03d": "☁️", // scattered clouds
      "03n": "☁️",
      "04d": "☁️", // broken clouds
      "04n": "☁️",
      "09d": "🌧️", // shower rain
      "09n": "🌧️",
      "10d": "🌦️", // rain day
      "10n": "🌧️", // rain night
      "11d": "⛈️", // thunderstorm
      "11n": "⛈️",
      "13d": "🌨️", // snow
      "13n": "🌨️",
      "50d": "🌫️", // mist
      "50n": "🌫️",
    };
    return weatherIcons[weatherCode] || "🌤️";
  };

  return (
    <div className={`rounded-lg p-4 mb-6 border`}>
      <h3
        className={`text-lg font-semibold mb-3 flex items-center ${
          isDarkMode ? "text-blue-300" : "text-blue-800"
        }`}
      >
        <Cloud className="w-5 h-5 mr-2" />
        Weather in {city}
      </h3>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          <p className={`${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>
            Loading weather data...
          </p>
        </div>
      )}

      {error && (
        <div
          className={`border rounded-lg p-3 ${
            isDarkMode
              ? "bg-red-900/20 border-red-400/30"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p className={`text-sm ${isDarkMode ? "text-red-300" : "text-red-600"}`}>
            {error}
          </p>
          {error.includes("API key") && (
            <p
              className={`text-xs mt-1 ${
                isDarkMode ? "text-red-400" : "text-red-500"
              }`}
            >
              To fix this, add your OpenWeatherMap API key to the .env file as
              VITE_WEATHER_API_KEY
            </p>
          )}
        </div>
      )}

      {weatherData && !loading && !error && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">
                {getWeatherIcon(weatherData.weather[0]?.icon)}
              </span>
              <div>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {Math.round(weatherData.main.temp)}°C
                </p>
                <p
                  className={`text-sm capitalize ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {weatherData.weather[0]?.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {Math.round(weatherData.main.temp_min)}°C /{" "}
                {Math.round(weatherData.main.temp_max)}°C
              </p>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-3 pt-2 border-t ${
              isDarkMode ? "border-blue-400/30" : "border-blue-200"
            }`}
          >
            <div className="flex items-center text-sm">
              <Droplets className="w-4 h-4 mr-2 text-blue-600" />
              <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Humidity: {weatherData.main.humidity}%
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Wind className="w-4 h-4 mr-2 text-blue-600" />
              <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Wind: {Math.round(weatherData.wind.speed)} m/s
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Thermometer className="w-4 h-4 mr-2 text-blue-600" />
              <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Pressure: {weatherData.main.pressure} hPa
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Visibility: {(weatherData.visibility / 1000).toFixed(1)} km
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherSection;
