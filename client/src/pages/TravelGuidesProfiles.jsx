import {
  Briefcase,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomCarousel from "../components/Custom/CustomCarousel";
import { useTheme } from "../context/ThemeContext";
import "./styles/TravelGuidesCarousel.css";

// Non-pet guides
const guides1 = [
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
];

// Pet guides
const guides = [
  {
    name: "Snowy Kat",
    expertise: "🐾 Mountain Treks & Pet Adventures",
    bio: "Passionate about guiding pet parents through scenic mountain trails and nature escapes. Specialist in safe trekking experiences for dogs and cats.",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
    details: {
      location: "Manali, India",
      languages: "English, Hindi, Himachali",
      certifications: "Certified Pet Adventure Guide (CPAG)",
      experience: "Led 80+ pet-friendly trekking expeditions",
      contact: "rohit.petguide@example.com",
    },
  },
  {
    name: "Ayushi Uniyal",
    expertise: "🏖️ Coastal Getaways",
    bio: "Loves helping travelers explore India's beautiful coastline. Expert in coastal accommodations and beach activities.",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    details: {
      location: "Goa, India",
      languages: "English, Hindi, Konkani",
      certifications: "Certified Coastal Travel Specialist (CCTS)",
      experience: "Helped 100+ families enjoy coastal destinations",
      contact: "ayushi.coastal@example.com",
    },
  },
  {
    name: "Weddy Brown",
    expertise: "🏙️ Urban Travel & City Exploration",
    bio: "Amsterdam-based guide specializing in urban exploration. Knows every hidden park, café, and unique stay in the city.",
    image: "https://randomuser.me/api/portraits/men/74.jpg",
    details: {
      location: "Amsterdam, Netherlands",
      languages: "Dutch, English, German",
      certifications: "Urban Travel Specialist Certified",
      experience: "Guided 150+ comprehensive city tours",
      contact: "weddy.urban@example.com",
    },
  },
];

// Combine all guides for search
const allGuides = [...guides, ...guides1];

const TravelGuidesCarousel = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const profileRef = useRef(null);

  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (location.state) {
      const guidetoview = allGuides.find(
        (guide) => guide.name === location.state.selectedGuideId
      );
      setSelectedGuide(guidetoview);
    }
  }, [location.state]);

  const viewProfile = (guide) => {
    setSelectedGuide(guide);
    setTimeout(() => {
      profileRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const filteredGuides = allGuides.filter(
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
      style={{
        scrollMarginTop: "80px",
        background: isDarkMode
          ? "linear-gradient(to bottom right, #000000, #831843)"
          : "linear-gradient(to bottom right, #ffffffff, #c0349d57)",
      }}
    >
      {/* Heading & Description */}
      <h1
        className="main-heading unique-heading-1"
        style={{ color: isDarkMode ? "#ffffff" : "#1f2937" }}
      >
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
            color: isDarkMode ? "#fcfcfc" : "#1f2937",
          }}
        >
          Explore the world with our expert local guides
        </p>
        <p
          style={{
            fontSize: "16px",
            color: isDarkMode ? "#bcbcbc" : "#6b7280",
            fontWeight: "400",
            lineHeight: "1.5",
          }}
        >
          From Himalayan treks to Italian culture and African safaris
        </p>
      </div>

      {/* Search Bar */}
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
              background: isDarkMode ? "rgba(252, 252, 252, 1)" : "#dc89b854",
              color: isDarkMode ? "#2d3748" : "#1f2937",
              fontWeight: "500",
              borderRadius: "10px",
            }}
          />
          {searchQuery && (
            <button onClick={clearSearch} style={{
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
            }}>✕</button>
          )}
        </div>
        {isSearching && (
          <div style={{ textAlign: "center", marginTop: "15px", color: "#667eea", fontSize: "14px", fontWeight: "500" }}>
            {searchResults.length > 0
              ? `Found ${searchResults.length} guide${searchResults.length !== 1 ? "s" : ""} matching "${searchQuery}"`
              : `No guides found for "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Guides Display */}
      {isSearching && searchQuery ? (
        <div style={{ padding: "0 20px", maxWidth: "1400px", margin: "0 auto" }}>
          {searchResults.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", padding: "20px 0" }}>
              {searchResults.map((guide, index) => (
                <div key={index} className="search-result-card" onClick={() => viewProfile(guide)}>
                  {/* Card content simplified for brevity */}
                  <h4>{guide.name}</h4>
                  <p>{guide.details.location}</p>
                  <p>{guide.expertise}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#667eea" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔍</div>
              <h3>No guides found</h3>
            </div>
          )}
        </div>
      ) : (
        <>
          <CustomCarousel guides={guides1} viewprofilehandle={viewProfile} />
          <hr style={{ margin: "30px 0" }} />
          <p style={{ fontSize: "40px", fontWeight: "700", marginTop: "14px", marginBottom: "50px", color: isDarkMode ? "#fcfcfc" : "#1f2937" }}>
            🐶 Pet Guides 🐱
          </p>
          <CustomCarousel guides={guides} viewprofilehandle={viewProfile} />
        </>
      )}

      {/* Selected Guide Profile */}
      {selectedGuide && (
        <div className="profile-section" ref={profileRef}>
          <h2>{selectedGuide.name}'s Profile</h2>
          <p>{selectedGuide.bio}</p>
          <p>Contact: {selectedGuide.details.contact}</p>
        </div>
      )}
    </section>
  );
};

export default TravelGuidesCarousel;
