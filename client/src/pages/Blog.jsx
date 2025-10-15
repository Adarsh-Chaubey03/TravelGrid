import React, { useState } from "react";
import Navbar from "../components/Custom/Navbar";
import Footer from "../components/Custom/Footer";
import TravelTips from "../components/Home/TravelTips";
import toast from "react-hot-toast";

const blogs = [
  {
    title: "Top 10 Hidden Gems to Visit in India 🇮🇳",
    summary:
      "Explore the unexplored! From Ziro Valley to Mawlynnong, find the peaceful side of India most tourists miss.",
    author: "Team TravelGrid",
    date: "July 25, 2025",
    tags: ["India", "Hidden Gems", "Travel Tips"],
  },
  {
    title: "How to Plan a Budget-Friendly Trip 💰",
    summary:
      "Want to travel smart? Here’s how you can plan a fun adventure under ₹10K using TravelGrid tools.",
    author: "Adarsh Chaubey",
    date: "July 20, 2025",
    tags: ["Budget Travel", "Planning"],
  },
  {
    title: "Ultimate Checklist Before You Travel ✅",
    summary:
      "Don't forget these important things before your next trip. We’ve got your back with this handy checklist.",
    author: "GSSoC Team",
    date: "July 10, 2025",
    tags: ["Checklist", "Packing", "Essentials"],
  },
  {
    title: "Solo Travel: A Complete Guide 🧍‍♂️",
    summary:
      "Thinking about traveling alone? Here's a complete guide to make your solo trip safe, fun, and memorable.",
    author: "Mayank Gaur",
    date: "July 5, 2025",
    tags: ["Solo Travel", "Safety", "Freedom"],
  },
  {
    title: "Why You Should Travel More Often 🌍",
    summary:
      "Life’s short, the world is wide. Discover how traveling boosts your mental health, confidence, and creativity.",
    author: "Team TravelGrid",
    date: "June 30, 2025",
    tags: ["Mental Health", "Motivation"],
  },
  {
    title: "Best Weekend Getaways from Delhi 🏞️",
    summary:
      "Need a quick escape from city life? Here are perfect weekend spots just hours away from Delhi.",
    author: "Shruti Sah",
    date: "June 22, 2025",
    tags: ["Weekend", "Delhi", "Road Trip"],
  },
];

function Blog() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-pink-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section - FIXED */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 animate-fade-in">
            TravelGrid <span className="text-pink-400">Blog</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300">
            Tips, stories & insights to make your journey unforgettable.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl mx-auto w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none border border-pink-400"
            />
          </div>
          {/* Travel Quote */}
          <p className="text-gray-400 italic mt-4 text-sm">
            “
            {
              [
                "Travel is the only thing you buy that makes you richer.",
                "Jobs fill your pocket, but adventures fill your soul.",
                "To travel is to live.",
                "Wander often. Wonder always.",
              ][Math.floor(Math.random() * 4)]
            }
            ”
          </p>

          <div className="w-24 h-1 bg-pink-400 mx-auto mt-6 rounded-full"></div>
          {/* Featured Blog Section */}
          <div className="mt-10 bg-gradient-to-r from-pink-600 to-purple-700 p-6 rounded-lg shadow-xl text-left max-w-3xl w-full">
            <h3 className="text-white text-xl font-bold mb-2">
              🔥 Featured: How to Travel on a Budget
            </h3>
            <p className="text-pink-100 mb-3">
              Learn practical tips to plan your trip under ₹10K without
              compromising on experience.
            </p>
            <button
              className="text-sm text-white bg-black bg-opacity-30 px-4 py-2 rounded hover:bg-opacity-50 transition"
              onClick={() => toast.error("Redirecting to blog detail soon!")}
            >
              Read Full Article →
            </button>
          </div>
        </div>
      </div>
      {/* --- */}
      {/* Tag Cloud */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {[
          "India",
          "Budget",
          "Solo",
          "Checklists",
          "Mental Health",
          "Weekend",
        ].map((tag, i) => (
          <span
            key={i}
            className="bg-pink-700 px-3 py-1 text-white text-sm rounded-full hover:bg-pink-600 cursor-pointer"
            onClick={() => setSearchTerm(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-pink-400 transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-300 text-sm mb-4">{blog.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-pink-200 mb-2">
                  By {blog.author} • {blog.date}
                </div>
                {/* Author Info */}
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${blog.author}`}
                    alt="avatar"
                    loading="lazy"
                    className="w-8 h-8 rounded-full border border-pink-400"
                  />
                  <span className="text-pink-300 text-sm">
                    @{blog.author.toLowerCase().replace(" ", "_")}
                  </span>
                </div>

                <button
                  className="text-pink-400 hover:text-white hover:underline text-sm"
                  onClick={() => toast.error("Detail page coming soon!")}
                >
                  Read More →
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-pink-200 col-span-full">
              No blogs found for “{searchTerm}”
            </p>
          )}
        </div>
      </div>

      {/* Travel Tips Section */}
      <div className="max-w-3xl mx-auto mb-20">
        <TravelTips />
      </div>

      {/* Travel Personality Poll Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-10 px-6 rounded-lg shadow-lg max-w-3xl mx-auto mb-20 text-center">
        <h3 className="text-white text-2xl font-bold mb-4 animate-bounce">
          🤔 What's Your Travel Vibe?
        </h3>
        <p className="text-pink-100 mb-6">
          Tell us what kind of traveler you are and see what others picked too!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
          {["🏞️ Mountains", "🏖️ Beach", "🏙️ City", "🏕️ Adventure"].map(
            (option, i) => (
              <button
                key={i}
                className="bg-pink-600 hover:bg-pink-700 transition px-4 py-3 rounded-lg shadow-md text-sm sm:text-base"
                onClick={() => toast.success(`You selected: ${option}`)}
              >
                {option}
              </button>
            )
          )}
        </div>
        <p className="text-gray-400 mt-6 italic text-sm">
          We're building cool content based on your vibe 😎
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;
