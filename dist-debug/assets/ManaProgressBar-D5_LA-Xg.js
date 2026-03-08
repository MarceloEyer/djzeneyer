import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, u as useUser, V as useGamipressQuery, d as Award, n as normalizeLanguage, P as ShoppingBag, i as getLocalizedRoute, r as Clock, m as Music, C as Calendar } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { Z as Zap } from "./zap-BXTxIMT0.js";
import { T as TrendingUp } from "./trending-up-W9sh_7o0.js";
import { S as Star } from "./star-CaRtl2Cw.js";
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
const FALLBACK = {
  user_id: 0,
  points: {
    points: { name: "XP", amount: 0, image: "" }
  },
  rank: {
    current: {
      id: 0,
      title: "Zen Novice",
      image: ""
    },
    progress: 0,
    requirements: [],
    next: null
  },
  achievements_earned: [],
  achievements_locked: [],
  recent_achievements: [],
  logs: [],
  stats: {
    totalTracks: 0,
    eventsAttended: 0,
    streak: 0,
    streakFire: false
  },
  main_points_slug: "points",
  lastUpdate: "",
  version: "1.1.0"
};
const useGamiPress = () => {
  const { user } = useUser();
  const { data, isLoading, error, refetch } = useGamipressQuery(user?.id, user?.token);
  const resolved = data ?? FALLBACK;
  return {
    data: resolved,
    loading: isLoading,
    error: error ? error.message : null,
    refresh: () => {
      refetch();
    },
    // Legacy mapping (uses dynamic slug from backend)
    mainPoints: resolved.points[resolved.main_points_slug]?.amount ?? 0,
    currentRank: resolved.rank.current.title
  };
};
const GamiPressContext = reactExports.createContext(void 0);
const GamiPressProvider = ({ children }) => {
  const gamipress = useGamiPress();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GamiPressContext.Provider, { value: gamipress, children });
};
const useGamiPressContext = () => {
  const ctx = reactExports.useContext(GamiPressContext);
  if (!ctx) {
    throw new Error("useGamiPressContext must be used within a GamiPressProvider");
  }
  return ctx;
};
const UserStatsCards = reactExports.memo(({ stats }) => {
  const { t } = useTranslation();
  const cardVariants = {
    hover: { y: -5, transition: { type: "spring", stiffness: 400, damping: 10 } }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        variants: cardVariants,
        whileHover: "hover",
        className: "relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-7 border border-primary/10 hover:border-primary/40 transition-all group shadow-xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 text-primary group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 48, fill: "currentColor" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "text-primary", size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-[0.2em] text-white/40 font-display", children: t("account.stats.level_title") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-black text-white font-display tracking-tighter mb-1", children: t("account.stats.level_value", { level: stats.level }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--color-primary),0.8)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-black uppercase tracking-widest text-primary/80", children: stats.rank })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        variants: cardVariants,
        whileHover: "hover",
        className: "relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-7 border border-secondary/10 hover:border-secondary/40 transition-all group shadow-xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 text-secondary group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 48, fill: "currentColor" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--color-secondary),0.3)] transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "text-secondary", size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-[0.2em] text-white/40 font-display", children: t("account.stats.xp_title") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-black text-white font-display tracking-tighter mb-1", children: [
              stats.xp.toLocaleString(),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-secondary/70", children: "XP" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-white/30 uppercase tracking-widest leading-none", children: stats.xpToNext > 0 ? t("account.stats.xp_to_next_rank", { count: stats.xpToNext }) : t("account.stats.xp_max") })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        variants: cardVariants,
        whileHover: "hover",
        className: "relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-7 border border-accent/10 hover:border-accent/40 transition-all group shadow-xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 text-accent group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 48, fill: "currentColor" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.3)] transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "text-accent", size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-black uppercase tracking-[0.2em] text-white/40 font-display", children: t("account.stats.achievements_title") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-black text-white font-display tracking-tighter mb-1", children: stats.totalAchievements }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-white/30 uppercase tracking-widest leading-none", children: stats.recentAchievements > 0 ? t("account.stats.unlocked_recently", { count: stats.recentAchievements }) : t("account.stats.keep_exploring") })
          ] })
        ]
      }
    )
  ] });
});
UserStatsCards.displayName = "UserStatsCards";
const OrdersList = reactExports.memo(({ orders, loading }) => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const getOrderStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-success/20 text-success";
      case "processing":
        return "bg-warning/20 text-warning";
      case "failed":
        return "bg-error/20 text-error";
      default:
        return "bg-white/20 text-white/70";
    }
  };
  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat(i18n.language.startsWith("pt") ? "pt-BR" : "en-US", {
      style: "currency",
      currency: "BRL"
    }).format(numValue);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("account.orders.loading") })
    ] });
  }
  if (orders.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mx-auto mb-4 text-white/30", size: 64 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold mb-3", children: t("account.orders.no_orders") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mb-8 max-w-md mx-auto", children: t("account.orders.no_orders_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("shop", currentLang), className: "btn btn-primary", children: t("account.orders.browse_shop") })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: t("account.orders.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("shop", currentLang), className: "btn btn-primary", children: t("account.orders.continue_shopping") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/30 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: t("account.orders.order_number", { id: order.id }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60", children: new Date(order.date_created).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: formatCurrency(order.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}`, children: t(`account.orders.status.${order.status}`, { defaultValue: order.status }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: order.line_items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm border-t border-white/5 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/80", children: [
              item.name,
              " x",
              item.quantity
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatCurrency(item.total) })
          ] }, index)) })
        ]
      },
      order.id
    )) })
  ] });
});
OrdersList.displayName = "OrdersList";
const RecentActivity = reactExports.memo(({ logs, hideHeader = false }) => {
  const { t, i18n } = useTranslation();
  const hasLogs = logs && logs.length > 0;
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(i18n.language === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    } catch {
      return dateString;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${!hideHeader ? "bg-surface/50 rounded-lg p-6 border border-white/10" : ""}`, children: [
    !hideHeader && /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-semibold mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "text-primary", size: 20 }),
      t("dashboard.recentActivity")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: hasLogs ? logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-lg ${log.points >= 0 ? "bg-success/10 text-success" : "bg-red-500/10 text-red-400"}`, children: log.points >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate group-hover:text-primary transition-colors", children: log.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
              " ",
              formatDate(log.date)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-mono font-bold ${log.points >= 0 ? "text-success" : "text-red-400"}`, children: [
            log.points >= 0 ? "+" : "",
            log.points
          ] })
        ]
      },
      log.id
    )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-white/5 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "text-primary", size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: t("dashboard.welcomeTribe") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60", children: t("dashboard.journeyBegins") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-white/5 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "text-accent", size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: t("dashboard.accountCreated") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60", children: t("dashboard.startExploring") })
        ] })
      ] })
    ] }) })
  ] });
});
RecentActivity.displayName = "RecentActivity";
const toPercent = (value) => {
  if (!Number.isFinite(value)) return 0;
  return value > 0 && value <= 1 ? value * 100 : value;
};
const ManaProgressBar = ({
  progress,
  label,
  subLabel
}) => {
  const parsedProgress = parseFloat(String(progress));
  const clampedProgress = Math.min(100, Math.max(0, toPercent(parsedProgress)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full select-none group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-end justify-between px-0.5", children: [
      (label || subLabel) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
        label && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-[10px] font-black uppercase tracking-[0.25em] text-white/30 transition-colors group-hover:text-primary/60", children: label }),
        subLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 font-display text-sm font-bold tracking-tight text-white/90 transition-colors group-hover:text-white", children: subLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg font-black tabular-nums text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.4)]", children: [
        Math.round(clampedProgress),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-4 w-full overflow-hidden rounded-full border border-white/10 bg-[#0a0f16] p-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/10 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { width: 0 },
          animate: { width: `${clampedProgress}%` },
          transition: { type: "spring", stiffness: 70, damping: 20 },
          className: "relative h-full overflow-hidden rounded-full bg-primary transition-all duration-700 group-hover:brightness-125",
          style: {
            boxShadow: "inset 0 0 8px rgba(255,255,255,0.4), 0 0 15px rgba(var(--color-primary),0.5)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 z-10 h-[45%] bg-white/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" }),
            clampedProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { left: "-100%" },
                animate: { left: "200%" },
                transition: { repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 },
                className: "absolute top-0 bottom-0 z-20 w-32 skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md"
              }
            ),
            clampedProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-0 z-30 h-full w-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-gradient-to-l from-white via-cyan-200 to-transparent blur-[1px]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-[-2px] top-1/2 h-6 w-4 -translate-y-1/2 animate-pulse rounded-full bg-cyan-300/40 blur-xl" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 opacity-[0.1] [background:repeating-linear-gradient(90deg,transparent,transparent_19px,black_20px)]" })
          ]
        }
      )
    ] })
  ] });
};
export {
  GamiPressProvider as G,
  ManaProgressBar as M,
  OrdersList as O,
  RecentActivity as R,
  UserStatsCards as U,
  useGamiPressContext as u
};
//# sourceMappingURL=ManaProgressBar-D5_LA-Xg.js.map
