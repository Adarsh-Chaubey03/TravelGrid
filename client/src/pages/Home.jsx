import React, { useState } from 'react'
import HeroSection from '../components/Home/HeroSection'
import FeatureCards from '../components/Home/FeatureCards'
import ForumSection from '../components/Home/ForumSection'
import DiscoverSection from '../components/Home/DiscoverSection'
import FeaturedPackages from '../components/Home/FeaturedPackages'
import TravelGuides from '../components/Home/TravelGuides'
import Testimonials from '../components/Home/Testimonials'
import InteractiveStats from '../components/Home/InteractiveStats'

function Home() {
    const [searchFilter, setSearchFilter] = useState(null);
    return (
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 overflow-x-hidden">
            <main className="flex flex-col flex-1 items-center justify-start w-full h-full">
                <HeroSection onSearch={setSearchFilter} />
                <FeatureCards />
                <InteractiveStats />
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
