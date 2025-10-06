// src/contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

const translations = {
  'pt-BR': {
    welcome_back: 'Bem-vindo de volta à Zen Tribe',
    join_tribe: 'Junte-se à Zen Tribe',
    // ...todas as outras traduções em português...
  },
  'en': {
    welcome_back: 'Welcome Back to the Zen Tribe',
    join_tribe: 'Join the Zen Tribe',
    // ...todas as outras traduções em inglês...
  }
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations['pt-BR'];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');
  const t = useCallback((key: TranslationKey): string => {
    return translations[language]?.[key] || key;
  }, [language]);
  const value = { language, setLanguage, t };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};