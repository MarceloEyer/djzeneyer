import React, { memo, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { useParams, Link, generatePath } from 'react-router-dom';
import { normalizeLanguage, getLocalizedRoute, type Language } from '../config/routes';
import { extractLastPathSegment, useEventsQuery, useEventById } from '../hooks/useQueries';
import { safeUrl, sanitizeHtml } from '../utils/sanitize';
import { stripHtml } from '../utils/text';
import { extractRegions, filterEventsByRegion, groupEventsByMonth, getPlainTitle } from '../utils/events';
import { logger } from '../lib/logger';
import { ARTIST } from '../data/artistData';
import { useBranding } from '../contexts/BrandingContext';
import { MapPin, Share2, ArrowLeft, Music, Calendar, Clock } from 'lucide-react';
import AddCalendarMenu from '../components/Events/AddCalendarMenu';
import { PageHeader } from '../components/ui/PageHeader';
import { getDateTimeFormatter } from '../utils/date';
import { Toast } from '../components/common/Toast';
import NotFoundPage from './NotFoundPage';
import type { ZenBitEventListItem, ZenBitEventDetail } from '../types/events';
import type { EventSchemaData } from '../components/HeadlessSEO';

// Static month keys stay at module scope to avoid reallocation on every render.
const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const COUNTRY_TRANSLATION_KEYS: Record<string, string> = {
  Australia: 'australia',
  Brazil: 'brazil',
  Canada: 'canada',
  Germany: 'germany',
  Netherlands: 'netherlands',
  Portugal: 'portugal',
  Spain: 'spain',
  Switzerland: 'switzerland',
  'United States': 'united_states',
  USA: 'united_states',
};

const getLocalizedCountry = (
  country: string | undefined,
  t: (key: string, options?: { defaultValue?: string }) => string,
): string => {
  if (!country) return '';
  const countryKey = COUNTRY_TRANSLATION_KEYS[country];
  return countryKey ? t(`countries.${countryKey}`, { defaultValue: country }) : country;
};

// ============================================================================
// SUB-COMPONENTS (SUSPENSE READY)
// ============================================================================

const SKELETON_ITEMS = [1, 2, 3];

const EventSkeleton = () => (
  <div className="space-y-6">
    {SKELETON_ITEMS.map(i => (
      <div key={i} className="h-32 bg-surface/50 border border-border/5 rounded-2xl animate-pulse flex items-center gap-6 px-6">
        <div className="w-12 h-12 bg-text/5 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-text/5 rounded w-1/4" />
          <div className="h-3 bg-text/5 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const EventDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
    <div className="h-10 w-32 bg-text/5 rounded-lg mb-8" />
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-3xl aspect-[4/5] bg-text/5 border border-border/10" />
      <div className="space-y-6">
        <div className="h-12 w-3/4 bg-text/5 rounded-xl" />
        <div className="space-y-3">
          <div className="h-4 bg-text/5 rounded w-1/2" />
          <div className="h-4 bg-text/5 rounded w-1/3" />
        </div>
      </div>
    </div>
  </div>
);

const EventDetailContent = ({ id, lang }: { id: string; lang: string }) => {
  const { t } = useTranslation('translation');
  const origin = ARTIST.site.baseUrl;
  const { data: event, isLoading, isFetching } = useEventById(id, lang as Language);
  const [showToast, setShowToast] = useState(false);

  if ((isLoading || isFetching) && !event) return <EventDetailSkeleton />;
  if (!event) return <NotFoundPage />;

  const eventDate = new Date(event.starts_at);
  const isValidDate = !isNaN(eventDate.getTime());
  const loc = event.location;
  const cleanDescription = stripHtml(event.description || '');
  const cleanEventTitle = getPlainTitle(event.title);
  const eventSeoTitle = cleanEventTitle || t('event_default_title');
  const eventDetailUrl = event.canonical_url || `${origin}${getLocalizedRoute('events', lang as Language)}/${id}`;

  const share = () => {
    const canonical = event.canonical_url || `${ARTIST.site.baseUrl}${getLocalizedRoute('events', lang as Language)}/${event.event_id}`;
    if (navigator.share) {
      navigator.share({ title: cleanEventTitle || ARTIST.identity.stageName, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeadlessSEO
        title={eventSeoTitle}
        description={cleanDescription.substring(0, 160)}
        url={`${origin}${getLocalizedRoute('events', lang as Language)}/${id}`}
        image={event.image || undefined}
        imageAlt={t('og.image_alt.events_detail', { eventTitle: eventSeoTitle, artist: ARTIST.identity.stageName })}
        type="event"
        events={[event]}
        leadAnswer={cleanDescription ? cleanDescription.substring(0, 300) : undefined}
      />

      <Breadcrumb
        items={[
          { label: t('nav.events'), path: getLocalizedRoute('events', lang as Language) },
          { label: event.title },
        ]}
        className="mb-8"
      />

      <Link
        to={getLocalizedRoute('events', lang as Language)}
        className="inline-flex items-center gap-2 text-text/60 hover:text-primary mb-12 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> {t('common.back_to_list', { defaultValue: 'Back to list' })}
      </Link>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Event Poster/Image */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-border/10 shadow-2xl">
            <img 
              src={event.image || '/images/default-event-poster.png'} 
              alt={event.title} 
              className="w-full h-full object-cover" 
              loading="lazy" 
              width="600" 
              height="800" 
            />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
              <div className="inline-block px-4 py-1 rounded-full bg-primary text-[rgb(var(--color-primary-fg))] font-black text-[10px] uppercase tracking-tighter mb-4 shadow-lg shadow-primary/20">
                {t('events.featured', { defaultValue: 'Featured Event' })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-7 bg-surface/30 backdrop-blur-xl border border-border/5 rounded-[2.5rem] p-5 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-text/5 pointer-events-none">
            <Music size={120} className="rotate-12" />
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 leading-[0.9] tracking-tighter uppercase whitespace-pre-line" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title) }} />

            <div className="flex items-center gap-4 text-text/80 mb-4">
              <div className="w-10 h-10 rounded-xl bg-text/5 flex items-center justify-center text-primary">
                <Calendar size={20} />
              </div>
              <span className="font-bold">
                {isValidDate ? getDateTimeFormatter(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(eventDate) : t('tba')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-text/80">
              <div className="w-10 h-10 rounded-xl bg-text/5 flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <span className="font-bold">{loc.venue}{loc.city ? `, ${loc.city}` : ''}</span>
            </div>

            <div className="prose prose-invert mt-10 mb-10 text-text/60 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description || '') }} />

            <div className="space-y-4">
              <AddCalendarMenu event={event} variant="primary" eventUrl={eventDetailUrl} />

              <button
                onClick={share}
                className="btn btn-outline border-border/10 w-full py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-text/5 transition-all text-text/70 hover:text-text font-bold uppercase tracking-widest text-xs"
                aria-label={t('share_event', { title: cleanEventTitle || t('event_default_title') })}
              >
                <Share2 size={18} /> {t('share')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={t('link_copied')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

const EventListContent = ({ lang }: { lang: string }) => {
  const { t } = useTranslation('translation');
  const origin = ARTIST.site.baseUrl;
  const { data: events = [], isLoading, error } = useEventsQuery({
    mode: 'upcoming',
    days: 365,
    limit: 50,
    lang: lang as Language,
  });

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const eventsDetailRoute = useMemo(() => getLocalizedRoute('events-detail', lang as Language), [lang]);
  const monthBadgeFormatter = useMemo(() => getDateTimeFormatter(lang, { month: 'short' }), [lang]);
  const timeFormatter = useMemo(() => getDateTimeFormatter(lang, { hour: '2-digit', minute: '2-digit' }), [lang]);

  useEffect(() => {
    if (error) {
      logger.error('EVENTS_PAGE', 'Error fetching events', { error: String(error) });
    }
  }, [error]);

  const regions = useMemo(() => extractRegions(events), [events]);
  const filteredEvents = useMemo(() => filterEventsByRegion(events, selectedRegion), [events, selectedRegion]);
  const groupedEvents = useMemo(() => groupEventsByMonth(filteredEvents), [filteredEvents]);


  const share = (e: ZenBitEventListItem) => {
    const canonical = e.canonical_url || `${ARTIST.site.baseUrl}${getLocalizedRoute('events', lang as Language)}/${e.event_id}`;
    const cleanEventTitle = getPlainTitle(e.title);
    if (navigator.share) {
      navigator.share({ title: cleanEventTitle || ARTIST.identity.stageName, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };

  if (isLoading && events.length === 0) {
    return <EventSkeleton />;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-surface/30 rounded-3xl border border-border/5 animate-in fade-in duration-500">
        <p className="text-text/70">{t('events_no_results')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
      <HeadlessSEO
        title={t('events_page_title')}
        description={t('events_page_meta_desc')}
        url={`${origin}${getLocalizedRoute('events', lang as Language)}`}
        image={`${ARTIST.site.baseUrl}/images/og/zen-eyer-events-og.jpg`}
        imageAlt={t('og.image_alt.events_list')}
        events={events as EventSchemaData[]}
      />
      <div className="rounded-[2rem] border border-border/10 bg-surface/35 p-4 shadow-2xl shadow-black/10 sm:p-7 md:p-9">
      {/* Filter Bar */}
      {regions.length > 0 && (
        <div className="mb-10 flex justify-center">
          <div className="inline-flex max-w-full flex-wrap justify-center gap-2 rounded-2xl border border-border/10 bg-background/45 p-2 shadow-lg shadow-black/5">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`min-h-[44px] rounded-xl border px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${selectedRegion === 'all' ? 'border-primary/20 bg-surface text-primary shadow-md shadow-black/5' : 'border-transparent bg-transparent text-text/70 hover:border-border/20 hover:bg-surface/75 hover:text-text'}`}
          >
            {t('common.all')}
          </button>
          {regions.map((region: string) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`min-h-[44px] rounded-xl border px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${selectedRegion === region ? 'border-primary/20 bg-surface text-primary shadow-md shadow-black/5' : 'border-transparent bg-transparent text-text/70 hover:border-border/20 hover:bg-surface/75 hover:text-text'}`}
            >
              {region}
            </button>
          ))}
          </div>
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-border/5 bg-background/45 py-20 text-center">
          <p className="text-text/70">{t('events_no_results_filter')}</p>
        </div>
      ) : (
        groupedEvents.map(([key, monthEvents]: [string, ZenBitEventListItem[]]) => {
          const y = key.slice(0, 4);
          const m = key.slice(5, 7);

          const monthShort = MONTH_NAMES[Number(m) - 1];
          const name = t(`events_month_${monthShort}` as unknown as Parameters<typeof t>[0]);
          return (
            <section key={key}>
              <h2 className="mb-6 flex items-center gap-4 text-xl font-bold text-text sm:text-2xl">
                <span>{name}</span>
                <span className="rounded-full border border-border/10 bg-background/55 px-3 py-1 text-sm font-medium text-text/60 shadow-sm">{y}</span>
                <span className="h-px flex-1 bg-border/20" />
              </h2>
              <div className="space-y-5">
                {monthEvents.map((e) => {
                  const hasStartDate = Boolean(e.starts_at && e.starts_at.length >= 10);
                  const dayStr = hasStartDate ? e.starts_at.substring(8, 10) : '??';
                  const eventDate = hasStartDate ? new Date(e.starts_at) : null;
                  const hasValidDate = eventDate !== null && !isNaN(eventDate.getTime());
                  const identifier = e.canonical_path
                    ? extractLastPathSegment(e.canonical_path) || e.event_id
                    : e.event_id;

                  const detailHref = e._processed?.detailHref || generatePath(eventsDetailRoute, { id: identifier });
                  const detailUrl = e.canonical_url || `${ARTIST.site.baseUrl}${detailHref}`;
                  const loc = e.location;
                  const cleanEventTitle = getPlainTitle(e.title);
                  const cityRegion = [loc?.city, loc?.region].filter(Boolean).join(', ');
                  const countryLabel = loc?.country ? getLocalizedCountry(loc.country, t) : '';
                  const locationLabel = [cityRegion, countryLabel].filter(Boolean).join(', ');

                  return (
                    <article key={e.event_id} className="card group overflow-hidden rounded-xl border border-border/5 bg-background/45 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background/60 hover:shadow-xl hover:shadow-black/10">
                      <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center">
                        <time dateTime={e.starts_at || undefined} className="flex w-[86px] shrink-0 flex-col items-center justify-center rounded-lg border border-border/10 bg-surface px-3 py-4 text-center shadow-sm">
                          <span className="text-4xl font-bold leading-none text-primary">{dayStr}</span>
                          <span className="mt-1 text-xs font-medium uppercase tracking-wide text-text/60">
                            {hasValidDate && eventDate ? monthBadgeFormatter.format(eventDate) : t('tba')}
                          </span>
                        </time>

                        <div className="min-w-0 flex-1">
                          <Link to={detailHref} className="inline-block">
                            <h3 className="font-display text-xl font-bold leading-tight text-text transition-colors group-hover:text-primary sm:text-2xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.title) }} />
                          </Link>
                          <div className="mt-3 space-y-1.5 text-sm text-text/70 sm:text-base">
                            {loc?.venue && (
                              <div className="flex items-center gap-2">
                                <MapPin size={15} className="shrink-0 text-primary" />
                                {loc.venue}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock size={15} className="shrink-0 text-text/55" />
                              <span>
                                {locationLabel}
                                {hasValidDate && eventDate ? ` - ${timeFormatter.format(eventDate)}` : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 border-t border-border/10 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                          <Link
                            to={detailHref}
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-border/10 bg-surface px-4 text-xs font-bold uppercase tracking-widest text-text/65 shadow-sm transition-all hover:border-primary/25 hover:bg-primary/10 hover:text-primary"
                          >
                            {t('events_view_details')}
                          </Link>
                          <AddCalendarMenu event={e as unknown as ZenBitEventDetail} variant="ghost" eventUrl={detailUrl} />
                          <button
                            onClick={() => share(e)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-text/65 shadow-sm transition-all hover:bg-primary/10 hover:text-primary"
                            aria-label={t('share_event', { title: cleanEventTitle || t('event_default_title') })}
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
      </div>

      <Toast
        message={t('link_copied')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation('translation');
  const { artist } = useBranding();
  const lang = normalizeLanguage(i18n.language);
  const pressKitUrl = artist?.site?.media?.epkPdf || ARTIST.site.media.epkPdf;

  if (id) {
    return (
      <div className="min-h-screen bg-background text-text pt-24 pb-20 px-4">
        <React.Suspense fallback={<EventDetailSkeleton />}>
          <EventDetailContent id={id} lang={lang} />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto relative pt-8">
        <PageHeader 
          titlePart1={t('events.title_part1')}
          titlePart2={t('events.title_part2')}
          breadcrumbs={[{ label: t('nav.events') }]}
        />

        <React.Suspense fallback={<div className="min-h-[1600px]"><EventSkeleton /></div>}>
          <EventListContent lang={lang} />
        </React.Suspense>

        <section className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-border/10 bg-surface/40 p-6 text-center shadow-xl shadow-black/5 backdrop-blur-md md:p-10">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Music size={22} />
          </div>
          <h2 className="relative z-20 mb-6 text-2xl font-black uppercase tracking-tight md:text-3xl">{t('events.press_title')}</h2>
          <div className="relative z-20 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={getLocalizedRoute('booking', lang as Language)} className="btn btn-primary min-h-[44px] rounded-xl px-10 py-3 text-sm font-bold uppercase">{t('contact')}</Link>
            <a href={safeUrl(pressKitUrl, '/')} className="btn btn-outline min-h-[44px] rounded-xl border-border/10 px-10 py-3 text-sm font-bold">{t('events.press_kit', { defaultValue: 'Press Kit' })}</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default memo(EventsPage);
