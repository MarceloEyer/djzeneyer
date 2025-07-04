// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PlayCircle, Calendar, Users, Music, Award, TrendingUp, Shield, Gift } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { t, i18n } = useTranslation();

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

  // Helper para obter URLs corretas baseadas no idioma
  const getLocalizedPath = (path: string) => {
    const basePath = i18n.language.startsWith('pt') ? '/pt' : '';
    return `${basePath}${path}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-display text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)]"
              dangerouslySetInnerHTML={{ __html: t('home_headline') }}
            />
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl [text-shadow:_1px_1px_2px_rgba(0,0,0,0.8)]">
              {t('home_subheadline')}
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button 
                onClick={handlePlayFeatured} 
                className="btn btn-primary flex items-center space-x-2 text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
                disabled={queue.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle size={24} />
                <span>{t('play_featured_mix')}</span>
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={getLocalizedPath('/events')} 
                  className="btn btn-outline flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <Calendar size={24} />
                  <span>{t('upcoming_events')}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-background to-transparent">
          {/* Animated waveform-like decoration */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-end space-x-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-primary/30 rounded-full"
                style={{ width: '3px' }}
                animate={{
                  height: [4, 20, 4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
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
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6 font-display"
              dangerouslySetInnerHTML={{ __html: t('home_features_title') }}
            />
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('home_features_subtitle')}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature Cards */}
            <motion.div variants={itemVariants} className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors">
                <Music className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Exclusive Music</h3>
              <p className="text-white/70 leading-relaxed">
                Access exclusive tracks, remixes, and live sets available only to the Zen Tribe community.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/30 transition-colors">
                <Calendar className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">VIP Events</h3>
              <p className="text-white/70 leading-relaxed">
                Get early access to events, exclusive meet & greets, and VIP experiences at Zouk gatherings.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/30 transition-colors">
                <Users className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Global Community</h3>
              <p className="text-white/70 leading-relaxed">
                Connect with passionate Zouk dancers and music lovers from around the world.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-success/30 transition-colors">
                <Award className="text-success" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-display">Achievement System</h3>
              <p className="text-white/70 leading-relaxed">
                Earn badges, level up your profile, and unlock special rewards for your engagement.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">7+</div>
              <div className="text-white/70">Countries Toured</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-white/70">Music Streams</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">100+</div>
              <div className="text-white/70">Live Events</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-success mb-2">5K+</div>
              <div className="text-white/70">Tribe Members</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                Level Up Your Musical Journey
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of music enthusiasts in an interactive experience that rewards your passion for Brazilian Zouk.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <TrendingUp className="text-primary" size={24} />, title: "Experience Points", desc: "Earn XP for every interaction and unlock new levels" },
                  { icon: <Shield className="text-secondary" size={24} />, title: "Digital Badges", desc: "Collect unique badges for achievements and milestones" },
                  { icon: <Gift className="text-accent" size={24} />, title: "Exclusive Rewards", desc: "Access special content and real-world benefits" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-white/70">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="DJ Performance" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join the Tribe CTA */}
      <section className="py-28 bg-gradient-to-t from-background via-surface to-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6 font-display"
            dangerouslySetInnerHTML={{ __html: t('home_cta_title') }}
          />
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12">
            {t('home_cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={getLocalizedPath('/tribe')} 
                className="btn btn-primary px-10 py-4 text-lg font-semibold"
              >
                {t('join_now_button')}
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={getLocalizedPath('/music')} 
                className="btn btn-outline px-10 py-4 text-lg font-semibold"
              >
                {t('explore_music_button')}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl"></div>
      </section>
    </>
  );
};

export default HomePage;