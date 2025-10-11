// src/components/common/UserMenu.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

interface UserMenuProps {
  orientation?: 'horizontal' | 'vertical';
}

const UserMenu: React.FC<UserMenuProps> = ({ orientation = 'horizontal' }) => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  console.log('[UserMenu] Renderizado - user:', user);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    console.log('[UserMenu] 🚪 Logout iniciado');
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  if (!user?.isLoggedIn) {
    return null;
  }

  // Versão vertical (para mobile)
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Link 
          to="/dashboard" 
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <User size={18} />
          <span>Dashboard</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full btn btn-outline flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Versão horizontal (para desktop)
  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-primary/50"
          />
        ) : (
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <User className="text-primary" size={16} />
          </div>
        )}
        <span className="font-semibold hidden lg:inline">{user.name}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center">
                    <User className="text-primary" size={24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{user.name}</p>
                  <p className="text-sm text-white/60 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <User size={18} className="text-primary" />
                <span className="font-semibold">Dashboard</span>
              </Link>

              <Link
                to="/my-account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <Settings size={18} className="text-secondary" />
                <span className="font-semibold">My Account</span>
              </Link>

              <Link
                to="/my-account?tab=orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <ShoppingBag size={18} className="text-accent" />
                <span className="font-semibold">My Orders</span>
              </Link>

              <Link
                to="/my-account?tab=achievements"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <Award size={18} className="text-success" />
                <span className="font-semibold">Achievements</span>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="border-t border-white/10 p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-semibold"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
