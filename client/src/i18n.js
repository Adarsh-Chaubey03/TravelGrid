import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import esTranslations from './locales/es.json';
import bnTranslations from './locales/bn.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';
import mrTranslations from './locales/mr.json';
import guTranslations from './locales/gu.json';
import knTranslations from './locales/kn.json';
import mlTranslations from './locales/ml.json';
import deTranslations from './locales/de.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  es: {
    translation: esTranslations
  },
  bn: {
    translation: bnTranslations
  },
  ta: {
    translation: taTranslations
  },
  te: {
    translation: teTranslations
  },
  mr: {
    translation: mrTranslations
  },
  gu: {
    translation: guTranslations
  },
  kn: {
    translation: knTranslations
  },
  ml: {
    translation: mlTranslations
  },
  de: {
    translation: deTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['querystring','localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;
