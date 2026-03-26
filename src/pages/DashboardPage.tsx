import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Award, Music, Zap, Loader2, Gift, Target, AlertCircle,
  ArrowRight, Crown, Flame, Star, Trophy, Sparkles, TrendingUp, Bell, CircleCheck
} from 'lucide-react';
import { GamiPressProvider, useGamiPressContext } from '../contexts/GamiPressContext';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { RecentActivity } from '../components/account';
import { useLeaderboardQuery } from '../hooks/useQueries';
import { safeUrl } from '../utils/sanitize';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

// ============================================================================
// 1. SUB-COMPONENTS (PREMIUM VISUALS)
// ============================================================================

const GlassCard = ({ children, className = '', glowColor = 'primary', noPadding = false }: { children: React.ReactNode; className?: string; glowColor?: 'primary' | 'secondary' | 'accent' | 'success'; noPadding?: boolean }) => {
  const glowClasses = {
    primary: 'hover:shadow-[0_0_30px_rgba(var(--color-primary),0.15)] hover:border-primary/30',
    secondary: 'hover:shadow-[0_0_30px_rgba(var(--color-secondary),0.15)] hover:border-secondary/30',
    accent: 'hover:shadow-[0_0_30px_rgba(var(--color-accent),0.15)] hover:border-accent/30',
    success: 'hover:shadow-[0_0_30px_rgba(var(--color-success),0.15)] hover:border-success/30',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[2rem] border border-white/5 bg-surface/20 backdrop-blur-2xl transition-all duration-500 group ${glowClasses[glowColor]} ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${glowColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const SectionHeader = ({ title, icon: Icon, badge }: { title: string; icon?: React.ElementType; badge?: string }) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-white/40 group-hover:text-primary transition-colors" size={20} />}
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/60 font-display">{title}</h3>
    </div>
    {badge && (
      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
        {badge}
      </span>
    )}
  </div>
);

const Gauge = ({ progress, size = 180, strokeWidth = 14, color = 'rgb(var(--color-primary))', label, subLabel }: { progress: number; size?: number; strokeWidth?: number; color?: string; label?: string; subLabel?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"
        />
      </svg>
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: color }} />
      
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black font-display text-white">{progress}%</span>
        {label && <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{label}</span>}
        {subLabel && <span className="text-[9px] text-primary font-bold mt-1">{subLabel}</span>}
      </div>
    </div>
  );
};

const HexBadge = ({ earned, title, image, size = '14' }: { earned: boolean; title: string; image?: string; size?: string }) => (
  <motion.div 
    whileHover={{ scale: 1.1, rotate: 5 }}
    className={`relative flex items-center justify-center group ${earned ? 'opacity-100' : 'opacity-30 grayscale'}`}
  >
    <div className={`clip-hex flex items-center justify-center p-[2px] ${earned ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-white/10'}`} style={{ width: `${size}rem`, height: `${size}rem` }}>
      <div className="clip-hex h-full w-full bg-surface-dark flex items-center justify-center overflow-hidden bg-black/40">
        {image ? (
          <img src={safeUrl(image)} alt={title} className="h-2/3 w-2/3 object-contain" />
        ) : (
          <Award className={`h-1/2 w-1/2 ${earned ? 'text-primary' : 'text-white/20'}`} />
        )}
      </div>
    </div>
    {earned && (
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    )}
  </motion.div>
);

// ============================================================================
// 2. MAIN DASHBOARD CONTENT
// ============================================================================

const DashboardContent = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  const { data: gamipress, loading: gamiLoading, error: gamiError, refresh: gamiRefresh } = useGamiPressContext();
  const { data: leaderboardData } = useLeaderboardQuery(5);

  const routes = useMemo(() => ({
    music: getLocalizedRoute('music', currentLang),
    events: getLocalizedRoute('events', currentLang),
    shop: getLocalizedRoute('shop', currentLang),
    myAccount: getLocalizedRoute('my-account', currentLang),
  }), [currentLang]);

  if (gamiLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-white tracking-widest uppercase font-display">{t('dashboard.loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (gamiError) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2 font-display">{t('dashboard.error_loading')}</h2>
          <p className="text-sm text-white/40 mb-8">{gamiError}</p>
          <button onClick={gamiRefresh} className="btn btn-primary btn-lg rounded-2xl w-full">
            {t('common.retry')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user || !gamipress) return null;

  // --- POINT & RANK CALCULATION ---
  const main_slug = gamipress.main_points_slug || 'points';
  const mainPoints = gamipress.points?.[main_slug]?.amount ?? 0;
  const streakCount = gamipress.stats?.streak ?? 0;
  const artifactCount = gamipress.stats?.totalTracks ?? 0;
  const currentRank = gamipress.rank?.current?.title || '--';
  const nextRank = gamipress.rank?.next?.title || null;
  const rankProgress = gamipress.rank?.progress || 0;
  const allReqs = gamipress.rank?.requirements ?? [];
  const rankExpCurrent = allReqs.reduce((sum, r) => sum + (r.current || 0), 0);
  const rankExpRequired = allReqs.reduce((sum, r) => sum + (r.required || 0), 0) || 1000;

  // menu_order is GamiPress sequential rank position (0-based → display as 1-based)
  const rankLevel = (gamipress.rank?.current?.menu_order ?? 0) + 1;

  // Active quests: real GamiPress rank requirements for next rank
  const activeQuests = allReqs.map(req => ({
    label: req.title,
    progress: Math.min(100, Math.round(req.percent)),
    done: req.percent >= 100,
  }));
  const completedQuests = activeQuests.filter(q => q.done).length;

  // Stars: dynamic based on rank progress
  const rankStars = rankProgress >= 66 ? 3 : rankProgress >= 33 ? 2 : rankProgress > 0 ? 1 : 0;

  const earnedAchievements = gamipress.achievements_earned || [];
  const leaderboard = (leaderboardData && Object.values(leaderboardData)[0]) || [];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background text-white selection:bg-primary/30">
      <HeadlessSEO
        title={`${t('dashboard_page_title')} | DJ Zen Eyer`}
        description={t('dashboard_page_meta_desc')}
        image="/images/zen-eyer-og-image.png"
        noindex
      />

      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* --- TOP HEADER & PROFILE --- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
              <img
                src={safeUrl(user.avatar, '/default-avatar.svg')}
                className="relative z-10 h-24 w-24 md:h-28 md:w-28 rounded-3xl object-cover border-2 border-primary/40 shadow-neon-sm"
                alt={user.display_name}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/default-avatar.svg'; }}
              />
              <div className="absolute -bottom-2 -right-2 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg border-2 border-background">
                <Crown size={14} className="fill-white text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black font-display tracking-tighter">
                  {user.display_name || user.name}
                </h1>
                <Bell size={20} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
              </div>
              <div className="flex items-center gap-3 text-sm font-bold opacity-70">
                <span className="flex items-center gap-1.5 text-primary">
                  <Flame size={16} className="fill-current animate-bounce" />
                  LEVEL {rankLevel}
                </span>
                <span className="text-white/30">•</span>
                <span className="uppercase tracking-widest text-xs px-2 py-0.5 rounded bg-white/10 border border-white/10">
                  {currentRank}
                </span>
                <span className="hidden md:inline text-white/30">•</span>
                <span className="hidden md:inline uppercase tracking-widest text-[10px] text-white/50">
                  Joined {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 text-right">
             <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-black uppercase tracking-widest text-white/30">Rank Progression</span>
                <span className="text-sm font-black text-primary font-display">{rankProgress}%</span>
             </div>
             <div className="h-2 w-full md:w-64 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${rankProgress}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-neon-sm"
                />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">
                {rankExpCurrent.toLocaleString()} / {rankExpRequired.toLocaleString()} XP to level up
             </p>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (STATUS & ACTION) */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* CURRENT STATUS */}
            <GlassCard glowColor="primary">
              <SectionHeader title="Status" icon={Target} />
              <div className="space-y-6">
                {[
                  { label: 'Daily Streak', value: `${streakCount} DAYS`, icon: Flame, color: 'text-orange-500', fill: 'fill-orange-500' },
                  { label: 'Artifacts Found', value: artifactCount, icon: Music, color: 'text-secondary' },
                  { label: 'Total Points', value: mainPoints.toLocaleString(), icon: Zap, color: 'text-primary', fill: 'fill-primary' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon size={18} className={stat.fill} />
                      </div>
                      <span className="text-xs font-bold text-white/50">{stat.label}</span>
                    </div>
                    <span className="text-lg font-black font-display group-hover:text-white transition-colors">{stat.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* QUICK ACTIONS / QUESTS */}
            <GlassCard glowColor="secondary">
              <SectionHeader
                title={t('dashboard.pendingQuests')}
                icon={Sparkles}
                badge={activeQuests.length > 0 ? `${completedQuests}/${activeQuests.length}` : undefined}
              />
              <div className="space-y-5">
                {activeQuests.length === 0 ? (
                  <div className="py-4 text-center text-white/40 text-xs font-bold uppercase tracking-widest">
                    {t('dashboard.allCleared')}
                  </div>
                ) : (
                  activeQuests.map((quest, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white/80">{quest.label}</span>
                        {quest.done
                          ? <CircleCheck size={12} className="text-success" />
                          : <TrendingUp size={12} className="text-primary" />
                        }
                      </div>
                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${quest.progress}%` }}
                          className={`h-full ${quest.done ? 'bg-success' : 'bg-primary'}`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>

            <button onClick={() => navigate(routes.music)} className="w-full group rounded-[1.5rem] bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between font-black uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
              Explore Music
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* MIDDLE COLUMN (Gauges & Activity) */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            
            <GlassCard noPadding glowColor="primary">
              <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
                <div className="flex justify-center">
                  <Gauge 
                    progress={rankProgress} 
                    label="Progress" 
                    subLabel={nextRank ? `TO ${nextRank}` : 'MAX LEVEL'}
                  />
                </div>
                <div className="space-y-6">
                   <div>
                     <h4 className="text-2xl font-black font-display leading-none mb-1">{t('dashboard.stats.ascension')}</h4>
                     <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{currentRank}</p>
                   </div>
                   <div className="space-y-3">
                     <p className="text-sm text-white/60 italic leading-relaxed">
                        "{t('dashboard.ascension_quote')}"
                     </p>
                     <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                          <Star key={i} size={12} className={i < rankStars ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'} />
                        ))}
                     </div>
                   </div>
                </div>
              </div>
            </GlassCard>

            <div className="h-[500px] overflow-hidden">
                <RecentActivity logs={gamipress.logs} hideHeader={false} />
            </div>
          </div>

          {/* RIGHT COLUMN (Badges & Competitive) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* BADGES EARNED */}
            <GlassCard glowColor="accent">
              <SectionHeader title="Badges Earned" icon={Award} badge={`${earnedAchievements.length} TOTAL`} />
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {earnedAchievements.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-white/20 text-xs font-bold italic">
                    Start exploring to earn your first badge
                  </div>
                ) : (
                  earnedAchievements.slice(0, 10).map((ach) => (
                    <HexBadge key={ach.id} earned={true} title={ach.title} image={ach.image} size="3.5" />
                  ))
                )}
                {/* Visual placeholders for locked ones */}
                {[...Array(Math.max(0, 10 - earnedAchievements.length))].map((_, i) => (
                  <HexBadge key={`locked-${i}`} earned={false} title="Locked" size="3.5" />
                ))}
              </div>
              <button 
                onClick={() => navigate(routes.myAccount)}
                className="mt-6 w-full py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                View Achievement Tree
              </button>
            </GlassCard>

            {/* LEADERBOARD PREVIEW */}
            <GlassCard glowColor="success">
               <SectionHeader title="Leaderboard" icon={Trophy} />
               <div className="space-y-4">
                  {leaderboard.length === 0 ? (
                    <div className="py-4 text-center text-white/20 text-xs italic">
                      Finding tribe members...
                    </div>
                  ) : (
                    leaderboard.map((entry, i) => (
                      <div key={entry.user_id} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${entry.user_id === user.id ? 'bg-primary/20 border border-primary/30' : 'bg-black/30 border border-white/5'}`}>
                        <span className={`w-5 text-sm font-black font-display ${i === 0 ? 'text-yellow-500' : 'text-white/30'}`}>{i + 1}.</span>
                        <img src={entry.avatar} className="h-8 w-8 rounded-full border border-white/10" alt={entry.display_name} />
                        <span className="flex-1 text-sm font-bold truncate">{entry.display_name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black font-display text-primary">{entry.points.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-white/20 uppercase">XP</span>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </GlassCard>

            {/* REWARDS CARD */}
            <GlassCard glowColor="secondary" className="bg-gradient-to-br from-indigo-900/40 to-surface/20">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-neon-sm">
                     <Gift size={28} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-black font-display text-lg uppercase tracking-tight">VIP Rewards Shop</h4>
                     <p className="text-xs text-white/50 font-medium">Redeem your Mana for exclusive tracks, discounts and VIP experiences.</p>
                  </div>
                  <button onClick={() => navigate(routes.shop)} className="h-10 w-10 shrink-0 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                     <ArrowRight size={18} />
                  </button>
               </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user, loading } = useUser();
  const { i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
        </motion.div>
      </div>
    );
  }

  if (!user?.isLoggedIn) {
    return <Navigate to={getLocalizedRoute('', currentLang)} replace />;
  }

  return (
    <GamiPressProvider>
      <DashboardContent />
    </GamiPressProvider>
  );
};

export default DashboardPage;

