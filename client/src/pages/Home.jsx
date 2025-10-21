import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import HeroSection from '../components/Home/HeroSection'
import FeatureCards from '../components/Home/FeatureCards'
import ForumSection from '../components/Home/ForumSection'
import DiscoverSection from '../components/Home/DiscoverSection'
import FeaturedPackages from '../components/Home/FeaturedPackages'
import TravelGuides from '../components/Home/TravelGuides'
import Testimonials from '../components/Home/Testimonials'
import { useSEO } from '../hooks/useSEO'
import WhyChooseTravelGrid from '@/components/WhyChooseTravelGrid'


function Home() {
    const [searchFilter, setSearchFilter] = useState(null);
    const { isDarkMode } = useTheme();
    
    // SEO optimization for home page
    useSEO();

    return (
        <div className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-all duration-300`}>
            <main className="flex flex-col flex-1 items-center justify-start w-full h-full">
                {/* Hero Section */}
                <div className="w-full relative">
                    <HeroSection onSearch={setSearchFilter} />
                </div>

                {/* Feature Cards Section */}
                <div className="w-full py-16 px-4">
                    <WhyChooseTravelGrid />
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

                {/* AI-Powered Travel Mood Board removed */}
            </main>
        </div>
    )
}

export default Home