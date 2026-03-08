import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { c as createLucideIcon, D as Download, x as Helmet, A as ARTIST, E as ExternalLink } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { I as Image } from "./image-BTn539TG.js";
import "./vendor-CFCQ-ZJr.js";
const __iconNode = [
  ["path", { d: "M15 18h-5", key: "95g1m2" }],
  ["path", { d: "M18 14h-8", key: "sponae" }],
  [
    "path",
    {
      d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2",
      key: "39pd36"
    }
  ],
  ["rect", { width: "8", height: "4", x: "10", y: "6", rx: "1", key: "aywv1n" }]
];
const Newspaper = createLucideIcon("newspaper", __iconNode);
const MediaPage = () => {
  const { t } = useTranslation();
  const pressHighlights = [
    {
      title: t("media_page.world_champion"),
      description: t("media_page.world_champion_desc"),
      source: t("media_page.source_official_bio"),
      year: "2023"
    },
    {
      title: t("media_page.international_performances"),
      description: t("media_page.international_performances_desc"),
      source: t("media_page.source_performance_history"),
      year: t("media_page.year_range")
    }
  ];
  const mediaAssets = [
    {
      title: t("media_page.high_res_photos"),
      description: t("media_page.high_res_photos_desc"),
      icon: Image,
      available: false
    },
    {
      title: t("media_page.official_bio"),
      description: t("media_page.official_bio_desc"),
      icon: Newspaper,
      available: true
    },
    {
      title: t("media_page.press_kit_pdf"),
      description: t("media_page.press_kit_pdf_desc"),
      icon: Download,
      available: false
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
        t("media_page.title"),
        " | DJ Zen Eyer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("media_page.subtitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "robots", content: "index, follow" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "text-center mb-16",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6", children: [
              t("media_page.title").split("&")[0],
              " & ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("media_page.title").split("&")[1] || "Press Kit" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/70 max-w-3xl mx-auto", children: t("media_page.subtitle") })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "card mb-16 p-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold mb-6", children: t("media_page.quick_facts") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2", children: t("media_page.artist_name") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: t("common.artist_name") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2", children: t("media_page.legal_name") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: t("common.legal_name") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2", children: t("media_page.genre") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: t("media_page.genre_value") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2", children: t("media_page.location") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: t("media_page.location_value") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2", children: t("media_page.cnpj") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold font-mono", children: t("common.cnpj") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2", children: t("media_page.isni") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold font-mono", children: t("common.isni") })
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
          transition: { duration: 0.6, delay: 0.3 },
          className: "mb-16",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold mb-8", children: t("media_page.press_highlights") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-6", children: pressHighlights.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-6 border-l-4 border-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white/50 font-mono", children: item.year })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-3", children: item.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary", children: item.source })
            ] }, index)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.4 },
          className: "mb-16",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold mb-8", children: t("media_page.media_assets") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: mediaAssets.map((asset, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-6 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${asset.available ? "bg-primary/20" : "bg-white/5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(asset.icon, { size: 28, className: asset.available ? "text-primary" : "text-white/30" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-2", children: asset.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm mb-4", children: asset.description }),
              asset.available ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary btn-sm w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16, className: "mr-2" }),
                t("media_page.download")
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40 uppercase tracking-wider", children: t("media_page.coming_soon") })
            ] }, index)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.5 },
          className: "card p-8 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold mb-4", children: t("media_page.press_inquiries") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-6 max-w-2xl mx-auto", children: t("media_page.press_inquiries_desc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `mailto:${ARTIST.contact.email}`,
                className: "btn btn-primary btn-lg inline-flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 20 }),
                  t("media_page.contact_press_office")
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
          transition: { duration: 0.6, delay: 0.6 },
          className: "mt-16 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 mb-4", children: t("media_page.verified_profiles") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-6 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://www.wikidata.org/wiki/Q136551855",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-white/60 hover:text-primary transition-colors flex items-center gap-2",
                  children: [
                    "Wikidata ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-white/60 hover:text-primary transition-colors flex items-center gap-2",
                  children: [
                    "MusicBrainz ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 })
                  ]
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
  MediaPage as default
};
//# sourceMappingURL=MediaPage-ojbYcLV3.js.map
