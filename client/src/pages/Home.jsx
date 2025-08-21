import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import HeroSection from '../components/Home/HeroSection'
import FeatureCards from '../components/Home/FeatureCards'
import ForumSection from '../components/Home/ForumSection'
import DiscoverSection from '../components/Home/DiscoverSection'
import FeaturedPackages from '../components/Home/FeaturedPackages'
import TravelGuides from '../components/Home/TravelGuides'
import Testimonials from '../components/Home/Testimonials'
import MoodBoard from '../components/MoodBoard/MoodBoard'


function Home() {
    const [searchFilter, setSearchFilter] = useState(null);
    const { isDarkMode } = useTheme();

    return (
        <div className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-all duration-300`}>
            <main className="flex flex-col flex-1 items-center justify-start w-full h-full">
                {/* Hero Section */}
                <div className="w-full relative">
                    <HeroSection onSearch={setSearchFilter} />
                </div>

                {/* Feature Cards Section */}
                <div className="w-full py-16 px-4">
                    <FeatureCards />
                </div>

                {/* Featured Packages Section */}
                <div className="w-full py-16 px-4">
                    <FeaturedPackages />
                </div>

                {/* Travel Guides Section */}
                <div className="w-full py-16 px-4">
                    <TravelGuides />
                </div>

                {/* Testimonials Section */}
                <div className="w-full py-16 px-4">
                    <Testimonials />
                </div>

                {/* Forum Section */}
                <div className="w-full py-16 px-4">
                    <ForumSection />
                </div>

                {/* Discover Section */}
                <div className="w-full py-16 px-4">
                    <DiscoverSection />
                </div>

                {/* AI-Powered Travel Mood Board Section */}
                <div className="w-full py-16 px-4">
                    <MoodBoard />
                </div>
            </main>
        </div>
    )
}

export default Home