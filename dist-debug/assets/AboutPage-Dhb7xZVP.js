import { u as useReducedMotion, j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports } from "./vendor-CFCQ-ZJr.js";
import { j as ARTIST_SCHEMA_BASE, A as ARTIST, M as Music2, T as Trophy, k as Users, G as Globe, H as HeadlessSEO, S as Sparkles, s as sanitizeHtml, b as Mail, g as getWhatsAppUrl } from "./index-Cac5tBAe.js";
import { u as useTranslation, T as Trans } from "./i18n-ti7dkFnK.js";
import { H as Heart } from "./heart-CoZQZ5Kp.js";
import { B as Brain } from "./brain-BVbsCg5A.js";
import { S as Star } from "./star-CaRtl2Cw.js";
const AboutPage = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const currentPath = "/about";
  const currentUrl = `${ARTIST.site.baseUrl}${currentPath}`;
  const ABOUT_SCHEMA = reactExports.useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        ...ARTIST_SCHEMA_BASE
      },
      {
        "@type": "WebPage",
        "@id": `${ARTIST.site.baseUrl}/about#webpage`,
        url: `${ARTIST.site.baseUrl}/about`,
        name: t("about.seo.name"),
        description: t("about.seo.description"),
        isPartOf: { "@id": `${ARTIST.site.baseUrl}/#website` },
        about: { "@id": `${ARTIST.site.baseUrl}/#artist` }
      }
    ]
  }), [t]);
  const MILESTONES = reactExports.useMemo(() => [
    {
      year: "2005-2010",
      title: t("about.timeline.m1.title"),
      description: t("about.timeline.m1.desc"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-8 h-8 text-white" }),
      color: "bg-gradient-to-br from-red-500 to-pink-600"
    },
    {
      year: "2012",
      title: t("about.timeline.m2.title"),
      description: t("about.timeline.m2.desc"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-8 h-8 text-white" }),
      color: "bg-gradient-to-br from-purple-500 to-indigo-600"
    },
    {
      year: "2015-2019",
      title: t("about.timeline.m3.title"),
      description: t("about.timeline.m3.desc"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-8 h-8 text-white" }),
      color: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      year: "2022",
      title: t("about.timeline.m4.title"),
      description: t("about.timeline.m4.desc"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-8 h-8 text-white" }),
      color: "bg-gradient-to-br from-yellow-500 to-amber-600"
    }
  ], [t]);
  const ACHIEVEMENTS_DATA = reactExports.useMemo(() => [
    {
      label: t("about.stats.passion"),
      value: t("about.stats.passion_value"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
    },
    {
      label: t("about.stats.events"),
      value: t("about.stats.events_value"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
    },
    {
      label: t("about.stats.stories"),
      value: t("about.stats.stories_value"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
    },
    {
      label: t("about.stats.smiles"),
      value: t("about.stats.smiles_value"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
    }
  ], [t]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("about.seo.title"),
        description: t("about.seo.description"),
        url: currentUrl,
        image: `${ARTIST.site.baseUrl}/images/artist/dj-zen-eyer-nature-portrait.jpg`,
        type: "profile",
        schema: ABOUT_SCHEMA,
        keywords: t("about.seo.keywords"),
        leadAnswer: t("about.seo.lead_answer")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-32 pb-20 px-4 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/10 via-surface/10 to-accent/10 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            className: "text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: { delay: 0.2, duration: 0.6 },
                  className: "inline-block mb-4",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "inline-block mr-2", size: 16 }),
                    t("about.hero.badge")
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-7xl font-black font-display mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "about.hero.title", children: [
                "A ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text", children: "Jornada" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed", children: t("about.hero.subtitle") })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: ACHIEVEMENTS_DATA.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
          transition: { delay: index * 0.1 },
          className: "bg-surface/50 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all",
          children: [
            item.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl md:text-4xl font-bold text-gradient mb-2", children: item.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 text-sm", children: item.label })
          ]
        },
        index
      )) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          className: "space-y-6 text-lg text-white/80 leading-relaxed",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("about.story.p1")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("about.story.p2")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("about.story.p3")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("about.story.p4")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("about.story.p5")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-semibold", dangerouslySetInnerHTML: { __html: sanitizeHtml(t("about.story.p6")) } })
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-4 bg-surface/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-5xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.h2,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "text-4xl md:text-5xl font-display font-bold text-center mb-16",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "about.timeline.title", children: [
              "Momentos que ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Mudaram Tudo" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-12", children: MILESTONES.map((milestone, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 },
            whileInView: prefersReducedMotion ? void 0 : { opacity: 1, y: 0, scale: 1 },
            viewport: { once: true, margin: "-50px" },
            transition: prefersReducedMotion ? void 0 : { duration: 0.35, delay: index * 0.06, ease: "easeOut" },
            className: "relative",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card p-6 md:p-8 hover:border-primary/50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex-shrink-0 w-16 h-16 rounded-full ${milestone.color} flex items-center justify-center`,
                  children: milestone.icon
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary font-bold mb-2", children: milestone.year }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display font-bold mb-3", children: milestone.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: milestone.description })
              ] })
            ] }) })
          },
          index
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          className: "card p-8 md:p-12 text-center bg-surface/50 rounded-2xl border border-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-16 h-16 mx-auto mb-6 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "about.philosophy.title", children: [
              "Minha ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Filosofia" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/80 leading-relaxed italic", children: t("about.philosophy.quote") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-white/60 font-semibold", children: [
              "- ",
              ARTIST.identity.stageName
            ] })
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.8 },
          className: "bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-10 md:p-12 border border-primary/30 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-12 h-12 mx-auto mb-6 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "about.cta.title", children: [
              "Vamos ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Conversar?" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/80 mb-8 max-w-2xl mx-auto", children: t("about.cta.desc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.a,
              {
                href: getWhatsAppUrl(t("about.cta.whatsapp_msg")),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "btn btn-primary btn-lg inline-flex items-center gap-3",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5" }),
                  t("about.cta.button")
                ]
              }
            )
          ]
        }
      ) }) })
    ] })
  ] });
};
export {
  AboutPage as default
};
//# sourceMappingURL=AboutPage-Dhb7xZVP.js.map
