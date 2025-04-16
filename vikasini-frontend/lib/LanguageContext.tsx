'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from './translations';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default language or from localStorage if available
  const [language, setLanguageState] = useState<Language>('english');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load translations based on selected language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Try to get language from localStorage on client-side
        const savedLanguage = typeof window !== 'undefined' 
          ? localStorage.getItem('vikasini-language') as Language 
          : null;
        
        if (savedLanguage && ['english', 'hindi', 'marathi', 'tamil', 'telugu'].includes(savedLanguage)) {
          setLanguageState(savedLanguage);
        }

        // Import translations dynamically
        const { translations } = await import('./translations');
        const allTranslations = translations[language] || translations.english;
        setTranslations(allTranslations);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setIsLoaded(true);
      }
    };

    loadTranslations();
  }, [language]);

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vikasini-language', lang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  // Return loading state until translations are loaded
  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Check for any language context issues 