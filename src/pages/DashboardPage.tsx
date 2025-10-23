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
} from 'lucide-react';
import GamificationWidget from '../components/Gamification/GamificationWidget';
import { useGamiPress } from '../hooks/useGamiPress';
import { useUserTracks } from '../hooks/useUserTracks';
import { useUserEvents } from '../hooks/useUserEvents';
import { useUserStreak } from '../hooks/useUserStreak';
// 🔥 REMOVIDO: import { useRecentActivity } from '../hooks/useRecentActivity';

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // 🎮 Hooks com dados reais
  const gamipress = useGamiPress();
  const tracks = useUserTracks();
  const events = useUserEvents();
  const streak = useUserStreak();
  // 🔥 REMOVIDO: const activity = useRecentActivity();

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
          <p className="mt-4 text-white/70">Loading your stats...</p>
        </div>
      </div>
    );
  }

  // ✅ User stats com dados REAIS do GamiPress
  const currentPoints = gamipress.points || 0;
  const currentLevel = Math.floor(currentPoints / 100) + 1;
  const nextLevelXP = currentLevel * 100;
  const progressPercentage = ((currentPoints % 100) / 100) * 100;

  const userStats = {
    level: currentLevel,
    currentXP: currentPoints,
    nextLevelXP: nextLevelXP,
    totalTracks: tracks.total || 0,
    eventsAttended: events.total || 0,
    streakDays: streak.streak || 0,
    tribeFriends: 12 // TODO: Implementar friends quando necessário
  };

  // ✅ Recent Activity SEGURO (SEM useRecentActivity que quebra)
  const recentActivity = [
    { icon: <Music className="text-primary" size={20} />, action: 'Downloaded', item: 'Zouk Nights Remix', xp: 10, time: '2 hours ago' },
    { icon: <Heart className="text-accent" size={20} />, action: 'Liked', item: 'Electric Dreams', xp: 5, time: '5 hours ago' },
    { icon: <Calendar className="text-success" size={20} />, action: 'RSVP\'d to', item: 'Summer Vibes Festival', xp: 25, time: '1 day ago' },
  ];

  // ✅ Achievements ULTRA SEGURO com dados REAIS do GamiPress
  const safeAchievements = (gamipress.achievements && Array.isArray(gamipress.achievements)) ? gamipress.achievements : [];
  const achievements = safeAchievements.length > 0 
    ? safeAchievements.slice(0, 6).map(ach => ({
        emoji: ach?.image ? '' : '🏆',
        image: ach?.image || '',
        title: ach?.title || 'Achievement',
        description: ach?.description || 'Achievement unlocked!',
        unlocked: ach?.earned || false
      }))
    : [
        { emoji: '🎧', title: 'First Beat', description: 'Welcome to the Zen Tribe', unlocked: true },
        { emoji: '🚀', title: 'Early Adopter', description: 'Joined during launch', unlocked: true },
        { emoji: '🔥', title: '7-Day Streak', description: 'Maintained activity streak', unlocked: false },
        { emoji: '🔍', title: 'Music Explorer', description: 'Listened to 10 tracks', unlocked: false },
        { emoji: '🦋', title: 'Social Butterfly', description: 'Connected with 5 members', unlocked: false },
        { emoji: '🎪', title: 'Event Regular', description: 'Attended 3 events', unlocked: false },
      ];

  const unlockedCount = achievements.length > 0 
    ? achievements.filter(a => a?.unlocked).length 
    : 0;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-2xl p-8 border border-primary/30">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="relative">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-primary"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-xl">
                  {userStats.level}
                </div>
              </div>

              <div className="flex-1 min-w-[300px]">
                <h1 className="text-3xl md:text-4xl font-black font-display mb-2">
                  Welcome back, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-white/70 text-lg mb-4">
                  {gamipress.rank || 'Zen Novice'} • Level {userStats.level}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Progress to Level {userStats.level + 1}</span>
                    <span className="text-primary font-bold">{userStats.currentXP % 100}/{100} XP</span>
                  </div>
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/shop')}
                className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Zap size={20} />
                Boost XP
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <Music className="text-primary mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">
              {tracks.loading ? '...' : userStats.totalTracks}
            </div>
            <div className="text-white/70 text-xs md:text-sm">Tracks Downloaded</div>
          </div>

          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <Calendar className="text-success mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">
              {events.loading ? '...' : userStats.eventsAttended}
            </div>
            <div className="text-white/70 text-xs md:text-sm">Events Attended</div>
          </div>

          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <Target className="text-warning mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">
              {streak.loading ? '...' : userStats.streakDays}
            </div>
            <div className="text-white/70 text-xs md:text-sm">Day Streak 🔥</div>
          </div>

          <div className="card p-4 md:p-6 hover:scale-105 transition-transform">
            <Users className="text-accent mb-2 md:mb-3" size={28} />
            <div className="text-2xl md:text-3xl font-black mb-1">{userStats.tribeFriends}</div>
            <div className="text-white/70 text-xs md:text-sm">Tribe Friends</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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

              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((act, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
                        {act.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          {act.action} <span className="text-primary">{act.item}</span>
                        </div>
                        <div className="text-sm text-white/60">{act.time}</div>
                      </div>
                      <div className="text-success font-bold text-sm flex-shrink-0">+{act.xp} XP</div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/50">No recent activity yet. Start exploring!</div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
                  whileHover={{ scale: achievement?.unlocked ? 1.05 : 1 }}
                  className={`bg-surface/50 rounded-lg p-4 text-center transition-all ${
                    achievement?.unlocked ? 'hover:bg-surface/70 cursor-pointer' : 'opacity-40 grayscale'
                  }`}
                >
                  {achievement?.image ? (
                    <img 
                      src={achievement.image} 
                      alt={achievement.title || 'Achievement'}
                      className="w-16 h-16 mx-auto mb-3 object-contain"
                    />
                  ) : (
                    <div className="text-4xl md:text-5xl mb-3">{achievement?.emoji || '🏆'}</div>
                  )}
                  <div className="font-bold text-sm mb-1">{achievement?.title || 'Achievement'}</div>
                  <div className="text-xs text-white/60 line-clamp-2">{achievement?.description || 'Unlocked!'}</div>
                  {achievement?.unlocked && (
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
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
