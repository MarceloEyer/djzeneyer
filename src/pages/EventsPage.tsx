import React, { memo, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { MapPin, Search, Share2, ArrowLeft, Music, Calendar } from 'lucide-react';
import AddCalendarMenu from '../components/Events/AddCalendarMenu';
import { Toast } from '../components/common/Toast';
import type { BandsintownEvent } from '../types/events';

// ============================================================================
// SUB-COMPONENTS (SUSPENSE READY)
// ============================================================================

const EventSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-surface/50 border border-white/5 rounded-2xl animate-pulse flex items-center gap-6 px-6">
        <div className="w-12 h-12 bg-white/5 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const EventDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
    <div className="h-10 w-32 bg-white/5 rounded-lg mb-8" />
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-3xl aspect-[4/5] bg-white/5 border border-white/10" />
      <div className="space-y-6">
        <div className="h-12 w-3/4 bg-white/5 rounded-xl" />
        <div className="space-y-3">
          <div className="h-6 w-1/2 bg-white/5 rounded" />
          <div className="h-6 w-1/2 bg-white/5 rounded" />
        </div>
        <div className="h-32 w-full bg-white/5 rounded-2xl" />
        <div className="h-14 w-full bg-white/5 rounded-xl" />
      </div>
    </div>
  </div>
);

interface EventDetailProps {
  id: string;
  lang: string;
}

const EventDetailContent = ({ id, lang }: EventDetailProps) => {
  const { t } = useTranslation();
  const { data: e } = useEventById(id, { suspense: true });
  const [showToast, setShowToast] = useState(false);

  if (!e) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Calendar size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">{t('events_not_found')}</h2>
        <p className="text-white/40 mb-8 max-w-md mx-auto">{t('events_not_found_desc')}</p>
        <Link to={getLocalizedRoute('events', lang)} className="btn btn-outline border-white/10 px-8 py-3 rounded-xl font-bold uppercase transition-all hover:bg-white/5 inline-flex items-center gap-2">
          <ArrowLeft size={18} /> {t('events_back')}
        </Link>
      </div>
    );
  }

  const share = () => {
    const url = `${window.location.origin}${getLocalizedRoute('events', lang)}/${e.id}`;
    if (navigator.share) {
      navigator.share({ title: e.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setShowToast(true);
    }
  };

  const eventDate = new Date(e.datetime || e.date || '');
  const isValidDate = !isNaN(eventDate.getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={getLocalizedRoute('events', lang)} className="flex items-center gap-2 text-primary mb-8 font-extrabold uppercase tracking-widest text-sm hover:text-white transition-colors">
        <ArrowLeft size={18} /> {t('events_back')}
      </Link>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="relative group">
          <img
            src={safeUrl(e.image || '/images/hero-background.webp')}
            className="rounded-[2.5rem] aspect-[4/5] object-cover border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
            alt={e.title}
          />
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-6">
            <div className="w-8 h-px bg-primary/30" />
            {isValidDate ? eventDate.toLocaleDateString(lang, { month: 'long', year: 'numeric' }) : t('tba')}
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-white leading-[0.9]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.title) }} />

          <div className="space-y-5 mb-10">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <Calendar size={20} />
              </div>
              <span className="font-bold">
                {isValidDate ? eventDate.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }) : t('tba')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <span className="font-bold">{e.venue?.name}{e.venue?.city ? `, ${e.venue.city}` : ''}</span>
            </div>

            <div className="prose prose-invert mb-10 text-white/60 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.description || e.content || '') }} />

            <div className="space-y-4">
              {/* Tickets button removed by user request */}
              <AddCalendarMenu event={e} variant="primary" />

              <button onClick={share} className="btn btn-outline border-white/10 w-full py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/50 hover:text-white font-bold uppercase tracking-widest text-xs">
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

interface EventListProps {
  searchQuery: string;
  lang: string;
}

const EventListContent = ({ searchQuery, lang }: EventListProps) => {
  const { t } = useTranslation();
  const { data: events = [] } = useEventsQuery({
    limit: 50,
    lang,
    upcomingOnly: true,
    search: searchQuery || undefined,
  }, { suspense: true });

  const groupedEvents = useMemo<[string, BandsintownEvent[]][]>(() => {
    const groups: { [key: string]: BandsintownEvent[] } = {};
    events.forEach((e) => {
      const date = new Date(e.datetime);
      const isInvalid = isNaN(date.getTime());

      // Fallback para agrupar eventos sem data válida no final ou ignorar
      if (isInvalid) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  const [showToast, setShowToast] = React.useState(false);

  const share = (e: BandsintownEvent) => {
    const url = `${window.location.origin}${getLocalizedRoute('events', lang)}/${e.id}`;
    if (navigator.share) {
      navigator.share({ title: e.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setShowToast(true);
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5 animate-in fade-in duration-500">
        <p className="text-white/40">{t('events_no_results')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {groupedEvents.map(([key, monthEvents]: [string, BandsintownEvent[]]) => {
        const [y, m] = key.split('-');
        const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthShort = MONTH_NAMES[Number(m) - 1];
        const name = t(`events_month_${monthShort}`);
        return (
          <section key={key}>
            <h2 className="text-2xl font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-4">
              {name} <span className="text-white/10">{y}</span>
              <div className="h-px flex-1 bg-white/5" />
            </h2>
            <div className="space-y-3">
              {monthEvents.map((e) => (
                <div key={e.id} className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-surface/30 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
                  <div className="text-3xl font-black min-w-[50px]">{String(new Date(e.datetime).getDate()).padStart(2, '0')}</div>
                  <div className="flex-1">
                    <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> {e.venue?.city}, {e.venue?.country}</div>
                    <Link to={`${getLocalizedRoute('events', lang)}/${e.id}`}>
                      <h3 className="text-xl font-bold uppercase group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.title) }} />
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <AddCalendarMenu event={e} variant="ghost" />
                    <button onClick={() => share(e)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

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
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const lang = normalizeLanguage(i18n.language);

  if (id) {
    return (
      <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
        <React.Suspense fallback={<EventDetailSkeleton />}>
          <EventDetailContent id={id} lang={lang} />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
      <HeadlessSEO title={t('events_page_title')} description={t('events_page_meta_desc')} />
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16 px-4">
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter">{t('events_page_title')}</h1>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder={t('events_filter_placeholder')}
              className="w-full bg-surface border border-white/10 rounded-full py-4 pl-12 pr-6 focus:border-primary transition-all shadow-xl"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <React.Suspense fallback={<EventSkeleton />}>
          <EventListContent searchQuery={searchQuery} lang={lang} />
        </React.Suspense>

        <section className="mt-40 p-12 md:p-24 text-center bg-surface border border-white/5 rounded-[3rem] relative overflow-hidden group">
          <Music className="absolute -right-16 -bottom-16 text-white/5 w-96 h-96 rotate-12" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">{t('home_press_title')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to={getLocalizedRoute('work-with-me', lang)} className="btn btn-primary px-10 py-4 rounded-xl font-bold uppercase">{t('contact')}</Link>
            <Link to={getLocalizedRoute('press-kit', lang)} className="btn btn-outline border-white/10 px-10 py-4 rounded-xl font-bold uppercase">{t('press_kit')}</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default memo(EventsPage);
