import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';;
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
        <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90">{t('dashboard.loading')}</p>
        </m.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90 mb-2">{t('dashboard.error_loading')}</p>
          <p className="text-sm text-white/40 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-xs"
          >
            {t('common.retry')}
          </button>
        </m.div>
      </div>
    );
  }

  if (!user || !gamipress) return null;

  const mainPoints = gamipress.points[gamipress.main_points_slug]?.amount ?? 0;
  const pointTypes = Object.entries(gamipress.points);
  const earnedAchievements = gamipress.achievements_earned;
  const lockedAchievements = gamipress.achievements_locked;
  const highlightedAchievements = gamipress.achievement_highlights ?? [...earnedAchievements, ...lockedAchievements];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>{`${t('dashboard_page_title')} | DJ Zen Eyer`}</title>
        <meta name="description" content={t('dashboard_page_meta_desc')} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-surface/40 p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`}
                alt={user.name}
                className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight">
                  {t('dashboard.welcomeBack', { name: user.display_name || user.name || t('common.friend') })}
                </h1>
                <p className="mt-2 text-white/60">{t('dashboard.journeyBegins')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{t('dashboard.stats.mana')}</div>
                <div className="text-xl font-black mt-1">{mainPoints}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{t('dashboard.stats.artifacts')}</div>
                <div className="text-xl font-black mt-1">{gamipress.stats.totalTracks}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{t('dashboard.stats.events')}</div>
                <div className="text-xl font-black mt-1">{gamipress.stats.eventsAttended}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{t('dashboard.stats.ascension')}</div>
                <div className="text-xl font-black mt-1 truncate">{gamipress.rank.current.title}</div>
              </div>
            </div>
          </div>

          {gamipress.rank.next && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <ManaProgressBar
                progress={gamipress.rank.progress}
                label={t('dashboard.nextRank')}
                subLabel={gamipress.rank.next.title}
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
            <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/40">
              {t('dashboard.allCleared')}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {highlightedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`rounded-2xl border p-4 ${achievement.earned ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-black/30 opacity-80'}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      {achievement.image ? (
                        <img src={safeUrl(achievement.image)} alt={achievement.title} className="h-6 w-6 object-contain" />
                      ) : (
                        <Award size={16} className="text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-black tracking-tight">{achievement.title}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        {achievement.earned ? t('dashboard.unlocked') : t('account.locked')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 line-clamp-2">{stripHtml(achievement.description)}</p>
                </div>
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
        <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-center text-white/80">{t('dashboard.loading')}</p>
        </m.div>
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

