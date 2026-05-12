// src/pages/MusicPage.tsx
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { Music2, Cloud, ExternalLink, Download, Coffee } from 'lucide-react';
import { YoutubeIcon } from '../components/icons/BrandIcons';
import { Link, generatePath } from 'react-router-dom';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST, MUSICGROUP_SCHEMA, DISCOGRAPHY } from '../data/artistData';
import { safeUrl } from '../utils/sanitize';

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
  url: ARTIST.social.spotify.url,
  color: 'hover:bg-[#1DB954]/20 border-[#1DB954]/20 hover:border-[#1DB954]/50',
};

const SECONDARY_PLATFORMS = [
  {
    name: 'Apple Music',
    icon: <Music2 className="text-[#FA243C]" />,
    url: ARTIST.social.appleMusic.url,
    color: 'hover:bg-[#FA243C]/20 border-[#FA243C]/20 hover:border-[#FA243C]/50',
  },
  {
    name: 'SoundCloud',
    icon: <Cloud className="text-[#FF5500]" />,
    url: ARTIST.social.soundcloud.url,
    color: 'hover:bg-[#FF5500]/20 border-[#FF5500]/20 hover:border-[#FF5500]/50',
  },
  {
    name: 'YouTube',
    icon: <YoutubeIcon className="text-[#FF0000]" />,
    url: ARTIST.social.youtube.url,
    color: 'hover:bg-[#FF0000]/20 border-[#FF0000]/20 hover:border-[#FF0000]/50',
  },
];

const MusicPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const prefersReducedMotion = useReducedMotion();

  const releaseCards = useMemo(() => {
    const newsDetailRoute = getLocalizedRoute('news-detail', currentLang);
    return DISCOGRAPHY.map((release) => ({
      ...release,
      path: generatePath(newsDetailRoute, { slug: release.newsSlugs?.[currentLang] || release.id }),
    }));
  }, [currentLang]);

  const musicListingSchema = useMemo(() => {
    const baseUrl = ARTIST.site.baseUrl;
    const pageUrl = `${baseUrl}${getLocalizedRoute('music', currentLang)}`;
    const newsDetailRoute = getLocalizedRoute('news-detail', currentLang);
    const ARTIST_PROFILE_URLS = new Set<string>([
      ...Object.values(ARTIST.social)
        .map((social) => social?.url)
        .filter((url): url is string => !!url),
    ]);

    const isReleaseSpecificUrl = (url: string | undefined): url is string =>
      !!url && !ARTIST_PROFILE_URLS.has(url);

    // ItemList: cada release vira um ListItem apontando para MusicRecording/MusicAlbum
    const releaseListItems = DISCOGRAPHY.map((release, index) => {
      const newsSlug = release.newsSlugs?.[currentLang] || release.id;
      const releasePath = generatePath(newsDetailRoute, { slug: newsSlug });
      const releaseUrl = `${baseUrl}${releasePath}`;

      const schemaType = release.type === 'album' ? 'MusicAlbum'
        : release.type === 'ep' ? 'MusicAlbum'
        : 'MusicRecording';

      const releaseNode: Record<string, unknown> = {
        '@type': schemaType,
        '@id': `${releaseUrl}#recording`,
        name: release.name,
        url: releaseUrl,
        image: release.image,
        byArtist: release.byArtist || { '@id': `${baseUrl}/#musicgroup` },
      };

      if (release.contributor) releaseNode.contributor = release.contributor;

      // Only emit datePublished if it's NOT the 2024-01-01 placeholder
      if (release.releaseDate && release.releaseDate !== '2024-01-01') {
        releaseNode.datePublished = release.releaseDate;
      }

      if (release.description) releaseNode.description = release.description;

      // sameAs: ONLY release-specific URLs (not artist profile pages)
      const sameAsLinks = [
        release.spotifyUrl,
        release.appleMusicUrl,
        release.musicBrainzUrl,
        release.deezerUrl,
        release.tidalUrl,
        release.amazonMusicUrl,
        release.youtubeMusicUrl,
        release.youtubeUrl,
        release.soundcloudUrl,
      ].filter(isReleaseSpecificUrl);
      if (sameAsLinks.length > 0) releaseNode.sameAs = sameAsLinks;

      // Faixas (MusicRecording dentro do álbum/EP)
      if (release.tracks.length > 0 && schemaType === 'MusicAlbum') {
        releaseNode.track = release.tracks.map((track) => {
          const trackNode: Record<string, unknown> = {
            '@type': 'MusicRecording',
            name: track.name,
            byArtist: { '@id': `${baseUrl}/#musicgroup` },
          };
          // Only emit duration if it's a real value (not placeholder)
          if (track.duration) trackNode.duration = track.duration;
          if (track.isrcCode) trackNode.isrcCode = track.isrcCode;
          const trackSameAs = [track.spotifyUrl, track.youtubeMusicUrl].filter(isReleaseSpecificUrl);
          if (trackSameAs.length > 0) trackNode.sameAs = trackSameAs;
          return trackNode;
        });
      }

      // Para single: a faixa principal é o próprio nó
      if (schemaType === 'MusicRecording' && release.tracks[0]) {
        const t0 = release.tracks[0];
        // Only emit duration if it's a real value
        if (t0.duration) releaseNode.duration = t0.duration;
        if (t0.isrcCode) releaseNode.isrcCode = t0.isrcCode;
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: releaseNode,
      };
    });



    return {
      '@context': 'https://schema.org',
      '@graph': [
        MUSICGROUP_SCHEMA,
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: t('music_page_title'),
          description: t('music_page_meta_desc'),
          isPartOf: { '@id': `${baseUrl}/#website` },
          about: { '@id': `${baseUrl}/#musicgroup` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
              { '@type': 'ListItem', position: 2, name: t('music_page_title'), item: pageUrl },
            ],
          },
        },
        // ItemList de releases — conecta o catálogo ao grafo
        ...(releaseListItems.length > 0 ? [{
          '@type': 'ItemList',
          '@id': `${pageUrl}#discography`,
          name: t('music.discography_schema_name'),
          description: t('music.discography_schema_desc'),
          url: pageUrl,
          numberOfItems: releaseListItems.length,
          itemListElement: releaseListItems,
        }] : []),
      ],
    };
  }, [t, currentLang]);

  return (
    <>
      <HeadlessSEO
        title={`${t('music_page_title')} | Zen Eyer`}
        description={t('music_page_meta_desc')}
        url={`${ARTIST.site.baseUrl}${getLocalizedRoute('music', currentLang)}`}
        schema={musicListingSchema}
      />
      <div className="min-h-screen bg-background text-white pt-24 pb-20">
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
              className="text-xl text-white/60"
            >
              {t('music.hub_subtitle')}
            </motion.p>
          </div>

          <div className="space-y-6 mb-16">
            {/* Spotify - Featured Hero */}
            <motion.a
              variants={SPOTIFY_VARIANTS}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              href={safeUrl(SPOTIFY_PLATFORM.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 sm:p-8 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-[2rem] transition-all duration-500 group relative overflow-hidden active:scale-[0.98] shadow-2xl shadow-[#1DB954]/10 hover:shadow-[#1DB954]/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-[#1DB954] text-black rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <SpotifyIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl md:text-4xl font-black font-display uppercase tracking-[0.2em] text-[#1DB954]">
                    {SPOTIFY_PLATFORM.name}
                  </span>
                  <span className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-white mt-1 opacity-90 transition-opacity group-hover:opacity-100">
                    {t('music.listen_now')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <ExternalLink size={24} className="text-[#1DB954] group-hover:text-white transition-colors" />
              </div>
            </motion.a>

            {/* Other Platforms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SECONDARY_PLATFORMS.map((platform, index) => (
                <motion.a
                  key={platform.name}
                  custom={index}
                  variants={SECONDARY_ITEM_VARIANTS}
                  initial={prefersReducedMotion ? false : 'hidden'}
                  animate={prefersReducedMotion ? undefined : 'visible'}
                  href={safeUrl(platform.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-5 bg-surface/30 border rounded-2xl transition-all duration-300 group ${platform.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity">{platform.icon}</div>
                    <span className="text-sm font-bold font-display uppercase tracking-wider">{platform.name}</span>
                  </div>
                  <ExternalLink size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {releaseCards.length > 0 && (
            <section className="mb-16" aria-labelledby="music-releases-title">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="music-releases-title" className="text-2xl font-black font-display text-white">
                    {t('music.releases_title')}
                  </h2>
                  <p className="mt-1 text-sm text-white/50">{t('music.releases_subtitle')}</p>
                </div>
                <Link to={getLocalizedRoute('news', currentLang)} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80">
                  {t('news.title')} <ExternalLink size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {releaseCards.map((release) => (
                  <Link
                    key={release.id}
                    to={release.path}
                    className="group flex min-h-[132px] gap-4 rounded-2xl border border-white/10 bg-surface/35 p-4 transition-colors hover:border-primary/50 hover:bg-surface/60"
                  >
                    <img
                      src={safeUrl(release.image, '/images/zen-eyer-og-image.png')}
                      alt={release.name}
                      className="h-24 w-24 flex-none rounded-xl object-cover"
                      width="96"
                      height="96"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                        {release.type}
                      </div>
                      <h3 className="line-clamp-2 text-lg font-black text-white transition-colors group-hover:text-primary">
                        {release.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/50">{t('music.read_release')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download / Grab & Go Card */}
            <motion.div
              variants={CARD_VARIANTS(0.7)}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              className="bg-red-500/5 border border-red-500/10 rounded-3xl p-5 sm:p-8 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Download size={160} />
              </div>
              <h3 className="text-2xl font-black font-display mb-4 flex items-center gap-3">
                <Download className="text-red-500" /> {t('music.steal_button')}
              </h3>
              <p className="text-white/60 mb-8 max-w-xs">{t('music.steal_desc')}</p>
              <a
                href="https://download.djzeneyer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
              >
                {t('music.steal_cta')} <ExternalLink size={16} />
              </a>
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
              <p className="text-white/60 mb-8 max-w-xs">{t('music.support_desc')}</p>
              <Link
                to={getLocalizedRoute('support', currentLang)}
                className="inline-flex items-center gap-2 bg-primary hover:brightness-110 text-black font-black px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                {t('music.support_cta')} <ExternalLink size={16} />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
};

export default React.memo(MusicPage);
