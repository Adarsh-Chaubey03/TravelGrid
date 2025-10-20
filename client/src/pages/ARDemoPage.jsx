import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ARTravelGuide from "../components/ARTravelGuide";
import { useTheme } from "../context/ThemeContext";
import { Camera, MapPin, Globe, Eye } from "lucide-react";

const ARDemoPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [showAR, setShowAR] = useState(false);
  
  // Sample location for demo
  const demoLocation = {
    id: 1,
    name: "Eiffel Tower, Paris",
    country: "France",
    region: "Île-de-France",
    coordinates: "48.8584,2.2945",
    overview: {
      description: "Experience the iconic Eiffel Tower like never before with our augmented reality travel guide. Discover hidden facts, translate signs in real-time, and navigate with spatial awareness."
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            AR Travel Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your travel experience with augmented reality. Overlay contextual information, translations, and navigation cues onto real-world environments.
          </p>
        </div>

        {!showAR ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className={`rounded-2xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center mb-4">
                  <Camera className="w-8 h-8 text-pink-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Object Recognition</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our AR system identifies landmarks, buildings, and points of interest in real-time through your camera.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Real-time landmark detection
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Contextual information overlays
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Distance and navigation cues
                  </li>
                </ul>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-purple-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Visual Translation</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Break language barriers with real-time visual translation of signs, menus, and descriptions.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Multi-language support
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Real-time text overlay
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Cultural context preservation
                  </li>
                </ul>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center mb-4">
                  <MapPin className="w-8 h-8 text-blue-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Spatial Mapping</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Advanced 3D point cloud mapping for accurate overlays and enhanced location awareness.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    3D environment mapping
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Precise overlay positioning
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Elevation and terrain awareness
                  </li>
                </ul>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center mb-4">
                  <Eye className="w-8 h-8 text-green-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gesture Controls</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Hands-free interaction through gesture recognition for seamless AR navigation.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Tap to interact with objects
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Swipe to navigate information
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Pinch to zoom overlays
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowAR(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition duration-300 hover:scale-105"
              >
                Launch AR Experience
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <ARTravelGuide 
              location={demoLocation} 
              onClose={() => setShowAR(false)} 
            />
          </div>
        )}

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="text-4xl font-bold text-pink-500 mb-3">1</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Point Your Camera</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply point your device camera at any location or landmark to activate the AR experience.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="text-4xl font-bold text-purple-500 mb-3">2</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Discover & Translate</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our system automatically detects objects and translates text in real-time for your convenience.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="text-4xl font-bold text-blue-500 mb-3">3</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Navigate & Explore</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use gesture controls to interact with information and navigate through your travel experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARDemoPage;