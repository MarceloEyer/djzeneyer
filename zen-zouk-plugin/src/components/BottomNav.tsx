import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, BookOpen, Award, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/desafio', icon: Target, label: 'Desafio' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/badges', icon: Award, label: 'Badges' },
  { to: '/config', icon: Settings, label: 'Config' }
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-white/10 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-white/60'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center gap-1"
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={22} />
                <span className="text-xs font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
