// src/contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Nosso dicionário de traduções completo
const translations = {
  'pt-BR': {
    // AuthModal
    welcome_back: 'Bem-vindo de volta à Zen Tribe',
    join_tribe: 'Junte-se à Zen Tribe',
    login_successful: 'Login realizado com sucesso! Bem-vindo à Zen Tribe.',
    invalid_email: 'Por favor, insira um endereço de email válido.',
    password_min_length: 'A senha deve ter pelo menos 6 caracteres.',
    name_min_length: 'Por favor, insira seu nome completo (mínimo 2 caracteres).',
    passwords_do_not_match: 'As senhas não coincidem.',
    invalid_credentials_short: 'Email ou senha inválidos.',
    account_exists: 'Já existe uma conta com este email. Tente fazer login.',
    weak_password: 'Escolha uma senha mais forte.',
    too_many_attempts: 'Muitas tentativas de login. Tente novamente mais tarde.',
    auth_failed_try_again: 'Falha na autenticação. Tente fazer login novamente.',
    security_check_failed: 'Falha na verificação de segurança. Atualize a página e tente novamente.',
    registration_failed: 'Ocorreu um erro inesperado no registro.',
    failed_to_initiate_google_login: 'Falha ao iniciar login com Google.',
    close_modal_aria: 'Fechar modal',
    full_name: 'Nome Completo',
    full_name_placeholder: 'Seu nome completo',
    email_address: 'Endereço de Email',
    email_address_placeholder: 'Seu email',
    password: 'Senha',
    password_placeholder: 'Sua senha',
    hide_password_aria: 'Ocultar senha',
    show_password_aria: 'Mostrar senha',
    password_min_length_hint: 'A senha deve ter pelo menos 6 caracteres',
    confirm_password: 'Confirmar Senha',
    confirm_password_placeholder: 'Confirme sua senha',
    forgot_password: 'Esqueceu sua senha?',
    signing_in: 'Entrando...',
    creating_account: 'Criando Conta...',
    sign_in: 'Entrar',
    create_account: 'Criar Conta',
    no_account: 'Não tem uma conta?',
    join_the_tribe: 'Junte-se à Tribe',
    already_have_account: 'Já tem uma conta?',
    or_continue_with: 'ou continue com',
    // HomePage
    home_headline: 'Vivencie o <span class="text-primary">Zen</span> no Zouk Brasileiro',
    home_subheadline: 'Junte-se à Zen Tribe e embarque em uma jornada por paisagens sonoras imersivas e meditação rítmica.',
    play_featured_mix: 'Tocar Mix em Destaque',
    upcoming_events: 'Próximos Eventos',
  },
  'en': {
    // AuthModal
    welcome_back: 'Welcome Back to the Zen Tribe',
    join_tribe: 'Join the Zen Tribe',
    login_successful: 'Login successful! Welcome to the Zen Tribe.',
    invalid_email: 'Please enter a valid email address.',
    password_min_length: 'Password must be at least 6 characters.',
    name_min_length: 'Please enter your full name (minimum 2 characters).',
    passwords_do_not_match: 'Passwords do not match.',
    invalid_credentials_short: 'Invalid email or password.',
    account_exists: 'An account with this email already exists. Please try to log in.',
    weak_password: 'Please choose a stronger password.',
    too_many_attempts: 'Too many login attempts. Please try again later.',
    auth_failed_try_again: 'Authentication failed. Please try to log in again.',
    security_check_failed: 'Security check failed. Please refresh the page and try again.',
    registration_failed: 'An unexpected registration error occurred.',
    failed_to_initiate_google_login: 'Failed to initiate login with Google.',
    close_modal_aria: 'Close modal',
    full_name: 'Full Name',
    full_name_placeholder: 'Your full name',
    email_address: 'Email Address',
    email_address_placeholder: 'Your email',
    password: 'Password',
    password_placeholder: 'Your password',
    hide_password_aria: 'Hide password',
    show_password_aria: 'Show password',
    password_min_length_hint: 'Password must be at least 6 characters',
    confirm_password: 'Confirm Password',
    confirm_password_placeholder: 'Confirm your password',
    forgot_password: 'Forgot your password?',
    signing_in: 'Signing In...',
    creating_account: 'Creating Account...',
    sign_in: 'Sign In',
    create_account: 'Create Account',
    no_account: "Don't have an account?",
    join_the_tribe: 'Join the Tribe',
    already_have_account: 'Already have an account?',
    or_continue_with: 'or continue with',
    // HomePage
    home_headline: 'Experience the <span class="text-primary">Zen</span> in Brazilian Zouk',
    home_subheadline: 'Join the Zen Tribe and embark on a journey through immersive soundscapes and rhythmic meditation.',
    play_featured_mix: 'Play Featured Mix',
    upcoming_events: 'Upcoming Events',
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
  // O idioma padrão agora é 'en'
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKey): string => {
    // Tenta pegar a tradução do idioma atual, se não encontrar, usa a do inglês como fallback
    const langDict = translations[language] as Record<TranslationKey, string>;
    const fallbackDict = translations['en'] as Record<TranslationKey, string>;
    return langDict?.[key] || fallbackDict?.[key] || key;
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