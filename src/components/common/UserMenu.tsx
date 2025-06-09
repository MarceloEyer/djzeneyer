import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Award, Music, ChevronDown, ShoppingBag } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface UserMenuProps {
  orientation?: 'horizontal' | 'vertical';
}

const UserMenu: React.FC<UserMenuProps> = ({ orientation = 'horizontal' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUser();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* User menu button */}
      <button 
        className={`flex items-center space-x-2 focus:outline-none transition-all duration-200 hover:bg-white/5 rounded-lg p-2 ${
          orientation === 'vertical' ? 'w-full' : ''
        }`}
        onClick={toggleMenu}
      >
        <div className="relative">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0d96ff&color=fff`}
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover border-2 border-primary"
          />
          <span className="absolute -bottom-1 -right-1 bg-success text-xs rounded-full w-4 h-4 flex items-center justify-center border border-background">
            3
          </span>
        </div>
        <div className={orientation === 'vertical' ? 'flex flex-col items-start' : ''}>
          <span className="text-sm font-medium">{user.name}</span>
          {orientation === 'vertical' && (
            <span className="text-xs text-white/60">Zen Apprentice</span>
          )}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`absolute z-20 w-64 mt-2 py-2 bg-surface rounded-lg shadow-xl border border-white/10 ${
          orientation === 'vertical' ? 'left-0' : 'right-0'
        }`}>
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-white/60">{user.email}</p>
            <div className="flex items-center space-x-1 text-xs text-white/60 mt-1">
              <span>Zen Apprentice</span>
              <span>•</span>
              <span>Level 3</span>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: '87.5%' }}
              ></div>
            </div>
            <p className="text-xs text-white/60 mt-1">
              350/400 XP to next level
            </p>
          </div>
          
          <div className="py-1">
            <Link
              to="/my-account"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>My Account</span>
            </Link>
            <Link
              to="/my-account"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={16} />
              <span>My Orders</span>
            </Link>
            <Link
              to="/my-account"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Award size={16} />
              <span>Achievements</span>
            </Link>
            <Link
              to="/my-account"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Music size={16} />
              <span>My Music</span>
            </Link>
            <Link
              to="/my-account"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className="border-t border-white/10 pt-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center space-x-2 transition-colors"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;