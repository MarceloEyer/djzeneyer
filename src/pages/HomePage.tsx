// src/pages/HomePage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Calendar, Users, Music, Award, TrendingUp } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { useUser } from '../contexts/UserContext';

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { user, unlockAchievement } = useUser();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user && user.isLoggedIn) {
      const firstLoginAch = user.achievements?.find(ach => ach.id === 'first-login');
      if (!firstLoginAch || !firstLoginAch.unlockedAt) {
        // unlockAchievement('first-login'); // Descomente quando a lógica de achievement estiver 100%
        console.log("Lógica para 'first-login' achievement a ser verificada/ativada.");
      }
    }
  }, [user, unlockAchievement]);

  const handlePlayFeatured = () => {
    if (queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
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
              // AJUSTE AQUI: Mude '0.3' para mais (ex: 0.5) se precisar de mais contraste,
              // ou para menos (ex: 0.15) se quiser a imagem mais clara.
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display [text-shadow:_0_2px_10px_rgb(var(--color-primary)_/_20%)]">
              Experience the <span className="text-primary">Zen</span> in Brazilian Zouk
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80">
              Join the Zen Tribe and embark on a journey through immersive soundscapes and rhythmic meditation.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handlePlayFeatured}
                className="btn btn-primary flex items-center space-x-2"
                aria-label="Play featured mix"
                disabled={queue.length === 0}
              >
                <PlayCircle size={20} />
                <span>Play Featured Mix</span>
              </button>
              <Link to="/events" className="btn btn-outline flex items-center space-x-2">
                <Calendar size={20} />
                <span>Upcoming Events</span>
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
            animate={{ opacity: 1, y: 0 }}
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
            <motion.div className="card p-6 glow" variants={itemVariants}>
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <Calendar className="text-success" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">VIP Event Access</h3>
              <p className="text-white/70">
                Get early access to event tickets, exclusive backstage passes, and special meet-and-greet opportunities.
              </p>
            </motion.div>
            <motion.div className="card p-6 glow" variants={itemVariants}>
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
                <PlayCircle className="text-warning" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Playlist Creation</h3>
              <p className="text-white/70">
                Create, share, and discover custom playlists. Get your creations featured in DJ Zen Eyer's performances.
              </p>
            </motion.div>
            <motion.div className="card p-6 glow" variants={itemVariants}>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Streak Rewards</h3>
              <p className="text-white/70">
                Maintain your daily engagement streak to earn special rewards, bonus XP, and unlock rare badges.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Releases */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            {/* LINHA CORRIGIDA ABAIXO */}
            <h2 className="text-3xl font-bold font-display">Latest Releases</h2>
            <Link to="/music" className="text-primary hover:underline">View All</Link>
          </div>
          <React.Suspense fallback={<div className="text-center p-12">Loading latest releases...</div>}>
            {queue.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {queue.map((track) => {
                  const formattedDuration = useMemo(() => {
                    const durationNumber = Number(track.duration);
                    if (isNaN(durationNumber)) return "0:00";
                    return `${Math.floor(durationNumber / 60)}:${(durationNumber % 60).toString().padStart(2, '0')}`;
                  }, [track.duration]);
                  
                  return (
                    <motion.div 
                      key={track.id}
                      className="card overflow-hidden group"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={imageErrors[track.id] ? '/images/fallback-cover.jpg' : track.artwork} 
                          alt={`${track.title} by ${track.artist}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={() => handleImageError(track.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button 
                            onClick={() => playTrack(track)}
                            className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
                            aria-label={`Play ${track.title} by ${track.artist}`}
                          >
                            <PlayCircle size={32} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold line-clamp-1">{track.title}</h3>
                        <p className="text-white/70">{track.artist}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-white/50">{formattedDuration}</span>
                          <span className="badge badge-primary">New Release</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-white/70">No tracks available at the moment. Check back soon!</p>
              </div>
            )}
          </React.Suspense>
        </div>
      </section>

      {/* Upcoming Events - Google Calendar Integration */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold font-display">Upcoming Events</h2>
            <Link to="/events" className="text-primary hover:underline">View All</Link>
          </div>
          <motion.div 
            className="card p-4 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full overflow-hidden rounded-lg">
              <iframe 
                src="https://calendar.google.com/calendar/embed?height=500&wkst=1&ctz=America%2FSao_Paulo&showPrint=0&title=DJ%20Zen%20Eyer%20Events&mode=AGENDA&src=ZXllci5tYXJjZWxvQGdtYWlsLmNvbQ&color=%23EF6C00" 
                style={{ border: 0 }} 
                width="100%" 
                height="600" 
                frameBorder={0}
                scrolling="no"
                title="DJ Zen Eyer Event Calendar"
                className="bg-surface rounded-lg"
                loading="lazy"
              ></iframe>
            </div>
            <p className="text-center mt-4 text-white/60 text-sm">
              All events are in Brasília Time (UTC-3). Click on an event for more details.
            </p>
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
            Become part of our growing community of electronic music enthusiasts. Unlock exclusive content, earn rewards, and connect with like-minded fans.
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