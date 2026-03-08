import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { c as createLucideIcon, x as Helmet } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { C as CircleCheckBig } from "./circle-check-big-BWROkmEK.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
import { B as Ban } from "./ban-CodaoOad.js";
import { F as FileText } from "./file-text-CIKLAVyj.js";
import "./vendor-CFCQ-ZJr.js";
const __iconNode = [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["path", { d: "m19 8 3 8a5 5 0 0 1-6 0zV7", key: "zcdpyk" }],
  ["path", { d: "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1", key: "1yorad" }],
  ["path", { d: "m5 8 3 8a5 5 0 0 1-6 0zV7", key: "eua70x" }],
  ["path", { d: "M7 21h10", key: "1b0cd5" }]
];
const Scale = createLucideIcon("scale", __iconNode);
const TermsPage = () => {
  const { t } = useTranslation();
  const sections = [
    {
      icon: CircleCheckBig,
      title: t("legal.terms_page.acceptance"),
      content: t("legal.terms_page.acceptance_desc")
    },
    {
      icon: Scale,
      title: t("legal.terms_page.license"),
      content: t("legal.terms_page.license_desc")
    },
    {
      icon: CircleAlert,
      title: t("legal.terms_page.disclaimer"),
      content: t("legal.terms_page.disclaimer_desc")
    },
    {
      icon: Ban,
      title: t("legal.terms_page.limitations"),
      content: t("legal.terms_page.limitations_desc")
    }
  ];
  const additionalTerms = [
    {
      title: t("legal.terms_page.intellectual_property"),
      points: [
        t("legal.terms_page.ip_content"),
        t("legal.terms_page.ip_protected"),
        t("legal.terms_page.ip_unauthorized"),
        t("legal.terms_page.ip_reproduce")
      ]
    },
    {
      title: t("legal.terms_page.user_conduct"),
      points: [
        t("legal.terms_page.conduct_lawful"),
        t("legal.terms_page.conduct_access"),
        t("legal.terms_page.conduct_bots"),
        t("legal.terms_page.conduct_malware"),
        t("legal.terms_page.conduct_respect")
      ]
    },
    {
      title: t("legal.terms_page.purchases"),
      points: [
        t("legal.terms_page.purchases_availability"),
        t("legal.terms_page.purchases_prices"),
        t("legal.terms_page.purchases_cancel"),
        t("legal.terms_page.purchases_processing"),
        t("legal.terms_page.purchases_refunds")
      ]
    },
    {
      title: t("legal.terms_page.accounts"),
      points: [
        t("legal.terms_page.accounts_confidential"),
        t("legal.terms_page.accounts_responsibility"),
        t("legal.terms_page.accounts_accurate"),
        t("legal.terms_page.accounts_suspend"),
        t("legal.terms_page.accounts_notify")
      ]
    },
    {
      title: t("legal.terms_page.third_party_links"),
      points: [
        t("legal.terms_page.links_contain"),
        t("legal.terms_page.links_no_control"),
        t("legal.terms_page.links_no_endorsement"),
        t("legal.terms_page.links_risk"),
        t("legal.terms_page.links_review")
      ]
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
        t("legal.terms_page.title"),
        " | ",
        t("common.artist_name")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("legal.terms_page.subtitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "robots", content: "index, follow" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "text-center mb-12",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 40, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-display font-bold mb-4", children: [
              t("legal.terms_page.title").split(" ")[0],
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("legal.terms_page.title").split(" ").slice(1).join(" ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70", children: [
              t("legal.terms_page.last_updated"),
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: t("legal.terms_page.last_updated_date") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 },
          className: "card p-8 mb-8 border-l-4 border-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/80 leading-relaxed mb-4", children: t("legal.terms_page.introduction") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("legal.terms_page.introduction_agreement") })
          ]
        }
      ),
      sections.map((section, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 + index * 0.1 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(section.icon, { size: 24, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mt-1", children: `${index + 1}. ${section.title}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed ml-16", children: section.content })
          ]
        },
        index
      )),
      additionalTerms.map((term, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.6 + index * 0.1 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: `${index + 5}. ${term.title}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: term.points.map((point, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-1.5", children: "â€¢" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 leading-relaxed", children: point })
            ] }, i)) })
          ]
        },
        index
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.1 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-display font-bold mb-4", children: [
              "10. ",
              t("legal.terms_page.governing_law")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed mb-4", children: t("legal.terms_page.law_brazil") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("legal.terms_page.law_consent") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.2 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-display font-bold mb-4", children: [
              "11. ",
              t("legal.terms_page.modifications")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("legal.terms_page.modifications_desc") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.3 },
          className: "card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("legal.terms_page.questions") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6", children: t("legal.terms_page.questions_desc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: t("common.artist_name") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("legal.terms_page.contact_company") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                t("media_page.cnpj"),
                ": ",
                t("common.cnpj")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("legal.terms_page.contact_location") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "mailto:contact@djzeneyer.com",
                  className: "text-primary hover:underline inline-block mt-2",
                  children: "contact@djzeneyer.com"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.4 },
          className: "text-center text-white/50 text-sm mt-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("legal.terms_page.acceptance_footer") })
        }
      )
    ] }) })
  ] });
};
export {
  TermsPage as default
};
//# sourceMappingURL=TermsPage-DZSh4c0q.js.map
