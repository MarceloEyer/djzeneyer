import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { c as createLucideIcon, A as ARTIST, G as Globe, m as Music, H as HeadlessSEO } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { C as CreditCard } from "./credit-card-iwRDF_6I.js";
import { H as Heart } from "./heart-CoZQZ5Kp.js";
import "./vendor-CFCQ-ZJr.js";
const __iconNode$3 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10 12h4", key: "a56b0p" }],
  ["path", { d: "M10 8h4", key: "1sr2af" }],
  ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
  [
    "path",
    {
      d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
      key: "secmi2"
    }
  ],
  ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", key: "16ra0t" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
const __iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode);
const SupportArtistPage = () => {
  const { t } = useTranslation();
  const paymentMethods = [
    {
      id: "inter",
      title: t("support.inter.title"),
      description: t("support.inter.description"),
      icon: Building2,
      priority: 1,
      isPreferred: true,
      color: "from-orange-500 to-orange-600",
      accounts: [
        // International Channels
        ...["usd", "eur", "gbp"].map((currency) => {
          const acc = ARTIST.payment.interGlobal[currency];
          return {
            country: t(`support.inter.${currency}`),
            details: currency === "usd" ? [
              { label: t("support.accountName"), value: acc.accountName },
              { label: t("support.bank"), value: acc.bankName },
              { label: t("support.accountNumber"), value: acc.accountNumber },
              { label: t("support.achRouting"), value: acc.achRouting },
              { label: t("support.wireRouting"), value: acc.wireRouting },
              { label: t("support.bankAddress"), value: acc.bankAddress }
            ] : [
              { label: t("support.accountName"), value: acc.accountName },
              { label: t("support.beneficiaryBank"), value: acc.beneficiaryBank },
              { label: t("support.swiftCode"), value: acc.swiftCode },
              { label: t("support.intermediary"), value: acc.intermediaryBank.name },
              { label: t("support.swiftInter"), value: acc.intermediaryBank.swift },
              { label: t("support.iban"), value: acc.iban }
            ]
          };
        }),
        // Local Brazil
        {
          country: t("support.inter.brazil"),
          details: [
            { label: t("support.accountName"), value: ARTIST.payment.interGlobal.brazil.accountName },
            { label: t("support.cpf"), value: ARTIST.payment.interGlobal.brazil.cpf },
            { label: t("support.bank"), value: ARTIST.payment.interGlobal.brazil.bank },
            { label: t("support.branch"), value: ARTIST.payment.interGlobal.brazil.branch },
            { label: t("support.account"), value: ARTIST.payment.interGlobal.brazil.account },
            { label: t("support.pixKey"), value: ARTIST.payment.interGlobal.brazil.pixKey }
          ]
        }
      ]
    },
    {
      id: "wise",
      title: t("support.wise.title"),
      description: t("support.wise.description"),
      icon: Globe,
      priority: 2,
      color: "from-green-500 to-green-600",
      link: ARTIST.payment.wise.url,
      email: ARTIST.payment.wise.email,
      accounts: [
        {
          country: t("support.wise.eur"),
          details: [
            { label: t("support.accountName"), value: ARTIST.payment.wise.eur.accountName },
            { label: t("support.iban"), value: ARTIST.payment.wise.eur.iban },
            { label: t("support.swiftCode"), value: ARTIST.payment.wise.eur.swiftCode },
            { label: t("support.bank"), value: ARTIST.payment.wise.eur.bankName },
            { label: t("support.bankAddress"), value: ARTIST.payment.wise.eur.bankAddress }
          ]
        }
      ]
    },
    {
      id: "paypal",
      title: t("support.paypal.title"),
      description: t("support.paypal.description"),
      icon: CreditCard,
      priority: 3,
      color: "from-blue-500 to-blue-600",
      link: ARTIST.payment.paypal.donateUrl,
      email: ARTIST.payment.paypal.email,
      phone: ARTIST.payment.paypal.phone
    }
  ];
  const supportReasons = [
    {
      icon: Music,
      title: t("support.reasons.music.title"),
      description: t("support.reasons.music.description")
    },
    {
      icon: Heart,
      title: t("support.reasons.community.title"),
      description: t("support.reasons.community.description")
    },
    {
      icon: Globe,
      title: t("support.reasons.worldwide.title"),
      description: t("support.reasons.worldwide.description")
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-24 pb-16 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("support.seo.title"),
        description: t("support.seo.description"),
        keywords: t("support.seo.keywords"),
        ogImage: "/images/zen-eyer-og-image.svg"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black font-display mb-6 text-white drop-shadow-2xl", children: t("support.header.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/70 max-w-3xl mx-auto leading-relaxed", children: t("support.header.description") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-primary font-bold", children: t("payme.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold font-display mb-8 text-center", children: t("support.reasons.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: supportReasons.map((reason, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 + index * 0.1 }, className: "card p-6 text-center hover:border-primary/50 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reason.icon, { className: "text-primary", size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-3", children: reason.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70", children: reason.description })
        ] }, reason.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold font-display mb-8 text-center", children: t("support.payment.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: paymentMethods.map((method, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.5 + index * 0.1 }, className: "card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-gradient-to-r ${method.color} p-6`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(method.icon, { className: "text-white", size: 24 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
                  method.title,
                  method.priority === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full", children: t("support.preferred") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-sm", children: method.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-white", children: method.priority }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
            (method.id === "inter" || method.id === "wise") && method.accounts && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: method.accounts.map((account, accountIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: accountIndex > 0 ? "pt-6 border-t border-white/10" : "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20, className: "text-primary" }),
                account.country
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
                account.details.map((detail, detailIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 rounded-lg p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/50 mb-1", children: detail.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-white font-bold", children: detail.value })
                ] }, detailIndex)),
                account.bankAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 rounded-lg p-4 md:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/50 mb-1", children: t("support.bankAddress") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-white font-bold", children: account.bankAddress })
                ] })
              ] })
            ] }, accountIndex)) }),
            (method.id === "wise" || method.id === "paypal") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              method.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 rounded-lg p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/50 mb-1", children: t("support.email") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-white font-bold", children: method.email })
              ] }),
              method.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 rounded-lg p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/50 mb-1", children: t("support.phone") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-white font-bold", children: method.phone })
              ] }),
              method.link && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: method.link, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary w-full justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 20 }),
                t("support.sendPayment"),
                " ",
                method.title
              ] })
            ] })
          ] })
        ] }, method.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "mt-16 card p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "mx-auto mb-4 text-primary", size: 48 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-4", children: t("support.business.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6 max-w-2xl mx-auto", children: t("support.business.description") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:contato@djzeneyer.com?subject=Event Booking Inquiry", className: "btn btn-primary inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20 }),
          t("support.business.contact")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1 }, className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/70 italic", children: t("support.thankYou") }) })
    ] })
  ] });
};
export {
  SupportArtistPage as default
};
//# sourceMappingURL=SupportArtistPage-6z3zSFWR.js.map
