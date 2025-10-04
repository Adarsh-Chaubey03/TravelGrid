import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import CustomCarousel from "../Custom/CustomCarousel";
import SkeletonGuide from "../SkeletonGuide";
import { useTranslation } from "react-i18next";

// Guide data using translation keys
const guides = [
  {
    name: "guide.aaravMehta.name",
    expertise: "guide.aaravMehta.expertise",
    bio: "guide.aaravMehta.bio",
    cardImage: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    name: "guide.sofiaRossi.name",
    expertise: "guide.sofiaRossi.expertise",
    bio: "guide.sofiaRossi.bio",
    cardImage: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "guide.jamesCarter.name",
    expertise: "guide.jamesCarter.expertise",
    bio: "guide.jamesCarter.bio",
    cardImage: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    name: "guide.snowyKat.name",
    expertise: "guide.snowyKat.expertise",
    bio: "guide.snowyKat.bio",
    cardImage: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    name: "guide.meiLin.name",
    expertise: "guide.meiLin.expertise",
    bio: "guide.meiLin.bio",
    cardImage: "https://randomuser.me/api/portraits/women/43.jpg",
  },
  {
    name: "guide.ayushiUniyal.name",
    expertise: "guide.ayushiUniyal.expertise",
    bio: "guide.ayushiUniyal.bio",
    cardImage: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    name: "guide.weddyBrown.name",
    expertise: "guide.weddyBrown.expertise",
    bio: "guide.weddyBrown.bio",
    cardImage: "https://randomuser.me/api/portraits/men/74.jpg"
  }
];


const TravelGuides = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const handleguide = (guideName) => {
    navigate("/guides", { state: { selectedGuideId: guideName } });
  };

  // Simulate API fetch with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Map translation keys to actual text
  const translatedGuides = guides.map((guide) => ({
    ...guide,
    name: t(guide.name),
    expertise: t(guide.expertise),
    bio: t(guide.bio),
  }));

  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-16">
          <h2
            className={`text-3xl md:text-4xl font-medium mb-6 transition-all duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t("guides.meetOur")} {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              {t("guides.topTravelGuides")}
            </span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("guides.connectWithGuides")}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonGuide key={i} />
            ))}
          </div>
        ) : (
          <CustomCarousel
            guides={translatedGuides}
            viewprofilehandle={handleguide}
            isHome={true}
          />
        )}
      </div>
    </section>
  );
};

export default TravelGuides;
