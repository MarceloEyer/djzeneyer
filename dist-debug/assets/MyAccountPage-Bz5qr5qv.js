import { j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./motion-CwY3TCXX.js";
import { r as reactExports, c as useNavigate, i as useSearchParams } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, F as useTracksQuery, m as Music, l as safeUrl, D as Download, E as ExternalLink, u as useUser, n as normalizeLanguage, i as getLocalizedRoute, J as useProfileQuery, K as useNewsletterStatusQuery, L as useUpdateProfileMutation, N as useUpdateNewsletterMutation, O as useUserOrdersQuery, U as User, P as ShoppingBag, d as Award, Q as Settings, x as Helmet, z as ChevronRight, I as Instagram, R as LogOut, T as Trophy } from "./index-Cac5tBAe.js";
import { G as GamiPressProvider, u as useGamiPressContext, M as ManaProgressBar, O as OrdersList, U as UserStatsCards, R as RecentActivity } from "./ManaProgressBar-D5_LA-Xg.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { P as Play } from "./play-CjRq6fsI.js";
import { s as stripHtml } from "./text-DgctY_bk.js";
import { L as LoaderCircle } from "./loader-circle-DTVp4yA4.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
import { Z as Zap } from "./zap-BXTxIMT0.js";
import "./trending-up-W9sh_7o0.js";
import "./star-CaRtl2Cw.js";
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const MusicCollection = () => {
  const { t } = useTranslation();
  const { data: tracks, isLoading } = useTracksQuery();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "text-white/10 mb-4", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 font-black uppercase tracking-[0.3em] text-xs font-display", children: t("loading") })
    ] });
  }
  const displayTracks = tracks?.slice(0, 6) || [];
  if (displayTracks.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 bg-black/20 rounded-[2rem] border border-white/5 shadow-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "mx-auto mb-4 text-white/10", size: 64 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black font-display mb-3 tracking-tighter", children: t("account.music.empty_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mb-8 max-w-sm mx-auto font-medium", children: t("account.music.empty_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs", children: t("account.music.explore") })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: displayTracks.map((track) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        whileHover: { y: -4, backgroundColor: "rgba(255, 255, 255, 0.05)" },
        className: "group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all shadow-lg overflow-hidden relative",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/10", children: [
            track.featured_image_src ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: safeUrl(track.featured_image_src), alt: track.title.rendered, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-surface-dark flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "text-white/20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 24, className: "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black font-display text-white truncate text-lg tracking-tight mb-1 group-hover:text-primary transition-colors", children: track.title.rendered }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate", children: track.category_name || "Remix" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-4", children: [
              track.links.download && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2.5 rounded-lg bg-white/5 hover:bg-primary/20 text-white/40 hover:text-primary transition-all border border-white/5", title: "Download", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5", title: "View Hub", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16 }) })
            ] })
          ] })
        ]
      },
      track.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 rounded-[2rem] p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black font-display mb-2 tracking-tight", children: "Expand Your Library" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-medium", children: "Discover hundreds of non-stop remixes and high-fidelity sets." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl", children: "Full Steam Hub" })
    ] })
  ] });
};
const MyAccountContent = () => {
  const { t, i18n } = useTranslation();
  const { user, loading, logout } = useUser();
  const currentLang = reactExports.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = reactExports.useState(initialTab);
  const { data: gamipress, loading: loadingGP, error: errorGP } = useGamiPressContext();
  reactExports.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };
  const [profileForm, setProfileForm] = reactExports.useState({
    realName: user?.name || "",
    preferredName: "",
    facebookUrl: "",
    instagramUrl: "",
    danceRole: [],
    gender: ""
  });
  const [savingProfile, setSavingProfile] = reactExports.useState(false);
  const [profileSaved, setProfileSaved] = reactExports.useState(false);
  const userStats = reactExports.useMemo(() => {
    if (!user || !gamipress) {
      return {
        level: 0,
        xp: 0,
        rank: t("dashboard.rank_new_member"),
        xpToNext: 0,
        totalAchievements: 0,
        recentAchievements: 0
      };
    }
    const mainPoints = gamipress.points.points?.amount || 0;
    const currentRank = gamipress.rank.current.title || t("dashboard.rank_zen_novice");
    const level = Math.floor(mainPoints / 100) + 1;
    const xpToNext = gamipress.rank.next ? 100 - mainPoints % 100 : 0;
    const totalAchievements = gamipress.achievements_earned.length;
    const recentAchievements = gamipress.recent_achievements.length;
    return {
      level,
      xp: mainPoints,
      rank: currentRank,
      xpToNext,
      totalAchievements,
      recentAchievements
    };
  }, [user, gamipress, t]);
  reactExports.useEffect(() => {
    if (!loading && !loadingGP && !user?.isLoggedIn) {
      navigate(getLocalizedRoute("", currentLang));
    }
  }, [user, loading, loadingGP, navigate, currentLang]);
  const { data: profileData } = useProfileQuery(user?.token);
  const { data: newsletterEnabled } = useNewsletterStatusQuery(user?.token);
  const updateProfile = useUpdateProfileMutation(user?.token);
  const updateNewsletter = useUpdateNewsletterMutation(user?.token);
  const { data: orders = [], isLoading: loadingOrders } = useUserOrdersQuery(user?.id, user?.token, 5);
  reactExports.useEffect(() => {
    if (profileData) {
      setProfileForm({
        realName: profileData.real_name || user?.name || "",
        preferredName: profileData.preferred_name || "",
        facebookUrl: profileData.facebook_url || "",
        instagramUrl: profileData.instagram_url || "",
        danceRole: profileData.dance_role || [],
        gender: profileData.gender || ""
      });
    }
  }, [profileData, user?.name]);
  const handleLogout = async () => {
    try {
      await logout();
      navigate(getLocalizedRoute("", currentLang));
    } catch (error) {
      console.error("[MyAccountPage] Erro no logout:", error);
      navigate(getLocalizedRoute("", currentLang));
    }
  };
  if (loading || user?.isLoggedIn && loadingGP) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center pt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-16 h-16 text-primary animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black font-display uppercase tracking-widest", children: t("account.loading") })
    ] }) });
  }
  if (errorGP && user?.isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-16 h-16 text-red-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold text-white/90 mb-2", children: t("dashboard.error_loading") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40 mb-6", children: errorGP }),
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
  if (!user?.isLoggedIn || !gamipress) return null;
  const tabs = [
    { id: "overview", label: t("account.tabs.overview"), icon: User, color: "primary" },
    { id: "orders", label: t("account.tabs.orders"), icon: ShoppingBag, color: "secondary" },
    { id: "achievements", label: t("account.tabs.achievements"), icon: Award, color: "accent" },
    { id: "music", label: t("account.tabs.music"), icon: Music, color: "primary" },
    { id: "settings", label: t("account.tabs.settings"), icon: Settings, color: "secondary" }
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-[2rem] p-10 border border-primary/10 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 100, fill: "currentColor", className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-black font-display mb-4 tracking-tighter", children: [
              t("dashboard.welcomeBack", { name: user?.display_name || user?.name || t("common.friend") }),
              " ðŸ‘‹"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/50 text-lg font-medium tracking-tight max-w-xl", children: [
              t("dashboard.journeyBegins"),
              " ",
              t("dashboard.diveDeep")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            gamipress.rank.next && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.2 },
                className: "bg-surface/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-2xl overflow-hidden relative group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 100, fill: "currentColor" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ManaProgressBar,
                    {
                      progress: gamipress.rank.progress,
                      label: t("dashboard.nextRank"),
                      subLabel: gamipress.rank.next.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: gamipress.rank.requirements.slice(0, 3).map((req, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-black uppercase tracking-widest text-white/40", children: [
                      req.title,
                      ":"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-white/90", children: [
                      req.current,
                      "/",
                      req.required
                    ] })
                  ] }, idx)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserStatsCards, { stats: userStats })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-10 border-white/5 bg-surface/30 backdrop-blur-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-black font-display mb-10 tracking-tight flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-8 bg-primary rounded-full" }),
              t("dashboard.recentActivity")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RecentActivity, { logs: gamipress.logs })
          ] })
        ] });
      case "orders":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersList, { orders, loading: loadingOrders });
      case "achievements":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black font-display tracking-tighter leading-none mb-2", children: t("dashboard.yourAchievements") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 text-[10px] font-black uppercase tracking-[0.3em]", children: t("account.profile.milestones", { count: gamipress.achievements_earned.length }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/20 text-primary px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-primary/20", children: [
              gamipress.achievements_earned.length,
              " / ",
              gamipress.achievements_earned.length + gamipress.achievements_locked.length
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [...gamipress.achievements_earned, ...gamipress.achievements_locked].map((ach) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              whileHover: { y: -5, scale: 1.02 },
              className: `relative rounded-[2rem] p-8 border transition-all duration-500 overflow-hidden ${ach.earned ? "bg-surface/50 border-primary/20 shadow-xl" : "bg-black/40 border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-20 h-20 rounded-2xl mb-6 flex items-center justify-center ${ach?.earned ? "bg-primary/10" : "bg-white/5"}`, children: ach?.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: safeUrl(ach.image), className: "w-12 h-12 object-contain", alt: ach?.title || t("gamification.achievement") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 32 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black font-display text-xl mb-3 tracking-tight", children: ach?.title || t("account.achievement_unknown") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40 mb-6 leading-relaxed", children: ach?.description ? stripHtml(ach.description) : "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${ach?.earned ? "bg-success/10 border-success/20 text-success" : "bg-white/5 border-white/10 text-white/30"}`, children: ach?.earned ? t("dashboard.unlocked") : t("account.locked") })
              ] })
            },
            ach.id
          )) }),
          gamipress.rank.next && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 mt-12 shadow-2xl overflow-hidden relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 150, fill: "currentColor" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ManaProgressBar,
              {
                progress: gamipress.rank.progress,
                label: t("dashboard.nextRank"),
                subLabel: gamipress.rank.next.title
              }
            )
          ] })
        ] });
      case "music":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MusicCollection, {});
      case "settings": {
        const handleProfileChange = (field, value) => {
          setProfileForm((prev) => ({ ...prev, [field]: value }));
          setProfileSaved(false);
        };
        const handleSaveProfile = async () => {
          setSavingProfile(true);
          try {
            await updateProfile.mutateAsync({
              real_name: profileForm.realName,
              preferred_name: profileForm.preferredName,
              facebook_url: profileForm.facebookUrl,
              instagram_url: profileForm.instagramUrl,
              dance_role: profileForm.danceRole,
              gender: profileForm.gender
            });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3e3);
          } catch (error) {
            console.error("[MyAccountPage] Error saving profile:", error);
          } finally {
            setSavingProfile(false);
          }
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black font-display tracking-tighter mb-10", children: t("account.tabs.settings") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "text-primary", size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black font-display tracking-tight uppercase", children: t("account.profile.identity") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3 ml-1", children: t("account.profile.real_name") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: profileForm.realName,
                      onChange: (e) => handleProfileChange("realName", e.target.value),
                      className: "input bg-black/40 border-white/5 focus:border-primary/50 py-4 px-6 rounded-2xl font-medium",
                      placeholder: t("account.profile.real_name")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3 ml-1", children: t("account.profile.preferred_name") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: profileForm.preferredName,
                      onChange: (e) => handleProfileChange("preferredName", e.target.value),
                      className: "input bg-black/40 border-white/5 focus:border-primary/50 py-4 px-6 rounded-2xl font-medium",
                      placeholder: t("account.profile.preferred_name")
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-secondary/10 border border-secondary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "text-secondary", size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black font-display tracking-tight uppercase", children: t("account.profile.social") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: profileForm.instagramUrl,
                      onChange: (e) => handleProfileChange("instagramUrl", e.target.value),
                      className: "input bg-black/40 border-white/5 focus:border-secondary/50 py-4 px-5 rounded-2xl text-sm",
                      placeholder: t("account.profile.instagram_placeholder")
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: profileForm.facebookUrl,
                      onChange: (e) => handleProfileChange("facebookUrl", e.target.value),
                      className: "input bg-black/40 border-white/5 focus:border-secondary/50 py-4 px-5 rounded-2xl text-sm",
                      placeholder: t("account.profile.facebook_placeholder")
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-4 ml-1", children: t("account.profile.dance_role") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["leader", "follower"].map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleProfileChange("danceRole", profileForm.danceRole.includes(role) ? [] : [role]),
                      className: `flex-1 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border transition-all ${profileForm.danceRole.includes(role) ? "bg-primary border-primary shadow-neon" : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"}`,
                      children: t(`account.profile.${role}`)
                    },
                    role
                  )) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 backdrop-blur-xl rounded-[2rem] p-10 border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-[1.5rem] bg-accent/10 flex items-center justify-center border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "text-accent", size: 32 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-black font-display tracking-tight mb-2", children: t("account.newsletter.title") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-medium", children: t("account.newsletter.desc") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-white/20", children: newsletterEnabled ? t("account.newsletter.enabled") : t("account.newsletter.disabled") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => updateNewsletter.mutate(!newsletterEnabled),
                  className: `w-14 h-8 rounded-full relative transition-colors ${newsletterEnabled ? "bg-primary" : "bg-white/10"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { x: newsletterEnabled ? 28 : 4 },
                      className: "absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleSaveProfile,
                disabled: savingProfile,
                className: "btn btn-primary px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center gap-4 group",
                children: [
                  savingProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
                  profileSaved ? t("account.profile.success") : t("account.profile.save")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleLogout,
                className: "btn bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/5 hover:border-red-500/30 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18, className: "mr-3" }),
                  t("nav.logout")
                ]
              }
            )
          ] })
        ] });
      }
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: t("account.tabs.not_found") });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: t("account.meta_title", { stageName: t("common.artist_name") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("account.meta_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-16 bg-background selection:bg-primary selection:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-12 mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:w-1/4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/5 border-b-white/10 sticky top-28 shadow-2xl overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-2 bg-gradient-to-tr from-primary via-secondary to-accent rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`,
                className: "relative w-32 h-32 rounded-full border-4 border-surface shadow-2xl object-cover",
                alt: user.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black font-display tracking-tight mb-2 truncate px-2", children: user.display_name || user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary shadow-neon shadow-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-primary/80", children: userStats.rank })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-3 relative z-10", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleTabChange(tab.id),
            className: `w-full flex items-center justify-between px-6 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all group/btn ${activeTab === tab.id ? "bg-primary text-white shadow-neon shadow-primary/20 scale-105" : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 20, className: activeTab === tab.id ? "text-white" : "text-white/20 group-hover/btn:text-white transition-colors" }),
                tab.label
              ] }),
              activeTab === tab.id && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-white/50" })
            ]
          },
          tab.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 pt-8 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-white/20 transition-colors", children: "Zen Tribe v2.1.0 Â· 2026" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "lg:flex-1 min-h-[700px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.4, ease: "circOut" },
          children: renderTabContent()
        },
        activeTab
      ) }) })
    ] }) }) })
  ] });
};
const MyAccountPage = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GamiPressProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MyAccountContent, {}) });
};
export {
  MyAccountPage as default
};
//# sourceMappingURL=MyAccountPage-Bz5qr5qv.js.map
