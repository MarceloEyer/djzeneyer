import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { H as HeadlessSEO, A as ARTIST, S as Sparkles, M as Music2 } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { H as Heart } from "./heart-CoZQZ5Kp.js";
import "./vendor-CFCQ-ZJr.js";
const PhilosophyPage = () => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: `${t("philosophy.page_title")} | ${ARTIST.identity.stageName}`,
        description: t("philosophy.coming_soon_desc", { name: ARTIST.identity.stageName })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-16 px-4 bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-4xl text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-16 h-16 mx-auto mb-6 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black font-display mb-8", children: t("philosophy.page_title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8 mb-16 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-8 bg-surface/50 border border-white/10 hover:border-primary/50 transition-all rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-10 h-10 text-primary mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-4 uppercase tracking-widest text-primary", children: t("philosophy.style_title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80 leading-relaxed italic", children: [
                '"',
                t("about.philosophy.quote"),
                '"'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-sm text-white/50", children: [
                "— ",
                ARTIST.identity.stageName
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-8 bg-surface/50 border border-white/10 hover:border-accent/50 transition-all rounded-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-10 h-10 text-accent mb-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-4 uppercase tracking-widest text-accent", children: t("philosophy.mission_title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 leading-relaxed", children: t("about.hero.subtitle") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-12 bg-white/5 border border-dashed border-white/10 rounded-3xl mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("philosophy.coming_soon_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 max-w-2xl mx-auto", children: t("philosophy.coming_soon_desc", { name: ARTIST.identity.stageName }) })
          ] })
        ]
      }
    ) }) })
  ] });
};
export {
  PhilosophyPage as default
};
//# sourceMappingURL=PhilosophyPage-DwWgo2rG.js.map
