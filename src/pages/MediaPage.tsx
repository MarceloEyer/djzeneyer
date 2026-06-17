import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Download, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { ARTIST_SCHEMA_BASE, MUSICGROUP_SCHEMA } from '../data/artist.schema';
import { PUBLISHED_WORKS } from '../data/publishedWorks';
import { useBranding } from '../contexts/BrandingContext';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { safeUrl } from '../utils/sanitize';

type MediaClippingItem = {
  type: string;
  title: string;
  description: string;
  source: string;
  url: string;
  date: string;
};

const EMPTY_CLIPPING_ARRAY: MediaClippingItem[] = [];

const GROUP_ITEM_INITIAL = { opacity: 0, x: -20 };
const GROUP_ITEM_WHILE_IN_VIEW = { opacity: 1, x: 0 };
const GROUP_ITEM_VIEWPORT = { once: true };
const FEATURED_VIDEO = {
  id: 'TcdCdpTzz-M',
  uploadDate: '2017-10-30T09:16:47-07:00',
  duration: 'PT3M19S',
  embedUrl: 'https://www.youtube.com/embed/TcdCdpTzz-M',
  contentUrl: 'https://www.youtube.com/watch?v=TcdCdpTzz-M',
  thumbnailUrl: 'https://i.ytimg.com/vi/TcdCdpTzz-M/hqdefault.jpg',
};

const MediaPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { artist } = useBranding();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const featuredVideoTitle = t('media_page.featured_video_title');
  const featuredVideoDescription = t('media_page.featured_video_desc');
  const currentPath = getLocalizedRoute('media', currentLang);
  const currentUrl = `${artist.site.baseUrl || ARTIST.site.baseUrl}/${currentPath.replace(/^\//, '')}/`;

  const clippingData = useMemo(() => {
    const items = [
      ...PUBLISHED_WORKS.map((work) => ({
        ...work,
        title: t(`published_works.${work.translationKey}.title`),
        description: t(`published_works.${work.translationKey}.description`),
      })),
      ...((artist.mediaClipping || ARTIST.mediaClipping || EMPTY_CLIPPING_ARRAY) as MediaClippingItem[]),
    ];

    return [...new Map(items.map((item, index) => [item.url || `fallback-id-${index}`, item])).values()];
  }, [artist.mediaClipping, t]);

  const mediaGroups = useMemo(() => [
    {
      title: t('media_page.independent_sources'),
      items: clippingData.filter((item) => ['Article', 'Essay', 'Media', 'Report'].includes(item.type)),
    },
    {
      title: t('media_page.festival_lineups'),
      items: clippingData.filter((item) => ['Official', 'Event'].includes(item.type)),
    },
    {
      title: t('media_page.music_databases'),
      items: clippingData.filter((item) => ['Analytics'].includes(item.type) || ['All About Jazz'].includes(item.source)),
    },
    {
      title: t('media_page.artist_directories'),
      items: clippingData.filter((item) => ['Profile', 'Wiki'].includes(item.type) && item.source !== 'All About Jazz'),
    },
    {
      title: t('media_page.distribution_sources'),
      items: clippingData.filter((item) => ['Press Release'].includes(item.type)),
    },
  ].filter((group) => group.items.length > 0), [clippingData, t]);

  const mediaPageSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      ARTIST_SCHEMA_BASE,
      MUSICGROUP_SCHEMA,
      {
        '@type': 'CollectionPage',
        '@id': `${currentUrl}#webpage`,
        url: currentUrl,
        name: `${t('media_page.title')} | ${artist.identity.stageName || ARTIST.identity.stageName}`,
        description: t('media_page.subtitle'),
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        about: { '@id': `${ARTIST.site.baseUrl}/#artist` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: PUBLISHED_WORKS.map((work, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: { '@id': `${work.url}#article` },
          })),
        },
        inLanguage: currentLang === 'pt' ? 'pt-BR' : 'en',
      },
      {
        '@type': 'VideoObject',
        '@id': `${currentUrl}#featured-video`,
        name: featuredVideoTitle,
        description: featuredVideoDescription,
        thumbnailUrl: FEATURED_VIDEO.thumbnailUrl,
        uploadDate: FEATURED_VIDEO.uploadDate,
        embedUrl: FEATURED_VIDEO.embedUrl,
        contentUrl: FEATURED_VIDEO.contentUrl,
        duration: FEATURED_VIDEO.duration,
      },
      ...PUBLISHED_WORKS.map((work) => ({
        '@type': work.type,
        '@id': `${work.url}#article`,
        headline: work.title,
        name: work.title,
        url: work.url,
        datePublished: work.date,
        dateModified: work.date,
        description: work.description,
        author: {
          '@type': 'Person',
          '@id': `${ARTIST.site.baseUrl}/#artist`,
          name: ARTIST.identity.stageName,
          url: `${ARTIST.site.baseUrl}${ARTIST.site.pages.about}`,
        },
        publisher: {
          '@type': 'Organization',
          name: work.source,
          url: work.publisherUrl,
        },
        about: [
          {
            '@type': 'Thing',
            name: 'Brazilian Zouk',
          },
          {
            '@id': `${ARTIST.site.baseUrl}/#musicgroup`,
          },
        ],
        mainEntityOfPage: work.url,
      })),
    ],
  }), [artist.identity.stageName, currentLang, currentUrl, featuredVideoDescription, featuredVideoTitle, t]);

  // ⚡ Bolt: Wrapped static array allocation in useMemo to reduce garbage collection overhead during render loops.
  // ⚡ Bolt: Extracted static media facts array from inline render loop map
  const mediaFacts = useMemo(() => [
    { label: t('media_page.artist_name'), value: ARTIST.identity.stageName },
    { label: t('media_page.legal_name'), value: ARTIST.identity.fullName },
    { label: t('media_page.genre'), value: t('media_page.genre_value') },
    { label: t('media_page.location'), value: t('media_page.location_value') },
    { label: t('media_page.cnpj'), value: ARTIST.identity.taxId },
  ], [t]);

  const mediaAssets = useMemo(() => [
    {
      title: t('media_page.high_res_photos'),
      description: t('media_page.high_res_photos_desc'),
      icon: ImageIcon,
      available: true,
      url: 'https://photos.djzeneyer.com'
    },
    {
      title: t('media_page.official_bio'),
      description: t('media_page.official_bio_desc'),
      icon: Newspaper,
      available: true,
      url: '/media/dj-zen-eyer-bio.pdf'
    },
    {
      title: t('media_page.press_kit_pdf'),
      description: t('media_page.press_kit_pdf_desc'),
      icon: Download,
      available: false
    }
  ], [t]);

  return (
    <>
      <HeadlessSEO
        title={`${t('media_page.title')} | ${artist.identity.stageName || ARTIST.identity.stageName}`}
        description={t('media_page.subtitle')}
        url={currentUrl}
        image="/images/og/zen-eyer-press-og.jpg"
        imageAlt={t('og.image_alt.press')}
        schema={mediaPageSchema}
      />

      <div className="min-h-screen pt-24 sm:pt-40 pb-16 sm:pb-24 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 sm:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 text-sm font-bold tracking-widest uppercase">
              <Newspaper size={16} /> {t('media_page.verified_profiles')}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-display mb-6 sm:mb-8 text-white tracking-tighter uppercase leading-[0.9]">
              {t('media_page.h1')}
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              {t('media_page.intro')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Main Content: Clipping List */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-3xl font-black font-display text-white uppercase tracking-widest mb-8 border-l-4 border-primary pl-6">
                {t('media_page.press_highlights')}
              </h2>
              
              <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <ShieldCheck size={18} />
                  <h3 className="font-display text-lg font-black uppercase tracking-widest">
                    {t('media_page.sources_corrections')}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-white/65">
                  {t('media_page.sources_corrections_desc')}
                </p>
              </div>

              {mediaGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-5 mt-12 text-xl font-black text-white first:mt-0">{group.title}</h3>
                  <div className="grid gap-6">
                    {group.items.map((item, index: number) => (
                      <motion.div
                        key={`${group.title}-${item.url}`}
                        initial={GROUP_ITEM_INITIAL}
                        whileInView={GROUP_ITEM_WHILE_IN_VIEW}
                        viewport={GROUP_ITEM_VIEWPORT}
                        transition={{ delay: index * 0.1 }}
                      >
                        <a
                          href={safeUrl(item.url, '/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block card p-6 bg-surface/30 backdrop-blur-md border hover:border-primary/50 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-primary text-xs font-bold uppercase tracking-widest border border-white/5 group-hover:bg-primary/20 transition-colors">
                              {item.type}
                            </span>
                            <span className="text-white/55 text-xs font-mono">{item.date}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors tracking-tight">
                            {item.title}
                          </h3>
                          <p className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary/70">
                            <span>{item.source}</span>
                            <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
                              {t('media_page.read_more')} <ExternalLink size={14} />
                            </span>
                          </div>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Sidebar: Assets & Quick Facts */}
            <div className="space-y-12">
              <section>
                <h3 className="text-xl font-black font-display text-white uppercase tracking-widest mb-6">
                  {t('media_page.media_assets')}
                </h3>
                <div className="grid gap-4">
                  {mediaAssets.map((asset, index) => (
                    <div key={index} className="card p-5 bg-surface/50 border-white/5 hover:border-primary/30 transition-all flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary`}>
                        <asset.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm uppercase">{asset.title}</h4>
                        <p className="text-white/55 text-xs line-clamp-1">{asset.description}</p>
                      </div>
                      {asset.available ? (
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="p-3 min-h-[44px] text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold uppercase">
                          {t('media_page.download')} <Download size={18} />
                        </a>
                      ) : (
                        <span className="text-xs text-white/35 uppercase font-black">{t('media_page.coming_soon')}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface/40">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="h-full w-full"
                    src={safeUrl(FEATURED_VIDEO.embedUrl, '/')}
                    title={featuredVideoTitle}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                    {t('media_page.featured_video_label')}
                  </div>
                  <h3 className="mb-2 font-display text-lg font-black uppercase tracking-tight text-white">
                    {featuredVideoTitle}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/65">
                    {featuredVideoDescription}
                  </p>
                  <a
                    href={safeUrl(FEATURED_VIDEO.contentUrl, '/')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80"
                  >
                    {t('media_page.watch_on_youtube')} <ExternalLink size={14} />
                  </a>
                </div>
              </section>

              <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border border-white/5">
                <h3 className="text-xl font-black font-display text-white uppercase tracking-widest mb-6">
                  {t('media_page.quick_facts')}
                </h3>
                <div className="space-y-6">
                  {mediaFacts.map((fact, i) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div className="text-xs text-primary font-black uppercase tracking-[0.2em] mb-1">{fact.label}</div>
                      <div className="text-white font-bold text-sm">{fact.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-8 bg-primary/10 border-primary/20 text-center">
                <h3 className="text-xl font-black font-display text-white uppercase tracking-tight mb-4">
                  {t('media_page.press_inquiries')}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {t('media_page.press_inquiries_desc')}
                </p>
                <a
                  href={`mailto:${ARTIST.contact.email}`}
                  className="btn btn-primary btn-sm w-full justify-center px-6 py-4 font-black uppercase tracking-widest"
                >
                  {t('media_page.contact_press_office')}
                </a>
              </section>
            </div>
          </div>

          {/* Social Proof / Footer IDs */}
          <div className="mt-32 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
            <a href={safeUrl(ARTIST.identifiers.wikidataUrl, '/')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
              <span className="font-display font-black text-xl tracking-tighter">Wikidata</span>
              <ExternalLink size={14} />
            </a>
            <a href={safeUrl(ARTIST.identifiers.musicbrainzUrl, '/')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
               <span className="font-display font-black text-xl tracking-tighter">MusicBrainz</span>
               <ExternalLink size={14} />
             </a>
             <a href={safeUrl(ARTIST.identifiers.discogsUrl, '/')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
               <span className="font-display font-black text-xl tracking-tighter">Discogs</span>
               <ExternalLink size={14} />
             </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(MediaPage);
