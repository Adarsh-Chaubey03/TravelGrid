import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// ✅ All translations defined here
const translations = {
  en: {
    welcome: "Welcome to our Travel Platform!",
    description: "Discover amazing places around the world."
  },
  hi: {
    welcome: "हमारे ट्रैवल प्लेटफ़ॉर्म पर आपका स्वागत है!",
    description: "दुनिया भर की अद्भुत जगहों की खोज करें।"
  },
  es: {
    welcome: "¡Bienvenido a nuestra plataforma de viajes!",
    description: "Descubre lugares increíbles en todo el mundo."
  },
  bn: {
    welcome: "আমাদের ভ্রমণ প্ল্যাটফর্মে স্বাগতম!",
    description: "সারা বিশ্বের আশ্চর্যজনক জায়গাগুলি আবিষ্কার করুন।"
  },
  ta: {
    welcome: "எங்கள் பயண தளத்திற்கு வரவேற்கிறோம்!",
    description: "உலகம் முழுவதும் அற்புதமான இடங்களை கண்டறியுங்கள்."
  },
  te: {
    welcome: "మా ట్రావెల్ ప్లాట్‌ఫారమ్‌కు స్వాగతం!",
    description: "ప్రపంచంలోని అద్భుతమైన ప్రదేశాలను కనుగొనండి."
  },
  mr: {
    welcome: "आमच्या ट्रॅव्हल प्लॅटफॉर्मवर आपले स्वागत आहे!",
    description: "जगभरातील अद्भुत ठिकाणे शोधा."
  },
  gu: {
    welcome: "અમારા ટ્રાવેલ પ્લેટફોર્મમાં આપનું સ્વાગત છે!",
    description: "વિશ્વભરના અદ્ભુત સ્થળો શોધો."
  },
  kn: {
    welcome: "ನಮ್ಮ ಪ್ರವಾಸ ವೇದಿಕೆಗೆ ಸುಸ್ವಾಗತ!",
    description: "ವಿಶ್ವದ ಅದ್ಭುತ ಸ್ಥಳಗಳನ್ನು ಅನ್ವೇಷಿಸಿ."
  },
  ml: {
    welcome: "ഞങ്ങളുടെ ട്രാവൽ പ്ലാറ്റ്‌ഫോമിലേക്ക് സ്വാഗതം!",
    description: "ലോകമെമ്പാടുമുള്ള അത്ഭുതകരമായ സ്ഥലങ്ങൾ കണ്ടെത്തുക."
  },
  de: {
    welcome: "Willkommen auf unserer Reiseplattform!",
    description: "Entdecken Sie erstaunliche Orte auf der ganzen Welt."
  }
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Available languages (all supported languages)
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // Change language
  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);

      // Save to localStorage
      localStorage.setItem('preferredLanguage', languageCode);

      // Update document direction for RTL languages
      if (languageCode === 'ar' || languageCode === 'he') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = languageCode;
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = languageCode;
      }

      return { success: true };
    } catch (error) {
      console.error('Language change failed:', error);
      return { success: false, error: 'Language change failed' };
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // Initialize language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];

    // Check if saved language is supported
    const supportedLanguage = languages.find(lang => lang.code === savedLanguage);

    // Check if browser language is supported
    const browserSupportedLanguage = languages.find(lang => lang.code === browserLanguage);

    // Set language priority: saved > browser > default
    let initialLanguage = 'en';
    if (supportedLanguage) {
      initialLanguage = savedLanguage;
    } else if (browserSupportedLanguage) {
      initialLanguage = browserSupportedLanguage.code;
    }

    setCurrentLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, [i18n]);

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    getCurrentLanguageInfo,
    isRTL: currentLanguage === 'ar' || currentLanguage === 'he',
    translations   // ✅ Add translations here for direct access
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};