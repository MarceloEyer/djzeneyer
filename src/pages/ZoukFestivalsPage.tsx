import React, { useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '../components/Breadcrumb';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST } from '../data/artistData';
import { safeUrl } from '../utils/sanitize';
import { getDateTimeFormatter } from '../utils/date';
import type { Festival } from '../types';

const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface FestivalCardProps {
  festival: Festival;
  year: string;
  opensInNewTab: string;
}

const FestivalCard: React.FC<FestivalCardProps> = React.memo(({ festival, year, opensInNewTab }) => (
  <a
    href={safeUrl(festival.url, '/')}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${festival.name} (${opensInNewTab})`}
    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-surface/35 p-5 transition-colors hover:border-primary/35"
  >
    <span className="flex-shrink-0 text-4xl" role="img" aria-label={festival.country}>
      {festival.flag}
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate font-display font-bold text-white transition-colors group-hover:text-primary">
        {festival.name}
      </p>
      <p className="flex items-center gap-1 text-sm text-white/50">
        <MapPin size={12} />
        {festival.country}
        {year && <span className="ml-1">· {year}</span>}
      </p>
    </div>
    <ExternalLink size={16} className="flex-shrink-0 text-white/30 transition-colors group-hover:text-primary" />
  </a>
));

const ZoukFestivalsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const prefersReducedMotion = useReducedMotion();
  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('zouk-festivals', currentLang)}`;

  const { upcoming, past } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingFestivals = [...ARTIST.festivals]
      .filter((f) => f.date && new Date(f.date) >= today)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    const pastFestivals = [...ARTIST.festivals]
      .filter((f) => !f.date || new Date(f.date) < today)
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    return { upcoming: upcomingFestivals, past: pastFestivals };
  }, []);

  const formatYear = useCallback((date: string | undefined): string => {
    if (!date) return '';
    try {
      return getDateTimeFormatter(i18n.language, { year: 'numeric' }).format(new Date(date));
    } catch {
      return '';
    }
  }, [i18n.language]);

  const opensInNewTab = t('common.opens_in_new_tab');

  return (
    <>
      <HeadlessSEO
        title={t('hub_pages.zouk_festivals.seo_title')}
        description={t('hub_pages.zouk_festivals.seo_description')}
        url={pageUrl}
        noindex
      />
      <div className="min-h-screen bg-background px-4 pb-20 pt-24 text-white">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumb items={[{ label: t('hub_pages.zouk_festivals.breadcrumb') }]} className="mb-10" />

          <motion.header
            variants={HERO_VARIANTS}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
            className="mb-14"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Globe size={14} />
              {t('hub_pages.zouk_festivals.breadcrumb')}
            </div>
            <h1 className="mb-4 font-display text-4xl font-black md:text-6xl">
              {t('hub_pages.zouk_festivals.h1')}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/65">
              {t('hub_pages.zouk_festivals.seo_description')}
            </p>
          </motion.header>

          {upcoming.length > 0 && (
            <section className="mb-12" aria-labelledby="upcoming-festivals">
              <h2 id="upcoming-festivals" className="mb-5 font-display text-2xl font-black text-white">
                {t('upcoming_events')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {upcoming.map((festival) => (
                  <FestivalCard
                    key={festival.name}
                    festival={festival}
                    year={formatYear(festival.date)}
                    opensInNewTab={opensInNewTab}
                  />
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="past-festivals">
            <h2 id="past-festivals" className="mb-5 font-display text-2xl font-black text-white">
              {t('hub_pages.zouk_festivals.past_editions')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {past.map((festival) => (
                <FestivalCard
                  key={festival.name}
                  festival={festival}
                  year={formatYear(festival.date)}
                  opensInNewTab={opensInNewTab}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default React.memo(ZoukFestivalsPage);
