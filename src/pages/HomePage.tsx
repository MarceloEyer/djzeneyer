// src/pages/HomePage.tsx

import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Calendar, Users, Music, Award, TrendingUp } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { t } = useLanguage();

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
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4 font-display [text-shadow:_1px_1px_3px_rgba(0,0,0,0.5),_0_0_5px_rgba(var(--color-primary),0.1)]"
              dangerouslySetInnerHTML={{ __html: t('home_headline') }}
            />
            <p className="text-xl md:text-2xl mb-8 text-white/80 [text-shadow:_1px_1px_2px_rgba(0,0,0,0.7)]">
              {t('home_subheadline')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handlePlayFeatured}
                className="btn btn-primary flex items-center space-x-2"
                aria-label="Play featured mix"
                disabled={queue.length === 0}
              >
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
          <div className="waveform absolute bottom-0 left-0 right-0 h-10 flex items-end px-4">
            {Array.from({ length: 32 }).map((_, i) => (
              <span 
                key={i} 
                style={{ 
                  animationDelay: `${(i * 0.05) % 0.6}s`, 
                  height: `${20 + Math.random() * 60}%` 
                }}
              ></span>
            ))}
          </div>
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
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
              Join the Zen Tribe Experience
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover the unique features that make DJ Zen Eyer's community special
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="card p-6 glow" variants={itemVariants}>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Music className="text-primary" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Music</h3>
              <p className="text-white/70">
                Get access to unreleased tracks, exclusive mixes, and limited edition content only available to Tribe members.
              </p>
            </motion.div>
            <motion.div className="card p-6 glow" variants={itemVariants}>
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Award className="text-secondary" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achievement System</h3>
              <p className="text-white/70">
                Earn badges, unlock achievements, and level up your Zen rank by engaging with music and attending events.
              </p>
            </motion.div>
            <motion.div className="card p-6 glow" variants={itemVariants}>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Users className="text-accent" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Connection</h3>
              <p className="text-white/70">
                Connect with like-minded music enthusiasts, share playlists, and participate in exclusive community events.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Join the Tribe CTA */}
      <section className="py-28 bg-gradient-to-t from-background via-background to-surface relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-gradient-radial from-secondary/30 via-transparent to-transparent"></div>
        </div>
        
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
            Ready to Join the <span className="text-primary">Zen Tribe</span>?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Become part of our growing community of brazilian zouk music enthusiasts. Unlock exclusive content, earn rewards, and connect with like-minded fans.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tribe" className="btn btn-primary px-8 py-4">
              Join Now
            </Link>
            <Link to="/music" className="btn btn-outline px-8 py-4">
              Explore Music
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;