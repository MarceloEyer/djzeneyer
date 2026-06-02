// src/pages/ReleaseDetailPage.tsx
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Music2, Calendar, Clock } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { ARTIST } from '../data/artistData';
import { DISCOGRAPHY } from '../data/artist.schema';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import NotFoundPage from './NotFoundPage';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDuration = (iso: string): string => {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return iso;
  const h = m[1] ? `${m[1]}:` : '';
  const min = (m[2] ?? '0').padStart(h ? 2 : 1, '0');
  const sec = (m[3] ?? '0').padStart(2, '0');
  return `${h}${min}:${sec}`;
};

const PLATFORMS = [
  { key: 'spotifyUrl', label: 'Spotify', color: '#1DB954' },
  { key: 'appleMusicUrl', label: 'Apple Music', color: '#FA243C' },
  { key: 'youtubeMusicUrl', label: 'YouTube Music', color: '#FF0000' },
  { key: 'youtubeUrl', label: 'YouTube', color: '#FF0000' },
  { key: 'soundcloudUrl', label: 'SoundCloud', color: '#FF5500' },
  { key: 'deezerUrl', label: 'Deezer', color: '#A238FF' },
  { key: 'tidalUrl', label: 'Tidal', color: '#00FFFF' },
  { key: 'amazonMusicUrl', label: 'Amazon Music', color: '#00A8E0' },
  { key: 'musicBrainzUrl', label: 'MusicBrainz', color: '#BA478F' },
] as const;

// ─── Framer Motion ───────────────────────────────────────────────────────────

const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 + 0.2 } }),
};

// ─── Component ───────────────────────────────────────────────────────────────

const ReleaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.language);

  const release = useMemo(() => DISCOGRAPHY.find((r) => r.id === id), [id]);

  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('release-detail', lang).replace(':id', id ?? '')}`;
  const musicHubRoute = getLocalizedRoute('music', lang);

  const schema = useMemo(() => {
    if (!release) return null;

    const releaseType = release.type === 'album' || release.type === 'ep'
      ? 'MusicAlbum'
      : 'MusicRecording';

    const streamingLinks = PLATFORMS
      .map((p) => release[p.key as keyof typeof release])
      .filter(Boolean) as string[];

    const base = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': releaseType,
          '@id': `${pageUrl}#release`,
          name: release.name,
          url: pageUrl,
          ...(release.releaseDate ? { datePublished: release.releaseDate } : {}),
          ...(release.releaseYear && !release.releaseDate ? { datePublished: release.releaseYear } : {}),
          image: release.image,
          ...(release.description ? { description: release.description } : {}),
          byArtist: release.byArtist ?? { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
          ...(release.contributor ? { contributor: release.contributor } : {}),
          ...(streamingLinks.length > 0 ? { sameAs: streamingLinks } : {}),
          ...(release.tracks.length > 0 ? {
            track: release.tracks.map((tr) => ({
              '@type': 'MusicRecording',
              name: tr.name,
              ...(tr.duration ? { duration: tr.duration } : {}),
              ...(tr.isrcCode ? { isrcCode: tr.isrcCode } : {}),
              ...(tr.spotifyUrl ? { sameAs: tr.spotifyUrl } : {}),
            })),
          } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: ARTIST.site.baseUrl },
            { '@type': 'ListItem', position: 2, name: t('music.pageTitle'), item: `${ARTIST.site.baseUrl}${musicHubRoute}` },
            { '@type': 'ListItem', position: 3, name: release.name, item: pageUrl },
          ],
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: release.name,
          ...(release.description ? { description: release.description } : {}),
          isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
          about: { '@id': `${pageUrl}#release` },
          primaryImageOfPage: release.image,
        },
      ],
    };

    return base;
  }, [release, pageUrl, musicHubRoute, lang, t]);

  if (!release) return <NotFoundPage />;

  const displayPlatforms = PLATFORMS.filter((p) => !!release[p.key as keyof typeof release]);
  const releaseTypeLabel = t(`music.release_type.${release.type}`);
  const dateDisplay = release.releaseDate
    ? new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(release.releaseDate))
    : release.releaseYear ?? '';

  return (
    <>
      <HeadlessSEO
        title={`${release.name} — Zen Eyer`}
        description={release.description ?? `${release.name} — ${releaseTypeLabel} by Zen Eyer. Brazilian Zouk music.`}
        image={release.image}
        imageAlt={`${release.name} cover art`}
        type="music.song"
        canonicalUrl={pageUrl}
        schema={schema}
        noindex={false}
      />

      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

          {/* Back link */}
          <Link
            to={musicHubRoute}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t('music.release_detail.back')}
          </Link>

          <Breadcrumb
            items={[
              { label: t('music.pageTitle'), to: musicHubRoute },
              { label: release.name },
            ]}
          />

          {/* Hero */}
          <motion.div
            variants={HERO_VARIANTS}
            initial="hidden"
            animate="visible"
            className="mt-6 flex flex-col sm:flex-row gap-6 items-start"
          >
            <img
              src={release.image}
              alt={`${release.name} cover`}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover shadow-lg flex-shrink-0"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">
                {releaseTypeLabel}
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold leading-tight">{release.name}</h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {dateDisplay && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {dateDisplay}
                  </span>
                )}
                {release.tracks[0]?.duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDuration(release.tracks[0].duration)}
                  </span>
                )}
              </div>

              {release.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {release.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* Streaming links */}
          {displayPlatforms.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {t('music.release_detail.listen_on')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {displayPlatforms.map((p, i) => (
                  <motion.a
                    key={p.key}
                    href={release[p.key as keyof typeof release] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={ITEM_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium hover:border-white/30 hover:bg-white/5 transition-colors"
                  >
                    <Music2 size={14} style={{ color: p.color }} />
                    {p.label}
                    <ExternalLink size={12} className="text-muted-foreground" />
                  </motion.a>
                ))}
              </div>
            </section>
          )}

          {/* Tracks */}
          {release.tracks.length > 1 && (
            <section className="mt-10">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Tracks
              </h2>
              <ol className="space-y-2">
                {release.tracks.map((tr, i) => (
                  <motion.li
                    key={tr.name}
                    variants={ITEM_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="flex items-center gap-4 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground w-5 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm">{tr.name}</span>
                    {tr.duration && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatDuration(tr.duration)}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ol>
            </section>
          )}

          {/* Credits */}
          {(release.byArtist || release.contributor) && (
            <section className="mt-10">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {t('music.release_detail.credits')}
              </h2>
              <dl className="space-y-2 text-sm">
                {release.byArtist && (release.byArtist as Record<string,unknown>).name && (
                  <div className="flex gap-3">
                    <dt className="text-muted-foreground min-w-28">
                      {t('music.release_detail.original_artist')}
                    </dt>
                    <dd>{String((release.byArtist as Record<string,unknown>).name)}</dd>
                  </div>
                )}
                {release.contributor && (
                  <div className="flex gap-3">
                    <dt className="text-muted-foreground min-w-28">
                      {t('music.release_detail.collaborator')}
                    </dt>
                    <dd>
                      {Array.isArray(release.contributor)
                        ? (release.contributor as Record<string,unknown>[]).map((c) => String(c.roleName ?? c.name ?? '')).join(', ')
                        : String((release.contributor as Record<string,unknown>).roleName ?? 'Zen Eyer')}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}

        </div>
      </main>
    </>
  );
};

export default ReleaseDetailPage;
