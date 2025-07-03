// src/components/common/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const getLocalizedPath = (langCode: 'pt' | 'en') => {
    const currentPath = location.pathname;
    // Remove qualquer prefixo de idioma existente (/pt ou /en)
    const basePath = currentPath.replace(/^\/(pt|en)/, '');
    
    // Se for o idioma padrão (inglês), não adiciona prefixo.
    if (langCode === 'en') {
      return basePath || '/';
    }
    
    // Adiciona o prefixo para os outros idiomas.
    return `/${langCode}${basePath || '/'}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button onClick={() => setIsOpen(!isOpen)} className="text-white/70 hover:text-white transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Globe size={24} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-40 bg-surface border border-white/10 rounded-lg shadow-lg z-50">
            <ul className="py-1">
              <li>
                <Link to={getLocalizedPath('pt')} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 flex items-center justify-between" onClick={() => setIsOpen(false)}>
                  <span>Português</span>
                  {i18n.language.startsWith('pt') && <Check size={16} className="text-primary" />}
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('en')} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 flex items-center justify-between" onClick={() => setIsOpen(false)}>
                  <span>English</span>
                  {i18n.language === 'en' && <Check size={16} className="text-primary" />}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;