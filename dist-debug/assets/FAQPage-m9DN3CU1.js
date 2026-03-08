import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { u as useLocation, r as reactExports } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, d as Award, G as Globe, k as Users, A as ARTIST, H as HeadlessSEO, l as safeUrl, f as ChevronDown, s as sanitizeHtml } from "./index-Cac5tBAe.js";
import { u as useTranslation, T as Trans } from "./i18n-ti7dkFnK.js";
import { B as Brain } from "./brain-BVbsCg5A.js";
const __iconNode$2 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ],
  ["path", { d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "auskq0" }]
];
const HeartPulse = createLucideIcon("heart-pulse", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
      key: "80a601"
    }
  ],
  [
    "path",
    {
      d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
      key: "j0ngtp"
    }
  ],
  ["circle", { cx: "16", cy: "7", r: "5", key: "d08jfb" }]
];
const MicVocal = createLucideIcon("mic-vocal", __iconNode);
const FAQItem = reactExports.memo(({ question, answer, isOpen, onToggle }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    className: "bg-surface/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300",
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onToggle,
          className: "w-full flex items-center justify-between p-6 text-left hover:bg-surface/50 transition-colors group",
          "aria-expanded": isOpen,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white pr-4 group-hover:text-primary transition-colors font-display", children: question }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { rotate: isOpen ? 180 : 0 },
                transition: { duration: 0.3 },
                className: "flex-shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "text-primary/70 group-hover:text-primary transition-colors", size: 24 })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: false,
          animate: {
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0
          },
          transition: { duration: 0.3, ease: "easeInOut" },
          className: "overflow-hidden",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-6 pb-6 text-white/80 leading-relaxed prose prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white border-t border-white/5 pt-4",
              dangerouslySetInnerHTML: { __html: sanitizeHtml(answer) }
            }
          )
        }
      )
    ]
  }
));
FAQItem.displayName = "FAQItem";
const CATEGORIES = ["djzeneyer", "rankings", "technical", "culture", "community"];
const FAQPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [openIndex, setOpenIndex] = reactExports.useState(null);
  const handleToggle = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };
  const faqData = reactExports.useMemo(() => CATEGORIES.map((cat) => ({
    category: cat,
    title: t(`faq.categories.${cat}.title`),
    description: t(`faq.categories.${cat}.desc`),
    icon: cat === "djzeneyer" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 24 }) : cat === "rankings" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 24 }) : cat === "technical" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 24 }) : cat === "culture" ? /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }),
    questions: ["q1", "q2", "q3"].map((qKey) => ({
      question: t(`faq.categories.${cat}.${qKey}.q`),
      answer: t(`faq.categories.${cat}.${qKey}.a`)
    }))
  })), [t]);
  const currentUrl = reactExports.useMemo(
    () => `${ARTIST.site.baseUrl}${location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`}`,
    [location.pathname]
  );
  const faqSchema = reactExports.useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${currentUrl}#faqpage`,
        "mainEntity": faqData.flatMap(
          (category) => category.questions.map((q) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer.replace(/<[^>]*>/g, "")
              // Texto limpo para robots/LLMs
            }
          }))
        )
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${currentUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": ARTIST.site.baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "FAQ",
            "item": currentUrl
          }
        ]
      }
    ]
  }), [currentUrl, faqData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-white pt-24 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("faq.title"),
        description: t("faq.subtitle"),
        url: safeUrl(currentUrl, ARTIST.site.baseUrl),
        schema: faqSchema,
        keywords: t("faq.seo.keywords"),
        leadAnswer: t("faq.seo.lead_answer")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "text-center mb-20",
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 text-sm font-bold tracking-widest uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 16 }),
              " ",
              t("faq.badge")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black font-display mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "faq.title", children: [
              "Perguntas ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500", children: "Frequentes" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/50 max-w-2xl mx-auto", children: t("faq.subtitle") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto space-y-16", children: faqData.map((category, catIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: catIndex * 0.1 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-surface rounded-xl text-primary border border-white/10 shadow-lg shadow-primary/5", children: category.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold font-display text-white mb-2", children: category.title }),
                category.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm", children: category.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: category.questions.map((q, qIndex) => {
              const uniqueId = `${category.category}-${qIndex}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                FAQItem,
                {
                  question: q.question,
                  answer: q.answer,
                  isOpen: openIndex === uniqueId,
                  onToggle: () => handleToggle(uniqueId)
                },
                uniqueId
              );
            }) })
          ]
        },
        category.category
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "mt-24 text-center border-t border-white/10 pt-16",
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display font-bold mb-6", children: t("faq.not_found") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://wa.me/5521987413091?text=${encodeURIComponent(t("about.cta.whatsapp_msg"))}`, className: "btn btn-primary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MicVocal, { size: 18 }),
                " ",
                t("faq.cta_whatsapp")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${ARTIST.contact.email}`, className: "btn btn-outline px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 transition-transform hover:scale-105", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 18 }),
                " ",
                t("faq.cta_email")
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
};
export {
  FAQPage as default
};
//# sourceMappingURL=FAQPage-m9DN3CU1.js.map
