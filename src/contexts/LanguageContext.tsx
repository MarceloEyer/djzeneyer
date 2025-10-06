// src/contexts/LanguageContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Nosso dicionário de traduções. Começaremos com Português do Brasil.
// Podemos adicionar 'en' para inglês, etc., no futuro.
const translations = {
  'pt-BR': {
    // Chaves para o AuthModal
    welcome_back: 'Bem-vindo de volta à Zen Tribe',
    join_tribe: 'Junte-se à Zen Tribe',
    login_successful: 'Login realizado com sucesso! Bem-vindo à Zen Tribe.',
    invalid_email: 'Por favor, insira um endereço de email válido.',
    password_min_length: 'A senha deve ter pelo menos 6 caracteres.',
    name_min_length: 'Por favor, insira seu nome completo (mínimo 2 caracteres).',
    passwords_do_not_match: 'As senhas não coincidem.',
    invalid_credentials_short: 'Email ou senha inválidos. Verifique suas credenciais.',
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
  },
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