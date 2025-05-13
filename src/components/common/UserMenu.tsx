import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Award, Music, ChevronDown } from 'lucide-react';
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
        className={`flex items-center space-x-2 focus:outline-none ${
          orientation === 'vertical' ? 'w-full' : ''
        }`}
        onClick={toggleMenu}
      >
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover border-2 border-primary"
          />
          <span className="absolute -bottom-1 -right-1 bg-success text-xs rounded-full w-4 h-4 flex items-center justify-center border border-background">
            {user.level}
          </span>
        </div>
        <div className={orientation === 'vertical' ? 'flex flex-col items-start' : ''}>
          <span className="text-sm font-medium">{user.name}</span>
          {orientation === 'vertical' && (
            <span className="text-xs text-white/60">{user.rank}</span>
          )}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={`absolute z-20 w-56 mt-2 py-2 bg-surface rounded-md shadow-lg border border-white/10 ${
          orientation === 'vertical' ? 'left-0' : 'right-0'
        }`}>
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm font-medium">{user.name}</p>
            <div className="flex items-center space-x-1 text-xs text-white/60">
              <span>{user.rank}</span>
              <span>•</span>
              <span>Level {user.level}</span>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${(user.xp % 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/60 mt-1">
              {user.xp % 100}/100 XP to next level
            </p>
          </div>
          
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>Profile</span>
            </Link>
            <Link
              to="/achievements"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Award size={16} />
              <span>Achievements</span>
            </Link>
            <Link
              to="/playlists"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Music size={16} />
              <span>My Playlists</span>
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-white hover:bg-white/5 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className="border-t border-white/10 pt-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 flex items-center space-x-2"
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