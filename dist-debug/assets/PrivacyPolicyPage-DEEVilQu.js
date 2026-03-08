import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { b as Mail, x as Helmet } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { D as Database } from "./database-BgxuNUZY.js";
import { E as Eye } from "./eye-nq4ae8V4.js";
import { L as Lock } from "./lock-B39ha62i.js";
import { S as Shield } from "./shield-XNTU4cFV.js";
import "./vendor-CFCQ-ZJr.js";
const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  const sections = [
    {
      icon: Database,
      title: t("privacy_page.sections.collection.title"),
      content: t("privacy_page.sections.collection.items", { returnObjects: true })
    },
    {
      icon: Eye,
      title: t("privacy_page.sections.usage.title"),
      content: t("privacy_page.sections.usage.items", { returnObjects: true })
    },
    {
      icon: Lock,
      title: t("privacy_page.sections.security.title"),
      content: t("privacy_page.sections.security.items", { returnObjects: true })
    },
    {
      icon: Shield,
      title: t("privacy_page.sections.sharing.title"),
      content: t("privacy_page.sections.sharing.items", { returnObjects: true })
    },
    {
      icon: Mail,
      title: t("privacy_page.sections.rights.title"),
      content: t("privacy_page.sections.rights.items", { returnObjects: true })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: t("privacy_page.seo.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("privacy_page.seo.description") }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 40, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-display font-bold mb-4", children: [
              t("privacy_page.title").split(" ")[0],
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("privacy_page.title").split(" ").slice(1).join(" ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70", children: [
              t("privacy_page.last_updated"),
              ": ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: t("privacy_page.last_updated_date") })
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
          className: "card p-8 mb-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/80 leading-relaxed mb-4", children: t("privacy_page.intro_p1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("privacy_page.intro_p2") })
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mt-1", children: section.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 ml-16", children: section.content.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-1.5", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 leading-relaxed", children: item })
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
          transition: { duration: 0.6, delay: 0.7 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("privacy_page.cookies_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed mb-4", children: t("privacy_page.cookies_p1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("privacy_page.cookies_p2") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.8 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("privacy_page.third_party_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed mb-4", children: t("privacy_page.third_party_p1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  t("privacy_page.third_party_analytics").split(":")[0],
                  ":"
                ] }),
                t("privacy_page.third_party_analytics").split(":")[1]
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  t("privacy_page.third_party_payments").split(":")[0],
                  ":"
                ] }),
                t("privacy_page.third_party_payments").split(":")[1]
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  t("privacy_page.third_party_email").split(":")[0],
                  ":"
                ] }),
                t("privacy_page.third_party_email").split(":")[1]
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
          transition: { duration: 0.6, delay: 0.9 },
          className: "card p-8 mb-6 border-l-4 border-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("privacy_page.lgpd_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed mb-4", children: t("privacy_page.lgpd_p1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-white/70", children: t("privacy_page.lgpd_items", { returnObjects: true }).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item })
            ] }, i)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1 },
          className: "card p-8 mb-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("privacy_page.changes_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 leading-relaxed", children: t("privacy_page.changes_p1") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.1 },
          className: "card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-4", children: t("privacy_page.contact_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6", children: t("privacy_page.contact_p1") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: t("common.legal_name") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("privacy_page.contact_name") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                t("media_page.cnpj"),
                ": ",
                t("common.cnpj")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("privacy_page.contact_location") }),
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
      )
    ] }) })
  ] });
};
export {
  PrivacyPolicyPage as default
};
//# sourceMappingURL=PrivacyPolicyPage-DEEVilQu.js.map
