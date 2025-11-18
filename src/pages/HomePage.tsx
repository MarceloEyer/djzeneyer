// src/pages/HomePage.tsx - SINTAXE CORRIGIDA E LIMPA

import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { PlayCircle, Calendar, Users, Music, Award } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { HeadlessSEO } from '../components/HeadlessSEO'; 

// ============================================================================
// COMPONENTE AUXILIAR (FEATURE CARD)
// ============================================================================

const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  variants: any; 
}> = ({ icon, title, description, variants }) => (
  <motion.div 
    className="card p-8 text-center" 
    variants={variants}
    role="article"
    aria-label={title}
  >
    <div 
      className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4"
      aria-hidden="true"
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
); // <--- NENHUM PONTO E VÍRGULA AQUI!

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer(); // <-- CORREÇÃO: Linha 33 do log (Agora deve estar na linha correta)
  const { t } = useTranslation();

  // DADOS ESTRUTURADOS PARA FEATURES
  const features = [
    { id: 'music', icon: <Music size={32} aria-hidden="true" />, titleKey: 'home_feat_exclusive_title', descKey: 'home_feat_exclusive_desc' },
    { id: 'achievements', icon: <Award size={32} aria-hidden="true" />, titleKey: 'home_feat_achievements_title', descKey: 'home_feat_achievements_desc' },
    { id: 'community', icon: <Users size={32} aria-hidden="true" />, titleKey: 'home_feat_community_title', descKey: 'home_feat_community_desc' },
  ];
  
  const handlePlayFeatured = () => {
    if (queue && queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  const containerVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  return (
    <>
      <HeadlessSEO 
        title={`${t('home_page_title')} | World Champion Brazilian Zouk DJ 2022`}
        description="DJ Zen Eyer - 2022 World Champion Brazilian Zouk DJ. Certified Jack & Jill DJ. 500K+ streams. Book now for international events. Official music on SoundCloud, Spotify & YouTube."
        url="https://djzeneyer.com"
        image="https://djzeneyer.com/images/zen-eyer-og-image.jpg"
        isHomepage={true}
      />

      {/* HERO SECTION */}
      <section 
        className="relative h-screen flex items-center justify-center text-center overflow-hidden"
        aria-label="Hero section - DJ Zen Eyer introduction"
      >
        {/* Background otimizado */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: "url('/images/hero-background.webp')" }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }} 
            transition={{ duration: 10, ease: "linear" }}
            role="img"
            aria-label="DJ Zen Eyer performing at Brazilian Zouk festival"
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
              <Trans i18nKey="home_headline">
                Experience the <span className="text-primary">Zen</span> in Brazilian Zouk
              </Trans>
            </h1>
            
            <p className="text-xl md:text-2xl mt-6 max-w-2xl mx-auto text-white/90 [text-shadow:_1px_1px_5px_rgba(0,0,0,0.8)]">
              {t('home_subheadline')}
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handlePlayFeatured} 
                className="btn btn-primary btn-lg flex items-center gap-2" 
                disabled={!queue || queue.length === 0}
                aria-label="Play featured Brazilian Zouk mix"
              >
                <PlayCircle size={22} aria-hidden="true" />
                <span>{t('play_featured_mix')}</span>
              </button>
              <Link 
                to="/events" 
                className="btn btn-outline btn-lg flex items-center gap-2"
                aria-label="View upcoming Brazilian Zouk events and festivals"
              >
                <Calendar size={22} aria-hidden="true" />
                <span>{t('upcoming_events')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section 
        className="py-24 bg-surface"
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }} 
            variants={itemVariants}
          >
            <h2 
              id="features-heading"
              className="text-3xl md:text-4xl font-bold font-display"
            >
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
      
      {/* CTA SECTION - CALL TO ACTION FINAL */}
      <section 
        className="py-28 bg-background"
        aria-labelledby="cta-heading"
      >
        <motion.div 
          className="container mx-auto px-4 text-center" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
          variants={itemVariants}
        >
          <h2 
            id="cta-heading"
            className="text-4xl md:text-5xl font-bold mb-6 font-display"
          >
            <Trans i18nKey="home_cta_title">
              Ready to Join the <span className="text-primary">Zen Tribe</span>?
            </Trans>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            {t('home_cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/zentribe" 
              className="btn btn-primary btn-lg"
              aria-label="Join the Zen Tribe community"
            >
              {t('join_now_button')}
            </Link>
            <Link 
              to="/music" 
              className="btn btn-outline btn-lg"
              aria-label="Explore DJ Zen Eyer's music collection"
            >
              {t('explore_music_button')}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;