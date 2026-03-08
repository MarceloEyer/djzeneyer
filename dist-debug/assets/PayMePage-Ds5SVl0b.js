import { j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./motion-CwY3TCXX.js";
import { r as reactExports } from "./vendor-CFCQ-ZJr.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { C as CreditCard } from "./credit-card-iwRDF_6I.js";
import { c as createLucideIcon, a1 as Briefcase, G as Globe } from "./index-Cac5tBAe.js";
import { H as Heart } from "./heart-CoZQZ5Kp.js";
import { Z as Zap } from "./zap-BXTxIMT0.js";
const __iconNode$2 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 18v-7", key: "wt116b" }],
  [
    "path",
    {
      d: "M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",
      key: "1m329m"
    }
  ],
  ["path", { d: "M14 18v-7", key: "vav6t3" }],
  ["path", { d: "M18 18v-7", key: "aexdmj" }],
  ["path", { d: "M3 22h18", key: "8prr45" }],
  ["path", { d: "M6 18v-7", key: "1ivflk" }]
];
const Landmark = createLucideIcon("landmark", __iconNode);
const paymentMethods = [
  {
    id: "pix",
    type: "pix",
    titleKey: "payme.methods.pix.title",
    descriptionKey: "payme.methods.pix.desc",
    category: "both",
    details: [
      { labelKey: "payme.fields.pix_key", value: "djzeneyer@gmail.com", copyable: true },
      { labelKey: "payme.fields.name", value: "Marcelo Eyer", copyable: false }
    ]
  },
  {
    id: "inter-brl",
    type: "bank",
    titleKey: "payme.methods.inter_brl.title",
    descriptionKey: "payme.methods.inter_brl.desc",
    category: "both",
    details: [
      { labelKey: "payme.fields.bank", value: "Banco Inter (077)", copyable: false },
      { labelKey: "payme.fields.agency", value: "0001", copyable: true },
      { labelKey: "payme.fields.account", value: "1234567-8", copyable: true },
      { labelKey: "payme.fields.document", value: "***.***.***-**", copyable: true }
    ]
  },
  {
    id: "paypal",
    type: "paypal",
    titleKey: "payme.methods.paypal.title",
    descriptionKey: "payme.methods.paypal.desc",
    category: "donor",
    details: [
      { labelKey: "payme.fields.link", value: "https://paypal.me/djzeneyer", copyable: true }
    ]
  },
  {
    id: "wire-usd",
    type: "wire",
    titleKey: "payme.methods.wire_usd.title",
    descriptionKey: "payme.methods.wire_usd.desc",
    category: "contractor",
    details: [
      { labelKey: "payme.fields.swift", value: "INTERUS33", copyable: true },
      { labelKey: "payme.fields.routing", value: "123456789", copyable: true },
      { labelKey: "payme.fields.account", value: "987654321", copyable: true }
    ]
  }
];
const PayMePage = () => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [activeAccordion, setActiveAccordion] = reactExports.useState("pix");
  const handleCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(fieldId);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const IconMap = {
    pix: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-primary" }),
    bank: /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { className: "w-6 h-6 text-primary" }),
    paypal: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-6 h-6 text-accent" }),
    wire: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-6 h-6 text-secondary" })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-display mb-4 text-gradient", children: t("payme.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-lg max-w-2xl mx-auto", children: t("payme.subtitle") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: paymentMethods.map((method) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `card p-0 transition-all duration-300 border border-white/5 ${activeAccordion === method.id ? "bg-surface/90 border-primary/30" : "hover:bg-surface/50"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveAccordion(activeAccordion === method.id ? null : method.id),
              className: "w-full flex items-center justify-between p-6 text-left focus:outline-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-white/5 rounded-lg", children: IconMap[method.type] || /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display", children: t(method.titleKey) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: t(method.descriptionKey) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: { rotate: activeAccordion === method.id ? 180 : 0 },
                    transition: { duration: 0.3 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: `w-5 h-5 transition-colors ${activeAccordion === method.id ? "text-primary" : "text-white/20"}` })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activeAccordion === method.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { height: 0, opacity: 0 },
              animate: { height: "auto", opacity: 1 },
              exit: { height: 0, opacity: 0 },
              className: "overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 pt-0 border-t border-white/5 grid gap-4", children: method.details.map((detail, idx) => {
                const fieldId = `${method.id}-${idx}`;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-white/5 rounded-lg group/field", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-white/40 font-bold", children: t(detail.labelKey) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-primary-light font-mono selection:bg-primary/30", children: detail.value }),
                    detail.copyable && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleCopy(detail.value, fieldId),
                        className: "p-2 hover:bg-white/10 rounded-md transition-colors relative",
                        title: t("common.copy"),
                        children: copiedId === fieldId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4 text-white/40 group-hover/field:text-white" })
                      }
                    )
                  ] })
                ] }, idx);
              }) })
            }
          ) })
        ]
      }
    ) }, method.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-8 bg-primary/5 border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-8 h-8 text-primary mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display mb-2", children: t("payme.sections.donors.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60", children: t("payme.sections.donors.desc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-8 bg-secondary/5 border-secondary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-8 h-8 text-secondary mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display mb-2", children: t("payme.sections.contractors.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60", children: t("payme.sections.contractors.desc") })
      ] })
    ] })
  ] }) });
};
export {
  PayMePage as default
};
//# sourceMappingURL=PayMePage-Ds5SVl0b.js.map
