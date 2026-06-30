// src/pages/MusicPage.tsx
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { Music2, Cloud, ExternalLink, Download, Coffee } from 'lucide-react';
import { YouTubeIcon } from '../components/icons/BrandIcons';
import { Link, generatePath } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTrackInteraction } from '../hooks/useQueries';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST } from '../data/artistData';
import { MUSICGROUP_SCHEMA } from '../data/artist.schema';
import { DISCOGRAPHY } from '../data/artist.discography';
import { safeUrl } from '../utils/sanitize';
import { buildReleaseCards, buildDiscographyListItems } from '../utils/music';
import { formatDateVal } from '../utils/date';

// --- SVG Icons for music platforms ---
const SpotifyIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

// --- Framer Motion variants (module scope) ---
const SPOTIFY_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const SECONDARY_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.3 } }),
};

const CARD_VARIANTS = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay } },
});

// --- Static platform data (module scope) ---
const SPOTIFY_PLATFORM = {
  name: 'Spotify',
  url: safeUrl(ARTIST.social.spotify.url, '/'),
  color: 'hover:bg-[#1DB954]/20 border-[#1DB954]/20 hover:border-[#1DB954]/50',
};

const SECONDARY_PLATFORMS = [
  {
    name: 'Apple Music',
    icon: <Music2 className="text-[#FA243C]" />,
    url: safeUrl(ARTIST.social.appleMusic.url, '/'),
    color: 'hover:bg-[#FA243C]/20 border-[#FA243C]/20 hover:border-[#FA243C]/50',
  },
  {
    name: 'SoundCloud',
    icon: <Cloud className="text-[#FF5500]" />,
    url: safeUrl(ARTIST.social.soundcloud.url, '/'),
    color: 'hover:bg-[#FF5500]/20 border-[#FF5500]/20 hover:border-[#FF5500]/50',
  },
  {
    name: 'YouTube',
    icon: <YouTubeIcon className="text-[#FF0000]" />,
    url: safeUrl(ARTIST.social.YouTube.url, '/'),
    color: 'hover:bg-[#FF0000]/20 border-[#FF0000]/20 hover:border-[#FF0000]/50',
  },
];

const formatReleaseListDate = (releaseDate: string | undefined, lang: string): string => {
  if (!releaseDate || releaseDate === '2024-01-01') return '';
  return formatDateVal(releaseDate, lang === 'pt' ? 'pt-BR' : 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const MusicPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const currentLang = normalizeLanguage(i18n.language);
  const prefersReducedMotion = useReducedMotion();
  const trackInteraction = useTrackInteraction(user?.token);

  const handleTrackInteraction = (action: string, objectId?: number, url?: string) => {
    trackInteraction.mutate({ action, objectId });
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // ⚡ Bolt: Top-level localized route evaluation to prevent redundant evaluations within render and nested useMemos, adhering to Rules of Hooks
  const releaseDetailRoute = useMemo(() => getLocalizedRoute('release-detail', currentLang), [currentLang]);
  const musicPageUrl = useMemo(() => `${ARTIST.site.baseUrl}${getLocalizedRoute('music', currentLang)}`, [currentLang]);

  const releaseCards = useMemo(() => {
    return buildReleaseCards(DISCOGRAPHY, currentLang, (releaseId) =>
      generatePath(releaseDetailRoute, { id: releaseId }),
    );
  }, [currentLang, releaseDetailRoute]);

  const musicListingSchema = useMemo(() => {
    const baseUrl = ARTIST.site.baseUrl;
    const artistSocialUrls = new Set<string>(
      Object.values(ARTIST.social)
        .map((s) => s?.url)
        .filter((u): u is string => !!u),
    );

    const releaseListItems = buildDiscographyListItems(DISCOGRAPHY, {
      baseUrl,
      getNewsDetailPath: (id) => generatePath(releaseDetailRoute, { id }),
      lang: currentLang,
      artistSocialUrls,
    });



    return {
      '@context': 'https://schema.org',
      '@graph': [
        MUSICGROUP_SCHEMA,
        {
          '@type': 'CollectionPage',
          '@id': `${musicPageUrl}#webpage`,
          url: musicPageUrl,
          name: t('music_page_title'),
          description: t('music_page_meta_desc'),
          isPartOf: { '@id': `${baseUrl}/#website` },
          about: { '@id': `${baseUrl}/#musicgroup` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
              { '@type': 'ListItem', position: 2, name: t('music_page_title'), item: musicPageUrl },
            ],
          },
        },
        // ItemList de releases — conecta o catálogo ao grafo
        ...(releaseListItems.length > 0 ? [{
          '@type': 'ItemList',
          '@id': `${musicPageUrl}#discography`,
          name: t('music.discography_schema_name'),
          description: t('music.discography_schema_desc'),
          url: musicPageUrl,
          numberOfItems: releaseListItems.length,
          itemListElement: releaseListItems,
        }] : []),
      ],
    };
  }, [t, currentLang, musicPageUrl, releaseDetailRoute]);

  return (
    <>
      <HeadlessSEO
        title={`${t('music_page_title')} | Zen Eyer`}
        description={t('music_page_meta_desc')}
        url={musicPageUrl}
        image={`${ARTIST.site.baseUrl}/images/og/zen-eyer-music-og.jpg`}
        imageAlt={t('og.image_alt.music')}
        schema={musicListingSchema}
      />
      <div className="min-h-screen bg-background text-text pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Breadcrumb items={[{ label: t('nav.music') }]} className="mb-8" />

          <div className="text-center mb-16">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl sm:text-5xl md:text-8xl font-black font-display tracking-tighter uppercase">
                <Trans i18nKey="music.hub_title_rich">
                  <span className="text-primary">Streaming</span> Hub
                </Trans>
              </h1>
            </motion.div>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              transition={prefersReducedMotion ? undefined : { delay: 0.2 }}
              className="text-xl text-text/60"
            >
              {t('music.hub_subtitle')}
            </motion.p>
          </div>

          <div className="space-y-6 mb-16">
            {/* Spotify - Featured Hero */}
            <motion.button
              variants={SPOTIFY_VARIANTS}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              onClick={() => handleTrackInteraction('spotify_hub', 0, SPOTIFY_PLATFORM.url)}
              className="w-full flex items-center justify-between p-5 sm:p-8 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-[2rem] transition-all duration-500 group relative overflow-hidden active:scale-[0.98] shadow-2xl shadow-[#1DB954]/10 hover:shadow-[#1DB954]/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1DB954] text-pureBlack rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <SpotifyIcon />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl sm:text-2xl md:text-4xl font-black font-display uppercase tracking-[0.2em] text-[#1DB954]">
                    {SPOTIFY_PLATFORM.name}
                  </span>
                  <span className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-text mt-1 opacity-90 transition-opacity group-hover:opacity-100">
                    {t('music.listen_now')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <ExternalLink size={24} className="text-[#1DB954] group-hover:text-text transition-colors" />
              </div>
            </motion.button>

            {/* Other Platforms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SECONDARY_PLATFORMS.map((platform, index) => (
                <motion.button
                  key={platform.name}
                  custom={index}
                  variants={SECONDARY_ITEM_VARIANTS}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  animate={prefersReducedMotion ? undefined : 'visible'}
                  onClick={() => handleTrackInteraction(`${platform.name.toLowerCase().replace(' ', '_')}_hub`, 0, platform.url)}
                  className={`w-full flex items-center justify-between p-5 bg-surface/30 border rounded-2xl transition-all duration-300 group ${platform.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity">{platform.icon}</div>
                    <span className="text-sm font-bold font-display uppercase tracking-wider">{platform.name}</span>
                  </div>
                  <ExternalLink size={16} className="text-text/10 group-hover:text-text/40 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Download / Grab & Go Card */}
            <motion.div
              variants={CARD_VARIANTS(0.7)}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              className="bg-error/5 border border-error/10 rounded-3xl p-5 sm:p-8 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Download size={160} />
              </div>
              <h3 className="text-2xl font-black font-display mb-4 flex items-center gap-3">
                <Download className="text-error" /> {t('music.steal_button')}
              </h3>
              <p className="text-text/60 mb-8 max-w-xs">{t('music.steal_desc')}</p>
              <button
                onClick={() => handleTrackInteraction('download_hub', 0, 'https://download.djzeneyer.com')}
                className="inline-flex items-center gap-2 bg-error hover:bg-error/80 text-text font-black px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-error/20"
              >
                {t('music.steal_cta')} <ExternalLink size={16} />
              </button>
            </motion.div>

            {/* Support / Coffee Card */}
            <motion.div
              variants={CARD_VARIANTS(0.8)}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              className="bg-primary/5 border border-primary/10 rounded-3xl p-5 sm:p-8 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Coffee size={160} />
              </div>
              <h3 className="text-2xl font-black font-display mb-4 flex items-center gap-3">
                <Coffee className="text-primary" /> {t('music.support_button')}
              </h3>
              <p className="text-text/60 mb-8 max-w-xs">{t('music.support_desc')}</p>
              <Link
                to={getLocalizedRoute('support', currentLang)}
                className="inline-flex items-center gap-2 bg-primary hover:brightness-110 text-[rgb(var(--color-primary-fg))] font-black px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                {t('music.support_cta')} <ExternalLink size={16} />
              </Link>
            </motion.div>
          </div>

          {releaseCards.length > 0 && (
            <section aria-labelledby="music-releases-title">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="music-releases-title" className="text-2xl font-black font-display text-text">
                    {t('music.releases_title')}
                  </h2>
                  <p className="mt-1 text-sm text-text/50">{t('music.releases_subtitle')}</p>
                </div>
                <Link to={getLocalizedRoute('news', currentLang)} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80">
                  {t('music.releases_archive_link')}
                  <ExternalLink size={14} />
                </Link>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border/10 bg-surface/25">
                {releaseCards.map((release) => (
                  <Link
                    key={release.id}
                    to={release.path}
                    className="group flex items-center justify-between gap-4 border-b border-border/10 px-4 py-4 transition-colors last:border-b-0 hover:bg-surface/55 sm:px-5"
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                        <span>{t(`music.release_type.${release.type}`, { defaultValue: release.type })}</span>
                        {release.releaseDate && (
                          <span className="text-text/40">
                            {formatReleaseListDate(release.releaseDate, currentLang)}
                          </span>
                        )}
                      </div>
                      <h3 className="truncate text-base font-black text-text transition-colors group-hover:text-primary sm:text-lg">
                        {release.name}
                      </h3>
                    </div>
                    <span className="hidden shrink-0 text-sm font-bold text-text/35 transition-colors group-hover:text-primary sm:inline">
                      {t('music.read_release')}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default React.memo(MusicPage);
