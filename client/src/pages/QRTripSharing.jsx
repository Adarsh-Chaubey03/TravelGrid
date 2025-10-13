import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Download, Copy, Check, MapPin, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const QRTripSharing = () => {
  const { isDarkMode } = useTheme();
  const [tripData, setTripData] = useState({
    destination: '',
    country: '',
    startDate: '',
    numberOfDays: '',
    activities: ['']
  });
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  // Generate mobile-friendly URL
  const getShareUrl = () => {
    const origin = window.location.origin;
    return `${origin}/shared-trip-tool?data=${encodeURIComponent(JSON.stringify(tripData))}`;
  };
  const shareUrl = getShareUrl();

  const handleInputChange = (field, value) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  const addActivity = () => {
    setTripData(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  const removeActivity = (index) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const updateActivity = (index, value) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => i === index ? value : activity)
    }));
  };

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${tripData.destination || 'trip'}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isFormValid = tripData.destination && tripData.country;

  return (
    <div className={`min-h-screen py-8 px-4 mt-20 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-black/60 via-black/40 to-black/70' 
        :  'from-pink-200/50 via-white/70 to-blue-200/50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-lg p-6 mb-6 mt-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              QR Trip Sharing Tool
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Create and share your travel plans instantly with QR codes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trip Form */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Trip Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={tripData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="e.g., Paris"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Country *
                  </label>
                  <input
                    type="text"
                    value={tripData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="e.g., France"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={tripData.numberOfDays}
                      onChange={(e) => handleInputChange('numberOfDays', e.target.value)}
                      placeholder="7"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Activities
                  </label>
                  {tripData.activities.map((activity, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => updateActivity(index, e.target.value)}
                        placeholder="e.g., Visit Eiffel Tower"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      {tripData.activities.length > 1 && (
                        <button
                          onClick={() => removeActivity(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addActivity}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border-2 border-dashed ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Share Your Trip
              </h2>
              
              {isFormValid ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div ref={qrRef} className="bg-white p-4 rounded-lg inline-block">
                      <QRCodeSVG
                        value={shareUrl}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={downloadQR}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </button>
                    
                    <button
                      onClick={copyLink}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-pink-500 hover:bg-pink-600 text-white'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>



                  {/* Preview */}
                  <div className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Preview:
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {tripData.destination}, {tripData.country}
                      </span>
                    </div>
                    {tripData.startDate && (
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(tripData.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {tripData.numberOfDays && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {tripData.numberOfDays} days
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in destination and country to generate QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRTripSharing;