// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { PlayCircle, Calendar, Users, Music, Award } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

// --- Subcomponente Reutilizável ---
const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  variants: any; 
}> = ({ icon, title, description, variants }) => (
  <motion.div className="card p-8 text-center" variants={variants}>
    <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
);

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { t } = useTranslation();

  // --- Array de Dados para os Cards ---
  const features = [
    { 
      id: 'music', 
      icon: <Music size={32} />, 
      titleKey: 'home_feat_exclusive_title', 
      descKey: 'home_feat_exclusive_desc' 
    },
    { 
      id: 'achievements', 
      icon: <Award size={32} />, 
      titleKey: 'home_feat_achievements_title', 
      descKey: 'home_feat_achievements_desc' 
    },
    { 
      id: 'community', 
      icon: <Users size={32} />, 
      titleKey: 'home_feat_community_title', 
      descKey: 'home_feat_community_desc' 
    },
  ];

  const handlePlayFeatured = () => {
    if (queue && queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('home_page_title')}</title>
        <meta name="description" content={t('home_page_meta_desc')} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <motion.div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: "url('/images/hero-background.webp')" }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white [text-shadow:_2px_2px_10px_rgba(0,0,0,0.7)]">
              {t('hero_title')}
            </h1>
            <p className="text-xl md:text-2xl mt-6 max-w-2xl mx-auto text-white/90 [text-shadow:_1px_1px_5px_rgba(0,0,0,0.8)]">
              {t('hero_subtitle')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handlePlayFeatured} 
                className="btn btn-primary btn-lg flex items-center gap-2" 
                disabled={!queue || queue.length === 0}
              >
                <PlayCircle size={22} />
                <span>{t('play_featured_mix')}</span>
              </button>
              <Link to="/events" className="btn btn-outline btn-lg flex items-center gap-2">
                <Calendar size={22} />
                <span>{t('upcoming_events')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }} 
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              {t('home_features_title')}
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
              {t('home_features_subtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map(feature => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={t(feature.titleKey as any)}
                description={t(feature.descKey as any)}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-28 bg-background">
        <motion.div 
          className="container mx-auto px-4 text-center" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
            <Trans i18nKey="home_cta_title">
              Pronto para Entrar na <span className="text-primary">Zen Tribe</span>?
            </Trans>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            {t('home_cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/zentribe" className="btn btn-primary btn-lg">
              {t('join_now_button')}
            </Link>
            <Link to="/music" className="btn btn-outline btn-lg">
              {t('explore_music_button')}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
