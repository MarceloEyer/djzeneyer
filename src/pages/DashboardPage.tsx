// src/pages/DashboardPage.tsx
// v18.1 - NATIVE GAMIPRESS INTEGRATION (Fixed Types)

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Music, Calendar, Clock, Zap, Users, Trophy, 
  Target, Gift, Loader2, TrendingUp, Star 
} from 'lucide-react';
import GamificationWidget from '../components/Gamification/GamificationWidget';
import { useGamiPress, Achievement } from '../hooks/useGamiPress';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

// --- HELPER: Formatação de Tempo (Ex: "2 hours ago") ---
function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((new Date().getTime() - timestamp * 1000) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

interface SafeAchievement {
  id?: number;
  title: string;
  description: string;
  image?: string;
  emoji?: string;
  earned: boolean;
}

const DashboardPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const homeRoute = getLocalizedRoute('', currentLang);
  const shopRoute = getLocalizedRoute('shop', currentLang);
  const myAccountRoute = getLocalizedRoute('my-account', currentLang);
  const musicRoute = getLocalizedRoute('music', currentLang);
  const eventsRoute = getLocalizedRoute('events', currentLang);
  
  // Hook de Dados Reais
  const gamipress = useGamiPress();

  useEffect(() => {
    if (user?.name) {
      document.title = `Dashboard - ${user.name} | DJ Zen Eyer`;
    }
  }, [user?.name]);

  useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate(homeRoute, { replace: true });
    }
  }, [user, navigate, homeRoute]);

  const userStats = useMemo(() => ({
    level: gamipress.level,
    currentXP: gamipress.points,
    nextLevelXP: gamipress.nextLevelPoints,
    progress: gamipress.progressToNextLevel,
    rank: gamipress.rank,
    totalTracks: 0, // Placeholder: WooCommerce hook removed
    eventsAttended: 0, // Placeholder: WooCommerce hook removed
    streakDays: gamipress.streak,
    streakFire: gamipress.streakFire,
    tribeFriends: 0 
  }), [gamipress]);

  const safeAchievements = useMemo<SafeAchievement[]>(() => {
    const raw = gamipress.achievements;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter((ach) => ach.earned)
        .map((ach) => ({
          id: ach.id,
          title: ach.title || 'Achievement',
          description: ach.description || 'Achievement unlocked!',
          image: ach.image || '',
          emoji: ach.image ? '' : '🏆',
          earned: true
        }));
    }
    return [];
  }, [gamipress.achievements]);

  const recentActivities = useMemo(() => {
      if (!gamipress.achievements) return [];
      return [...gamipress.achievements]
          .filter(a => a.earned && a.date_earned)
          .sort((a, b) => new Date(b.date_earned!).getTime() - new Date(a.date_earned!).getTime())
          .slice(0, 10)
          .map(a => ({
              id: `ach_${a.id}`,
              type: 'achievement',
              description: a.title || 'Achievement',
              xp: 0, // XP unknown in this context without extra fetch
              timestamp: new Date(a.date_earned!).getTime() / 1000
          }));
  }, [gamipress.achievements]);

  const unlockedCount = safeAchievements.length;

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
                  className="w-24 h-24 rounded-full border-4 border-primary shadow-xl object-cover"
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
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(shopRoute)}
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
            { icon: Music, value: userStats.totalTracks, label: 'Tracks Downloaded', color: 'text-primary', loading: false },
            { icon: Calendar, value: userStats.eventsAttended, label: 'Events Attended', color: 'text-success', loading: false },
            { icon: Target, value: userStats.streakDays, label: userStats.streakFire ? 'Day Streak 🔥' : 'Day Streak', color: 'text-warning', loading: gamipress.loading },
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
          
          {/* ✅ REAL ACTIVITY FEED */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-2">
            <div className="card p-6 h-full min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2">
                  <Clock className="text-primary" size={24} /> Recent Activity
                </h2>
                <button onClick={() => navigate(myAccountRoute)} className="text-primary hover:underline text-sm transition-all hover:scale-105">View All →</button>
              </div>
              
              <div className="space-y-4">
                {gamipress.loading ? (
                   // Loading State
                   <div className="flex flex-col gap-4">
                     {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />)}
                   </div>
                ) : recentActivities.length > 0 ? (
                  // ✅ Renderização da Atividade Real
                  recentActivities.map((act, i) => {
                    // Mapeamento de Estilo baseado no Tipo
                    const isLoot = act.type === 'loot';
                    const icon = isLoot ? <Gift size={20} /> : <Trophy size={20} />;
                    const colorClass = isLoot ? 'text-purple-400 bg-purple-500/10' : 'text-yellow-400 bg-yellow-500/10';
                    const actionLabel = isLoot ? 'Looted' : 'Unlocked';

                    return (
                      <motion.div key={act.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} 
                        className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-all cursor-pointer border border-transparent hover:border-primary/30 group"
                      >
                        {/* Ícone */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:scale-110 transition-transform ${colorClass}`}>
                          {icon}
                        </div>
                        
                        {/* Texto */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-white/90">
                            <span className="opacity-70 text-xs uppercase tracking-wider block mb-0.5">{actionLabel}</span>
                            {act.description}
                          </div>
                          <div className="text-sm text-white/50 flex items-center gap-1 mt-1">
                            <Clock size={12} /> {getTimeAgo(act.timestamp)}
                          </div>
                        </div>
                        
                        {/* XP Badge */}
                        {act.xp > 0 && (
                            <div className="text-success font-bold text-sm flex-shrink-0 flex items-center gap-1 bg-success/10 px-3 py-1 rounded-full border border-success/20">
                            <Star size={14} className="fill-success" /> +{act.xp} XP
                            </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  // Empty State
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="text-white/20" size={32} />
                    </div>
                    <p className="text-white/50">No recent activity yet.</p>
                  </div>
                )}
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
                  { icon: Music, label: 'Browse Music', path: musicRoute, variant: 'primary' },
                  { icon: Calendar, label: 'View Events', path: eventsRoute, variant: 'outline' },
                  { icon: Gift, label: 'Visit Shop', path: shopRoute, variant: 'outline' },
                ].map((action, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(action.path)} className={`w-full btn btn-${action.variant} justify-start gap-3`}>
                    <action.icon size={20} /> {action.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ACHIEVEMENTS REAIS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12">
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2"><Award className="text-primary" size={28} /> Your Achievements</h2>
              <div className="text-white/70 flex items-center gap-2"><Trophy className="text-warning" size={20} /> <span className="text-primary font-bold text-xl">{unlockedCount}</span> <span>Unlocked</span></div>
            </div>
            
            {safeAchievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {safeAchievements.map((achievement, i) => (
                  <motion.div key={achievement.id || i} whileHover={{ scale: 1.05 }} className="bg-surface/50 rounded-lg p-4 text-center transition-all border border-primary/30 hover:bg-surface/70 hover:border-primary cursor-pointer shadow-lg hover:shadow-primary/20">
                    <div className="text-4xl md:text-5xl mb-3 h-16 w-16 mx-auto flex items-center justify-center">
                        {achievement.image ? <img src={achievement.image} alt={achievement.title} className="w-full h-full object-contain drop-shadow-md" /> : (achievement.emoji || '🏆')}
                    </div>
                    <div className="font-bold text-sm mb-1 line-clamp-1">{achievement.title}</div>
                    <div className="text-xs text-white/60 line-clamp-2 min-h-[2rem]">{achievement.description}</div>
                    <div className="mt-2 text-xs text-success flex items-center justify-center gap-1 font-bold">Unlocked <Award size={10} /></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // EMPTY STATE
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Start Your Journey</h3>
                <p className="text-white/60 mb-6 max-w-md mx-auto">Complete tasks like listening to tracks, attending events, or visiting the shop to unlock your first achievements!</p>
                <button onClick={() => navigate(musicRoute)} className="btn btn-primary">Start Listening</button>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
