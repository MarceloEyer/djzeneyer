import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Calendar, Users, Music, Award, TrendingUp } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { useUser } from '../contexts/UserContext';

const HomePage: React.FC = () => {
  const { playTrack, queue } = useMusicPlayer();
  const { user, unlockAchievement } = useUser();

  // Trigger achievement for visiting home page
  useEffect(() => {
    if (user) {
      unlockAchievement('first-login');
    }
  }, [user]);

  // Play the first track
  const handlePlayFeatured = () => {
    if (queue.length > 0) {
      playTrack(queue[0]);
    }
  };

  // Animation variants
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
              backgroundImage: "url('https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920')",
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

        {/* Animated waveform */}
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
            {/* Feature 1 */}
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Music className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Music</h3>
              <p className="text-white/70">
                Get access to unreleased tracks, exclusive mixes, and limited edition content only available to Tribe members.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Award className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Achievement System</h3>
              <p className="text-white/70">
                Earn badges, unlock achievements, and level up your Zen rank by engaging with music and attending events.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Users className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Connection</h3>
              <p className="text-white/70">
                Connect with like-minded music enthusiasts, share playlists, and participate in exclusive community events.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <Calendar className="text-success" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">VIP Event Access</h3>
              <p className="text-white/70">
                Get early access to event tickets, exclusive backstage passes, and special meet-and-greet opportunities.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
                <PlayCircle className="text-warning" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Playlist Creation</h3>
              <p className="text-white/70">
                Create, share, and discover custom playlists. Get your creations featured in DJ Zen Eyer's performances.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              className="card p-6 glow"
              variants={itemVariants}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} />
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
            <h2 className="text-3xl font-bold font-display">Latest Releases</h2>
            <Link to="/music" className="text-primary hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {queue.map((track) => (
              <motion.div 
                key={track.id}
                className="card overflow-hidden group"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={track.artwork} 
                    alt={track.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => playTrack(track)}
                      className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
                    >
                      <PlayCircle size={32} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1">{track.title}</h3>
                  <p className="text-white/70">{track.artist}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-white/50">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="badge badge-primary">New Release</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold font-display">Upcoming Events</h2>
            <Link to="/events" className="text-primary hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event 1 */}
            <motion.div 
              className="card overflow-hidden group"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Zen Nightclub" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  JUN 15
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">Cosmic Enlightenment Tour</h3>
                <p className="text-white/70 mb-3">Zen Nightclub, New York</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white/60">8:00 PM - 2:00 AM</span>
                  <Link to="/events" className="btn btn-outline py-1 px-3 text-sm">
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Event 2 */}
            <motion.div 
              className="card overflow-hidden group"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Echo Festival" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-secondary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  JUL 22-24
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">Echo Festival</h3>
                <p className="text-white/70 mb-3">Sunset Beach, Miami</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white/60">3-Day Event</span>
                  <Link to="/events" className="btn btn-outline py-1 px-3 text-sm">
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Event 3 */}
            <motion.div 
              className="card overflow-hidden group"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Zen Lounge" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-accent/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                  AUG 10
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">Neural Pathways Experience</h3>
                <p className="text-white/70 mb-3">Zen Lounge, Los Angeles</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white/60">9:00 PM - 3:00 AM</span>
                  <Link to="/events" className="btn btn-outline py-1 px-3 text-sm">
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
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