import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Heart, Music2, Sparkles } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const PhilosophyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const pageUrl = `${ARTIST.site.baseUrl}${getLocalizedRoute('philosophy', currentLang)}`;

  const philosophySchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        url: pageUrl,
        headline: t('philosophy.page_title'),
        description: t('philosophy.coming_soon_desc', { name: ARTIST.identity.stageName }),
        author: {
          '@type': 'Person',
          '@id': `${ARTIST.site.baseUrl}/#artist`,
          name: ARTIST.identity.stageName,
        },
        publisher: {
          '@type': 'Person',
          '@id': `${ARTIST.site.baseUrl}/#artist`,
          name: ARTIST.identity.stageName,
        },
        about: [
          { '@type': 'Thing', name: 'Cremosidade', description: 'A unique DJing philosophy developed by DJ Zen Eyer emphasizing smooth, creamy transitions in Brazilian Zouk music.' },
          { '@type': 'MusicGenre', name: 'Brazilian Zouk' },
        ],
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: ARTIST.site.baseUrl },
            { '@type': 'ListItem', position: 2, name: t('philosophy.page_title'), item: pageUrl },
          ],
        },
      },
    ],
  }), [t, pageUrl]);

  return (
    <>
      <HeadlessSEO
        title={`${t('philosophy.page_title')} | ${ARTIST.identity.stageName}`}
        description={t('philosophy.coming_soon_desc', { name: ARTIST.identity.stageName })}
        url={pageUrl}
        schema={philosophySchema}
        leadAnswer={t('philosophy.coming_soon_desc', { name: ARTIST.identity.stageName })}
      />

      <div className="min-h-screen pt-24 pb-16 px-4 bg-background text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-6xl font-black font-display mb-8">
              {t('philosophy.page_title')}
            </h1>

            <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
              <motion.div 
                whileHover={{ y: -5 }}
                className="card p-8 bg-surface/50 border border-white/10 hover:border-primary/50 transition-all rounded-3xl"
              >
                <Music2 className="w-10 h-10 text-primary mb-6" />
                <h2 className="text-xl font-black mb-4 uppercase tracking-[0.2em] text-primary">
                  {t('philosophy_page.style_title')}
                </h2>
                <p className="text-white/80 leading-relaxed italic text-lg">
                  "{t('about.philosophy.quote')}"
                </p>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest">{t('music.listen_now')}</span>
                    <div className="text-xs text-white/30 font-bold uppercase tracking-widest">— {ARTIST.identity.stageName}</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="card p-8 bg-surface/50 border border-white/10 hover:border-accent/50 transition-all rounded-3xl"
              >
                <Heart className="w-10 h-10 text-accent mb-6" />
                <h2 className="text-xl font-black mb-4 uppercase tracking-[0.2em] text-accent">
                  {t('philosophy_page.connection')}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {t('philosophy_page.connection_desc')}
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="card p-8 bg-surface/50 border border-white/10 hover:border-cyan-500/50 transition-all rounded-3xl"
              >
                <Sparkles className="w-10 h-10 text-cyan-500 mb-6" />
                <h2 className="text-xl font-black mb-4 uppercase tracking-[0.2em] text-cyan-500">
                  {t('philosophy_page.flow')}
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {t('philosophy_page.flow_desc')}
                </p>
              </motion.div>
            </div>

            {/* Expanded Content Sections */}
            <div className="space-y-12 mb-20 text-left">
              <section className="relative p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-5xl font-black font-display mb-6 tracking-tighter uppercase italic">
                    {t('philosophy_page.cremosidade_title')}
                  </h3>
                  <div className="h-1 w-20 bg-primary mb-8" />
                  <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl">
                    {t('philosophy_page.cremosidade_desc')}
                  </p>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="text-2xl font-black font-display uppercase tracking-widest text-white/90">
                    {t('philosophy_page.the_source')}
                  </h4>
                  <p className="text-lg text-white/50 leading-relaxed">
                    {t('philosophy_page.the_source_desc')}
                  </p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {t('philosophy_page.coming_soon_title')}
                  </h4>
                  <p className="text-white/40 italic">
                    {t('philosophy_page.coming_soon_desc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PhilosophyPage);
