// src/pages/HomePage.tsx

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // 1. Importamos o hook correto
import { PlayCircle, Calendar, Users, Music, Award, TrendingUp } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { t } = useTranslation(); // 2. Usamos o novo hook para pegar a função de tradução 't'

  const handlePlayFeatured = () => {
    if (queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/images/hero-background.webp')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 3. Textos agora usam a função t() do i18next */}
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4 font-display [text-shadow:_1px_1px_3px_rgba(0,0,0,0.5)]"
              dangerouslySetInnerHTML={{ __html: t('home_headline') }}
            />
            <p className="text-xl md:text-2xl mb-8 text-white/80 [text-shadow:_1px_1px_2px_rgba(0,0,0,0.7)]">
              {t('home_subheadline')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handlePlayFeatured} className="btn btn-primary flex items-center space-x-2" disabled={queue.length === 0}>
                <PlayCircle size={20} />
                <span>{t('play_featured_mix')}</span>
              </button>
              <Link to="/events" className="btn btn-outline flex items-center space-x-2">
                <Calendar size={20} />
                <span>{t('upcoming_events')}</span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 z-10 bg-gradient-to-t from-background to-transparent">
            {/* Animação de Waveform */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display"
              dangerouslySetInnerHTML={{ __html: t('home_features_title') }}
            />
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {t('home_features_subtitle')}
            </p>
          </motion.div>
          {/* ... O resto da sua HomePage com os cards, etc ... */}
        </div>
      </section>

      {/* Join the Tribe CTA */}
      <section className="py-28 bg-gradient-to-t from-background via-background to-surface relative overflow-hidden">
        <motion.div 
            className="container mx-auto px-4 text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display"
            dangerouslySetInnerHTML={{ __html: t('home_cta_title') }}
          />
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            {t('home_cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tribe" className="btn btn-primary px-8 py-4">
              {t('join_now_button')}
            </Link>
            <Link to="/music" className="btn btn-outline px-8 py-4">
              {t('explore_music_button')}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;