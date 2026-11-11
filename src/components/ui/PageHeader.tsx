import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from '../Breadcrumb';

interface PageHeaderProps {
  /** First part of the title (rendered with the semantic text token) */
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
      <h1
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display uppercase tracking-tighter text-text ${
          hasBreadcrumbs ? 'pt-16' : ''
        } ${centerTitle ? 'text-center' : 'text-left'} motion-safe:animate-fade-up`}
      >
        {titlePart1}{' '}
        {titlePart2 && <span className="text-primary">{titlePart2}</span>}
      </h1>
    </header>
  );
};
