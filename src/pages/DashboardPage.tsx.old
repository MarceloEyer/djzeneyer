// src/pages/DashboardPage.tsx
// v14.0 - Zero Errors, Dados Reais, Cache-Friendly, UX Premium

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Loader2,
  TrendingUp,
  Star,
} from 'lucide-react';
import GamificationWidget from '../components/Gamification/GamificationWidget';
import { useGamiPress } from '../hooks/useGamiPress';
import { useUserTracks } from '../hooks/useUserTracks';
import { useUserEvents } from '../hooks/useUserEvents';
import { useUserStreak } from '../hooks/useUserStreak';

// ============================================================================
// TIPOS SAFE (Proteção contra undefined)
// ============================================================================
interface SafeAchievement {
  id?: number;
  title: string;
  description: string;
  image?: string;
  emoji?: string;
  earned: boolean;
}

interface ActivityItem {
  icon: React.ReactNode;
  action: string;
  item: string;
  xp: number;
  time: string;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Hooks com dados reais
  const gamipress = useGamiPress();
  const tracks = useUserTracks();
  const events = useUserEvents();
  const streak = useUserStreak();

  // Redirect se não logado
  React.useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Loading state elegante
  if (gamipress.loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90">Loading your Zen Dashboard...</p>
          <p className="text-sm text-white/50 mt-2">Fetching your stats from the cloud</p>
        </motion.div>
      </div>
    );
  }

  // Fallback se user null (não deve acontecer, mas TypeScript feliz)
  if (!user) return null;

  // ============================================================================
  // CÁLCULOS DE STATS (Com fallbacks seguros)
  // ============================================================================
  const currentPoints = gamipress.data?.points ?? 0;
  const currentLevel = gamipress.data?.level ?? 1;
  const nextLevelPoints = gamipress.data?.nextLevelPoints ?? 100;
  const progressPercentage = gamipress.data?.progressToNextLevel ?? 0;
  const rankTitle = gamipress.data?.rank ?? 'Zen Novice';

  const userStats = {
    level: currentLevel,
    currentXP: currentPoints,
    nextLevelXP: nextLevelPoints,
    totalTracks: tracks.data?.total ?? 0,
    eventsAttended: events.data?.total ?? 0,
    streakDays: streak.data?.streak ?? 0,
    streakFire: streak.data?.fire ?? false,
    tribeFriends: 12 // TODO: Implementar sistema de amigos
  };

  // ============================================================================
  // RECENT ACTIVITY (Simulado - pode ser substituído por dados reais)
  // ============================================================================
  const recentActivity: ActivityItem[] = [
    { 
      icon: <Music className="text-primary" size={20} />, 
      action: 'Downloaded', 
      item: 'Zouk Nights Remix', 
      xp: 10, 
      time: '2 hours ago' 
    },
    { 
      icon: <Heart className="text-accent" size={20} />, 
      action: 'Favorited', 
      item: 'Electric Dreams', 
      xp: 5, 
      time: '5 hours ago' 
    },
    { 
      icon: <Calendar className="text-success" size={20} />, 
      action: 'RSVP\'d to', 
      item: 'Summer Vibes Festival', 
      xp: 25, 
      time: '1 day ago' 
    },
  ];

  // ============================================================================
  // ACHIEVEMENTS (Dados reais do GamiPress com fallback)
  // ============================================================================
  const rawAchievements = gamipress.data?.achievements ?? [];
  const safeAchievements: SafeAchievement[] = Array.isArray(rawAchievements) && rawAchievements.length > 0
    ? rawAchievements.slice(0, 6).map((ach: any) => ({
        id: ach?.id,
        title: ach?.title || 'Achievement',
        description: ach?.description || 'Achievement unlocked!',
        image: ach?.image || '',
        emoji: ach?.image ? '' : '🏆',
        earned: !!ach?.earned
      }))
    : [
        { emoji: '🎧', title: 'First Beat', description: 'Welcome to the Zen Tribe', earned: true },
        { emoji: '🚀', title: 'Early Adopter', description: 'Joined during launch', earned: true },
        { emoji: '🔥', title: '7-Day Streak', description: 'Maintained activity streak', earned: false },
        { emoji: '🔍', title: 'Music Explorer', description: 'Listened to 10 tracks', earned: false },
        { emoji: '🦋', title: 'Social Butterfly', description: 'Connected with 5 members', earned: false },
        { emoji: '🎪', title: 'Event Regular', description: 'Attended 3 events', earned: false },
      ];

  const unlockedCount = safeAchievements.filter(a => a.earned).length;

  // ============================================================================
  // ANIMATION VARIANTS
  // ============================================================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* ============================
            WELCOME HEADER
        ============================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-2xl p-6 md:p-8 border border-primary/30 backdrop-blur-sm">
            <div className="flex items-center gap-6 flex-wrap">
              
              {/* Avatar com Level Badge */}
              <div className="relative">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-primary shadow-xl"
                  loading="lazy"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary to-secondary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-xl ring-4 ring-background"
                >
                  {userStats.level}
                </motion.div>
              </div>

              {/* User Info + Progress Bar */}
              <div className="flex-1 min-w-[300px]">
                <h1 className="text-3xl md:text-4xl font-black font-display mb-2">
                  Welcome back, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-white/70 text-lg mb-4 flex items-center gap-2">
                  <Trophy className="text-warning" size={20} />
                  {rankTitle} • Level {userStats.level}
                </p>
                
                {/* XP Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 flex items-center gap-1">
                      <TrendingUp size={16} />
                      Progress to Level {userStats.level + 1}
                    </span>
                    <span className="text-primary font-bold">
                      {currentPoints}/{nextLevelPoints} XP
                    </span>
                  </div>
                  <div className="h-3 bg-background/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop')}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap shadow-xl"
              >
                <Zap size={20} />
                Boost XP
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ============================
            STATS GRID
        ============================ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {[
            { icon: Music, value: userStats.totalTracks, label: 'Tracks Downloaded', color: 'text-primary', loading: tracks.loading },
            { icon: Calendar, value: userStats.eventsAttended, label: 'Events Attended', color: 'text-success', loading: events.loading },
            { icon: Target, value: userStats.streakDays, label: userStats.streakFire ? 'Day Streak 🔥' : 'Day Streak', color: 'text-warning', loading: streak.loading },
            { icon: Users, value: userStats.tribeFriends, label: 'Tribe Friends', color: 'text-accent', loading: false },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card p-4 md:p-6 transition-all hover:shadow-2xl"
            >
              <stat.icon className={`${stat.color} mb-2 md:mb-3`} size={28} />
              <div className="text-2xl md:text-3xl font-black mb-1">
                {stat.loading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={stat.value}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {stat.value}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>
              <div className="text-white/70 text-xs md:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ============================
            MAIN CONTENT GRID
        ============================ */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ============================
              RECENT ACTIVITY (2 colunas)
          ============================ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2">
                  <Clock className="text-primary" size={24} />
                  Recent Activity
                </h2>
                <button 
                  onClick={() => navigate('/my-account')}
                  className="text-primary hover:underline text-sm transition-all hover:scale-105"
                >
                  View All →
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((act, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-all cursor-pointer border border-transparent hover:border-primary/30"
                      >
                        <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
                          {act.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">
                            {act.action} <span className="text-primary">{act.item}</span>
                          </div>
                          <div className="text-sm text-white/60 flex items-center gap-1">
                            <Clock size={12} />
                            {act.time}
                          </div>
                        </div>
                        <div className="text-success font-bold text-sm flex-shrink-0 flex items-center gap-1">
                          <Star size={16} className="fill-success" />
                          +{act.xp} XP
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-white/50"
                  >
                    <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No recent activity yet</p>
                    <p className="text-sm mt-2">Start exploring to see your journey!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ============================
              SIDEBAR (1 coluna)
          ============================ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            
            {/* GamiPress Widget */}
            <GamificationWidget />

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Music, label: 'Browse Music', path: '/music', variant: 'primary' },
                  { icon: Calendar, label: 'View Events', path: '/events', variant: 'outline' },
                  { icon: Gift, label: 'Visit Shop', path: '/shop', variant: 'outline' },
                  { icon: Users, label: 'Invite Friends', path: '/tribe', variant: 'outline' },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className={`w-full btn btn-${action.variant} justify-start gap-3`}
                  >
                    <action.icon size={20} />
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Membership Card */}
            <div className="card p-6">
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Trophy className="text-warning" size={24} />
                Membership
              </h3>
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-4 mb-4 border border-primary/20 backdrop-blur-sm">
                <div className="text-2xl font-black mb-2">{rankTitle}</div>
                <div className="text-sm text-white/70 mb-4">Free Tier • Level {userStats.level}</div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/shop')}
                  className="w-full btn btn-secondary btn-sm shadow-lg"
                >
                  Upgrade Now →
                </motion.button>
              </div>
            </div>

          </motion.div>
        </div>

        {/* ============================
            ACHIEVEMENTS SECTION
        ============================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2">
                <Award className="text-primary" size={28} />
                Your Achievements
              </h2>
              <div className="text-white/70 flex items-center gap-2">
                <Trophy className="text-warning" size={20} />
                <span className="text-primary font-bold text-xl">{unlockedCount}</span> 
                <span>of {safeAchievements.length} unlocked</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout">
                {safeAchievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id || i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: achievement.earned ? 1.1 : 1, rotate: achievement.earned ? [0, -5, 5, 0] : 0 }}
                    className={`bg-surface/50 rounded-lg p-4 text-center transition-all border ${
                      achievement.earned 
                        ? 'hover:bg-surface/70 cursor-pointer border-primary/30 hover:border-primary' 
                        : 'opacity-40 grayscale border-transparent'
                    }`}
                  >
                    {achievement.image ? (
                      <img 
                        src={achievement.image} 
                        alt={achievement.title}
                        className="w-16 h-16 mx-auto mb-3 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-4xl md:text-5xl mb-3">{achievement.emoji || '🏆'}</div>
                    )}
                    <div className="font-bold text-sm mb-1 line-clamp-1">{achievement.title}</div>
                    <div className="text-xs text-white/60 line-clamp-2 min-h-[2rem]">{achievement.description}</div>
                    {achievement.earned && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs text-success flex items-center justify-center gap-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Unlocked
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;