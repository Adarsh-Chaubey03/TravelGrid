import React from 'react';
import { useTheme } from '../context/ThemeContext';
import MoodBoard from '../components/MoodBoard/MoodBoard';
import Navbar from '../components/Custom/Navbar';
import Footer from '../components/Custom/Footer';

const MoodBoardPage = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`min-h-screen transition-all duration-300`}>
            <Navbar />

            <main className="flex-1 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                            AI-Powered Travel Mood Board
                        </h1>
                        <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Create stunning visual travel plans with AI assistance, collaborate in real-time,
                            and bring your dream destinations to life with immersive 3D previews.
                        </p>
                    </div>

                    <MoodBoard />
                </div>
            </main>

            
        </div>
    );
};

export default MoodBoardPage;

