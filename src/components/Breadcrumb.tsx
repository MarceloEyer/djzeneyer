import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const BREADCRUMB_INITIAL = { opacity: 0, y: -8 };
const BREADCRUMB_ANIMATE = { opacity: 1, y: 0 };
const BREADCRUMB_TRANSITION = { duration: 0.4, ease: 'easeOut' };

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);

  return (
    <motion.nav
      aria-label={t('nav.breadcrumb')}
      className={className}
      initial={BREADCRUMB_INITIAL}
      animate={BREADCRUMB_ANIMATE}
      transition={BREADCRUMB_TRANSITION}
    >
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/50">
        <li>
          <Link
            to={getLocalizedRoute('home', currentLang)}
            className="inline-flex items-center gap-1.5 py-1 font-medium tracking-wide transition-colors hover:text-primary"
          >
            <Home size={14} className="text-primary/70" aria-hidden="true" />
            <span>{t('nav.home')}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
            <ChevronRight size={14} className="flex-shrink-0 text-white/20" aria-hidden="true" />
            {item.path ? (
              <Link
                to={item.path}
                className="truncate py-1 font-medium tracking-wide transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate py-1 font-semibold tracking-wide text-white/80" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
};
