import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Award,
  Music,
  Calendar,
  Zap,
  Loader2,
  Gift,
  Target,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { GamiPressProvider, useGamiPressContext } from '../contexts/GamiPressContext';
import { Helmet } from 'react-helmet-async';
import { RecentActivity } from '../components/account';
import { safeUrl } from '../utils/sanitize';
import { stripHtml } from '../utils/text';
import ManaProgressBar from '../components/ui/ManaProgressBar';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

const DashboardContent = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  const { data: gamipress, loading, error } = useGamiPressContext();

  const routes = useMemo(
    () => ({
      music: getLocalizedRoute('music', currentLang),
      events: getLocalizedRoute('events', currentLang),
      shop: getLocalizedRoute('shop', currentLang),
      myAccount: getLocalizedRoute('my-account', currentLang),
    }),
    [currentLang]
  );

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90">{t('dashboard.loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90 mb-2">{t('dashboard.error_loading')}</p>
          <p className="text-sm text-white/40 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-xs"
          >
            {t('common.retry')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user || !gamipress) return null;

  const mainPoints = (gamipress.points && gamipress.main_points_slug) 
    ? (gamipress.points[gamipress.main_points_slug]?.amount ?? 0) 
    : 0;
  const pointTypes = gamipress.points ? Object.entries(gamipress.points) : [];
  const earnedAch = Array.isArray(gamipress.achievements_earned) ? gamipress.achievements_earned : [];
  const lockedAch = Array.isArray(gamipress.achievements_locked) ? gamipress.achievements_locked : [];
  const highlightedAchievements = Array.isArray(gamipress.achievement_highlights) 
    ? gamipress.achievement_highlights 
    : [...earnedAch, ...lockedAch];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>{`${t('dashboard_page_title')} | DJ Zen Eyer`}</title>
        <meta name="description" content={t('dashboard_page_meta_desc')} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/40 p-6 md:p-8 backdrop-blur-xl">
          {/* Decorative Background Image */}
          <div className="absolute -right-20 -top-20 h-64 w-64 opacity-20 blur-2xl lg:opacity-30 lg:h-96 lg:w-96">
             <img src="/images/zen_tribe_dashboard_welcome.png" className="h-full w-full object-cover rounded-full" alt="Decorative" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=6366F1&color=fff&size=128`}
                  alt={user.name}
                  className="relative z-10 h-20 w-20 rounded-2xl border border-white/10 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 z-20 rounded-lg bg-primary p-1 shadow-lg">
                  <Zap size={12} className="text-white fill-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white">
                  {t('dashboard.welcomeBack', { name: (user.display_name || user.name || t('common.friend')) as string })}
                </h1>
                <p className="mt-2 text-white/50">{t('dashboard.journeyBegins')}</p>
              </div>
            </div>

            {/* PREMIUM STATS GRID */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:w-3/4">
              {/* MANA CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-4 py-5 group transition-all hover:bg-primary/10 hover:border-primary/40 shadow-lg shadow-primary/5"
              >
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={64} className="text-primary fill-primary" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{t('dashboard.stats.mana')}</div>
                <div className="text-3xl font-black mt-1 font-display bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{mainPoints}</div>
                <div className="mt-2 h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-primary"
                  />
                </div>
              </motion.div>

              {/* ARTIFACTS CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-secondary/5 px-4 py-5 group transition-all hover:bg-secondary/10 hover:border-secondary/40 shadow-lg shadow-secondary/5"
              >
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Music size={64} className="text-secondary fill-secondary" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">{t('dashboard.stats.artifacts')}</div>
                <div className="text-3xl font-black mt-1 font-display bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{gamipress.stats?.totalTracks ?? 0}</div>
              </motion.div>

              {/* EVENTS CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 px-4 py-5 group transition-all hover:bg-accent/10 hover:border-accent/40 shadow-lg shadow-accent/5"
              >
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar size={64} className="text-accent fill-accent" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">{t('dashboard.stats.events')}</div>
                <div className="text-3xl font-black mt-1 font-display bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{gamipress.stats?.eventsAttended ?? 0}</div>
              </motion.div>

              {/* RANK CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl border border-success/20 bg-success/5 px-4 py-5 group transition-all hover:bg-success/10 hover:border-success/40 shadow-lg shadow-success/5"
              >
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award size={64} className="text-success fill-success" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-success/60">{t('dashboard.stats.ascension')}</div>
                <div className="text-xl font-black mt-2 font-display text-white truncate drop-shadow-sm">{gamipress.rank?.current?.title || '--'}</div>
              </motion.div>
            </div>
          </div>

          {gamipress.rank?.next && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 backdrop-blur-md">
              <ManaProgressBar
                progress={gamipress.rank.progress || 0}
                label={t('dashboard.nextRank')}
                subLabel={`${gamipress.rank.next.title} (${gamipress.rank.requirements?.[0]?.current || 0} / ${gamipress.rank.requirements?.[0]?.required || 0} XP)`}
              />
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-surface/30 p-6">
              <h2 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-white/60">{t('dashboard.quickActions')}</h2>
              <div className="space-y-3">
                {[
                  { icon: Music, label: t('dashboard.browseMusic'), to: routes.music },
                  { icon: Calendar, label: t('dashboard.viewEvents'), to: routes.events },
                  { icon: Gift, label: t('dashboard.visitShop'), to: routes.shop },
                ].map((action) => (
                  <button
                    key={action.to}
                    onClick={() => navigate(action.to)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-primary/30 hover:bg-primary/10"
                  >
                    <span className="flex items-center gap-3">
                      <action.icon size={18} className="text-primary" />
                      {action.label}
                    </span>
                    <ArrowRight size={16} className="text-white/40" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-surface/30 p-6">
              <h2 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-white/60">{t('dashboard.yourWallet')}</h2>
              <div className="space-y-4">
                {pointTypes.map(([slug, point]) => (
                  <div key={slug} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                      {point.image ? <img src={safeUrl(point.image)} alt={point.name} className="h-6 w-6 object-contain" /> : <Zap size={16} className="text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-black leading-none">{point.amount}</div>
                      <div className="truncate text-[10px] uppercase tracking-[0.2em] text-white/40">{point.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-surface/30 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black font-display tracking-tight">{t('dashboard.recentActivity')}</h2>
              <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-success">
                {t('dashboard.live_feed')}
              </span>
            </div>
            <RecentActivity logs={gamipress.logs} hideHeader={true} />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-surface/30 p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black font-display tracking-tight">{t('dashboard.yourAchievements')}</h2>
            <button
              onClick={() => navigate(routes.myAccount)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-primary/30 hover:text-primary"
            >
              <Target size={14} />
              {t('gamification.viewAll')}
            </button>
          </div>

          {highlightedAchievements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                 <Music className="text-white/20" />
              </div>
              <p className="text-white/40 font-medium italic">{t('dashboard.allCleared')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {highlightedAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative overflow-hidden rounded-[1.5rem] border p-5 transition-all duration-300 ${
                    achievement.earned 
                      ? 'border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(var(--color-primary),0.05)]' 
                      : 'border-white/5 bg-black/40 grayscale opacity-60'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rotate-45 ${
                    achievement.earned ? 'bg-primary/20' : 'bg-white/5'
                  }`} />
                  
                  <div className="relative mb-4 flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                      achievement.earned ? 'border-primary/30 bg-primary/20 shadow-neon' : 'border-white/10 bg-white/5'
                    }`}>
                      {achievement.image ? (
                        <img src={safeUrl(achievement.image)} alt={achievement.title} className="h-8 w-8 object-contain" />
                      ) : (
                        <Award size={24} className={achievement.earned ? 'text-primary' : 'text-white/20'} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-lg tracking-tight text-white">{achievement.title}</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${achievement.earned ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                        <p className={`text-[10px] font-black uppercase tracking-widest ${achievement.earned ? 'text-primary' : 'text-white/30'}`}>
                          {achievement.earned ? t('dashboard.unlocked') : t('account.locked')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed text-white/60">
                    {stripHtml(achievement.description)}
                  </p>
                  
                  {achievement.earned && (
                    <div className="mt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-primary/40">
                      <span>Verified Artifact</span>
                      <Zap size={10} className="fill-primary text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user, loading } = useUser();
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-center text-white/80">{t('dashboard.loading')}</p>
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

