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

const BreadcrumbInner: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);

  return (
    <motion.nav
      aria-label={t('nav.breadcrumb')}
      className={`${className} w-full text-left`}
      initial={BREADCRUMB_INITIAL}
      animate={BREADCRUMB_ANIMATE}
      transition={BREADCRUMB_TRANSITION}
    >
      <ol className="flex flex-wrap items-center justify-start gap-2 text-xs sm:text-sm text-text/75">
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
            <ChevronRight size={14} className="flex-shrink-0 text-text/20" aria-hidden="true" />
            {item.path ? (
              <Link
                to={item.path}
                className="truncate py-1 font-medium tracking-wide transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate py-1 font-semibold tracking-wide text-text" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
};

// ⚡ Bolt: Wrapped Breadcrumb with React.memo to prevent unnecessary re-renders.
// This component is frequently used via PageHeader and its props (items) rarely change
// within the same page view, preventing O(N) recalculations on layout renders.
export const Breadcrumb = React.memo(BreadcrumbInner);
