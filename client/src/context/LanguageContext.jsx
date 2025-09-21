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
      initialLanguage = browserSupportedLanguage.code; // Use code from supported language
    }

    setCurrentLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, [i18n]);

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    getCurrentLanguageInfo,
    isRTL: currentLanguage === 'ar' || currentLanguage === 'he'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
