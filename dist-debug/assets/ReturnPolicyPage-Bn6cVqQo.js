import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { H as HeadlessSEO, A as ARTIST } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import "./vendor-CFCQ-ZJr.js";
const ReturnPolicyPage = () => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("legal.return_policy.page_title"),
        description: t("legal.return_policy.page_meta_desc"),
        isHomepage: false
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-20 bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.article,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "prose prose-invert prose-lg max-w-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl mb-8", children: t("legal.return_policy.h1") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 bg-surface border border-white/10 rounded-xl mb-10 text-white/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: t("legal.return_policy.intro") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t("legal.return_policy.digital_title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("legal.return_policy.digital_text") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t("legal.return_policy.tickets_title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("legal.return_policy.tickets_text") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: t("legal.return_policy.cancellations_label") }),
              " ",
              t("legal.return_policy.cancellations_text")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: t("legal.return_policy.transfers_label") }),
              " ",
              t("legal.return_policy.transfers_text")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: t("legal.return_policy.rescheduling_label") }),
              " ",
              t("legal.return_policy.rescheduling_text")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t("legal.return_policy.merch_title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("legal.return_policy.merch_text") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("legal.return_policy.merch_c1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("legal.return_policy.merch_c2") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: t("legal.return_policy.merch_c3") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t("legal.return_policy.request_title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            t("legal.return_policy.request_text"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ARTIST.contact.email }),
            " ",
            t("legal.return_policy.request_text_2")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 pt-8 border-t border-white/10 text-sm text-white/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            t("legal.return_policy.last_updated"),
            ": ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: t("legal.return_policy.last_updated_date") })
          ] }) })
        ]
      }
    ) }) })
  ] });
};
export {
  ReturnPolicyPage as default
};
//# sourceMappingURL=ReturnPolicyPage-Bn6cVqQo.js.map
