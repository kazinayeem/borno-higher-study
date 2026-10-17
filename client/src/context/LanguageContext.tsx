import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { en } from '../locales/en.js';
import { bn } from '../locales/bn.js';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  isBengali: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, fallback?: string) => string;
  formatNumber: (value: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'borno_lang';

const translations: Record<Language, any> = {
  en,
  bn,
};

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Strictly default to 'en' on first visit
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'bn') {
        return saved;
      }
    }
    return 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = 'ltr';
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // ignore storage errors
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = useMemo(() => {
    return (path: string, fallback?: string): string => {
      const keys = path.split('.');

      // Helper to traverse object
      const getVal = (dict: any): string | undefined => {
        let current = dict;
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k];
          } else {
            return undefined;
          }
        }
        return typeof current === 'string' ? current : undefined;
      };

      // 1. Try active language
      const activeVal = getVal(translations[language]);
      if (activeVal !== undefined) return activeVal;

      // 2. Fallback to English
      const enVal = getVal(translations.en);
      if (enVal !== undefined) return enVal;

      // 3. Fallback text or raw key
      return fallback !== undefined ? fallback : path;
    };
  }, [language]);

  const formatNumber = (value: number | string): string => {
    const str = String(value);
    if (language !== 'bn') return str;
    return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)] || digit);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isBengali: language === 'bn',
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, language, setLanguage, toggleLanguage, isBengali, formatNumber } = useLanguage();
  return { t, language, setLanguage, toggleLanguage, isBengali, formatNumber };
};
