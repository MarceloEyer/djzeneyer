import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronRight, ExternalLink, Search, Sparkles } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Breadcrumb } from '../components/Breadcrumb';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST } from '../data/artistData';
import { ZOUK_ENCYCLOPEDIA, type EncyclopediaCategory } from '../data/zoukEncyclopedia';
import { safeUrl } from '../utils/sanitize';

const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CATEGORY_ORDER: EncyclopediaCategory[] = ['fundamentals', 'music', 'eventFormats', 'culture'];

const EncyclopediaPage: React.FC = () => {
  const { t, i18n } = useTranslation(['translation', 'encyclopedia']);
  const [query, setQuery] = useState('');
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const prefersReducedMotion = useReducedMotion();
  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('encyclopedia', currentLang)}`;

  const visibleTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return ZOUK_ENCYCLOPEDIA;

    return ZOUK_ENCYCLOPEDIA.filter((item) => {
      const haystack = [
        t(`terms.${item.key}.term`, { ns: 'encyclopedia' }),
        t(`terms.${item.key}.short`, { ns: 'encyclopedia' }),
        t(`terms.${item.key}.body`, { ns: 'encyclopedia' }),
        t(`categories.${item.category}`, { ns: 'encyclopedia' }),
      ].join(' ').toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, t]);

  const groupedTerms = useMemo(
    () => CATEGORY_ORDER.map((category) => ({
      category,
      terms: visibleTerms.filter((item) => item.category === category),
    })).filter((group) => group.terms.length > 0),
    [visibleTerms]
  );

  const leadAnswer = t('terms.brazilianZouk.short', { ns: 'encyclopedia' });

  const encyclopediaSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': `${pageUrl}#defined-term-set`,
        name: t('seo.title', { ns: 'encyclopedia' }),
        description: t('seo.description', { ns: 'encyclopedia' }),
        url: pageUrl,
        creator: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
        hasDefinedTerm: ZOUK_ENCYCLOPEDIA.map((item) => ({
          '@type': 'DefinedTerm',
          '@id': `${pageUrl}#${item.key}`,
          name: t(`terms.${item.key}.term`, { ns: 'encyclopedia' }),
          description: t(`terms.${item.key}.short`, { ns: 'encyclopedia' }),
          inDefinedTermSet: { '@id': `${pageUrl}#defined-term-set` },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t('seo.title', { ns: 'encyclopedia' }),
        description: t('seo.description', { ns: 'encyclopedia' }),
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        about: [
          { '@type': 'Thing', name: 'Brazilian Zouk' },
          { '@type': 'Thing', name: 'Zouk music' },
          { '@id': `${pageUrl}#defined-term-set` },
        ],
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: ARTIST.site.baseUrl },
            { '@type': 'ListItem', position: 2, name: t('nav_label', { ns: 'encyclopedia' }), item: pageUrl },
          ],
        },
      },
    ],
  }), [pageUrl, t]);

  return (
    <>
      <HeadlessSEO
        title={`${t('seo.title', { ns: 'encyclopedia' })} | ${ARTIST.identity.stageName}`}
        description={t('seo.description', { ns: 'encyclopedia' })}
        url={pageUrl}
        schema={encyclopediaSchema}
        leadAnswer={leadAnswer}
      />

      <div className="min-h-screen bg-background px-4 pb-20 pt-24 text-white">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumb items={[{ label: t('nav_label', { ns: 'encyclopedia' }) }]} className="mb-10" />

          <motion.header
            variants={HERO_VARIANTS}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
            className="mb-14 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
              <BookOpen size={14} />
              {t('badge', { ns: 'encyclopedia' })}
            </div>
            <h1 className="mb-6 font-display text-4xl font-black tracking-tight md:text-6xl">
              <Trans i18nKey="hero_title" ns="encyclopedia">
                Zouk <span className="text-primary">Encyclopedia</span>
              </Trans>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/65">
              {t('hero_subtitle', { ns: 'encyclopedia' })}
            </p>
          </motion.header>

          <section aria-label="Introduction to Brazilian Zouk" className="mx-auto mb-14 max-w-3xl space-y-8 rounded-2xl bg-surface/30 p-6 md:p-8">
            <div>
              <h2 className="mb-3 font-display text-xl font-bold text-white">
                {t('intro.what_is.q', { ns: 'encyclopedia' })}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {t('intro.what_is.a', { ns: 'encyclopedia' })}
              </p>
            </div>
            <div>
              <h2 className="mb-3 font-display text-xl font-bold text-white">
                {t('intro.dance_or_music.q', { ns: 'encyclopedia' })}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {t('intro.dance_or_music.a', { ns: 'encyclopedia' })}
              </p>
            </div>
            <div>
              <h2 className="mb-3 font-display text-xl font-bold text-white">
                {t('intro.differences.q', { ns: 'encyclopedia' })}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {t('intro.differences.a', { ns: 'encyclopedia' })}
              </p>
            </div>
          </section>

          <section aria-label={t('search_label', { ns: 'encyclopedia' })} className="mx-auto mb-14 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={20} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('search_placeholder', { ns: 'encyclopedia' })}
                aria-label={t('search_label', { ns: 'encyclopedia' })}
                className="h-14 w-full rounded-xl border border-white/10 bg-surface/50 pl-12 pr-4 text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/60"
              />
            </div>
          </section>

          {groupedTerms.length > 0 ? (
            <div className="space-y-12">
              {groupedTerms.map((group) => (
                <section key={group.category} aria-labelledby={`encyclopedia-${group.category}`}>
                  <h2 id={`encyclopedia-${group.category}`} className="mb-5 font-display text-2xl font-black text-white">
                    {t(`categories.${group.category}`, { ns: 'encyclopedia' })}
                  </h2>
                  <div className="grid gap-5">
                    {group.terms.map((item) => (
                      <article
                        id={item.key}
                        key={item.key}
                        className="rounded-2xl border border-white/10 bg-surface/35 p-5 transition-colors hover:border-primary/35 md:p-7"
                      >
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Sparkles size={20} />
                            </div>
                            <h3 className="font-display text-2xl font-black text-white">
                              {t(`terms.${item.key}.term`, { ns: 'encyclopedia' })}
                            </h3>
                          </div>
                          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/45">
                            {t(`categories.${item.category}`, { ns: 'encyclopedia' })}
                          </span>
                        </div>

                        <p className="mb-4 text-base font-semibold leading-relaxed text-white/85" data-speakable>
                          {t(`terms.${item.key}.short`, { ns: 'encyclopedia' })}
                        </p>
                        <p className="text-base leading-relaxed text-white/62">
                          {t(`terms.${item.key}.body`, { ns: 'encyclopedia' })}
                        </p>

                        {item.relatedTerms && item.relatedTerms.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {item.relatedTerms.map((related) => (
                              <a
                                key={related}
                                href={`#${related}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-bold text-primary/75 transition-colors hover:bg-primary/10 hover:text-primary"
                              >
                                <ChevronRight size={12} />
                                {t(`terms.${related}.term`, { ns: 'encyclopedia' })}
                              </a>
                            ))}
                          </div>
                        )}

                        {item.sources && item.sources.length > 0 && (
                          <div className="mt-5 border-t border-white/10 pt-4">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
                              {t('sources_label', { ns: 'encyclopedia' })}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.sources.map((source) => (
                                <a
                                  key={source.url}
                                  href={safeUrl(source.url, '/')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/65 transition-colors hover:border-primary/35 hover:text-primary"
                                >
                                  {source.label}
                                  <ExternalLink size={12} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-surface/35 p-8 text-center text-white/60">
              {t('no_results', { ns: 'encyclopedia' })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(EncyclopediaPage);
