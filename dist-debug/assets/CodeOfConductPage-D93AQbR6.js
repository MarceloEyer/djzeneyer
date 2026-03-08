import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { c as createLucideIcon, k as Users, x as Helmet, b as Mail } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { H as Heart } from "./heart-CoZQZ5Kp.js";
import { S as Shield } from "./shield-XNTU4cFV.js";
import { B as Ban } from "./ban-CodaoOad.js";
import "./vendor-CFCQ-ZJr.js";
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const CodeOfConductPage = () => {
  const { t } = useTranslation();
  const lastUpdated = t("conduct_page.last_updated_date");
  const principles = [
    {
      icon: Heart,
      title: t("conduct_page.respect_title"),
      description: t("conduct_page.respect_desc"),
      examples: [
        t("conduct_page.respect_inclusive"),
        t("conduct_page.respect_viewpoints"),
        t("conduct_page.respect_welcome"),
        t("conduct_page.respect_celebrate")
      ]
    },
    {
      icon: Users,
      title: t("conduct_page.community_title"),
      description: t("conduct_page.community_desc"),
      examples: [
        t("conduct_page.community_support"),
        t("conduct_page.community_share"),
        t("conduct_page.community_contribute"),
        t("conduct_page.community_maintain")
      ]
    },
    {
      icon: Shield,
      title: t("conduct_page.safety_title"),
      description: t("conduct_page.safety_desc"),
      examples: [
        t("conduct_page.safety_ask"),
        t("conduct_page.safety_boundaries"),
        t("conduct_page.safety_speak"),
        t("conduct_page.safety_report")
      ]
    }
  ];
  const prohibitedBehavior = [
    {
      title: t("conduct_page.harassment_title"),
      items: [
        t("conduct_page.harassment_1"),
        t("conduct_page.harassment_2"),
        t("conduct_page.harassment_3"),
        t("conduct_page.harassment_4")
      ]
    },
    {
      title: t("conduct_page.disruptive_title"),
      items: [
        t("conduct_page.disruptive_1"),
        t("conduct_page.disruptive_2"),
        t("conduct_page.disruptive_3"),
        t("conduct_page.disruptive_4")
      ]
    },
    {
      title: t("conduct_page.privacy_title"),
      items: [
        t("conduct_page.privacy_1"),
        t("conduct_page.privacy_2"),
        t("conduct_page.privacy_3"),
        t("conduct_page.privacy_4")
      ]
    }
  ];
  const consequences = [
    {
      level: t("conduct_page.consequence_first"),
      action: t("conduct_page.consequence_first_action"),
      description: t("conduct_page.consequence_first_desc")
    },
    {
      level: t("conduct_page.consequence_repeated"),
      action: t("conduct_page.consequence_repeated_action"),
      description: t("conduct_page.consequence_repeated_desc")
    },
    {
      level: t("conduct_page.consequence_severe"),
      action: t("conduct_page.consequence_severe_action"),
      description: t("conduct_page.consequence_severe_desc")
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
        t("conduct_page.title"),
        " | ",
        t("common.artist_name")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("conduct_page.subtitle") }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 40, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-display font-bold mb-4", children: t("conduct_page.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70", children: [
              t("conduct_page.last_updated"),
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: lastUpdated })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("conduct_page.commitment") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/80 leading-relaxed mb-4", children: t("conduct_page.commitment_intro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("conduct_page.commitment_participation") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "mb-12",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold mb-8 text-center", children: t("conduct_page.principles") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: principles.map((principle, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.3 + index * 0.1 },
                className: "card p-6 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(principle.icon, { size: 32, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3", children: principle.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-4 leading-relaxed", children: principle.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-left space-y-2", children: principle.examples.map((example, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-white/60", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "✓" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: example })
                  ] }, i)) })
                ]
              },
              index
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.6 },
          className: "mb-12",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 24, className: "text-red-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold", children: t("conduct_page.prohibited") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6", children: t("conduct_page.prohibited_intro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: prohibitedBehavior.map((category, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.7 + index * 0.1 },
                className: "card p-6 border-l-4 border-red-500/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-4 text-red-400", children: category.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: category.items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-white/70", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 mt-1", children: "×" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item })
                  ] }, i)) })
                ]
              },
              index
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1 },
          className: "card p-8 mb-8 bg-gradient-to-br from-primary/10 to-transparent",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold", children: t("conduct_page.reporting") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6 leading-relaxed", children: t("conduct_page.reporting_intro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white mb-2", children: t("conduct_page.reporting_how") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-white/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.reporting_events") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.reporting_online") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      t("conduct_page.reporting_email"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:conduct@djzeneyer.com", className: "text-primary hover:underline", children: "conduct@djzeneyer.com" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white mb-2", children: t("conduct_page.reporting_after") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-white/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "1." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.reporting_acknowledge") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "2." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.reporting_investigate") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "3." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.reporting_action") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "4." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.reporting_followup") })
                  ] })
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.1 },
          className: "mb-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold mb-6", children: t("conduct_page.enforcement") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6", children: t("conduct_page.enforcement_intro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: consequences.map((consequence, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 1.2 + index * 0.1 },
                className: "card p-6 flex items-start gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold", children: index + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg mb-1", children: consequence.level }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-semibold mb-2", children: consequence.action }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm", children: consequence.description })
                  ] })
                ]
              },
              index
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.5 },
          className: "card p-8 mb-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("conduct_page.scope") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed mb-4", children: t("conduct_page.scope_intro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-white/70", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.scope_events") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.scope_online") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.scope_website") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.scope_workshops") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("conduct_page.scope_representing") })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.6 },
          className: "card p-8 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 32, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("conduct_page.contact") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6", children: t("conduct_page.contact_intro") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "mailto:conduct@djzeneyer.com",
                className: "btn btn-primary btn-lg inline-flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20 }),
                  t("conduct_page.contact_button")
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.7 },
          className: "text-center text-white/50 text-sm mt-8 space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("conduct_page.acknowledgment") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-4 text-white/70", children: [
              t("conduct_page.together"),
              " 💙"
            ] })
          ]
        }
      )
    ] }) })
  ] });
};
export {
  CodeOfConductPage as default
};
//# sourceMappingURL=CodeOfConductPage-D93AQbR6.js.map
