// src/components/EventsList.tsx
// ARQUITETURA V2: VISUAL LIMPO + PAYLOAD ENXUTO + SEO CANONICAL

import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Link, generatePath } from 'react-router-dom';
import { useEventsQuery } from '../hooks/useQueries';
import { sanitizeHtml } from '../utils/sanitize';
import { getLocalizedRoute } from '../config/routes';
import patternSvg from '../assets/images/pattern.svg';
import { getDateTimeFormatter } from '../utils/date';

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
  return getDateTimeFormatter(locale, options).format(date);
};

const formatTime = (date: Date, locale: string) => {
  return getDateTimeFormatter(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
};

function EventsListInner({ limit = 10, showTitle = true, variant = 'full' }: EventsListProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  const lang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  // Otimização O(1): Memoriza a rota base do detalhe de evento para o idioma atual,
  // prevenindo chamadas repetidas a getLocalizedRoute dentro do map cycle.
  const detailRouteBase = useMemo(() => getLocalizedRoute('events-detail', lang), [lang]);

  // React Query: v2 defaults
  const { data: events = [], isLoading: loading, error } = useEventsQuery({
    mode: 'upcoming',
    limit,
    lang
  }); // Home page usually non-suspense for better LCP

  if (error) {
    console.error('Error fetching events:', error);
  }

  const skeletonElements = useMemo(() => {
    return Array.from({ length: limit }).map((_, i) => {
      const skeletonHeight = variant === 'compact' ? 'h-[106px]' : 'h-[360px]';
      return (
        <div
          key={`skeleton-${i}`}
          className={`animate-pulse bg-surface/30 border border-white/5 rounded-xl overflow-hidden ${skeletonHeight}`}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
        </div>
      );
    });
  }, [limit, variant]);

  // --- Render States (Skeleton Loader for CLS) ---
  if (loading) {
    return (
      <div className="w-full">
        {variant === 'full' && showTitle && (
          <div className="h-9 w-48 bg-white/5 animate-pulse rounded-lg mx-auto mb-8" />
        )}
        <div className={variant === 'compact' ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {skeletonElements}
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

          const formattedTime = formatTime(eventDate, currentLocale);

          // Canonical Link handling — SINCRONIZADO COM EVENTSPAGE PARA EVITAR 404
          const identifier = event.canonical_path
            ? event.canonical_path.split('/').pop() || event.event_id
            : event.event_id;

          const detailHref = generatePath(detailRouteBase, { id: identifier });

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
                        <span className="truncate">{eventLocation} • {formattedTime}</span>
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
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-surface to-background flex items-center justify-center relative p-6 text-center group-hover:scale-105 transition-transform duration-500">
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{ backgroundImage: `url(${patternSvg})`, backgroundSize: '30px' }}
                    />
                    <div className="relative z-10 w-full">
                      <h3 
                         className="text-2xl font-black uppercase tracking-tighter font-display text-white/90 leading-[0.9] break-words line-clamp-3"
                         dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title) }} 
                      />
                       <div className="mt-3 w-8 h-0.5 bg-primary/30 mx-auto rounded-full" />
                    </div>
                  </div>
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-background/80 backdrop-blur-md border border-white/10 rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-xl font-bold text-primary leading-none">{eventDate.getDate()}</div>
                      <div className="text-[10px] uppercase font-semibold text-white/70 mt-1">
                        {formatDate(eventDate, { month: 'short' }, currentLocale)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors h-[3.5rem] flex items-center"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title) }}
                  />

                  <div className="space-y-3 text-sm text-white/60">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white">
                          {loc.venue || t('loc_to_be_defined')}
                        </div>
                        <div className="truncate text-xs">{eventLocation}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Clock size={14} className="text-white/40" />
                      </div>
                      <div className="text-xs uppercase tracking-wider font-medium text-white/80">
                        {formattedTime}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export const EventsList = memo(EventsListInner);