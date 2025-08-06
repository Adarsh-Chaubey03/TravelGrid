// TrendingSpots.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  TrendingUp,
  Star,
  Users,
  Calendar,
  Heart,
  Share2,
  Eye,
} from "lucide-react";
import Navbar from "../components/Custom/Navbar";

const TrendingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);
  const [likedSpots, setLikedSpots] = useState(new Set());

  // Simulated backend
   const mockTrendingSpots = [
    {
      id: 1,
      name: "Santorini, Greece",
      country: "Greece",
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      trending_score: 95,
      visitors_count: "2.3M",
      category: "beach",
      price_range: "$2000",
      best_time: "Apr-Oct",
      highlights: ["Stunning sunsets", "White architecture", "Wine tours"],
      recent_reviews: 1250,
      growth_percentage: 23,
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      trending_score: 92,
      visitors_count: "1.8M",
      category: "cultural",
      price_range: "$3000",
      best_time: "Mar-May, Sep-Nov",
      highlights: ["Ancient temples", "Cherry blossoms", "Traditional culture"],
      recent_reviews: 2100,
      growth_percentage: 18,
    },
    {
      id: 3,
      name: "Banff National Park",
      country: "Canada",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      trending_score: 89,
      visitors_count: "4.2M",
      category: "nature",
      price_range: "$5000",
      best_time: "Jun-Sep",
      highlights: ["Mountain lakes", "Wildlife viewing", "Hiking trails"],
      recent_reviews: 890,
      growth_percentage: 31,
    },
    {
      id: 4,
      name: "Dubai, UAE",
      country: "United Arab Emirates",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.6,
      trending_score: 87,
      visitors_count: "16.7M",
      category: "city",
      price_range: "$1000",
      best_time: "Nov-Mar",
      highlights: ["Luxury shopping", "Modern architecture", "Desert safari"],
      recent_reviews: 3200,
      growth_percentage: 15,
    },
    {
      id: 5,
      name: "Tulum, Mexico",
      country: "Mexico",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.5,
      trending_score: 85,
      visitors_count: "800K",
      category: "beach",
      price_range: "$3000",
      best_time: "Dec-Apr",
      highlights: ["Mayan ruins", "Cenotes", "Bohemian vibes"],
      recent_reviews: 670,
      growth_percentage: 42,
    },
    {
      id: 6,
      name: "Reykjavik, Iceland",
      country: "Iceland",
      image:
        "https://images.unsplash.com/photo-1606130503037-6a8ef67c9d2d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      trending_score: 83,
      visitors_count: "1.2M",
      category: "nature",
      price_range: "$4000",
      best_time: "Jun-Aug, Sep-Mar",
      highlights: ["Northern lights", "Blue lagoon", "Unique landscapes"],
      recent_reviews: 540,
      growth_percentage: 28,
    },
    {
      id: 7,
      name: "Maldives",
      country: "Maldives",
      image:
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      trending_score: 91,
      visitors_count: "1.7M",
      category: "beach",
      price_range: "$1000",
      best_time: "Nov-Apr",
      highlights: ["Overwater villas", "Crystal clear water", "Luxury resorts"],
      recent_reviews: 980,
      growth_percentage: 35,
    },
    {
      id: 8,
      name: "Machu Picchu, Peru",
      country: "Peru",
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      trending_score: 88,
      visitors_count: "1.5M",
      category: "cultural",
      price_range: "$2000",
      best_time: "May-Sep",
      highlights: ["Ancient Inca ruins", "Mountain hiking", "Sacred valley"],
      recent_reviews: 1150,
      growth_percentage: 22,
    },
    {
      id: 9,
      name: "Bali, Indonesia",
      country: "Indonesia",
      image:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.6,
      trending_score: 86,
      visitors_count: "6.3M",
      category: "beach",
      price_range: "$500",
      best_time: "Apr-Oct",
      highlights: ["Rice terraces", "Temples", "Beach clubs"],
      recent_reviews: 2800,
      growth_percentage: 29,
    },
    {
      id: 10,
      name: "Swiss Alps",
      country: "Switzerland",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9,
      trending_score: 90,
      visitors_count: "3.1M",
      category: "nature",
      price_range: "$8000",
      best_time: "Jun-Sep, Dec-Mar",
      highlights: ["Mountain peaks", "Skiing", "Alpine villages"],
      recent_reviews: 750,
      growth_percentage: 19,
    },
    {
      id: 11,
      name: "Paris, France",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1712647016816-7072674bd83f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7,
      trending_score: 84,
      visitors_count: "38M",
      category: "city",
      price_range: "$10000",
      best_time: "Apr-Jun, Sep-Oct",
      highlights: ["Eiffel Tower", "Art museums", "French cuisine"],
      recent_reviews: 4200,
      growth_percentage: 12,
    },
    {
      id: 12,
      name: "New York City, USA",
      country: "United States",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.5,
      trending_score: 82,
      visitors_count: "65M",
      category: "city",
      price_range: "$10000",
      best_time: "Apr-Jun, Sep-Nov",
      highlights: ["Broadway shows", "Central Park", "Museums"],
      recent_reviews: 5800,
      growth_percentage: 8,
    },
  ];
  useEffect(() => {
    setTimeout(() => {
      setSpots(mockTrendingSpots);
    }, 500);
  }, []);

  const filteredSpots = filter === "all" ? spots : spots.filter((s) => s.category === filter);

  const handleLike = (id) => {
    const updated = new Set(likedSpots);
    if (likedSpots.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setLikedSpots(updated);
  };

  return (
    <div className="bg-gradient-to-br from-black to-pink-900 min-h-screen overflow-x-hidden">
      <Navbar lightBackground />

      <motion.div
       initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 py-10"
      >
        <h1 className="text-4xl pt-16 md:text-5xl font-extrabold text-white text-center mb-10">
          Trending <span className="text-pink-500">Spots</span>
        </h1>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpots.slice(0, visibleCount).map((spot, index) => (
            <motion.div
              key={spot.id}
              className="bg-white/10 border border-pink-400/40 rounded-2xl shadow-xl backdrop-blur-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative">
                <img src={spot.image} alt={spot.name} className="w-full h-64 object-cover" />

                {/* Like + Share Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    onClick={() => handleLike(spot.id)}
                    whileTap={{ scale: 1.4 }}
                    animate={{
                      scale: likedSpots.has(spot.id) ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 p-2 rounded-full"
                  >
                    <Heart
                      className={`h-4 w-4 ${likedSpots.has(spot.id) ? "text-pink-600 fill-pink-600" : "text-gray-600"}`}
                    />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="bg-white/90 p-2 rounded-full"
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{spot.name}</h3>
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="h-4 w-4 mr-1" />
                      {spot.country}
                    </div>
                  </div>
                  <div className="text-right text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{spot.rating}</span>
                    </div>
                    <span className="text-xs">{spot.price_range}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {spot.highlights.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white text-pink-500 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-300 mt-4 pt-4 border-t border-pink-200">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{spot.recent_reviews} reviews</span>
                  </div>
                  <div className="text-pink-400 font-semibold">
                    +{spot.growth_percentage}%
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className="w-full mt-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white py-2 rounded-xl font-semibold transition"
                >
                  Explore {spot.name}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TrendingSpots;
