import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import CustomCarousel from "../Custom/CustomCarousel";
import SkeletonGuide from "../SkeletonGuide"; // loader
import { useTranslation } from "react-i18next";

// Add keys for translation mapping
const guides = [
  {
    nameKey: "0.name",
    expertiseKey: "0.expertise",
    bioKey: "0.bio",
    cardImage: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    nameKey: "1.name",
    expertiseKey: "1.expertise",
    bioKey: "1.bio",
    cardImage: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    nameKey: "2.name",
    expertiseKey: "2.expertise",
    bioKey: "2.bio",
    cardImage: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    nameKey: "3.name",
    expertiseKey: "3.expertise",
    bioKey: "3.bio",
    cardImage: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    nameKey: "4.name",
    expertiseKey: "4.expertise",
    bioKey: "4.bio",
    cardImage: "https://randomuser.me/api/portraits/women/43.jpg",
  },
  {
    nameKey: "5.name",
    expertiseKey: "5.expertise",
    bioKey: "5.bio",
    cardImage: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    nameKey: "6.name",
    expertiseKey: "6.expertise",
    bioKey: "6.bio",
    cardImage: "https://randomuser.me/api/portraits/men/74.jpg",
  },
];

const TravelGuides = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const handleguide = (guideName) => {
    navigate("/guides", { state: { selectedGuideId: guideName } });
  };

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Map translations
  const translatedGuides = guides.map((guide) => ({
    ...guide,
    name: t(`home.travelGuides.guides.${guide.nameKey}`),
    expertise: t(`home.travelGuides.guides.${guide.expertiseKey}`),
    bio: t(`home.travelGuides.guides.${guide.bioKey}`),
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
            {t("home.travelGuides.heading")}
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-300 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("home.travelGuides.description")}
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
            viewProfileText={t("home.travelGuides.viewProfile")}
            isHome={true}
          />
        )}
      </div>
    </section>
  );
};

export default TravelGuides;
