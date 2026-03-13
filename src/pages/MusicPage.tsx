// src/pages/MusicPage.tsx
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Music2, Youtube, Cloud, Play, ArrowLeft, Coffee, Download, ExternalLink } from 'lucide-react';
import { useTrackBySlug } from '../hooks/useQueries';
import { useParams, Link, generatePath } from 'react-router-dom';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST } from '../data/artistData';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { stripHtml } from '../utils/text';

// --- SVG Icons for music platforms ---
const SpotifyIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const MusicPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const prefersReducedMotion = useReducedMotion();

  const { data: singleTrack, isLoading: singleLoading } = useTrackBySlug(slug);

  const streamingPlatforms = useMemo(() => [
    {
      name: 'Spotify',
      icon: <SpotifyIcon />,
      url: ARTIST.social.spotify.url,
      color: 'hover:bg-[#1DB954]/20 border-[#1DB954]/20 hover:border-[#1DB954]/50'
    },
    {
      name: 'Apple Music',
      icon: <Music2 className="text-[#FA243C]" />,
      url: ARTIST.social.appleMusic.url,
      color: 'hover:bg-[#FA243C]/20 border-[#FA243C]/20 hover:border-[#FA243C]/50'
    },
    {
      name: 'SoundCloud',
      icon: <Cloud className="text-[#FF5500]" />,
      url: ARTIST.social.soundcloud.url,
      color: 'hover:bg-[#FF5500]/20 border-[#FF5500]/20 hover:border-[#FF5500]/50'
    },
    {
      name: 'YouTube',
      icon: <Youtube className="text-[#FF0000]" />,
      url: ARTIST.social.youtube.url,
      color: 'hover:bg-[#FF0000]/20 border-[#FF0000]/20 hover:border-[#FF0000]/50'
    }
  ], []);

  const spotifyPlatform = useMemo(
    () => streamingPlatforms.find((platform) => platform.name === 'Spotify'),
    [streamingPlatforms]
  );
  const secondaryPlatforms = useMemo(
    () => streamingPlatforms.filter((platform) => platform.name !== 'Spotify'),
    [streamingPlatforms]
  );

  // --- RENDERIZACAO DE FAIXA UNICA (DETALHE) ---
  if (!singleLoading && slug && singleTrack) {
    const origin = typeof window !== 'undefined' ? window.location.origin : ARTIST.site.baseUrl;
    const trackImage = safeUrl(singleTrack.featured_image_src_full || singleTrack.featured_image_src, '/images/hero-background.webp');
    const trackUrl = `${origin}${generatePath(getLocalizedRoute('music-detail', currentLang), { slug })}`;

    const musicSchema = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      "name": stripHtml(singleTrack.title?.rendered || t('music.pageTitle')),
      "image": trackImage,
      "url": trackUrl,
      "byArtist": {
        "@type": "MusicGroup",
        "name": ARTIST.identity.stageName
      }
    };

    return (
      <>
        <HeadlessSEO
          title={`${singleTrack.title?.rendered || t('music.pageTitle')} | Zen Music`}
          description={singleTrack.excerpt?.rendered || t('music.pageDesc')}
          url={trackUrl}
          image={trackImage}
          type="music.song"
          schema={musicSchema}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={getLocalizedRoute('music', currentLang)} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold">
              <ArrowLeft size={20} /> {t('music.back')}
            </Link>

            <div className="bg-surface/30 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative group">
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                  <img
                    src={safeUrl(singleTrack.featured_image_src_full || singleTrack.featured_image_src, '/images/hero-background.webp')}
                    className="w-full h-full object-cover"
                    alt={
                      singleTrack.title?.rendered
                        ? t('common.image_alts.music_track', {
                            title: stripHtml(singleTrack.title.rendered),
                          })
                        : t('common.image_alts.music_track', { title: 'New Track' })
                    }
                  />
                </div>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl md:text-6xl font-black font-display mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(singleTrack.title?.rendered) }} />
                  <p className="text-primary font-bold mb-8 tracking-widest uppercase">{t('music.artist_tag')}</p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {(singleTrack.links as any)?.spotify && (
                      <a
                        href={safeUrl((singleTrack.links as any).spotify)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary px-8 py-3 rounded-full flex items-center gap-2 relative overflow-hidden group/btn shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] transition-all bg-[#1DB954] text-black border-none"
                      >
                        <Play fill="currentColor" size={18} /> {t('common.platforms.spotify')}
                      </a>
                    )}
                    {(singleTrack.links as any)?.soundcloud && (
                      <a
                        href={safeUrl((singleTrack.links as any).soundcloud)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline px-8 py-3 rounded-full flex items-center gap-2 border-white/20"
                      >
                        <Cloud size={18} /> {t('common.platforms.soundcloud')}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-16 border-t border-white/5 pt-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Music2 size={18} className="text-primary" /> {t('music.about_track')}</h2>
                <div
                  className="prose prose-invert max-w-none text-white/60"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(singleTrack.content?.rendered || singleTrack.excerpt?.rendered || "") }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeadlessSEO
        title={`${t('music_page_title')} | DJ Zen Eyer`}
        description={t('music_page_meta_desc')}
        url={`${window.location.origin}${getLocalizedRoute('music', currentLang)}`}
      />
      <div className="min-h-screen bg-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">

          <div className="text-center mb-16">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter uppercase">
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
            {spotifyPlatform && (
              <motion.a
                key={spotifyPlatform.name}
                href={safeUrl(spotifyPlatform.url)}
                target="_blank"
                rel="noopener noreferrer"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={prefersReducedMotion ? undefined : { duration: 0.5 }}
                className="flex items-center justify-between p-8 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-[2rem] transition-all duration-500 group relative overflow-hidden active:scale-[0.98] shadow-2xl shadow-[#1DB954]/10 hover:shadow-[#1DB954]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#1DB954] text-black rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <SpotifyIcon />
                  </div>
                  <div>
                    <span className="text-2xl md:text-3xl font-black font-display uppercase tracking-widest text-[#1DB954]">
                      {spotifyPlatform.name} — {t('music.listen_now')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <Play fill="white" className="text-white scale-150 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-500 hidden md:block" />
                  <ExternalLink size={24} className="text-[#1DB954] group-hover:text-white transition-colors" />
                </div>
              </motion.a>
            )}

            {/* Other Platforms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {secondaryPlatforms.map((platform, index) => (
                <motion.a
                  key={platform.name}
                  href={safeUrl(platform.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? undefined : { delay: index * 0.1 + 0.3 }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download / Steal Card */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? undefined : { delay: 0.7 }}
              className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 relative overflow-hidden group"
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
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? undefined : { delay: 0.8 }}
              className="bg-primary/5 border border-primary/10 rounded-3xl p-8 relative overflow-hidden group"
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

export default MusicPage;
