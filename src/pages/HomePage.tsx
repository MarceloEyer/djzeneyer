// src/pages/HomePage.tsx - VERSÃO REFATORADA COM HEADLESS SEO CENTRALIZADO

import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
// Componentes/Contextos
import { PlayCircle, Calendar, Users, Music, Award } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { HeadlessSEO } from '../components/HeadlessSEO';

// LAZY LOADING E COMPONENTES AUXILIARES
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; variants: any }> = ({
  icon,
  title,
  description,
  variants,
}) => (
  <motion.div
    variants={variants}
    className="card p-8 bg-surface/50 border border-primary/20 rounded-full mb-4"
    role="article"
    aria-label={title}
  >
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>);

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { t } = useTranslation();

  // DADOS ESTRUTURADOS PARA FEATURES
  const features = [
    {
      id: 'music',
      icon: <Music size={32} className="w-8 h-8 text-primary" />,
      titleKey: 'home_feat_exclusive_title',
      descKey: 'home_feat_exclusive_desc',
    },
    {
      id: 'achievements',
      icon: <Award size={32} className="w-8 h-8 text-accent" />,
      titleKey: 'home_feat_achievements_title',
      descKey: 'home_feat_achievements_desc',
    },
    {
      id: 'community',
      icon: <Users size={32} className="w-8 h-8 text-primary" />,
      titleKey: 'home_feat_community_title',
      descKey: 'home_feat_community_desc',
    },
  ];

  const containerVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  // Schema.org para a homepage (fornecido como prop ao HeadlessSEO)
  const homepageSchema = {
    "@type": "WebPage",
    "@id": "https://djzeneyer.com/#webpage",
    "url": "https://djzeneyer.com",
    "name": "DJ Zen Eyer | World Champion Brazilian Zouk DJ",
    "description": "Experience the Zen in Brazilian Zouk - Two-time world champion DJ creating immersive audio experiences",
    "isPartOf": { "@id": "https://djzeneyer.com/#website" },
  };

  const handlePlayFeatured = () => {
    if (queue && queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  return (
    <>
      {/* 🎯 COMPONENTE HEADLESSEO - CENTRALIZA TODAS AS TAGS SEO */}
      <HeadlessSEO
        title="DJ Zen Eyer | World Champion Brazilian Zouk DJ"
        description="Two-time world champion DJ specializing in Brazilian Zouk music. Experience immersive audio, world-class remixes, and live performances by DJ Zen Eyer."
        url="https://djzeneyer.com"
        image="https://djzeneyer.com/images/zen-eyer-og.jpg"
        ogType="website"
        keywords="DJ Zen Eyer, Brazilian Zouk, DJ, music producer, remixes, live events"
        schema={homepageSchema}
        hrefLang={[
          { lang: 'en', href: 'https://djzeneyer.com' },
          { lang: 'pt-BR', href: 'https://djzeneyer.com/pt' },
          { lang: 'x-default', href: 'https://djzeneyer.com' }
        ]}
      />

      {/* DESIGN ORIGINAL PRESERVADO - SEM ALTERAÇÕES VISUAIS */}
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-surface/10 to-accent/10 blur-3xl" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                Experience the <span className="text-gradient">Zen</span>
                <br />
                in Brazilian Zouk
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Transforming dance floors into immersive audio experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={handlePlayFeatured}
                  className="px-8 py-4 bg-primary rounded-full font-bold hover:bg-primary/80 transition flex items-center justify-center gap-2"
                  aria-label={t('home_play_featured')}
                >
                  <PlayCircle size={24} />
                  {t('home_play_featured')}
                </button>
                <Link
                  to="/events"
                  className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/10 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={24} />
                  {t('nav_events')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12">{t('home_why_join')}</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  icon={feature.icon}
                  title={t(feature.titleKey)}
                  description={t(feature.descKey)}
                  variants={itemVariants}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">{t('home_ready_join')}</h2>
            <p className="text-lg text-white/80 mb-8">{t('home_join_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/zentribe"
                className="px-8 py-4 bg-primary rounded-full font-bold hover:bg-primary/80 transition"
              >
                {t('home_join_now')}
              </Link>
              <Link
                to="/music"
                className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/10 transition"
              >
                {t('nav_music')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;