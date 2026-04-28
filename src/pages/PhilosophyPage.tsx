import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Heart, Music2, Sparkles } from 'lucide-react';
import { ARTIST } from '../data/artistData';
import { useTranslation, Trans } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

// ─── Framer Motion — module-level constants ───────────────────────────────────
const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const QUOTE_VARIANTS = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
};

const CARDS_CONTAINER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const CARD_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CARD_HOVER = { y: -8 };
const VIEWPORT_ONCE = { once: true, amount: 0.15 };

// ─── Component ────────────────────────────────────────────────────────────────
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
        description: t('philosophy.cremosidade_desc'),
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
          { '@type': 'Thing', name: 'Cremosidade', description: t('philosophy_page.cremosidade_desc') },
          { '@type': 'MusicGenre', name: 'Brazilian Zouk' },
        ],
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.lead-answer', '[data-speakable]'],
        },
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('home'), item: `${ARTIST.site.baseUrl}${getLocalizedRoute('home', currentLang)}` },
            { '@type': 'ListItem', position: 2, name: t('philosophy.page_title'), item: pageUrl },
          ],
        },
      },
    ],
  }), [t, pageUrl, currentLang]);

  return (
    <>
      <HeadlessSEO
        title={`${t('philosophy.page_title')} | ${ARTIST.identity.stageName}`}
        description={t('philosophy.cremosidade_desc')}
        url={pageUrl}
        schema={philosophySchema}
        leadAnswer={t('philosophy.cremosidade_desc')}
      />

      <div className="min-h-screen bg-background text-white">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[55vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-primary/15 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[120px]" />
          </div>

          <motion.div
            className="relative z-10 text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={HERO_VARIANTS}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              {t('philosophy_page.manifesto_badge')}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-display mb-6 leading-none tracking-tight">
              <Trans i18nKey="philosophy.hero_title_rich">
                Filosofia <span className="text-primary">Artística</span>
              </Trans>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed" data-speakable>
              {t('philosophy_page.hero_subtitle')}
            </p>
          </motion.div>
        </section>

        {/* ── QUOTE ────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4 bg-surface/30 border-y border-white/5">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            variants={QUOTE_VARIANTS}
          >
            <div className="text-7xl sm:text-8xl text-primary/20 font-display leading-none mb-2 select-none" aria-hidden>
              &ldquo;
            </div>
            <blockquote className="text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed italic font-light -mt-4">
              {t('about.philosophy.quote')}
            </blockquote>
            <div className="mt-6 text-sm text-white/40 font-bold uppercase tracking-[0.2em]">
              &mdash; {ARTIST.identity.stageName}
            </div>
          </motion.div>
        </section>

        {/* ── 3 PRINCÍPIOS ─────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={CARDS_CONTAINER_VARIANTS}
            >
              {/* 01 — O Estilo */}
              <motion.div
                variants={CARD_ITEM_VARIANTS}
                whileHover={CARD_HOVER}
                className="group card p-6 sm:p-8 bg-surface/50 border border-white/10 hover:border-primary/50 transition-colors duration-300 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-6 group-hover:bg-primary/25 transition-colors duration-300">
                  <Music2 className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary/50 uppercase tracking-[0.3em] mb-2">01</div>
                <h2 className="text-xl font-black uppercase tracking-[0.15em] text-white mb-4">
                  {t('philosophy_page.style_title')}
                </h2>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  {t('philosophy_page.style_desc')}
                </p>
              </motion.div>

              {/* 02 — Conexão Real */}
              <motion.div
                variants={CARD_ITEM_VARIANTS}
                whileHover={CARD_HOVER}
                className="group card p-6 sm:p-8 bg-surface/50 border border-white/10 hover:border-accent/50 transition-colors duration-300 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-colors duration-300">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div className="text-xs font-bold text-accent/50 uppercase tracking-[0.3em] mb-2">02</div>
                <h2 className="text-xl font-black uppercase tracking-[0.15em] text-white mb-4">
                  {t('philosophy_page.connection')}
                </h2>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  {t('philosophy_page.connection_desc')}
                </p>
              </motion.div>

              {/* 03 — Estado de Flow */}
              <motion.div
                variants={CARD_ITEM_VARIANTS}
                whileHover={CARD_HOVER}
                className="group card p-6 sm:p-8 bg-surface/50 border border-white/10 hover:border-cyan-500/50 transition-colors duration-300 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-6 group-hover:bg-cyan-500/25 transition-colors duration-300">
                  <Sparkles className="w-6 h-6 text-cyan-500" />
                </div>
                <div className="text-xs font-bold text-cyan-500/50 uppercase tracking-[0.3em] mb-2">03</div>
                <h2 className="text-xl font-black uppercase tracking-[0.15em] text-white mb-4">
                  {t('philosophy_page.flow')}
                </h2>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  {t('philosophy_page.flow_desc')}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── CREMOSIDADE ──────────────────────────────────────────────── */}
        <section className="pb-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              className="relative p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/5 overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={FADE_UP_VARIANTS}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 pointer-events-none" aria-hidden />
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-4 tracking-tighter uppercase italic">
                  {t('philosophy_page.cremosidade_title')}
                </h3>
                <div className="h-1 w-16 sm:w-20 bg-primary mb-6 sm:mb-8" />
                <p className="text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl">
                  {t('philosophy_page.cremosidade_desc')}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FONTE + VISÃO ─────────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">

              {/* A Fonte */}
              <motion.div
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                variants={FADE_UP_VARIANTS}
              >
                <h4 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-widest text-white/90">
                  {t('philosophy_page.the_source')}
                </h4>
                <div className="h-0.5 w-12 bg-primary/50" />
                <p className="text-base sm:text-lg text-white/60 leading-relaxed">
                  {t('philosophy_page.the_source_desc')}
                </p>
              </motion.div>

              {/* Manifesto 2026 */}
              <motion.div
                className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_ONCE}
                variants={FADE_UP_VARIANTS}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] pointer-events-none" aria-hidden />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-primary uppercase tracking-[0.25em]">
                      {t('philosophy_page.coming_soon_title')}
                    </span>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                    {t('philosophy_page.coming_soon_desc')}
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default React.memo(PhilosophyPage);
