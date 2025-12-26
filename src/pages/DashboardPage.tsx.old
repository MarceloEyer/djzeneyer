// src/pages/DashboardPage.tsx
// v15.0 - PERFECT: Memoized, No SEO Conflicts, Optimal Performance

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Music, Calendar, Clock, Zap, Users, Trophy, 
  Target, Gift, Heart, Loader2, TrendingUp, Star 
} from 'lucide-react';
import GamificationWidget from '../components/Gamification/GamificationWidget';
import { useGamiPress } from '../hooks/useGamiPress';
import { useUserTracks } from '../hooks/useUserTracks';
import { useUserEvents } from '../hooks/useUserEvents';
import { useUserStreak } from '../hooks/useUserStreak';

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

const DashboardPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const gamipress = useGamiPress();
  const tracks = useUserTracks();
  const events = useUserEvents();
  const streak = useUserStreak();

  // ✅ FIX 1: Set page title via document.title (no SEO component conflicts)
  useEffect(() => {
    if (user?.name) {
      document.title = `Dashboard - ${user.name} | DJ Zen Eyer`;
    }
  }, [user?.name]);

  useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const userStats = useMemo(() => ({
    level: gamipress.data?.level ?? 1,
    currentXP: gamipress.data?.points ?? 0,
    nextLevelXP: gamipress.data?.nextLevelPoints ?? 100,
    progress: gamipress.data?.progressToNextLevel ?? 0,
    rank: gamipress.data?.rank ?? 'Zen Novice',
    totalTracks: tracks.data?.total ?? 0,
    eventsAttended: events.data?.total ?? 0,
    streakDays: streak.data?.streak ?? 0,
    streakFire: streak.data?.fire ?? false,
    tribeFriends: 12
  }), [gamipress.data, tracks.data, events.data, streak.data]);

  const safeAchievements = useMemo<SafeAchievement[]>(() => {
    const raw = gamipress.data?.achievements;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.slice(0, 6).map((ach: any) => ({
        id: ach?.id,
        title: ach?.title || 'Achievement',
        description: ach?.description || 'Achievement unlocked!',
        image: ach?.image || '',
        emoji: ach?.image ? '' : '🏆',
        earned: !!ach?.earned
      }));
    }
    return [
      { emoji: '🎧', title: 'First Beat', description: 'Welcome to the Zen Tribe', earned: true },
      { emoji: '🚀', title: 'Early Adopter', description: 'Joined during launch', earned: true },
      { emoji: '🔥', title: '7-Day Streak', description: 'Maintained activity streak', earned: false },
      { emoji: '🔍', title: 'Music Explorer', description: 'Listened to 10 tracks', earned: false },
      { emoji: '🦋', title: 'Social Butterfly', description: 'Connected with 5 members', earned: false },
      { emoji: '🎪', title: 'Event Regular', description: 'Attended 3 events', earned: false },
    ];
  }, [gamipress.data?.achievements]);

  // ✅ FIX 2: Memoize activity to prevent recreating React elements
  const recentActivity = useMemo<ActivityItem[]>(() => [
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
  ], []);

  const unlockedCount = useMemo(() => safeAchievements.filter(a => a.earned).length, [safeAchievements]);

  const containerVariants = { 
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }, 
    hidden: { opacity: 0 } 
  };
  const itemVariants = { 
    visible: { opacity: 1, y: 0 }, 
    hidden: { opacity: 0, y: 20 } 
  };

  if (gamipress.loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90">Loading your Zen Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-2xl p-6 md:p-8 border border-primary/30 backdrop-blur-sm">
            <div className="flex items-center gap-6 flex-wrap">
              
              <div className="relative">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-primary shadow-xl"
                />
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary to-secondary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-xl ring-4 ring-background"
                >
                  {userStats.level}
                </motion.div>
              </div>

              <div className="flex-1 min-w-[300px]">
                <h1 className="text-3xl md:text-4xl font-black font-display mb-2">
                  Welcome back, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-white/70 text-lg mb-4 flex items-center gap-2">
                  <Trophy className="text-warning" size={20} />
                  {userStats.rank} • Level {userStats.level}
                </p>
                
                <div className="space-y-2" role="progressbar" aria-valuenow={userStats.progress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 flex items-center gap-1"><TrendingUp size={16} /> Progress to Level {userStats.level + 1}</span>
                    <span className="text-primary font-bold">{userStats.currentXP}/{userStats.nextLevelXP} XP</span>
                  </div>
                  <div className="h-3 bg-background/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${userStats.progress}%` }} 
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/shop')}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap shadow-xl"
              >
                <Zap size={20} /> Boost XP
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* STATS GRID */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { icon: Music, value: userStats.totalTracks, label: 'Tracks Downloaded', color: 'text-primary', loading: tracks.loading },
            { icon: Calendar, value: userStats.eventsAttended, label: 'Events Attended', color: 'text-success', loading: events.loading },
            { icon: Target, value: userStats.streakDays, label: userStats.streakFire ? 'Day Streak 🔥' : 'Day Streak', color: 'text-warning', loading: streak.loading },
            { icon: Users, value: userStats.tribeFriends, label: 'Tribe Friends', color: 'text-accent', loading: false },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }} className="card p-4 md:p-6 transition-all hover:shadow-2xl">
              <stat.icon className={`${stat.color} mb-2 md:mb-3`} size={28} />
              <div className="text-2xl md:text-3xl font-black mb-1">
                {stat.loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stat.value}
              </div>
              <div className="text-white/70 text-xs md:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* RECENT ACTIVITY */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-2">
            <div className="card p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2"><Clock className="text-primary" size={24} /> Recent Activity</h2>
                <button onClick={() => navigate('/my-account')} className="text-primary hover:underline text-sm transition-all hover:scale-105">View All →</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((act, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-all cursor-pointer border border-transparent hover:border-primary/30">
                    <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">{act.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{act.action} <span className="text-primary">{act.item}</span></div>
                      <div className="text-sm text-white/60 flex items-center gap-1"><Clock size={12} /> {act.time}</div>
                    </div>
                    <div className="text-success font-bold text-sm flex-shrink-0 flex items-center gap-1"><Star size={16} className="fill-success" /> +{act.xp} XP</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SIDEBAR */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-6">
            <GamificationWidget />
            <div className="card p-6">
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2"><Zap className="text-primary" size={20} /> Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: Music, label: 'Browse Music', path: '/music', variant: 'primary' },
                  { icon: Calendar, label: 'View Events', path: '/events', variant: 'outline' },
                  { icon: Gift, label: 'Visit Shop', path: '/shop', variant: 'outline' },
                ].map((action, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(action.path)} className={`w-full btn btn-${action.variant} justify-start gap-3`}>
                    <action.icon size={20} /> {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ACHIEVEMENTS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12">
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2"><Award className="text-primary" size={28} /> Your Achievements</h2>
              <div className="text-white/70 flex items-center gap-2"><Trophy className="text-warning" size={20} /> <span className="text-primary font-bold text-xl">{unlockedCount}</span> <span>of {safeAchievements.length} unlocked</span></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {safeAchievements.map((achievement, i) => (
                <motion.div key={achievement.id || i} whileHover={{ scale: achievement.earned ? 1.1 : 1 }} className={`bg-surface/50 rounded-lg p-4 text-center transition-all border ${achievement.earned ? 'hover:bg-surface/70 cursor-pointer border-primary/30 hover:border-primary' : 'opacity-40 grayscale border-transparent'}`}>
                  <div className="text-4xl md:text-5xl mb-3">{achievement.image ? <img src={achievement.image} alt={achievement.title} className="w-16 h-16 mx-auto object-contain" /> : (achievement.emoji || '🏆')}</div>
                  <div className="font-bold text-sm mb-1 line-clamp-1">{achievement.title}</div>
                  <div className="text-xs text-white/60 line-clamp-2 min-h-[2rem]">{achievement.description}</div>
                  {achievement.earned && <div className="mt-2 text-xs text-success flex items-center justify-center gap-1">Unlocked</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;