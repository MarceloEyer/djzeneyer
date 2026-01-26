// src/components/common/UserMenu.tsx
// v3.0 - DIAMOND MASTER: Route Listener Fix & Event Safety + i18n Routes

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  Award, 
  ChevronDown 
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths } from '../../config/routes';

interface UserMenuProps {
  orientation?: 'horizontal' | 'vertical';
}

const UserMenu: React.FC<UserMenuProps> = ({ orientation = 'horizontal' }) => {
  const { user, logout } = useUser();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper para criar link localizado
  const getRouteForKey = (key: string): string => {
    const route = ROUTES_CONFIG.find(r => {
      const pathEn = getLocalizedPaths(r, 'en')[0];
      return pathEn === key;
    });
    if (!route) return `/${key}`;
    const localizedPath = getLocalizedPaths(route, i18n.language as 'en' | 'pt')[0];
    return buildFullPath(localizedPath, i18n.language as 'en' | 'pt');
  };

  // ✅ FIX 1: O segredo para não travar. 
  // Sempre que a Rota (URL) mudar, fecha o menu automaticamente.
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // ✅ FIX 2: Click Outside com lógica segura
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }, 10);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  if (!user) return null;

  // --- VERSÃO MOBILE (VERTICAL) ---
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-2 w-full pt-2 border-t border-white/10 mt-2">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-primary object-cover" />
          ) : (
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"><User size={20} className="text-primary"/></div>
          )}
          <div className="overflow-hidden">
            <div className="font-bold text-sm text-white truncate">{user.name}</div>
            <div className="text-xs text-white/50 truncate">{user.email}</div>
          </div>
        </div>
        
        <Link to={getRouteForKey('dashboard')} className="btn btn-primary w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          <User size={18} /> <span>Dashboard</span>
        </Link>
        <button onClick={handleLogout} className="btn btn-outline w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-950/30 border border-red-500/30 py-2 rounded-lg mt-2 transition-colors">
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>
    );
  }

  // --- VERSÃO DESKTOP (HORIZONTAL / DROPDOWN) ---
  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-full border transition-all duration-200 ${isOpen ? 'bg-white/10 border-primary/50' : 'border-transparent hover:bg-white/5'}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover border border-primary/50"
          />
        ) : (
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20">
            <User className="text-primary" size={16} />
          </div>
        )}
        <ChevronDown 
          size={14} 
          className={`text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 top-full mt-3 w-64 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-white/5 border-b border-white/5">
              <p className="font-bold text-white truncate text-base">{user.name}</p>
              <p className="text-xs text-white/50 truncate font-mono mt-0.5">{user.email}</p>
            </div>

            {/* Links - Rotas dinâmicas agora */}
            <div className="py-2 flex flex-col">
              <Link to={getRouteForKey('dashboard')} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                <User size={18} className="text-white/60 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-white/80 group-hover:text-white">Dashboard</span>
              </Link>
              <Link to={getRouteForKey('my-account')} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                <Settings size={18} className="text-white/60 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-white/80 group-hover:text-white">My Account</span>
              </Link>
              <Link to={`${getRouteForKey('my-account')}?tab=orders`} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                <ShoppingBag size={18} className="text-white/60 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-white/80 group-hover:text-white">My Orders</span>
              </Link>
              <Link to={`${getRouteForKey('my-account')}?tab=achievements`} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group">
                <Award size={18} className="text-white/60 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-white/80 group-hover:text-white">Achievements</span>
              </Link>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-2 bg-white/5">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-semibold"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
