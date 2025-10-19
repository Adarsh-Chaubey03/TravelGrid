import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertTriangle, MapPin, CheckCircle, User, Phone, Bell, Settings, Navigation } from 'lucide-react';

const SafetyDashboard = () => {
  const { safetyProfile, alerts, riskAssessment, loading, getRiskAssessment, checkInSafety } = useSafety();
  const { user } = useAuth();
  const [destination, setDestination] = useState('');
  const [location, setLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fetch risk assessment when destination changes
  useEffect(() => {
    if (destination) {
      getRiskAssessment(destination);
    }
  }, [destination, getRiskAssessment]);

  const handleCheckIn = async () => {
    if (!destination) {
      alert('Please enter a destination');
      return;
    }
    
    try {
      await checkInSafety(destination, location);
      alert('Safety check-in successful!');
    } catch (error) {
      alert('Failed to check in: ' + error.message);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'High', color: 'text-red-500', bg: 'bg-red-100' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (score >= 40) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-100' };
    return { level: 'Very Low', color: 'text-blue-500', bg: 'bg-blue-100' };
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
          <Shield className="mr-3 text-blue-500" />
          Travel Safety Intelligence
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Real-time safety insights and proactive protection for your travels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Assessment Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Risk Assessment</h2>
            <AlertTriangle className="text-yellow-500" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check destination risk
            </label>
            <div className="flex">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button 
                onClick={() => destination && getRiskAssessment(destination)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Check
              </button>
            </div>
          </div>
          
          {riskAssessment ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Overall Risk</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevel(riskAssessment.overallRiskScore).bg} ${getRiskLevel(riskAssessment.overallRiskScore).color}`}>
                  {getRiskLevel(riskAssessment.overallRiskScore).level} ({riskAssessment.overallRiskScore}/100)
                </span>
              </div>
              
              <div className="space-y-3">
                {riskAssessment.riskFactors && riskAssessment.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300 capitalize">{factor.factorType}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${factor.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{factor.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {destination ? 'Loading risk assessment...' : 'Enter a destination to check risk levels'}
            </div>
          )}
        </div>

        {/* Safety Check-in Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Safety Check-in</h2>
            <CheckCircle className="text-green-500" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Location
            </label>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="mr-2" size={16} />
              {location ? (
                <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              ) : (
                <span>Location not available</span>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter your destination"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            onClick={handleCheckIn}
            disabled={!destination || loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <CheckCircle className="mr-2" size={20} />
            Check-in Safe
          </button>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Checking in confirms your safety to trusted contacts and updates your location status.</p>
          </div>
        </div>

        {/* Safety Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Safety Profile</h2>
            <User className="text-purple-500" />
          </div>
          
          {safetyProfile ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800 dark:text-white">{user?.name || 'Traveler'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Safety Profile Active</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">SOS Enabled</span>
                  <span className="text-green-500 font-medium">Yes</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Trusted Contacts</span>
                  <span className="text-blue-500 font-medium">
                    {safetyProfile.trustedContacts?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Auto Check-in</span>
                  <span className={safetyProfile.autoCheckInEnabled ? 'text-green-500 font-medium' : 'text-gray-500 font-medium'}>
                    {safetyProfile.autoCheckInEnabled ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors">
                Manage Profile
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Set up your safety profile to enable all features
              </p>
              <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Create Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Active Safety Alerts</h2>
          <Bell className="text-red-500" />
        </div>
        
        {alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{alert.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{alert.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{alert.alertType}</span>
                      <span className="mx-2">•</span>
                      <span>{alert.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <p className="mt-4">No active safety alerts for your destinations</p>
          </div>
        )}
      </div>

      {/* Safety Recommendations */}
      {riskAssessment && riskAssessment.safetyRecommendations && riskAssessment.safetyRecommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Safety Recommendations</h2>
            <Shield className="text-blue-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskAssessment.safetyRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                  <Shield className="text-blue-500 dark:text-blue-300" size={20} />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyDashboard;