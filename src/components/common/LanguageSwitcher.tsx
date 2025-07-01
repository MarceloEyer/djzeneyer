// src/components/common/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt-BR', name: 'Português' },
    { code: 'en', name: 'English' },
  ];

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
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button onClick={() => { setLanguage(lang.code as 'pt-BR' | 'en'); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 flex items-center justify-between">
                    <span>{lang.name}</span>
                    {language === lang.code && <Check size={16} className="text-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;