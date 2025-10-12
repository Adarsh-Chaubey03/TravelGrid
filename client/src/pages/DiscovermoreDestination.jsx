import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscoverCard from '../components/DiscoverCard';
import { useTheme } from "../context/ThemeContext";


function DiscovermoreDestination() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const handleBookNowClick = () => {
        navigate("/packages");
    };

    const destinations = [
        {
            name: "Manali, Himachal",
            description: "A beautiful hill station known for its scenic beauty and adventure sports.",
            image: "https://images.unsplash.com/photo-1712388430474-ace0c16051e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWxpfGVufDB8fDB8fHww"
        },
        {
            name: "Jaipur, Rajasthan",
            description: "The Pink City with rich history, forts, and vibrant culture.",
            image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFpcHVyfGVufDB8fDB8fHww"
        },
        {
            name: "Goa",
            description: "Popular beach destination with nightlife, water sports, and culture.",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29hfGVufDB8fDB8fHww"
        },
        {
            name: "Rishikesh, Uttarakhand",
            description: "The yoga capital of the world, nestled on the banks of the Ganges.",
            image: "https://plus.unsplash.com/premium_photo-1697730398251-40cd8dc57e0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmlzaGlrZXNofGVufDB8fDB8fHww"
        },
        {
            name: "Munnar, Kerala",
            description: "A serene hill station blanketed with tea gardens and misty mountains.",
            image: "https://images.unsplash.com/photo-1711192702535-eac61a78ecb0?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            name: "Jaisalmer, Rajasthan",
            description: "The Golden City of India, known for its desert forts and camel safaris.",
            image: "https://media.istockphoto.com/id/185324109/photo/bada-bagh-with-wind-turbines.webp?a=1&b=1&s=612x612&w=0&k=20&c=-iAtc1fprTuX-WuYS4FQkLXWj9cYH_NaMv4H728z5aM="
        },
        {
            name: "Tawang, Arunachal Pradesh",
            description: "A remote Himalayan town home to ancient monasteries and landscapes.",
            image: "https://media.istockphoto.com/id/187510803/photo/ancient-buddhist-monastery-tawang-arunachal-pradesh-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=FX8tHuN0SvTW8bvUmZZ3FeGMTT8pjlH06p-gc9doEtg="
        },
        {
            name: "Hampi, Karnataka",
            description: "A UNESCO World Heritage site with majestic ruins surreal landscapes.",
            image: "https://media.istockphoto.com/id/1270774245/photo/hampi-stone-chariot-the-antique-stone-art-piece-from-unique-angle-with-amazing-blue-sk.webp?a=1&b=1&s=612x612&w=0&k=20&c=FN6uQp0ywkO9PxQ1bXerkryHSGyNNDEc3cCbQ7IzMdU="
        },
        {
            name: "Spiti Valley, Himachal Pradesh",
            description: "A cold desert mountain valley known for its monasteries and rugged beauty.",
            image: "https://images.unsplash.com/photo-1617159156637-dfb8655c9f95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpdGklMjB2YWxsZXl8ZW58MHx8MHx8fDA%3D"
        },
        {
            name: "Pondicherry",
            description: "A coastal town with French colonial architecture and tranquil beaches.",
            image: "https://plus.unsplash.com/premium_photo-1728117267325-534ccbd21a5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9uZGljaGVycnl8ZW58MHx8MHx8fDA%3D"
        },
        {
            name: "Coorg, Karnataka",
            description: "Known as the Scotland of India, filled with coffee plantations and lush hills.",
            image: "https://images.unsplash.com/photo-1634874634941-78abc0a00298?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvb3JnJTIwa2FybmF0a2F8ZW58MHx8MHx8fDA%3D"
        }
    ];

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 4;

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = destinations.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(destinations.length / cardsPerPage);
    // const { isDarkMode } = useTheme();
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <section className={`w-full  text-cyan-950
     ${        isDarkMode 
            ? 'bg-gradient-to-br from-black to-pink-900'
            : 'from-pink-200/50 via-white/70 to-blue-200/50'}  py-16 text-center` }>


            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode?'text-white':'text-black'} mt-6`}>
                Discover New Destinations
            </h2>
            <p className={`${isDarkMode?'text-gray-300':'text-gray-800'} text-base md:text-lg mb-10`}>
                Explore trending places, hidden gems, and must-visit spots curated just for you.
            </p>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {currentCards.map((place, index) => (
                    <DiscoverCard
                        key={index}
                        index={index}
                        place={place}
                        handleBookNowClick={handleBookNowClick}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-10">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className={`${isDarkMode?'text-white':'text-black'} font-semibold`}>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-pink-600 text-black rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </section>
    );
}

export default DiscovermoreDestination;
