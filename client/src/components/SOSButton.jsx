import React, { useState, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { Phone, AlertTriangle } from 'lucide-react';

const SOSButton = () => {
  const { triggerSOS } = useSafety();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

  // Handle countdown when confirmation is shown
  useEffect(() => {
    let timer;
    if (showConfirmation && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showConfirmation && countdown === 0) {
      handleSOS();
    }
    return () => clearTimeout(timer);
  }, [showConfirmation, countdown]);

  const handleSOSClick = () => {
    setShowConfirmation(true);
    setCountdown(5);
  };

  const handleSOS = async () => {
    try {
      await triggerSOS(location, 'SOS triggered from mobile app');
      alert('SOS alert sent successfully! Help is on the way.');
    } catch (error) {
      alert('Failed to send SOS alert: ' + error.message);
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelSOS = () => {
    setShowConfirmation(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {showConfirmation ? (
        <div className="bg-red-500 text-white rounded-xl shadow-2xl p-4 w-64 animate-pulse">
          <div className="flex items-center mb-3">
            <AlertTriangle className="mr-2" size={24} />
            <h3 className="font-bold text-lg">SOS ALERT</h3>
          </div>
          <p className="text-sm mb-4">
            Emergency alert will be sent in {countdown} seconds. 
            Press cancel if this was accidental.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={cancelSOS}
              className="flex-1 bg-white text-red-500 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSOS}
              className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Send Now
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSOSClick}
          className="group relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full text-white shadow-2xl hover:shadow-red-500/25 transform hover:scale-110 transition-all duration-300 ease-out animate-pulse"
          aria-label="Emergency SOS"
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-ping">
            <AlertTriangle className="w-2 h-2 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 opacity-75 animate-ping"></div>
        </button>
      )}
    </div>
  );
};

export default SOSButton;