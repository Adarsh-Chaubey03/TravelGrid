import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SharedTripTool = () => {
  const [searchParams] = useSearchParams();
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      if (data) {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setTripData(parsedData);
      } else {
        setError('No trip data found');
      }
    } catch (err) {
      setError('Invalid trip data');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg p-6 mb-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-pink-500" />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {tripData.destination}, {tripData.country}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tripData.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {new Date(tripData.startDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {tripData.numberOfDays && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {tripData.numberOfDays} days
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Activities */}
        {tripData.activities && tripData.activities.filter(activity => activity.trim()).length > 0 && (
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <Activity className="w-6 h-6 text-pink-500" />
              Planned Activities
            </h2>
            
            <div className="space-y-3">
              {tripData.activities
                .filter(activity => activity.trim())
                .map((activity, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {activity}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Shared via TravelGrid QR Tool • Create your own at{' '}
            <a href="/qr-trip-sharing" className="text-pink-500 hover:underline">
              TravelGrid
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedTripTool;