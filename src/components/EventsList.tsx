// src/components/EventsList.tsx
// ARQUITETURA V2: VISUAL LIMPO + PAYLOAD ENXUTO + SEO CANONICAL

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventsQuery } from '../hooks/useQueries';
import { sanitizeHtml } from '../utils/sanitize';
import { getLocalizedRoute } from '../config/routes';
import patternSvg from '../assets/images/pattern.svg';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

interface EventsListProps {
  limit?: number;
  showTitle?: boolean;
  variant?: 'compact' | 'full';
}

// ============================================================================
// 2. COMPONENT
// ============================================================================

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions, locale: string) => {
  return date.toLocaleDateString(locale, options);
};

const formatTime = (date: Date, locale: string) => {
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
};

function EventsListInner({ limit = 10, showTitle = true, variant = 'full' }: EventsListProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  const lang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  // React Query: v2 defaults
  const { data: events = [], isLoading: loading, error } = useEventsQuery({
    mode: 'upcoming',
    limit,
    lang
  }, { suspense: false }); // Home page usually non-suspense for better LCP

  if (error) {
    console.error('Error fetching events:', error);
  }

  // --- Render States (Skeleton Loader for CLS) ---
  if (loading) {
    return (
      <div className="w-full">
        {variant === 'full' && showTitle && (
          <div className="h-9 w-48 bg-white/5 animate-pulse rounded-lg mx-auto mb-8" />
        )}
        <div className={variant === 'compact' ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6"}>
          {Array.from({ length: limit }).map((_, i) => {
            const skeletonHeight = variant === 'compact' ? 'h-[106px]' : 'h-[360px]';

            return (
              <div
                key={`skeleton-${i}`}
                className={`animate-pulse bg-surface/30 border border-white/5 rounded-xl overflow-hidden ${skeletonHeight}`}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <Calendar size={48} className="mx-auto mb-4 text-white/20" aria-hidden="true" />
        <p>{t('events_noEvents')}</p>
      </div>
    );
  }
  const visibleEvents = events.slice(0, limit);


  return (
    <div className="w-full">
      {variant === 'full' && showTitle && (
        <h2 className="text-3xl font-bold mb-8 text-center font-display text-white">
          {t('events_title')}
        </h2>
      )}

      <div className={variant === 'compact' ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {visibleEvents.map((event) => {
          const eventDate = new Date(event.starts_at);
          const loc = event.location;
          const eventLocation = `${loc.city}, ${loc.country || ''}`;

          const formattedDate = formatDate(eventDate, { day: 'numeric', month: 'long', year: 'numeric' }, currentLocale);
          const formattedTime = formatTime(eventDate, currentLocale);

          // Canonical Link handling
          const detailHref = event.canonical_path
            ? (lang === 'pt'
              ? `/pt/eventos${event.canonical_path.replace('/events', '')}`
              : event.canonical_path)
            : `${getLocalizedRoute('events', lang)}/${event.event_id}`;

          // --- COMPACT CARD (used in Home) ---
          if (variant === 'compact') {
            return (
              <article
                key={event.event_id}
                className="card hover:border-primary/50 transition-all duration-300 group bg-surface/30 border border-white/5 rounded-xl overflow-hidden"
              >
                <Link to={detailHref} className="flex items-start gap-4 p-4">
                  <time dateTime={event.starts_at} className="flex-shrink-0 text-center bg-surface rounded-lg p-3 border border-white/10 min-w-[70px]">
                    <div className="text-2xl font-bold text-primary">{eventDate.getDate()}</div>
                    <div className="text-xs uppercase text-white/60">{formatDate(eventDate, { month: 'short' }, currentLocale)}</div>
                  </time>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors text-left" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title) }} />
                    <div className="space-y-1 text-sm text-white/70 text-left">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="flex-shrink-0 text-primary" />
                        <span className="truncate">{loc.venue || loc.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="flex-shrink-0 text-white/40" />
                        <span className="truncate">{eventLocation} â€¢ {formattedTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          }

          // --- FULL CARD ---
          return (
            <article
              key={event.event_id}
              className="card group hover:border-primary/50 transition-all duration-300 overflow-hidden bg-surface/30 border border-white/5 rounded-2xl"
            >
              <Link to={detailHref}>
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: `url(${patternSvg})` }}
                  ></div>
                  <time dateTime={event.starts_at} className="relative z-10 text-center drop-shadow-lg">
                    <div className="text-6xl font-bold text-primary">{eventDate.getDate()}</div>
                    <div className="text-xl uppercase text-white/90 font-semibold">{formatDate(eventDate, { month: 'short' }, currentLocale)}</div>
                    <div className="text-sm text-white/80">{eventDate.getFullYear()}</div>
                  </time>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-white" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title) }} />
                  <div className="space-y-2 mb-4 text-sm text-white/70">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary" />
                      <div>
                        <div className="font-semibold text-white">{loc.venue || t('loc_to_be_defined')}</div>
                        <div>{eventLocation}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="flex-shrink-0 text-white/40" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="flex-shrink-0 text-white/40" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div >
    </div >
  );
}

export const EventsList = memo(EventsListInner);
EventsList.displayName = 'EventsList';
