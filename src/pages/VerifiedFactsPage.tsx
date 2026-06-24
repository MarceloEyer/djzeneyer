import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST } from '../data/artistData';
import { ARTIST_SCHEMA_BASE, MUSICGROUP_SCHEMA } from '../data/artist.schema';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const COUNTRIES = [
  'Brazil',
  'Netherlands',
  'Germany',
  'Poland',
  'Portugal',
  'Spain',
  'Australia',
  'Switzerland',
  'Ireland',
  'Slovenia',
  'United States',
  'Czech Republic',
  'Lithuania',
  'Latvia',
];

const FACT_ROWS = [
  ['stage_name', 'Zen Eyer', 'Official site, MusicBrainz, ISNI', 'P742'],
  ['legal_name', 'Marcelo Eyer Fernandes', 'Mensa/profile/source', 'P1477'],
  ['birth_date', '20 Aug 1985', 'ISNI/MusicBrainz', 'P569'],
  ['genre', 'Brazilian Zouk', 'Official site, All About Jazz', 'P136'],
  ['award_remix', 'verified_facts.facts.award_remix_value', 'verified_facts.facts.award_source', 'P166'],
  ['award_performance', 'verified_facts.facts.award_performance_value', 'verified_facts.facts.award_source', 'P166'],
  ['residence', 'Niterói, RJ', 'Official site', 'P551'],
] as const;

const VerifiedFactsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('verified-facts', currentLang)}`;

  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      ARTIST_SCHEMA_BASE,
      MUSICGROUP_SCHEMA,
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t('verified_facts.seo.title'),
        description: t('verified_facts.seo.description'),
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        about: { '@id': `${ARTIST.site.baseUrl}/#artist` },
        mainEntity: { '@id': `${ARTIST.site.baseUrl}/#artist` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: ARTIST.site.baseUrl },
            { '@type': 'ListItem', position: 2, name: t('verified_facts.nav_label'), item: pageUrl },
          ],
        },
      },
    ],
  }), [pageUrl, t]);

  return (
    <>
      <HeadlessSEO
        title={t('verified_facts.seo.title')}
        description={t('verified_facts.seo.description')}
        url={pageUrl}
        image="/images/og/zen-eyer-facts-og.jpg"
        imageAlt={t('og.image_alt.facts')}
        type="profile"
        schema={schema}
      />

      <main className="min-h-screen bg-background px-4 pb-20 pt-24 text-text">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumb items={[{ label: t('verified_facts.nav_label') }]} className="mb-10" />

          <header className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
              <ShieldCheck size={14} />
              {t('verified_facts.badge')}
            </div>
            <h1 className="mb-5 font-display text-4xl font-black tracking-tight md:text-6xl">
              {t('verified_facts.title')}
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-text/70" data-speakable>
              {t('verified_facts.intro')}
            </p>
          </header>

          <section className="mb-10 rounded-2xl border border-border/10 bg-surface/35 p-6">
            <h2 className="mb-4 font-display text-2xl font-black">{t('verified_facts.core_identity')}</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ['canonical', ARTIST.identity.stageName],
                ['aliases', 'DJ Zen Eyer, djzeneyer, zeneyer'],
                ['legal', ARTIST.identity.fullName],
                ['pronunciation', ARTIST.identity.pronunciationIPA],
                ['genre', 'Brazilian Zouk'],
                ['occupations', t('verified_facts.occupations_value')],
                ['residence', 'Niterói, Rio de Janeiro, Brazil'],
              ].map(([key, value]) => (
                <div key={key} className="rounded-xl border border-border/8 bg-text/[0.03] p-4">
                  <dt className="mb-1 text-xs font-bold uppercase tracking-widest text-primary/80">
                    {t(`verified_facts.identity.${key}`)}
                  </dt>
                  <dd className="text-sm leading-relaxed text-text/82">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mb-10 overflow-hidden rounded-2xl border border-border/10 bg-surface/35">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-text/[0.04] text-xs uppercase tracking-widest text-primary/80">
                  <tr>
                    <th className="px-4 py-3">{t('verified_facts.table.fact')}</th>
                    <th className="px-4 py-3">{t('verified_facts.table.value')}</th>
                    <th className="px-4 py-3">{t('verified_facts.table.source')}</th>
                    <th className="px-4 py-3">{t('verified_facts.table.wikidata')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {FACT_ROWS.map(([key, value, source, property]) => (
                    <tr key={key}>
                      <td className="px-4 py-4 font-bold text-text">{t(`verified_facts.facts.${key}`)}</td>
                      <td className="px-4 py-4 text-text/75">{t(value, { defaultValue: value })}</td>
                      <td className="px-4 py-4 text-text/65">{t(source, { defaultValue: source })}</td>
                      <td className="px-4 py-4 font-mono text-primary/80">{property}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/10 bg-surface/35 p-6">
              <h2 className="mb-4 font-display text-2xl font-black">{t('verified_facts.awards')}</h2>
              <ol className="list-decimal space-y-2 pl-5 text-text/75">
                <li>{t('verified_facts.facts.award_performance_value')}</li>
                <li>{t('verified_facts.facts.award_remix_value')}</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-border/10 bg-surface/35 p-6">
              <h2 className="mb-4 font-display text-2xl font-black">{t('verified_facts.external_identifiers')}</h2>
              <ul className="space-y-2 text-sm text-text/75">
                <li>Wikidata: {ARTIST.identifiers.wikidata}</li>
                <li>MusicBrainz: {ARTIST.identifiers.musicbrainz}</li>
                <li>ISNI: {ARTIST.identity.isni}</li>
                <li>Spotify Artist ID: {ARTIST.social.spotify.id}</li>
              </ul>
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-border/10 bg-surface/35 p-6">
            <h2 className="mb-4 font-display text-2xl font-black">{t('verified_facts.international_performances')}</h2>
            <p className="mb-4 text-text/75">{t('verified_facts.countries_intro')}</p>
            <p className="text-text/65">{COUNTRIES.join(', ')}.</p>
            <p className="mt-4 text-text/55">{t('verified_facts.online_russia')}</p>
          </section>

          <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="mb-4 font-display text-2xl font-black">{t('verified_facts.related_pages')}</h2>
            <div className="flex flex-wrap gap-3">
              {[
                ['about', t('nav.about')],
                ['faq', 'FAQ'],
                ['media', t('nav.media')],
              ].map(([routeKey, label]) => (
                <Link
                  key={routeKey}
                  to={getLocalizedRoute(routeKey, currentLang)}
                  className="rounded-lg border border-border/10 bg-text/5 px-4 py-2 text-sm font-bold text-text/75 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default React.memo(VerifiedFactsPage);
