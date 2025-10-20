import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  MapPin,
  Users,
  Star,
  Heart,
  Mail,
  Phone,
  Calendar,
  Award,
  Globe,
  Target,
  Eye,
  Lightbulb
} from "lucide-react";
import GitHubStats from "./GitHubStats";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { IoCarSportSharp } from "react-icons/io5";
import { FaHotel } from "react-icons/fa";
import { GiBookCover } from "react-icons/gi";
import { LuNotebookPen } from "react-icons/lu";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaRecycle } from "react-icons/fa";
import { BsLuggageFill } from "react-icons/bs";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { GiSmartphone } from "react-icons/gi";
import { PiIslandFill } from "react-icons/pi";

function About() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  //for features cards navigation
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      //adding path to each of the feature
      title: "Travel Booking",
      description:
        "Easily book flights, trains, buses, and more with our intuitive booking system.",
      icon: <BiSolidPlaneAlt />,
      path: '/ticket'
    },
    {
      title: "Vehicle Rentals",
      description:
        "Rent or hire vehicles tailored to your travel needs, from cars to bikes.",
      icon: <IoCarSportSharp />,
      path: '/ticket'
    },
    {
      title: "Hotel Reservations",
      description:
        "Browse and book hotels based on your preferences and budget.",
      icon: <FaHotel />,
      path: '/hotel-booking'
    },
    {
      title: "Travel Guides",
      description:
        "Discover curated guides to plan your ideal trip with local insights.",
      icon: <GiBookCover />,
      path: '/guides'
    },

    {
      title: "Essentials Chechlist",
      description:
        "Ensure you are not forgetting anything with our checklist feature.",
      icon: <LuNotebookPen />,
      path: '/packing-checklist'
    },
    {
      title: "Expense Calculator",
      description:
        "We will manage all your expenses, be it solo travelling or a fun group trip. Just enter amount and number of people(for a group)",
      icon: <RiMoneyRupeeCircleFill />,
      path: '/trip-calculator'
    },
    {
      title: "Currency converter",
      description:
        "With us you dont have to worry about currency, just enter amount and currency, and you'll get exact amount in requested currency.",
      icon: <FaRecycle />,
      path: '/enhanced-currency'
    },
    {
      title: "Travel with music",
      description:
        "Travel the world listening to your favourite melodies with our wide categories of music.",
      icon: <IoMusicalNotesSharp />,
      path: '/music'
    },
    {
      title: "Travel Packages",
      description:
        "Choose pre-designed packages or customize your own adventure.",
      icon: <BsLuggageFill />,
      path: '/packages'
    },
    {
      title: "Responsive Design",
      description:
        "Enjoy a consistent experience across desktops, tablets, and mobile devices.",
      icon: <GiSmartphone />,
      path: '/'
    },
    {
      title: "Trending Spots",
      description:
        "Find the places going viral right now—from hidden gems to must-see hotspots trending across the internet.",
      icon: <PiIslandFill />,
      path: '/trending-spots'
    },

  ];
  


  const techStack = [
    { name: "React.js", color: "bg-blue-500" },
    { name: "Tailwind CSS", color: "bg-cyan-500" },
    { name: "ShadCN UI", color: "bg-purple-500" },
    { name: "Vite", color: "bg-yellow-500" },
    { name: "Git & GitHub", color: "bg-gray-600" },
  ];

  const timeline = [
    {
      year: "2024",
      title: "Project Inception",
      description: "TravelGrid was born from the vision to simplify travel planning",
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      year: "2025",
      title: "GSSoC Partnership",
      description: "Joined GirlScript Summer of Code to build with the community",
      icon: <Users className="w-6 h-6" />
    },
    {
      year: "2025",
      title: "Feature Expansion",
      description: "Added booking systems, guides, and travel tools",
      icon: <Award className="w-6 h-6" />
    },
    {
      year: "Future",
      title: "Global Reach",
      description: "Expanding to serve travelers worldwide",
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const teamMembers = [
    {
      name: "Development Team",
      role: "Full Stack Developers",
      description: "Building the core platform with modern technologies",
      avatar: "👥"
    },
    {
      name: "Design Team",
      role: "UI/UX Designers",
      description: "Creating intuitive and beautiful user experiences",
      avatar: "🎨"
    },
    {
      name: "Community Team",
      role: "Open Source Contributors",
      description: "Contributing features and improvements through GSSoC",
      avatar: "🤝"
    },
    {
      name: "Product Team",
      role: "Product Managers",
      description: "Defining roadmap and ensuring user-centric features",
      avatar: "📋"
    }
  ];

  const achievements = [
    { number: "10K+", label: "Active Users", icon: <Users className="w-8 h-8" /> },
    { number: "50+", label: "Destinations", icon: <MapPin className="w-8 h-8" /> },
    { number: "100+", label: "Contributors", icon: <Heart className="w-8 h-8" /> },
    { number: "4.8", label: "User Rating", icon: <Star className="w-8 h-8" /> }
  ];

  return (
    <div className={`w-full overflow-hidden transition-all duration-300 mt-16`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
          >
            About <span className="text-pink-400">TravelGrid</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-xl sm:text-2xl mb-8 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
          >
            Your all-in-one travel platform designed to streamline your travel
            planning experience
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-1 bg-pink-400 mx-auto rounded-full"
          />
        </div>
      </motion.div>

      {/* Mission Section */}
      <section
        id="mission"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-pink-400 mr-3" />
                <h2 className={`text-3xl sm:text-4xl font-bold transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  Our <span className="text-pink-400">Mission</span>
                </h2>
              </div>
              <p className={`text-lg mb-6 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                TravelGrid is a comprehensive platform that simplifies travel
                planning. From booking flights, trains, or buses to renting
                vehicles, reserving hotels, or exploring expertly curated travel
                guides, TravelGrid offers a seamless and intuitive experience.
              </p>
              <p className={`text-lg leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Our mission is to make travel planning accessible, affordable,
                and enjoyable for everyone. Whether you're a solo traveler or
                planning a group adventure, TravelGrid simplifies every step of
                your journey.
              </p>
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  One Platform
                </h3>
                <p className="text-pink-100">
                  Everything you need for your perfect trip
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        id="vision"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.vision ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Future Vision
                </h3>
                <p className="text-blue-100">
                  Revolutionizing how the world travels
                </p>
              </div>
            </motion.div>
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-pink-400 mr-3" />
                <h2 className={`text-3xl sm:text-4xl font-bold transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  Our <span className="text-pink-400">Vision</span>
                </h2>
              </div>
              <p className={`text-lg mb-6 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                We envision a world where travel planning is effortless and inspiring.
                TravelGrid aims to become the global leader in comprehensive travel solutions,
                connecting travelers with authentic experiences and local communities.
              </p>
              <p className={`text-lg leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                By leveraging cutting-edge technology and fostering a vibrant community of
                travelers and contributors, we're building the future of travel - one that's
                sustainable, inclusive, and accessible to all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        id="story"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.story ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Our <span className="text-pink-400">Story</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Born from a passion for travel and technology, TravelGrid emerged from the recognition
              that travel planning could be simplified, more engaging, and accessible to everyone.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-pink-400 to-purple-600"></div>

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className={`rounded-lg p-6 border transition-all duration-300 ${isDarkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-pink-400'
                    : 'bg-gradient-to-br from-white to-pink-200 border-pink-600 hover:border-pink-300 shadow-xl shadow-gray-600'
                    }`}>
                    <div className="flex items-center mb-2">
                      <div className="text-pink-400 mr-2">{item.icon}</div>
                      <span className="text-pink-400 font-bold text-lg">{item.year}</span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{item.title}</h3>
                    <p className={`transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{item.description}</p>
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-400 rounded-full border-4 border-gray-900"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section
        id="team"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.team ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Our <span className="text-pink-400">Team</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              A diverse group of passionate individuals working together to revolutionize travel planning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-lg p-6 text-center border transition-all duration-300 ${isDarkMode
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-pink-400'
                  : 'bg-gradient-to-br from-white to-pink-200 border-pink-600 hover:border-pink-300 shadow-xl shadow-gray-600'
                  }`}
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className={`text-xl font-bold mb-2 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{member.name}</h3>
                <p className="text-pink-400 font-semibold mb-3">{member.role}</p>
                <p className={`text-sm leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section
        id="achievements"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Our <span className="text-pink-400">Impact</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Numbers that reflect our growing community and commitment to excellence
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg p-8 text-center text-white transform transition-all duration-300"
              >
                <div className="flex justify-center mb-4 text-white">
                  {achievement.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{achievement.number}</div>
                <div className="text-pink-100 font-semibold">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section
        id="contact"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Get in <span className="text-pink-400">Touch</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Have questions, suggestions, or want to contribute? We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`rounded-lg p-8 border transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-pink-400'
                : 'bg-gradient-to-br from-white to-pink-200 border-pink-600 hover:border-pink-300 shadow-xl shadow-gray-600'
                }`}
            >
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-pink-400 mr-3" />
                <h3 className={`text-xl font-bold transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Email Us</h3>
              </div>
              <p className={`mb-4 transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                For general inquiries, partnerships, or support
              </p>
              <a
                href="mailto:contact@travelgrid.com"
                className="text-pink-400 hover:text-pink-300 transition-colors duration-200 font-semibold"
              >
                contact@travelgrid.com
              </a>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`rounded-lg p-8 border transition-all duration-300 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-pink-400'
                : 'bg-gradient-to-br from-white to-pink-200 border-pink-600 hover:border-pink-300 shadow-xl shadow-gray-600'
                }`}
            >
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-pink-400 mr-3" />
                <h3 className={`text-xl font-bold transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>GitHub</h3>
              </div>
              <p className={`mb-4 transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Contribute to our open-source project
              </p>
              <a
                href="https://github.com/Adarsh-Chaubey03/TravelGrid"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors duration-200 font-semibold"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl font-bold text-center mb-12 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
          >
            Why Choose <span className="text-pink-400">TravelGrid?</span>
          </motion.h2>

          {/*Enhanced UI feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}

                whileHover={{ scale: 1.1 }}
                className="group relative h-64 cursor-pointer"
              //onMouseEnter={() => setActiveFeature(index)}
              //style={{ perspective: '1000px' }}
              >
                <div className="relative w-full h-full transition-transform duration-700 group-hover:rotate-y-180"
                  style={{ transformStyle: 'preserve-3d' }}>
                  {/* Front */}
                  <div className={`absolute inset-0 rounded-lg p-6 border transition-all duration-300 ${isDarkMode
                    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 border-gray-700 group-hover:border-cyan-400'

                    : 'bg-gradient-to-br from-white to-pink-200 border-pink-600 group-hover:border-pink-300 shadow-xl shadow-gray-600'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}>
                    {/* Icon with Circular Gradient BG */}
                      <div className="w-14 h-14 flex items-center justify-center rounded-full mb-6 
                        bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-purple-900/50  ">
                         {React.cloneElement(feature.icon, { size: 32})}
                      </div>
                    <h3 className={`text-xl font-bold mb-3 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                    <p className={`leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature.description}</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-700 rounded-lg p-6 border border-pink-400 flex flex-col items-center justify-center text-center hover:from-pink-500 hover:to-purple-600 transition-all duration-300"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    onClick={() => handleCardClick(feature.path)}>
                    <h3 className="text-7xl mb-4">{feature.icon}</h3>
                    <h3 className="text-xl font-bold text-white mb-3">Explore the Feature</h3>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GSSoC Section */}
      <section
        id="gssoc"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? "text-pink-300" : "text-black"} bg-opacity-50 transition-all duration-1000 ${isVisible.gssoc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}

          >
            Part of{" "}
            <span className="text-pink-400">
              GirlScript Summer of Code 2025
            </span>
          </motion.h2>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-lg p-8 border border-pink-400"
          >
            <p className={`text-lg mb-6 leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              TravelGrid is proudly part of GirlScript Summer of Code 2025
              (GSSoC), providing contributors with an opportunity to collaborate
              on a real-world application, honing their skills and building a
              meaningful product.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-transform duration-200">
                Open Source
              </div>
              <div className="bg-purple-500 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-transform duration-200">
                Community Driven
              </div>
              <div className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-transform duration-200">
                Learning Focused
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <GitHubStats></GitHubStats>

      {/* Tech Stack Section */}
      <section
        id="tech"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.tech ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl font-bold text-center mb-12 transition-all duration-300 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Built with Modern <span className="text-pink-400">Technology</span>
          </motion.h2>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className={`${tech.color} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-lg`}
              >
                {tech.name}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className={`mt-4 text-lg transition-all duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              We use cutting-edge technologies to ensure a fast, responsive, and
              modern user experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Frontend", desc: "React.js with modern hooks and components", color: "text-blue-400" },
              { title: "Styling", desc: "Tailwind CSS for responsive design", color: "text-cyan-400" },
              { title: "Development", desc: "Vite for fast build and development", color: "text-yellow-400" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-pink-400 transition-all duration-300"
              >
                <h4 className={`${item.color} font-bold mb-2 text-lg`}>{item.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        data-animate
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`text-4xl font-bold mb-4 transition-all duration-300 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Ready to Start Your <span className="text-pink-400">Journey?</span>
          </motion.h2>

          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-xl mb-8 transition-all duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Join thousands of travelers who trust TravelGrid for their adventures
          </motion.p>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-pink-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
            >
              Explore TravelGrid
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                window.open(
                  "https://github.com/Adarsh-Chaubey03/TravelGrid",
                  "_blank"
                )
              }
              className="border-2 border-pink-500 text-pink-400 px-8 py-3 rounded-lg font-semibold hover:bg-pink-500 hover:text-white transition-colors duration-300"
            >
              View on GitHub
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;
