import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronRight, ExternalLink, Search, Sparkles } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { ARTIST } from '../data/artistData';
import {
  findEncyclopediaTermBySlug,
  toEncyclopediaTermSlug,
  ZOUK_ENCYCLOPEDIA,
  type EncyclopediaCategory,
  type EncyclopediaTerm,
} from '../data/zoukEncyclopedia';
import { safeUrl } from '../utils/sanitize';

const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CATEGORY_ORDER: EncyclopediaCategory[] = ['fundamentals', 'history', 'styles', 'music', 'eventFormats', 'culture'];

const EncyclopediaHubPage: React.FC = () => {
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

          <section aria-label={t('intro_label', { ns: 'encyclopedia' })} className="mx-auto mb-14 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              {(['what_is', 'dance_or_music', 'differences'] as const).map((item) => (
                <div key={item} className="border-t border-white/10 pt-5">
                  <h2 className="mb-3 font-display text-lg font-bold leading-tight text-white">
                    {t(`intro.${item}.q`, { ns: 'encyclopedia' })}
                  </h2>
                  <p className="text-sm leading-relaxed text-white/62">
                    {t(`intro.${item}.a`, { ns: 'encyclopedia' })}
                  </p>
                </div>
              ))}
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
                              <Link
                                to={`${getLocalizedRoute('encyclopedia', currentLang)}/${toEncyclopediaTermSlug(item.key)}`}
                                className="transition-colors hover:text-primary"
                              >
                                {t(`terms.${item.key}.term`, { ns: 'encyclopedia' })}
                              </Link>
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
                              <Link
                                key={related}
                                to={`${getLocalizedRoute('encyclopedia', currentLang)}/${toEncyclopediaTermSlug(related)}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-bold text-primary/75 transition-colors hover:bg-primary/10 hover:text-primary"
                              >
                                <ChevronRight size={12} />
                                {t(`terms.${related}.term`, { ns: 'encyclopedia' })}
                              </Link>
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
                                  {source.labelKey ? t(`sources.${source.labelKey}`, { ns: 'encyclopedia' }) : source.label}
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


interface EncyclopediaTermPageProps {
  term: EncyclopediaTerm;
}

const EncyclopediaTermPage: React.FC<EncyclopediaTermPageProps> = ({ term }) => {
  const { t, i18n } = useTranslation(['translation', 'encyclopedia']);
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const prefersReducedMotion = useReducedMotion();
  const hubPath = getLocalizedRoute('encyclopedia', currentLang);
  const termSlug = toEncyclopediaTermSlug(term.key);
  const pagePath = `${hubPath}/${termSlug}`;
  const pageUrl = `${ARTIST.site.baseUrl}${pagePath}`;
  const termName = t(`terms.${term.key}.term`, { ns: 'encyclopedia' });
  const shortAnswer = t(`terms.${term.key}.short`, { ns: 'encyclopedia' });
  const body = t(`terms.${term.key}.body`, { ns: 'encyclopedia' });
  const question = t('detail.question', { ns: 'encyclopedia', term: termName });
  const completeAnswer = `${shortAnswer} ${body}`;
  const enUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('encyclopedia', 'en')}/${termSlug}`;
  const ptUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('encyclopedia', 'pt')}/${termSlug}`;

  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': `${ARTIST.site.baseUrl}${hubPath}#defined-term-set`,
        name: t('seo.title', { ns: 'encyclopedia' }),
        url: `${ARTIST.site.baseUrl}${hubPath}`,
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${pageUrl}#defined-term`,
        name: termName,
        description: shortAnswer,
        url: pageUrl,
        inDefinedTermSet: { '@id': `${ARTIST.site.baseUrl}${hubPath}#defined-term-set` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: [{
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: completeAnswer },
        }],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${termName} | ${t('seo.title', { ns: 'encyclopedia' })}`,
        description: shortAnswer,
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        mainEntity: { '@id': `${pageUrl}#defined-term` },
        about: { '@id': `${pageUrl}#defined-term` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: ARTIST.site.baseUrl },
            { '@type': 'ListItem', position: 2, name: t('nav_label', { ns: 'encyclopedia' }), item: `${ARTIST.site.baseUrl}${hubPath}` },
            { '@type': 'ListItem', position: 3, name: termName, item: pageUrl },
          ],
        },
      },
    ],
  }), [completeAnswer, hubPath, pageUrl, question, shortAnswer, t, termName]);

  return (
    <>
      <HeadlessSEO
        title={`${termName} | ${t('seo.title', { ns: 'encyclopedia' })} | ${ARTIST.identity.stageName}`}
        description={shortAnswer}
        url={pageUrl}
        hrefLang={[
          { lang: 'en', url: enUrl },
          { lang: 'pt-BR', url: ptUrl },
          { lang: 'x-default', url: enUrl },
        ]}
        schema={schema}
        leadAnswer={shortAnswer}
      />

      <div className="min-h-screen bg-background px-4 pb-20 pt-24 text-white">
        <div className="container mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: t('nav_label', { ns: 'encyclopedia' }), path: hubPath },
              { label: termName },
            ]}
            className="mb-10"
          />

          <motion.article
            variants={HERO_VARIANTS}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
            className="rounded-3xl border border-white/10 bg-surface/35 p-6 md:p-10"
          >
            <Link to={hubPath} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80">
              <ArrowLeft size={16} />
              {t('detail.back_to_encyclopedia', { ns: 'encyclopedia' })}
            </Link>

            <span className="mb-4 block w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              {t(`categories.${term.category}`, { ns: 'encyclopedia' })}
            </span>
            <h1 className="mb-8 font-display text-4xl font-black tracking-tight md:text-6xl">{termName}</h1>

            <section aria-labelledby="term-question">
              <h2 id="term-question" className="mb-4 font-display text-2xl font-black text-white md:text-3xl">{question}</h2>
              <p className="mb-5 text-lg font-semibold leading-relaxed text-white/85" data-speakable>{shortAnswer}</p>
              <p className="text-base leading-relaxed text-white/65 md:text-lg">{body}</p>
            </section>

            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <section className="mt-10 border-t border-white/10 pt-6" aria-labelledby="related-terms">
                <h2 id="related-terms" className="mb-4 text-sm font-black uppercase tracking-widest text-white/60">
                  {t('detail.related_terms', { ns: 'encyclopedia' })}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.map((related) => (
                    <Link
                      key={related}
                      to={`${hubPath}/${toEncyclopediaTermSlug(related)}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-sm font-bold text-primary/80 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <ChevronRight size={14} />
                      {t(`terms.${related}.term`, { ns: 'encyclopedia' })}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {term.sources && term.sources.length > 0 && (
              <section className="mt-8 border-t border-white/10 pt-6" aria-labelledby="term-sources">
                <h2 id="term-sources" className="mb-4 text-sm font-black uppercase tracking-widest text-white/60">
                  {t('sources_label', { ns: 'encyclopedia' })}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {term.sources.map((source) => (
                    <a key={source.url} href={safeUrl(source.url, '/')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/65 transition-colors hover:border-primary/35 hover:text-primary">
                      {source.labelKey ? t(`sources.${source.labelKey}`, { ns: 'encyclopedia' }) : source.label}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </motion.article>
        </div>
      </div>
    </>
  );
};

const EncyclopediaPage: React.FC = () => {
  const { term: termSlug } = useParams<{ term?: string }>();
  const { pathname } = useLocation();
  const term = findEncyclopediaTermBySlug(termSlug);

  if (termSlug && !term) {
    return <Navigate to={getLocalizedRoute('encyclopedia', pathname.startsWith('/pt/') ? 'pt' : 'en')} replace />;
  }

  return term ? <EncyclopediaTermPage term={term} /> : <EncyclopediaHubPage />;
};

export default React.memo(EncyclopediaPage);
