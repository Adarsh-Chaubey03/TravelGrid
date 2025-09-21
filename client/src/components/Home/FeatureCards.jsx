import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { MapPin, Star, Shield, Clock, Users, Heart } from "lucide-react";

const FeatureCards = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      title: t('home.features.greatPrices.title'),
      desc: t('home.features.greatPrices.desc')
    },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
      title: t('home.features.lovedByTravelers.title'),
      desc: t('home.features.lovedByTravelers.desc')
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
      title: t('home.features.easyBooking.title'),
      desc: t('home.features.easyBooking.desc')
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-3.7 4.99c-.47.63-.49 1.49-.05 2.15L14 18h-2v6h4zm-8-2v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 6.54 8H5c-.8 0-1.54.37-2.01 1L-.71 13.99c-.47.63-.49 1.49-.05 2.15L2 18H0v6h12z" />
      </svg>
    ),
      title: t('home.features.support.title'),
      desc: t('home.features.support.desc')
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 }
  })
};

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16">
          <motion.h2
            className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-300 break-words ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('home.whyChoose')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              TravelGrid
            </span>
            ?
          </motion.h2>
          <motion.p
            className={`text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-300 break-words ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t('home.featureDescription')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              className="group relative"
            >
              <div className={`backdrop-blur-md rounded-2xl p-8 border transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full ${isDarkMode
                ? 'bg-black/20 border-white/20 hover:border-white/40 hover:shadow-pink-500/20'
                : 'bg-white/20 border-gray-200/50 hover:border-gray-300/70 hover:shadow-pink-500/20'
                }`}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-6 transition-all duration-300 shadow-lg"
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>
                <h3 className={`text-xl font-semibold mb-4 group-hover:text-pink-300 transition-colors duration-300 break-words ${
                  isDarkMode
                  ? 'text-white group-hover:text-pink-400'
                  : 'text-gray-900 group-hover:text-pink-500'
                  }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed break-words ${
                  isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-900'
                  }`}>
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeatureCards;
