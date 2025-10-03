import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock, Utensils } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SharedTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/share/trip/${tripId}`);
        const data = await response.json();
        
        if (data.success) {
          setTrip(data.trip);
        } else {
          setError('Trip not found');
        }
      } catch (err) {
        setError('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

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
              {trip.destination}, {trip.country}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {new Date(trip.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {trip.numberOfDays} days
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Shared by {trip.createdBy}
              </span>
            </div>
          </div>

          {trip.interests && trip.interests.length > 0 && (
            <div className="mt-4">
              <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Interests:
              </h3>
              <div className="flex flex-wrap gap-2">
                {trip.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itinerary */}
        {trip.plan && trip.plan.days && (
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Itinerary
            </h2>
            
            <div className="space-y-6">
              {trip.plan.days.map((day, index) => (
                <div key={index} className={`border-l-4 border-pink-500 pl-6 ${
                  isDarkMode ? 'border-opacity-70' : ''
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Day {day.day}: {day.title}
                  </h3>
                  
                  {day.activities && day.activities.length > 0 && (
                    <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Activities:
                      </h4>
                      <ul className="space-y-1">
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {day.meals && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['breakfast', 'lunch', 'dinner'].map((meal) => (
                        day.meals[meal] && (
                          <div key={meal} className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-gray-500" />
                            <div>
                              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {meal.charAt(0).toUpperCase() + meal.slice(1)}:
                              </span>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {day.meals[meal]}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Powered by TravelGrid • Plan your next adventure at{' '}
            <a href="/" className="text-pink-500 hover:underline">
              TravelGrid
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;