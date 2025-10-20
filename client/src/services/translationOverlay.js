/**
 * Translation Overlay Service for AR Travel Guide
 * Provides real-time language translation with visual overlays
 */

// Mock translation database for demonstration
const translationDatabase = {
  'en': {
    'Historical Building': 'Edificio Histórico',
    'Landmark': 'Punto de Referencia',
    'Restaurant': 'Restaurante',
    'Museum': 'Museo',
    'Park': 'Parque',
    'Monument': 'Monumento',
    'Hotel': 'Hotel',
    'Transport Station': 'Estación de Transporte',
    'Shopping Center': 'Centro Comercial',
    'Cultural Site': 'Sitio Cultural',
    'Hello': 'Hola',
    'Welcome': 'Bienvenido',
    'Information': 'Información',
    'History': 'Historia',
    'Nearby': 'Cerca',
    'Distance': 'Distancia',
    'Meters': 'Metros',
    'Kilometers': 'Kilómetros'
  },
  'fr': {
    'Historical Building': 'Bâtiment Historique',
    'Landmark': 'Point de Repère',
    'Restaurant': 'Restaurant',
    'Museum': 'Musée',
    'Park': 'Parc',
    'Monument': 'Monument',
    'Hotel': 'Hôtel',
    'Transport Station': 'Gare de Transport',
    'Shopping Center': 'Centre Commercial',
    'Cultural Site': 'Site Culturel',
    'Hello': 'Bonjour',
    'Welcome': 'Bienvenue',
    'Information': 'Information',
    'History': 'Histoire',
    'Nearby': 'À Proximité',
    'Distance': 'Distance',
    'Meters': 'Mètres',
    'Kilometers': 'Kilomètres'
  },
  'de': {
    'Historical Building': 'Historisches Gebäude',
    'Landmark': 'Wahrzeichen',
    'Restaurant': 'Restaurant',
    'Museum': 'Museum',
    'Park': 'Park',
    'Monument': 'Denkmal',
    'Hotel': 'Hotel',
    'Transport Station': 'Verkehrshalle',
    'Shopping Center': 'Einkaufszentrum',
    'Cultural Site': 'Kulturelle Stätte',
    'Hello': 'Hallo',
    'Welcome': 'Willkommen',
    'Information': 'Information',
    'History': 'Geschichte',
    'Nearby': 'In der Nähe',
    'Distance': 'Entfernung',
    'Meters': 'Meter',
    'Kilometers': 'Kilometer'
  }
};

/**
 * Translate text from source language to target language
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code (e.g., 'en')
 * @param {string} targetLang - Target language code (e.g., 'es')
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, sourceLang = 'en', targetLang = 'es') => {
  // In a real implementation, this would call a translation API
  // For example, Google Translate API, Microsoft Translator, or similar
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Check if we have the translation in our database
  if (translationDatabase[targetLang] && translationDatabase[targetLang][text]) {
    return translationDatabase[targetLang][text];
  }
  
  // Return original text if no translation found
  return text;
};

/**
 * Translate multiple texts at once
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} sourceLang - Source language code
 * @param {string} targetLang - Target language code
 * @returns {Promise<Array<string>>} Array of translated texts
 */
export const translateBatch = async (texts, sourceLang = 'en', targetLang = 'es') => {
  // In a real implementation, this would batch translate for efficiency
  return Promise.all(
    texts.map(text => translateText(text, sourceLang, targetLang))
  );
};

/**
 * Get available languages for translation
 * @returns {Array<Object>} Array of language objects with code and name
 */
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' }
  ];
};

/**
 * Detect the language of a given text
 * @param {string} text - Text to analyze
 * @returns {Promise<string>} Detected language code
 */
export const detectLanguage = async (text) => {
  // In a real implementation, this would use a language detection API
  // For this demo, we'll assume English
  return 'en';
};

/**
 * Create a visual translation overlay
 * @param {string} originalText - Original text
 * @param {string} translatedText - Translated text
 * @param {Object} position - Position coordinates {x, y}
 * @param {Object} options - Display options
 * @returns {Object} Overlay configuration
 */
export const createTranslationOverlay = (originalText, translatedText, position, options = {}) => {
  return {
    id: `overlay-${Date.now()}`,
    originalText,
    translatedText,
    position,
    visible: true,
    style: {
      backgroundColor: options.backgroundColor || 'rgba(0, 0, 0, 0.7)',
      textColor: options.textColor || '#ffffff',
      fontSize: options.fontSize || '14px',
      fontFamily: options.fontFamily || 'Arial, sans-serif',
      padding: options.padding || '8px',
      borderRadius: options.borderRadius || '4px',
      maxWidth: options.maxWidth || '200px'
    }
  };
};

export default {
  translateText,
  translateBatch,
  getAvailableLanguages,
  detectLanguage,
  createTranslationOverlay
};