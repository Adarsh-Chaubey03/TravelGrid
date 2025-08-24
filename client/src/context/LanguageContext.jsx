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

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Supported languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    // add more as needed
  ];

  // Translations object
  const translations = {
    en: { welcome: "Welcome", description: "Explore the world with TravelGrid" },
    hi: { welcome: "स्वागत है", description: "TravelGrid के साथ दुनिया की खोज करें" },
    es: { welcome: "Bienvenido", description: "Explora el mundo con TravelGrid" },
    // add more translations as needed
  };

  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredLanguage', languageCode);
      }
      if (typeof document !== 'undefined') {
        if (languageCode === 'ar' || languageCode === 'he') {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = languageCode;
        } else {
          document.documentElement.dir = 'ltr';
          document.documentElement.lang = languageCode;
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Language change failed:', error);
      return { success: false, error: 'Language change failed' };
    }
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  useEffect(() => {
    let savedLanguage;
    let browserLanguage;
    if (typeof window !== 'undefined') {
      savedLanguage = localStorage.getItem('preferredLanguage');
      browserLanguage = navigator.language.split('-')[0];
    }

    const supportedLanguage = languages.find(lang => lang.code === savedLanguage);
    const browserSupportedLanguage = languages.find(lang => lang.code === browserLanguage);

    let initialLanguage = 'en';
    if (supportedLanguage) initialLanguage = savedLanguage;
    else if (browserSupportedLanguage) initialLanguage = browserSupportedLanguage.code;

    setCurrentLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, [i18n]);

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    getCurrentLanguageInfo,
    isRTL: currentLanguage === 'ar' || currentLanguage === 'he',
    translations // ✅ added
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
