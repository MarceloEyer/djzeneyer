// src/components/common/LanguageSwitcher.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const isPortuguese = i18n.language.startsWith('pt');

  const toggleLanguage = () => {
    const newLang = isPortuguese ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };

  return (
    <div
      onClick={toggleLanguage}
      className={`relative flex items-center w-16 h-8 p-1 cursor-pointer rounded-full transition-colors duration-300 ${
        isPortuguese ? 'bg-primary/50' : 'bg-surface'
      }`}
    >
      {/* O seletor que se move */}
      <motion.div
        className="absolute w-6 h-6 bg-white rounded-full"
        layout
        transition={spring}
        style={{ left: isPortuguese ? 'auto' : '4px', right: isPortuguese ? '4px' : 'auto' }}
      />
      
      {/* Os textos PT e EN */}
      <div className="flex justify-between w-full px-1">
        <span className={`text-xs font-bold ${!isPortuguese ? 'text-white' : 'text-white/50'}`}>
          EN
        </span>
        <span className={`text-xs font-bold ${isPortuguese ? 'text-white' : 'text-white/50'}`}>
          PT
        </span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;