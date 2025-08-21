import React, { useState } from 'react';
import TravelMoodMusicPlayer from '../components/TravelMoodMusicPlayer';
import { useTheme } from '../context/ThemeContext';

const MusicPlayerDemo = () => {
    const { isDarkMode } = useTheme();
    const [showPlayer, setShowPlayer] = useState(true);

    const demoDestinations = [
        { name: 'Paris', type: 'romantic', description: 'City of Love with French Chanson music' },
        { name: 'Japan', type: 'adventure', description: 'Land of the Rising Sun with traditional melodies' },
        { name: 'India', type: 'cultural', description: 'Incredible India with Bollywood beats' },
        { name: 'Beach Resort', type: 'relaxation', description: 'Tropical paradise with ocean vibes' },
        { name: 'Mountain Trek', type: 'adventure', description: 'High altitude adventure with nature sounds' }
    ];

    const demoMoods = [
        { name: 'Adventure', emoji: '🏔️', description: 'Perfect for outdoor activities and exploration' },
        { name: 'Relaxation', emoji: '🌊', description: 'Ideal for beach vacations and spa trips' },
        { name: 'Energetic', emoji: '🎉', description: 'Great for city breaks and nightlife' },
        { name: 'Romantic', emoji: '💕', description: 'Perfect for couples\' getaways' },
        { name: 'Business', emoji: '💼', description: 'Focused music for work trips' }
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        🎵 Travel Mood Music Player Demo
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Experience the mind-blowing feature that automatically generates and plays curated music playlists
                        based on your travel destination, mood, and activities. Transform your travel planning into an
                        immersive journey with the perfect soundtrack!
                    </p>
                </div>

                {/* Feature Showcase */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* How It Works */}
                    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h2 className="text-2xl font-bold mb-4 text-purple-600">✨ How It Works</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                                <div>
                                    <h3 className="font-semibold">Automatic Detection</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Detects travel pages and shows music player</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                                <div>
                                    <h3 className="font-semibold">Smart Mood Detection</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically detects mood based on trip type</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                                <div>
                                    <h3 className="font-semibold">Cultural Integration</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Provides destination-appropriate music</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                                <div>
                                    <h3 className="font-semibold">Seamless Experience</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Music continues across travel features</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <h2 className="text-2xl font-bold mb-4 text-pink-600">🚀 Key Features</h2>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span>Destination-based music curation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span>Mood-based playlist generation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span>Activity-specific music</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span>Smart playlist management</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span>Save and share playlists</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-500">✓</span>
                                <span>Offline functionality</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Demo Destinations */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">🌍 Demo Destinations</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {demoDestinations.map((dest, index) => (
                            <div key={index} className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 border-blue-500`}>
                                <h3 className="text-xl font-bold mb-2">{dest.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dest.description}</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-blue-600">Type:</span>
                                    <span className="text-sm capitalize">{dest.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demo Moods */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-green-600">😊 Available Moods</h2>
                    <div className="grid md:grid-cols-5 gap-4">
                        {demoMoods.map((mood, index) => (
                            <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
                                <div className="text-3xl mb-2">{mood.emoji}</div>
                                <h3 className="font-bold mb-2">{mood.name}</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{mood.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Music Player Toggle */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => setShowPlayer(!showPlayer)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${showPlayer
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        {showPlayer ? '🎵 Hide Music Player' : '🎵 Show Music Player'}
                    </button>
                </div>

                {/* Music Player */}
                {showPlayer && (
                    <div className="flex justify-center">
                        <div className="w-full max-w-md">
                            <TravelMoodMusicPlayer />
                        </div>
                    </div>
                )}

                {/* Why This Feature is Mind-Blowing */}
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-purple-600">🌟 Why This Feature is Mind-Blowing</h2>
                    <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-4xl mx-auto`}>
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-pink-600">🎬 Immersive Experience</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Makes trip planning feel like a movie soundtrack, creating an emotional connection to your journey.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-blue-600">🌍 Cultural Connection</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Introduces users to local music from their destination, adding educational value.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-green-600">😊 Mood Enhancement</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Automatically sets the right atmosphere for trip planning based on your mood.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-purple-600">📱 Viral Potential</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Users will share their travel playlists on social media, increasing engagement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        Ready to experience the future of travel planning?
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                            🎵 Try Music Player
                        </button>
                        <button className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-all duration-300">
                            📚 Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayerDemo;
