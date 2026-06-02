import { useTranslation } from 'react-i18next';
import type { Track } from '../../types/music';
import { tracks } from '../../data/tracks';
import { HeadlessSEO } from '../../components/HeadlessSEO';
import { safeUrl } from '../../utils/sanitize';

export function MusicCatalogPage() {
  const { t } = useTranslation();
  const sorted = [...tracks].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <HeadlessSEO title={t('music_catalog_title')} description={t('music_catalog_description')} />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t('music_catalog_title')}</h1>
        <p className="mt-2 text-sm text-zinc-300">
          {t('music_catalog_description')}
        </p>
      </header>

      <section className="space-y-4">
        {sorted.map((track: Track) => (
          <article
            key={track.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-medium">{track.title}</h2>
                <p className="text-xs text-zinc-400">
                  {track.primaryArtist}
                  {track.bpm != null ? ` • ${track.bpm} ${t('track.bpm')}` : ''}
                  {track.energy != null ? ` • ${track.energy} ${t('track.energy')}` : ''}
                  {track.key != null ? ` • ${track.key}` : ''}
                </p>
                {track.moodTags.length > 0 && (
                  <p className="mt-1 text-xs text-zinc-400">
                    {track.moodTags.join(' · ')}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {track.links.map((link) => (
                  <a
                    key={`${track.id}-${link.platform}`}
                    href={safeUrl(link.url, '#')}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
