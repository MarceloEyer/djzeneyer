import { j as jsxRuntimeExports } from "./motion-CwY3TCXX.js";
import { r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { n as normalizeLanguage, a2 as House, i as getLocalizedRoute, m as Music, C as Calendar, k as Users } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = reactExports.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block p-6 rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "64",
        height: "64",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "text-primary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9.1 4c-.5 0-.4.5-.4.5 0 .3.4.5.4.5l13.4 8c.4.3.6.8.3 1.1-.1.2-.3.3-.3.3l-13.1 8s-.7.5-1.2.2c-.5-.3-.5-.8-.5-.8V5.3s-.4-1.3.9-1.3h.5Z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6.1 4c-.5 0-.4.5-.4.5 0 .3.4.5.4.5l13.4 8c.4.3.6.8.3 1.1-.1.2-.3.3-.3.3l-13.1 8s-.7.5-1.2.2c-.5-.3-.5-.8-.5-.8V5.3s-.4-1.3.9-1.3h.5Z", opacity: ".5" })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-6xl font-bold mb-6 font-display", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold mb-4 font-display", children: t("not_found.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/70 mb-8", children: t("not_found.text") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: getLocalizedRoute("", currentLang),
          className: "card p-4 text-center hover:bg-white/5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "text-primary mb-2", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("not_found.home") })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: getLocalizedRoute("music", currentLang),
          className: "card p-4 text-center hover:bg-white/5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "text-secondary mb-2", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("not_found.music") })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: getLocalizedRoute("events", currentLang),
          className: "card p-4 text-center hover:bg-white/5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "text-accent mb-2", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("not_found.events") })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: getLocalizedRoute("zentribe", currentLang),
          className: "card p-4 text-center hover:bg-white/5 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-success mb-2", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("not_found.tribe") })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("", currentLang), className: "btn btn-primary px-8 py-3", children: t("not_found.cta") })
  ] }) }) });
};
export {
  NotFoundPage as default
};
//# sourceMappingURL=NotFoundPage-B7h318Lz.js.map
