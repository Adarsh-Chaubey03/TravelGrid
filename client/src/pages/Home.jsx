import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import HeroSection from '../components/Home/HeroSection'
import FeatureCards from '../components/Home/FeatureCards'
import ForumSection from '../components/Home/ForumSection'
import DiscoverSection from '../components/Home/DiscoverSection'
import FeaturedPackages from '../components/Home/FeaturedPackages'
import TravelGuides from '../components/Home/TravelGuides'
import Testimonials from '../components/Home/Testimonials'


function Home() {
    const [searchFilter, setSearchFilter] = useState(null);
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-all duration-300 ${
            isDarkMode 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
        }`}>
            <main className="flex flex-col flex-1 items-center justify-start w-full h-full">
                <HeroSection onSearch={setSearchFilter} />
                <FeatureCards />
                <FeaturedPackages />
                <TravelGuides />
                <Testimonials />
                <ForumSection />
                <DiscoverSection />
            </main>
        </div>
    )
}

export default Home
