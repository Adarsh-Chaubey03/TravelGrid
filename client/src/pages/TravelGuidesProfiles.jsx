import { useState, useRef, useEffect } from "react";
import "./styles/TravelGuidesCarousel.css";
import { useLocation } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  LanguagesIcon,
  Mail,
  MapPin,
  Trophy,
} from "lucide-react";

const guides = [
  {
    name: "Aarav Mehta",
    expertise: "Himalayan Treks",
    bio: "Certified mountain guide with 10+ years of experience leading treks in the Indian Himalayas.",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    details: {
      location: "Manali, Himachal Pradesh",
      languages: "English, Hindi",
      certifications: "Mountaineering Certified (IMF)",
      experience: "Over 50 successful expeditions",
      contact: "aarav.treks@example.com",
    },
  },
  {
    name: "Sofia Rossi",
    expertise: "Italian Cities & Culture",
    bio: "Passionate about art, food, and history. Fluent in English and Italian. Rome-based.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    details: {
      location: "Rome, Italy",
      languages: "Italian, English",
      certifications: "European Cultural Guide",
      experience: "Expert in food tours and city history",
      contact: "sofia.culture@example.com",
    },
  },
  {
    name: "James Carter",
    expertise: "African Safaris",
    bio: "Wildlife expert and safari guide, specializing in Kenya and Tanzania national parks.",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    details: {
      location: "Nairobi, Kenya",
      languages: "English, Swahili",
      certifications: "Wildlife Tourism Certified",
      experience: "Led over 200 safaris",
      contact: "james.safari@example.com",
    },
  },
  {
    name: "Mei Lin",
    expertise: "East Asia Tours",
    bio: "Licensed guide for Japan, China, and South Korea. Loves sharing local traditions and cuisine.",
    image: "https://randomuser.me/api/portraits/women/43.jpg",
    details: {
      location: "Tokyo, Japan",
      languages: "Japanese, Chinese, Korean, English",
      certifications: "East Asia Tourism License",
      experience: "Cultural guide for 8+ years",
      contact: "mei.eastasia@example.com",
    },
  },
  {
    name: "Ayushi Uniyal",
    expertise: "🐾 Pet Travel & Coastal Getaways",
    bio: "Loves helping travelers explore India’s beaches with their furry companions. Expert in pet-friendly accommodations and transport.",
    image: "https://randomuser.me/api/portraits/women/54.jpg",
    details: {
      location: "Goa, India",
      languages: "English, Hindi, Konkani",
      certifications: "Certified Pet Travel Consultant (CPTC)",
      experience: "Helped 100+ pet parents travel stress-free",
      contact: "ayushi.petguide@example.com",
    }
  },
  {
    name: "Weddy Brown",
    expertise: "🐾 Urban Travel with Pets",
    bio: "Amsterdam-based guide specializing in navigating cities with pets. Knows every pet-friendly park, café, and stay in the area.",
    image: "https://randomuser.me/api/portraits/men/74.jpg",
    details: {
      location: "Amsterdam, Netherlands",
      languages: "Dutch, English, German",
      certifications: "Urban Pet Travel Certified",
      experience: "Guided 150+ city tours with pets",
      contact: "Brownweddy.peturban@example.com",
    }
  }

];

const TravelGuidesCarousel = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      const guidetoview = guides.find(
        (guide) => guide.name == location.state.selectedGuideId
      );
      setSelectedGuide(guidetoview);
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const profileRef = useRef(null);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + guides.length) % guides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % guides.length);
  };

  const viewProfile = (guide) => {
    setSelectedGuide(guide);
    setTimeout(() => {
      profileRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filteredGuides = guides.filter(
      (guide) =>
        guide.name.toLowerCase().includes(query.toLowerCase()) ||
        guide.expertise.toLowerCase().includes(query.toLowerCase()) ||
        guide.bio.toLowerCase().includes(query.toLowerCase()) ||
        guide.details.location.toLowerCase().includes(query.toLowerCase()) ||
        guide.details.languages.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredGuides);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <section
      className="travel-guides-section"
      style={{ scrollMarginTop: "80px" }}
    >
      <h1 className="main-heading unique-heading-1">
        Travel <span className="main-span">Guides</span>
      </h1>

      <div
        style={{
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto 40px",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "1.6",
            marginBottom: "10px",
            color: "#fcfcfc",
          }}
        >
          Explore the world with our expert local guides
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "#bcbcbc",
            fontWeight: "400",
            lineHeight: "1.5",
          }}
        >
          From Himalayan treks to Italian culture and African safaris
        </p>
      </div>

      {/* Search Bar Section */}
      <div
        className="search-section"
        style={{
          maxWidth: "800px",
          margin: "10px auto 50px auto",
          padding: "0 20px",
        }}
      >
        <div className="search-tab" tabIndex={0}>
          <input
            type="text"
            placeholder="🔍 Search guides by name, expertise, location, or language..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 30px 15px 25px",
              border: "none",
              outline: "none",
              fontSize: "16px",
              background: "#fcfcfc",
              color: "#2d3748",
              fontWeight: "500",
              borderRadius: "10px",
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "linear-gradient(135deg, #59168b 0%, #9810fa 100%)",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Stats */}
        {isSearching && (
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "#667eea",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {searchResults.length > 0
              ? `Found ${searchResults.length} guide${
                  searchResults.length !== 1 ? "s" : ""
                } matching "${searchQuery}"`
              : `No guides found for "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Guides Display - Search Results or Carousel */}
      {isSearching && searchQuery ? (
        // Search Results View
        <div
          style={{ padding: "0 20px", maxWidth: "1400px", margin: "0 auto" }}
        >
          {searchResults.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "30px",
                padding: "20px 0",
              }}
            >
              {searchResults.map((guide, index) => (
                <div
                  key={index}
                  className="search-result-card"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "25px",
                    padding: "30px",
                    color: "white",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(102, 126, 234, 0.3)";
                  }}
                  onClick={() => viewProfile(guide)}
                >
                  {/* Background decoration */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "100px",
                      height: "100px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={guide.image}
                      alt={guide.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        marginRight: "20px",
                        border: "4px solid rgba(255, 255, 255, 0.3)",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {guide.name}
                      </h4>
                      <p
                        style={{
                          margin: "0",
                          opacity: "0.9",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        📍 {guide.details.location}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <p
                      style={{
                        margin: "8px 0",
                        fontSize: "15px",
                        fontWeight: "600",
                      }}
                    >
                      🎯 <strong>Expertise:</strong> {guide.expertise}
                    </p>
                    <p
                      style={{
                        margin: "8px 0",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        opacity: "0.95",
                      }}
                    >
                      📝 {guide.bio}
                    </p>
                    <p style={{ margin: "8px 0", fontSize: "14px" }}>
                      🗣️ <strong>Languages:</strong> {guide.details.languages}
                    </p>
                    <p style={{ margin: "8px 0", fontSize: "14px" }}>
                      ⭐ <strong>Experience:</strong> {guide.details.experience}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewProfile(guide);
                      }}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                        backdropFilter: "blur(10px)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.3)";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.2)";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      View Full Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "#667eea",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔍</div>
              <h3
                style={{
                  fontSize: "28px",
                  marginBottom: "15px",
                  color: "#2d3748",
                }}
              >
                No guides found
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#718096",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Try searching with different keywords like location, expertise,
                or language. Our guides specialize in various destinations and
                activities worldwide.
              </p>
              <button
                onClick={clearSearch}
                style={{
                  marginTop: "25px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Clear Search & Browse All Guides
              </button>
            </div>
          )}
        </div>
      ) : (
        // Default Carousel View
        <div className="carousel-container">
          <button className="carousel-btn left" onClick={prevSlide}>
            &lt;
          </button>

          <div className="carousel-track">
            {guides.map((guide, index) => {
              let position = "hidden";
              if (index === currentIndex) position = "center";
              else if (index === (currentIndex + 1) % guides.length)
                position = "right";
              else if (
                index ===
                (currentIndex - 1 + guides.length) % guides.length
              )
                position = "left";

              return (
                <div key={index} className={`card ${position}`}>
                  <div className="card-image">
                    <img src={guide.image} alt={guide.name} />
                  </div>
                  <div className="card-info">
                    <h3>{guide.name}</h3>
                    <p className="expertise">{guide.expertise}</p>
                    <p className="bio">{guide.bio}</p>
                    <button
                      className="view-btn"
                      onClick={() => viewProfile(guide)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-btn right" onClick={nextSlide}>
            &gt;
          </button>
        </div>
      )}

      {selectedGuide && (
        <div className="profile-section" ref={profileRef}>
          <div className="profile-heading">
            <div className="line" />
            <h2>{selectedGuide.name}'s Profile</h2>
            <div className="line" />
          </div>
          <div className="flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-lg p-8 bg-gradient-to-br bg-white/5 backdrop:blur-md rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-pink-500/30">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* profile image */}
                <div className="relative p-1 rounded-full bg-gradient-to-br from-pink-500 to-purple-500">
                  <img
                    src={selectedGuide.image}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800"
                  />
                </div>
                {/* name and bio section */}
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedGuide.name}
                  </h2>
                  <p className="text-md text-gray-600 dark:text-gray-300">
                    {selectedGuide.bio}
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <Mail size={24} /><p>{selectedGuide.details.contact}</p>
                </div>
              </div>
              <hr className="my-6 border-gray-200 dark:border-gray-600" />
              <div className="space-y-6">
                {/* location */}
                <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
                  <MapPin size={20} className="text-pink-500 flex-shrink-0" />
                  <p className="text-lg">{selectedGuide.details.location}</p>
                </div>
                {/* expertise */}
                <div className="space-y-2">
                  <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <Trophy size={20} className="text-pink-500" />
                    <span>Expertise</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-pink-500 text-white px-4 py-2 rounded-full font-medium shadow-md transition-transform hover:scale-105">
                      {selectedGuide.expertise}
                    </span>
                  </div>
                </div>

                {/* experience section */}
                <div className="space-y-2">
                  <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <Briefcase size={20} className="text-pink-500" />
                    <span>Experience</span>
                  </h3>
                  <ul className="list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="text-left pr-4" >
                      - {selectedGuide.details.experience}
                    </li>
                  </ul>
                </div>

                {/* Certifications section */}
                <div className="space-y-2">
                  <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <GraduationCap size={20} className="text-pink-500" />
                    <span>Certifications</span>
                  </h3>
                  <ul className="list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="text-left pr-4">
                      - {selectedGuide.details.certifications}
                    </li>
                  </ul>
                </div>
                {/* languages section */}
                <div className="space-y-2">
                  <h3 className="flex items-center space-x-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <LanguagesIcon size={20} className="text-pink-500" />
                    <span>Languages</span>
                  </h3>
                  <ul className="list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="text-left pr-4">
                      - {selectedGuide.details.languages}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TravelGuidesCarousel;
