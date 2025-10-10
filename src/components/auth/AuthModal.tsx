// src/components/auth/AuthModal.tsx - VERSÃO CORRIGIDA

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
// <-- MUDANÇA 1: Importa a função específica, de forma nomeada
import { initializeGoogleButton } from '../../services/googleAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const { login, register, loading: globalLoading, user, loginWithGoogleToken } = useUser();
  const loading = isSubmitting || globalLoading;

  useEffect(() => {
    if (isOpen) {
      setEmail(''); setPassword(''); setConfirmPassword(''); setName('');
      setLocalError(null); setLocalSuccess(null); setShowPassword(false); setIsSubmitting(false);
      setTimeout(() => {
        if (mode === 'register') {
          nameInputRef.current?.focus();
        } else {
          emailInputRef.current?.focus();
        }
      }, 10);
    }
  }, [mode, isOpen]);

  useEffect(() => {
    if (user && user.isLoggedIn && isOpen) {
      setLocalSuccess(t('login_successful', { defaultValue: 'Login realizado com sucesso.' }));
      const timer = setTimeout(() => { onClose(); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose, t]);

  useEffect(() => {
    if (!isOpen || mode !== 'login') return;
    const el = googleButtonRef.current;
    if (!el) return;
    try {
        // <-- MUDANÇA 2: Usa a função importada diretamente
        initializeGoogleButton(el, async (credential) => {
            await loginWithGoogleToken(credential);
        });
    } catch (e) {
      console.warn('Falha ao inicializar Google Button', e);
    }
  }, [isOpen, mode, loginWithGoogleToken]);

  // ... (o resto do seu código, como validateForm e handleSubmit, continua o mesmo)
  const validateForm = () => {
    setLocalError(null);
    if (!email || !email.includes('@')) {
      setLocalError(t('invalid_email', { defaultValue: 'Email inválido.' }));
      return false;
    }
    if (!password || password.length < 6) {
      setLocalError(t('password_min_length', { defaultValue: 'A senha deve ter pelo menos 6 caracteres.' }));
      return false;
    }
    if (mode === 'register') {
      if (!name || name.trim().length < 2) {
        setLocalError(t('name_min_length', { defaultValue: 'Nome é obrigatório.' }));
        return false;
      }
      if (password !== confirmPassword) {
        setLocalError(t('passwords_do_not_match', { defaultValue: 'As senhas não coincidem.' }));
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setLocalError(null);
    setLocalSuccess(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name.trim(), email, password);
      }
    } catch (err: any) {
      let errorMessage = err?.message || t('registration_failed', { defaultValue: 'Ocorreu um erro.' });
      const low = String(errorMessage).toLowerCase();
      if (low.includes('invalid') || low.includes('incorrect')) {
        errorMessage = t('invalid_credentials_short', { defaultValue: 'Credenciais inválidas.' });
      } else if (low.includes('already exists') || low.includes('already_registered') || low.includes('exists')) {
        errorMessage = t('account_exists', { defaultValue: 'Conta já existe.' });
      }
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleForgotPassword = () => {
    const siteUrl = typeof window !== 'undefined' && (window as any).wpData?.siteUrl ? (window as any).wpData.siteUrl : '';
    const target = siteUrl ? `${String(siteUrl).replace(/\/$/, '')}/wp-login.php?action=lostpassword` : '/wp-login.php?action=lostpassword';
    window.open(target, '_blank');
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      <div className="relative z-[101] bg-surface rounded-xl shadow-2xl max-w-md w-full border border-white/10" aria-live="polite">
        <div className="flex justify-between items-center p-6 border-b border-white/10">{/* ... */}</div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>{/* ... (todo o seu JSX aqui) */}</form>
      </div>
    </div>
  );
};

// <-- MUDANÇA 3: Simplificado para apenas a exportação padrão, seguindo o padrão de componentes
export default AuthModal;