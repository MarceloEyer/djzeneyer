/**
 * UserMenu Component - Account & Auth Navigation
 * 
 * Exibe informações do usuário logado e links de navegação da conta.
 * Integrado com UserContext para estado de autenticação.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  ChevronDown,
  ShoppingBag,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../contexts/UserContext';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';

const UserMenu: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useUser();
  const currentLang = normalizeLanguage(i18n.language);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate(getLocalizedRoute('', currentLang));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuLinks = [
    {
      to: getLocalizedRoute('dashboard', currentLang),
      label: t('nav.dashboard'),
      icon: <LayoutDashboard size={18} />
    },
    {
      to: getLocalizedRoute('my-account', currentLang),
      label: t('nav.my_account'),
      icon: <User size={18} />
    },
    {
      to: getLocalizedRoute('my-account/orders', currentLang),
      label: t('account.orders.title'),
      icon: <ShoppingBag size={18} />
    },
    {
      to: getLocalizedRoute('my-account/settings', currentLang),
      label: t('account.tabs.settings'),
      icon: <Settings size={18} />
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <User size={16} className="text-primary" />
        </div>
        <span className="hidden md:block text-sm font-medium mr-1 max-w-[100px] truncate">
          {user.name || user.email.split('@')[0]}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-white/5 mb-2">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <div className="space-y-1 px-2">
            {menuLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <span className="text-white/40 group-hover:text-primary transition-colors">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-white/5 px-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors text-left"
            >
              <LogOut size={18} />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
