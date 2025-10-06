// src/components/auth/AuthModal.tsx - VERSÃO DE TESTE
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
// import { useLanguage } from '../../contexts/LanguageContext'; // TEMPORARIAMENTE DESATIVADO

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  // const { t } = useLanguage(); // TEMPORARIAMENTE DESATIVADO
  // ... (o resto dos seus useState)

  // ... (useEffect e outras funções) ...
  // No seu JSX, substitua t('chave') pelo texto direto. Exemplo:
  // <h2 ...>{mode === 'login' ? 'Bem-vindo de volta' : 'Junte-se à Tribe'}</h2>
  
  // Por favor, use a versão do AuthModal que você me enviou da última vez,
  // mas com as chamadas a 't()' e 'useLanguage' comentadas/removidas.
  // Se preferir, me envie o seu e eu faço a alteração para você.
};

export default AuthModal;