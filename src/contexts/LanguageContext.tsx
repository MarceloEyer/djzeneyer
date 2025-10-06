// src/contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Nosso dicionário de traduções completo
const translations = {
  'pt-BR': {
    welcome_back: 'Bem-vindo de volta à Zen Tribe',
    join_tribe: 'Junte-se à Zen Tribe',
    // ... adicione todas as outras traduções em português aqui ...
  },
  'en': {
    welcome_back: 'Welcome Back to the Zen Tribe',
    join_tribe: 'Join the Zen Tribe',
    login_successful: 'Login successful! Welcome to the Zen Tribe.',
    invalid_email: 'Please enter a valid email address.',
    password_min_length: 'Password must be at least 6 characters.',
    name_min_length: 'Please enter your full name (minimum 2 characters).',
    passwords_do_not_match: 'Passwords do not match.',
    invalid_credentials_short: 'Invalid email or password.',
    account_exists: 'An account with this email already exists. Please try to log in.',
    // ... etc ...
  }
};

type Language = keyof typeof translations;
// Usamos as chaves do inglês como base, já que é o idioma principal
type TranslationKey = keyof typeof translations['en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // CORREÇÃO: O idioma padrão agora é 'en'
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey): string => {
    // Tenta pegar a tradução do idioma atual, se não encontrar, usa a do inglês como fallback
    return translations[language]?.[key] || translations['en']?.[key] || key;
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