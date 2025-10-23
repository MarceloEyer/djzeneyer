// src/pages/DashboardPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Music, 
  Calendar, 
  Clock,
  Zap,
  Users,
  Trophy,
  Target,
  Gift,
  Heart,
  ShoppingBag,
  TrendingUp,
  Star,
  ArrowRight,
} from 'lucide-react';
import GamificationWidget from '../components/Gamification/GamificationWidget';
import { useGamiPress } from '../hooks/useGamiPress';

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // 🎮 Hook com dados reais (SEM useRecentActivity que quebra)
  const gamipress = useGamiPress();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Loading state
  if (gamipress.loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-white/70">Loading your Zen Dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ User stats com dados REAIS do GamiPress
  const currentPoints = gamipress.points || 0;
  const currentLevel = Math.floor(currentPoints / 100) + 1;
  const nextLevelXP = currentLevel * 100;
  const progressPercentage = ((currentPoints % 100) / 100) * 100;
  const pointsToNextLevel = nextLevelXP - currentPoints;

  // ✅ Next rank info (ULTRA SEGURO)
  const allRanks = (gamipress.allRanks && Array.isArray(gamipress.allRanks)) ? gamipress.allRanks : [];
  const currentRankIndex = allRanks.length > 0 
    ? (allRanks.findIndex(r => r?.slug === gamipress.currentRank?.slug) || 0) 
    : 0;
  const nextRank = (allRanks.length > currentRankIndex + 1) ? allRanks[currentRankIndex + 1] : null;

  // ✅ Achievements (ULTRA SEGURO)
  const achievements = (gamipress.achievements && Array.isArray(gamipress.achievements) && gamipress.achievements.length > 0)
    ? gamipress.achievements.slice(0, 6).map(ach => ({
        emoji: ach?.image ? '' : '🏆',
        image: ach?.image || '',
        title: ach?.title || 'Achievement',
        description: ach?.description || 'Achievement unlocked!',
        unlocked: ach?.earned || false
      }))
    : [];

  const unlockedCount = achievements.length > 0    ? achievements.filter(a => a?.unlocked).length    : 0;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* 🔥 HERO SECTION - GAMIPRESS (PRIORIDADE MÁXIMA) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-success/20 rounded-3xl p-8 md:p-12 border-2 border-primary/40 shadow-2xl">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse"></div>
            
            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
              
              {/* Left: Avatar + Level */}
              <div className="text-center md:text-left">
                <div className="relative inline-block mb-4">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=6366f1&color=fff&bold=true`} 
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-primary shadow-xl"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-primary to-accent text-white rounded-full w-16 h-16 flex items-center justify-center font-black shadow-xl text-2xl">
                    {currentLevel}
                  </div>
                </div>
                <h1 className="text-3xl font-black font-display mb-1">
                  {user.name}
                </h1>
                <p className="text-primary text-xl font-bold mb-2">
                  {gamipress.rank || 'Zen Novice'}
                </p>
                <p className="text-white/60 text-sm">
                  Level {currentLevel} • {currentPoints} XP
                </p>
              </div>

              {/* Center: Progress & Next Rank */}
              <div className="md:col-span-2 space-y-6">
                
                {/* 🎮 XP Progress - BARRA AZUL ELÉTRICA ESTILO MMORPG */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-semibold">Level {currentLevel} Progress</span>
                    <span className="text-primary font-black text-lg">
                      {currentPoints % 100}/{100} XP
                    </span>
                  </div>
                  <div className="h-4 bg-background/50 rounded-full overflow-hidden border border-primary/30">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full relative"
                    >
                      {/* Glow effect estilo MMORPG */}
                      <div className="absolute inset-0 bg-primary/50 blur-sm animate-pulse"></div>
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </motion.div>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    {pointsToNextLevel} XP needed for Level {currentLevel + 1}
                  </p>
                </div>

                {/* Next Rank */}
                {nextRank && (
                  <div className="bg-background/30 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white/70 text-sm mb-1">Next Rank</p>
                        <p className="text-xl font-bold text-primary">{nextRank.title || 'Next Rank'}</p>
                        {nextRank.requirements && (
                          <p className="text-white/60 text-xs mt-1">
                            {nextRank.requirements}
                          </p>
                        )}
                      </div>
                      <Trophy className="text-warning animate-bounce" size={36} />
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button 
                  onClick={() => navigate('/shop')}
                  className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all"
                >
                  <Zap size={24} />
                  Boost Your XP Now
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🎯 PRIMARY ACTIONS (CTAs) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          
          {/* Next Event CTA */}
          <div className="card p-8 bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/30 hover:scale-[1.02] transition-all cursor-pointer group"
               onClick={() => navigate('/events')}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-accent/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                <Calendar className="text-accent" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black font-display">Next Event</h3>
                <p className="text-white/70 text-sm">Don't miss out!</p>
              </div>
            </div>
            <p className="text-white/80 mb-4">
              Summer Vibes Festival • June 15, 2025
            </p>
            <button className="btn btn-accent w-full group-hover:bg-accent/80">
              Get Your Tickets
              <ArrowRight className="ml-2" size={16} />
            </button>
          </div>

          {/* Next Quiz/Track CTA */}
          <div className="card p-8 bg-gradient-to-br from-success/20 to-primary/20 border-2 border-success/30 hover:scale-[1.02] transition-all cursor-pointer group"
               onClick={() => navigate('/music')}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-success/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                <Music className="text-success" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black font-display">New Music</h3>
                <p className="text-white/70 text-sm">Discover fresh beats</p>
              </div>
            </div>
            <p className="text-white/80 mb-4">
              50+ new tracks available this week
            </p>
            <button className="btn btn-success w-full group-hover:bg-success/80">
              Browse Music
              <ArrowRight className="ml-2" size={16} />
            </button>
          </div>
        </motion.div>

        {/* 📊 STATS CARDS (SECONDARY INFO) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <Trophy className="text-primary mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">
              {unlockedCount}
            </div>
            <div className="text-white/70 text-xs md:text-sm">Achievements</div>
          </div>

          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <ShoppingBag className="text-accent mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">
              0
            </div>
            <div className="text-white/70 text-xs md:text-sm">Orders</div>
          </div>

          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <TrendingUp className="text-warning mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">
              0
            </div>
            <div className="text-white/70 text-xs md:text-sm">Streak Days</div>
          </div>

          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <Users className="text-success mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">0</div>
            <div className="text-white/70 text-xs md:text-sm">Tribe Friends</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 📌 RECENT ACTIVITY (PLACEHOLDER TEMPORÁRIO) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2">
                  <Clock className="text-primary" size={24} />
                  Recent Activity
                </h2>
                <button 
                  onClick={() => navigate('/my-account')}
                  className="text-primary hover:underline text-sm"
                >
                  View All
                </button>
              </div>

              <div className="text-center py-12">
                <Target className="mx-auto text-white/20 mb-4" size={48} />
                <p className="text-white/50 mb-4">No recent activity yet</p>
                <button 
                  onClick={() => navigate('/music')}
                  className="btn btn-primary btn-sm"
                >
                  Start Exploring
                </button>
              </div>
            </div>
          </motion.div>

          {/* 🎯 SIDEBAR (QUICK ACTIONS & MEMBERSHIP) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            
            {/* GamiPress Widget */}
            <GamificationWidget />

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-xl font-bold font-display mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/music')}
                  className="w-full btn btn-primary justify-start gap-3"
                >
                  <Music size={20} />
                  Browse Music
                </button>
                <button 
                  onClick={() => navigate('/events')}
                  className="w-full btn btn-outline justify-start gap-3"
                >
                  <Calendar size={20} />
                  View Events
                </button>
                <button 
                  onClick={() => navigate('/shop')}
                  className="w-full btn btn-outline justify-start gap-3"
                >
                  <Gift size={20} />
                  Visit Shop
                </button>
                <button 
                  onClick={() => navigate('/tribe')}
                  className="w-full btn btn-outline justify-start gap-3"
                >
                  <Users size={20} />
                  Invite Friends
                </button>
              </div>
            </div>

            {/* Membership Card */}
            <div className="card p-6">
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Trophy className="text-warning" size={24} />
                Membership
              </h3>
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-4 mb-4 border border-primary/20">
                <div className="text-2xl font-black mb-2">{gamipress.rank || 'Zen Novice'}</div>
                <div className="text-sm text-white/70 mb-4">Free Tier</div>
                <button 
                  onClick={() => navigate('/shop')}
                  className="w-full btn btn-secondary btn-sm"
                >
                  Upgrade Now
                </button>
              </div>
            </div>

          </motion.div>
        </div>

        {/* 🏆 ACHIEVEMENTS (BOTTOM) */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12"
          >
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2">
                  <Award className="text-primary" size={28} />
                  Your Achievements
                </h2>
                <div className="text-white/70">
                  <span className="text-primary font-bold">{unlockedCount}</span> of {achievements.length} unlocked
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                    className={`bg-surface/50 rounded-lg p-4 text-center transition-all ${
                      achievement.unlocked ? 'hover:bg-surface/70 cursor-pointer' : 'opacity-40 grayscale'
                    }`}
                  >
                    {achievement.image ? (
                      <img 
                        src={achievement.image} 
                        alt={achievement.title}
                        className="w-16 h-16 mx-auto mb-3 object-contain"
                      />
                    ) : (
                      <div className="text-4xl md:text-5xl mb-3">{achievement.emoji}</div>
                    )}
                    <div className="font-bold text-sm mb-1">{achievement.title}</div>
                    <div className="text-xs text-white/60 line-clamp-2">{achievement.description}</div>
                    {achievement.unlocked && (
                      <div className="mt-2 text-xs text-success flex items-center justify-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Unlocked
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => navigate('/my-account')}
                  className="btn btn-outline"
                >
                  View All Achievements
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
