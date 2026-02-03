import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import enUS from './locales/en-US.json';
import enCA from './locales/en-CA.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import fr from './locales/fr.json';
import frFR from './locales/fr-FR.json';
import frCA from './locales/fr-CA.json';
import tl from './locales/tl.json';
import vi from './locales/vi.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import ur from './locales/ur.json';

const resources = {
  en: { translation: en },
  'en-US': { translation: enUS },
  'en-CA': { translation: enCA },
  es: { translation: es },
  zh: { translation: zh },
  fr: { translation: fr },
  'fr-FR': { translation: frFR },
  'fr-CA': { translation: frCA },
  tl: { translation: tl },
  vi: { translation: vi },
  ar: { translation: ar },
  hi: { translation: hi },
  ur: { translation: ur },
};

// Map common locale variants to our supported languages
const getLanguageCode = (locale: string): string => {
  const normalizedLocale = locale.replace('_', '-').toLowerCase();
  const exactLocaleMap: Record<string, string> = {
    'en-us': 'en-US',
    'en-ca': 'en-CA',
    'fr-fr': 'fr-FR',
    'fr-ca': 'fr-CA',
  };
  if (exactLocaleMap[normalizedLocale]) {
    return exactLocaleMap[normalizedLocale];
  }

  const code = normalizedLocale.split('-')[0];
  const languageMap: Record<string, string> = {
    en: 'en-US',
    es: 'es',
    zh: 'zh',
    fr: 'fr-FR',
    tl: 'tl',
    fil: 'tl', // Filipino -> Tagalog
    vi: 'vi',
    ar: 'ar',
    hi: 'hi',
    ur: 'ur',
  };
  return languageMap[code] || 'en-US';
};

// Get browser locale (client-side only)
export const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') {
    return 'en-US';
  }
  const browserLocale = navigator.language || (navigator as any).userLanguage || 'en-US';
  return getLanguageCode(browserLocale);
};

// Initialize with default, will be set to browser language on client side
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en-US', // Default, will be updated on client
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    compatibilityJSON: 'v4', // Use i18next v4 format
  });

// Don't auto-set browser language here - let LanguageSync handle it
// This prevents overriding user preferences on page navigation

export default i18n;
