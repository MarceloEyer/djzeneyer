import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb';
import { motion } from 'framer-motion';

// Issue B — Framer Motion inline objects extracted to module scope (Style Rule 6)
const PAGE_HEADER_INITIAL = { opacity: 0, y: 20 };
const PAGE_HEADER_ANIMATE = { opacity: 1, y: 0 };
const PAGE_HEADER_TRANSITION = { duration: 0.6 };

interface PageHeaderProps {
  /** First part of the title (rendered in white) */
  titlePart1: string | React.ReactNode;
  /** Second part of the title (rendered in primary color/blue) */
  titlePart2?: string | React.ReactNode;
  /** Breadcrumb items to display at the top left */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional extra classes */
  className?: string;
  /** Force text-center for the title (breadcrumb remains left) */
  centerTitle?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  titlePart1,
  titlePart2,
  breadcrumbs,
  className = '',
  centerTitle = true,
}) => {
  const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;
  return (
    <header className={`w-full mb-12 md:mb-16 relative z-10 ${className}`}>
      {/* Breadcrumb - Always Top Left, discrete */}
      {/* Issue C — guard: only render breadcrumb nav when array is non-empty */}
      {hasBreadcrumbs && (
        <div className="absolute top-0 left-0 w-full mb-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <Breadcrumb items={breadcrumbs} className="!mb-0" />
        </div>
      )}

      {/* Title - Standardized Display Font, Blue and White */}
      <motion.h1
        initial={PAGE_HEADER_INITIAL}
        animate={PAGE_HEADER_ANIMATE}
        transition={PAGE_HEADER_TRANSITION}
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display uppercase tracking-tighter text-text ${
          hasBreadcrumbs ? 'pt-16' : ''
        } ${centerTitle ? 'text-center' : 'text-left'}`}
      >
        {titlePart1}{' '}
        {titlePart2 && <span className="text-primary">{titlePart2}</span>}
      </motion.h1>
    </header>
  );
};
