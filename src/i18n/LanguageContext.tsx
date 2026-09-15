import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLanguage, LanguageInfo, SOUTH_AFRICAN_LANGUAGES } from './types';
import { translations } from './translations';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageInfo: LanguageInfo;
  languages: LanguageInfo[];
  t: (key: string, fallback?: string) => string;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'avani_preferred_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SOUTH_AFRICAN_LANGUAGES.some(l => l.code === saved)) {
        return saved as SupportedLanguage;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const currentLanguageInfo = useMemo(() => {
    return SOUTH_AFRICAN_LANGUAGES.find(l => l.code === currentLanguage) || SOUTH_AFRICAN_LANGUAGES[0];
  }, [currentLanguage]);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[currentLanguage];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    const enDict = translations['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        currentLanguageInfo,
        languages: SOUTH_AFRICAN_LANGUAGES,
        t,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
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
