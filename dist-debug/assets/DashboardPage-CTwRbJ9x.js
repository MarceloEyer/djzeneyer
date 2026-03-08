import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports, h as Navigate, c as useNavigate } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, u as useUser, n as normalizeLanguage, i as getLocalizedRoute, x as Helmet, l as safeUrl, m as Music, C as Calendar, d as Award } from "./index-Cac5tBAe.js";
import { G as GamiPressProvider, u as useGamiPressContext, M as ManaProgressBar, R as RecentActivity } from "./ManaProgressBar-D5_LA-Xg.js";
import { s as stripHtml } from "./text-DgctY_bk.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { L as LoaderCircle } from "./loader-circle-DTVp4yA4.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
import { G as Gift } from "./gift-IUjGOuBb.js";
import { A as ArrowRight } from "./arrow-right-DAPyJrnT.js";
import { Z as Zap } from "./zap-BXTxIMT0.js";
import "./trending-up-W9sh_7o0.js";
import "./star-CaRtl2Cw.js";
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
const DashboardContent = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const currentLang = reactExports.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const { data: gamipress, loading, error } = useGamiPressContext();
  const routes = reactExports.useMemo(
    () => ({
      music: getLocalizedRoute("music", currentLang),
      events: getLocalizedRoute("events", currentLang),
      shop: getLocalizedRoute("shop", currentLang),
      myAccount: getLocalizedRoute("my-account", currentLang)
    }),
    [currentLang]
  );
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-16 h-16 text-primary animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold text-white/90", children: t("dashboard.loading") })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-center max-w-md px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-16 h-16 text-red-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold text-white/90 mb-2", children: t("dashboard.error_loading") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40 mb-6", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "btn btn-primary px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-xs",
          children: t("common.retry")
        }
      )
    ] }) });
  }
  if (!user || !gamipress) return null;
  const mainPoints = gamipress.points[gamipress.main_points_slug]?.amount ?? 0;
  const pointTypes = Object.entries(gamipress.points);
  const earnedAchievements = gamipress.achievements_earned;
  const lockedAchievements = gamipress.achievements_locked;
  const highlightedAchievements = gamipress.achievement_highlights ?? [...earnedAchievements, ...lockedAchievements];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-24 pb-16 min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: `${t("dashboard_page_title")} | DJ Zen Eyer` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("dashboard_page_meta_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-7xl space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/10 bg-surface/40 p-6 md:p-8 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`,
                alt: user.name,
                className: "h-20 w-20 rounded-2xl border border-white/10 object-cover"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-black font-display tracking-tight", children: t("dashboard.welcomeBack", { name: user.display_name || user.name || t("common.friend") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/60", children: t("dashboard.journeyBegins") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-white/40", children: t("dashboard.stats.mana") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1", children: mainPoints })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-white/40", children: t("dashboard.stats.artifacts") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1", children: gamipress.stats.totalTracks })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-white/40", children: t("dashboard.stats.events") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1", children: gamipress.stats.eventsAttended })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-white/40", children: t("dashboard.stats.ascension") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black mt-1 truncate", children: gamipress.rank.current.title })
            ] })
          ] })
        ] }),
        gamipress.rank.next && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ManaProgressBar,
          {
            progress: gamipress.rank.progress,
            label: t("dashboard.nextRank"),
            subLabel: gamipress.rank.next.title
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-surface/30 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-5 text-sm font-black uppercase tracking-[0.2em] text-white/60", children: t("dashboard.quickActions") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
              { icon: Music, label: t("dashboard.browseMusic"), to: routes.music },
              { icon: Calendar, label: t("dashboard.viewEvents"), to: routes.events },
              { icon: Gift, label: t("dashboard.visitShop"), to: routes.shop }
            ].map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => navigate(action.to),
                className: "flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-primary/30 hover:bg-primary/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { size: 18, className: "text-primary" }),
                    action.label
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16, className: "text-white/40" })
                ]
              },
              action.to
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-surface/30 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-5 text-sm font-black uppercase tracking-[0.2em] text-white/60", children: t("dashboard.yourWallet") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: pointTypes.map(([slug, point]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10", children: point.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: safeUrl(point.image), alt: point.name, className: "h-6 w-6 object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-black leading-none", children: point.amount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] uppercase tracking-[0.2em] text-white/40", children: point.name })
              ] })
            ] }, slug)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-surface/30 p-6 lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black font-display tracking-tight", children: t("dashboard.recentActivity") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-success", children: t("dashboard.live_feed") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RecentActivity, { logs: gamipress.logs, hideHeader: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[1.5rem] border border-white/10 bg-surface/30 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black font-display tracking-tight", children: t("dashboard.yourAchievements") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => navigate(routes.myAccount),
              className: "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-primary/30 hover:text-primary",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 }),
                t("gamification.viewAll")
              ]
            }
          )
        ] }),
        highlightedAchievements.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/40", children: t("dashboard.allCleared") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3", children: highlightedAchievements.map((achievement) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-2xl border p-4 ${achievement.earned ? "border-primary/30 bg-primary/5" : "border-white/10 bg-black/30 opacity-80"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5", children: achievement.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: safeUrl(achievement.image), alt: achievement.title, className: "h-6 w-6 object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 16, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-black tracking-tight", children: achievement.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-white/40", children: achievement.earned ? t("dashboard.unlocked") : t("account.locked") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 line-clamp-2", children: stripHtml(achievement.description) })
            ]
          },
          achievement.id
        )) })
      ] })
    ] })
  ] });
};
const DashboardPage = () => {
  const { user, loading } = useUser();
  const { t, i18n } = useTranslation();
  const currentLang = reactExports.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-16 h-16 text-primary animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-white/80", children: t("dashboard.loading") })
    ] }) });
  }
  if (!user?.isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: getLocalizedRoute("", currentLang), replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GamiPressProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardContent, {}) });
};
export {
  DashboardPage as default
};
//# sourceMappingURL=DashboardPage-CTwRbJ9x.js.map
