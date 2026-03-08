import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports } from "./vendor-CFCQ-ZJr.js";
import { u as useUser, k as Users, H as HeadlessSEO, d as Award, r as Clock } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { S as Star } from "./star-CaRtl2Cw.js";
import { S as Shield } from "./shield-XNTU4cFV.js";
import { T as TrendingUp } from "./trending-up-W9sh_7o0.js";
import { G as Gift } from "./gift-IUjGOuBb.js";
import { Z as Zap } from "./zap-BXTxIMT0.js";
const getOrganizationSchema = (t) => ({
  "@type": "Organization",
  "@id": "https://djzeneyer.com/zentribe#organization",
  "name": t("zenTribe.schema.organization_name"),
  "alternateName": "Tribo Zen",
  "url": "https://djzeneyer.com/zentribe",
  "founder": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "description": t("zenTribe.schema.organization_desc"),
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "slogan": t("zenTribe.schema.organization_slogan"),
  "knowsAbout": ["Brazilian Zouk Community", "DJ Zen Eyer Music", "Zouk Dance Culture"],
  "memberOf": {
    "@type": "Organization",
    "name": "International Brazilian Zouk Community"
  }
});
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};
const ACHIEVEMENTS_DATA = [
  { emoji: "🎧", titleKey: "zenTribe.achievements.firstTrack.title", descKey: "zenTribe.achievements.firstTrack.desc", unlocked: true },
  { emoji: "🚀", titleKey: "zenTribe.achievements.firstEvent.title", descKey: "zenTribe.achievements.firstEvent.desc", unlocked: true },
  { emoji: "🔍", titleKey: "zenTribe.achievements.collector.title", descKey: "zenTribe.achievements.collector.desc", unlocked: false },
  { emoji: "🦋", titleKey: "zenTribe.achievements.marketer.title", descKey: "zenTribe.achievements.marketer.desc", unlocked: false },
  { emoji: "🎪", titleKey: "zenTribe.achievements.legend.title", descKey: "zenTribe.achievements.legend.desc", unlocked: false },
  { emoji: "⏱️", titleKey: "zenTribe.achievements.streak.title", descKey: "zenTribe.achievements.streak.desc", unlocked: false }
];
const BenefitCard = reactExports.memo(({ icon, title, description, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    className: "card p-6 glow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
    variants: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
      }
    },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-full bg-${color}/20 flex items-center justify-center mb-4`, children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold mb-2", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: description })
    ]
  }
));
BenefitCard.displayName = "BenefitCard";
const MembershipCard = reactExports.memo(({ tier, user, t }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    className: `card overflow-hidden relative transition-all duration-300 hover:shadow-lg ${tier.popular ? "border-2 border-secondary" : ""}`,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: tier.popular ? 0 : 0.1 },
    children: [
      tier.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-sm font-medium", children: t("zenTribe.mostPopular") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 bg-${tier.color}/10`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-12 h-12 rounded-full bg-${tier.color}/20 flex items-center justify-center mb-4 text-${tier.color}`, children: tier.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-2 font-display", children: tier.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold", children: tier.price }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 mb-6", children: tier.features.map((feature, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-${tier.color} mr-2 mt-1`, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/80", children: feature })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `w-full btn ${tier.popular ? "btn-secondary" : "btn-outline"} transition-all duration-300 hover:scale-[1.02]`,
            "aria-label": `Join ${tier.name} membership`,
            children: user?.isLoggedIn ? t("zenTribe.upgradeNow") : t("zenTribe.joinNow")
          }
        )
      ] })
    ]
  }
));
MembershipCard.displayName = "MembershipCard";
const AchievementCard = reactExports.memo(({ emoji, title, description, unlocked, t }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-surface/50 rounded-lg p-4 transition-all duration-300 ${unlocked ? "hover:bg-surface/70" : "opacity-60"}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: emoji }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg mb-1", children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70", children: description }),
  unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-success flex items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12" }) }),
    t("zenTribe.unlocked")
  ] })
] }));
AchievementCard.displayName = "AchievementCard";
const ZenTribePage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const membershipTiers = [
    {
      name: t("zenTribe.tiers.novice.name"),
      price: t("zenTribe.tiers.novice.price"),
      features: [
        t("zenTribe.tiers.novice.feature1"),
        t("zenTribe.tiers.novice.feature2"),
        t("zenTribe.tiers.novice.feature3"),
        t("zenTribe.tiers.novice.feature4")
      ],
      color: "primary",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24, "aria-hidden": "true" }),
      popular: false
    },
    {
      name: t("zenTribe.tiers.voyager.name"),
      price: t("zenTribe.tiers.voyager.price"),
      features: [
        t("zenTribe.tiers.voyager.feature1"),
        t("zenTribe.tiers.voyager.feature2"),
        t("zenTribe.tiers.voyager.feature3"),
        t("zenTribe.tiers.voyager.feature4"),
        t("zenTribe.tiers.voyager.feature5")
      ],
      color: "secondary",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 24, "aria-hidden": "true" }),
      popular: true
    },
    {
      name: t("zenTribe.tiers.master.name"),
      price: t("zenTribe.tiers.master.price"),
      features: [
        t("zenTribe.tiers.master.feature1"),
        t("zenTribe.tiers.master.feature2"),
        t("zenTribe.tiers.master.feature3"),
        t("zenTribe.tiers.master.feature4"),
        t("zenTribe.tiers.master.feature5"),
        t("zenTribe.tiers.master.feature6")
      ],
      color: "accent",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 24, "aria-hidden": "true" }),
      popular: false
    }
  ];
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const currentPath = "/zentribe";
  const currentUrl = "https://djzeneyer.com" + currentPath;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("tribe_page_title"),
        description: t("tribe_page_meta_desc"),
        url: currentUrl,
        image: "https://djzeneyer.com/images/zen-tribe-og.jpg",
        ogType: "website",
        schema: getOrganizationSchema(t),
        keywords: "Zen Tribe, Tribo Zen, Brazilian Zouk community, DJ Zen Eyer membership, Zouk exclusive content, gamification, VIP events"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-24 min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface py-12 md:py-16", id: "tribe-intro", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "text-center",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm", children: t("zenTribe.badge") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display", children: [
              t("zenTribe.welcome"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("zenTribe.tribe") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl text-white/70 max-w-2xl mx-auto", children: t("zenTribe.subtitle") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "btn btn-primary transition-all duration-300 hover:scale-105",
                  onClick: () => scrollToSection("membership-tiers"),
                  "aria-label": t("zenTribe.aria.viewMemberships"),
                  children: t("zenTribe.viewMemberships")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "btn btn-outline transition-all duration-300 hover:scale-105",
                  onClick: () => scrollToSection("tribe-benefits"),
                  "aria-label": t("zenTribe.aria.learnMore"),
                  children: t("zenTribe.learnMore")
                }
              )
            ] })
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-background", id: "tribe-benefits", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.h2,
          {
            className: "text-2xl md:text-3xl font-bold mb-12 text-center font-display",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: t("zenTribe.whyJoin")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8",
            variants: CONTAINER_VARIANTS,
            initial: "hidden",
            animate: "visible",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BenefitCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "text-primary", size: 24, "aria-hidden": "true" }),
                  title: t("zenTribe.benefits.exclusiveMusic.title"),
                  description: t("zenTribe.benefits.exclusiveMusic.desc"),
                  color: "primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BenefitCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "text-secondary", size: 24, "aria-hidden": "true" }),
                  title: t("zenTribe.benefits.earlyAccess.title"),
                  description: t("zenTribe.benefits.earlyAccess.desc"),
                  color: "secondary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BenefitCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "text-accent", size: 24, "aria-hidden": "true" }),
                  title: t("zenTribe.benefits.vipStatus.title"),
                  description: t("zenTribe.benefits.vipStatus.desc"),
                  color: "accent"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                BenefitCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-success", size: 24, "aria-hidden": "true" }),
                  title: t("zenTribe.benefits.community.title"),
                  description: t("zenTribe.benefits.community.desc"),
                  color: "success"
                }
              )
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-surface", id: "membership-tiers", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold mb-4 font-display", children: t("zenTribe.chooseMembership") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl text-white/70 max-w-2xl mx-auto", children: t("zenTribe.selectTier") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8", children: membershipTiers.map((tier, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(MembershipCard, { tier, user, t }, index)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 bg-background", id: "achievement-system", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row items-start gap-8 lg:gap-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "lg:w-1/2",
            initial: { opacity: 0, x: -30 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-bold mb-6 font-display", children: t("zenTribe.levelUpTitle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/70 mb-8", children: t("zenTribe.levelUpDesc") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "text-primary mr-4 mt-1", size: 24 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display mb-2", children: t("zenTribe.xpTitle") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: t("zenTribe.xpDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "text-secondary mr-4 mt-1", size: 24 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display mb-2", children: t("zenTribe.badgesTitle") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: t("zenTribe.badgesDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "text-accent mr-4 mt-1", size: 24 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display mb-2", children: t("zenTribe.rewardsTitle") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: t("zenTribe.rewardsDesc") })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "text-success mr-4 mt-1", size: 24 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display mb-2", children: t("zenTribe.streaksTitle") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: t("zenTribe.streaksDesc") })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "lg:w-1/2 bg-surface rounded-xl p-8",
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5, delay: 0.2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-primary", size: 24 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display", children: t("zenTribe.achievementShowcase") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: ACHIEVEMENTS_DATA.map((achievement, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                AchievementCard,
                {
                  emoji: achievement.emoji,
                  title: t(achievement.titleKey),
                  description: t(achievement.descKey),
                  unlocked: achievement.unlocked,
                  t
                },
                index
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-display", children: t("zenTribe.currentLevel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl text-primary", children: "3" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-lg mb-4", children: t("zenTribe.zenApprentice") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 mb-2", children: t("zenTribe.progressToLevel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-background rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary rounded-full", style: { width: "87.5%" } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-right text-sm text-white/70 mt-1", children: "350/400 XP" })
              ] })
            ]
          }
        )
      ] }) }) })
    ] })
  ] });
};
export {
  ZenTribePage as default
};
//# sourceMappingURL=ZenTribePage-mrHYPeYm.js.map
