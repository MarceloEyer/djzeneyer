import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getLocalizedRoute } from '../config/routes';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  return (
    <motion.nav 
      aria-label="Breadcrumb" 
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/50">
        <li>
          <Link
            to={getLocalizedRoute('home', currentLang)}
            className="hover:text-primary transition-colors flex items-center gap-1.5 py-1"
          >
            <Home size={14} className="text-primary/70" />
            <span className="font-medium tracking-wide">{t('nav.home')}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
            {item.path ? (
              <Link 
                to={item.path} 
                className="hover:text-primary transition-colors py-1 font-medium tracking-wide"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white/80 font-semibold tracking-wide py-1" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
};
