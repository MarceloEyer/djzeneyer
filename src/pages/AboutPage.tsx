// src/pages/AboutPage.tsx - About sobre o DJ Zen Eyer

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle, Music, Users, Award, Globe, Brain } from 'lucide-react';

// ✅ Componente About
const FAQItem = memo<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}>(({ question, answer, isOpen, onToggle }) => (
  <motion.div 
    className="bg-surface/50 rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/80 transition-colors"
      aria-expanded={isOpen}
    >
      <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0"
      >
        <ChevronDown className="text-primary" size={24} />
      </motion.div>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: answer }} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

FAQItem.displayName = 'FAQItem';

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ About Data - OTIMIZADO PARA IAs + SEO


export default AboutPage;
