// src/components/common/LanguageSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react'; // useRef foi adicionado aqui
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
  ];

  // Fecha o dropdown se clicar fora dele
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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white/70 hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change language"
      >
        <Globe size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 lg:left-0 mt-2 w-40 bg-surface border border-white/10 rounded-lg shadow-lg z-50"
          >
            <ul className="py-1">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-primary/20 flex items-center justify-between"
                  >
                    <span>{lang.name}</span>
                    {i18n.language.startsWith(lang.code) && <Check size={16} className="text-primary" />}
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