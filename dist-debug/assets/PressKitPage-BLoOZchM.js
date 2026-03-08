import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { u as useLocation, r as reactExports } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, A as ARTIST, I as Instagram, t as CirclePlay, G as Globe, E as ExternalLink, k as Users, M as Music2, d as Award, H as HeadlessSEO, S as Sparkles, s as sanitizeHtml, b as Mail, e as MapPin, C as Calendar, D as Download } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { D as Database } from "./database-BgxuNUZY.js";
import { S as Star } from "./star-CaRtl2Cw.js";
import { I as Image } from "./image-BTn539TG.js";
import { F as FileText } from "./file-text-CIKLAVyj.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }],
  ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }],
  ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }],
  ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Radio = createLucideIcon("radio", __iconNode);
const PRESS_LINKS = {
  photos: "https://photos.djzeneyer.com",
  epk: "/media/dj-zen-eyer-epk.pdf",
  logos: "/media/dj-zen-eyer-logos.zip"
};
const WHATSAPP_NUMBER = "5521987413091";
const StatCard = reactExports.memo(({ icon, number, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.div,
  {
    whileHover: { scale: 1.05, y: -5 },
    className: `${color} p-6 rounded-2xl text-center backdrop-blur-sm border border-white/20 shadow-xl`,
    transition: { type: "spring", stiffness: 300 },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white inline-block p-4 bg-white/10 rounded-full mb-4", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-black text-4xl text-white mb-2", children: number }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 font-semibold", children: label })
    ]
  }
));
StatCard.displayName = "StatCard";
const MediaKitCard = reactExports.memo(({ icon, title, description, path, isExternal, t }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  motion.a,
  {
    href: path,
    download: !isExternal,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "group bg-surface/50 p-8 rounded-2xl backdrop-blur-sm border border-white/10 transition-all hover:border-primary hover:bg-surface/80 flex flex-col h-full",
    whileHover: { y: -8 },
    transition: { type: "spring", stiffness: 300 },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary mx-auto mb-4 p-4 bg-primary/10 rounded-full inline-block group-hover:scale-110 transition-transform", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-xl text-white mb-2", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-4 flex-grow", children: description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-primary font-semibold mt-auto", children: [
        isExternal ? /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isExternal ? t("presskit.media.access") : t("presskit.media.download") })
      ] })
    ]
  }
));
MediaKitCard.displayName = "MediaKitCard";
const PressKitPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  const currentUrl = `https://djzeneyer.com${currentPath}`;
  const RELEVANT_LINKS = reactExports.useMemo(() => [
    { name: t("social.instagram"), url: ARTIST.social.instagram.url, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 20 }) },
    { name: t("social.youtube"), url: ARTIST.social.youtube.url, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 20 }) },
    { name: t("social.spotify"), url: ARTIST.social.spotify.url, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { size: 20 }) },
    { name: t("social.apple_music"), url: ARTIST.social.appleMusic.url, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { size: 20 }) },
    { name: t("social.musicbrainz"), url: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20 }) },
    { name: t("social.wikidata"), url: "https://www.wikidata.org/wiki/Q136551855", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20 }) },
    { name: t("social.discogs"), url: "https://www.discogs.com/artist/16872046", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20 }) },
    { name: t("social.resident_advisor"), url: "https://pt-br.ra.co/dj/djzeneyer", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 20 }) }
  ], [t]);
  const WHATSAPP_URL = reactExports.useMemo(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("presskit.contact.whatsapp_message"))}`,
    [t]
  );
  const stats = reactExports.useMemo(() => [
    { number: "11+", label: t("presskit.stats.countries"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 32 }), color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { number: "50K+", label: t("presskit.stats.people"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 32 }), color: "bg-gradient-to-br from-purple-500 to-purple-700" },
    { number: "500K+", label: t("presskit.stats.streams"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { size: 32 }), color: "bg-gradient-to-br from-pink-500 to-pink-700" },
    { number: "10+", label: t("presskit.stats.years"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 32 }), color: "bg-gradient-to-br from-green-500 to-green-700" }
  ], [t]);
  const quickStatsItems = reactExports.useMemo(() => [
    { title: t("presskit.bio.quickStats.cremosidade"), desc: t("presskit.bio.quickStats.cremosidade_desc"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 20, className: "text-primary" }) },
    { title: t("presskit.bio.quickStats.repertoire"), desc: t("presskit.bio.quickStats.repertoire_desc"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { size: 20, className: "text-accent" }) },
    { title: t("presskit.bio.quickStats.connection"), desc: t("presskit.bio.quickStats.connection_desc"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20, className: "text-success" }) },
    { title: t("presskit.bio.quickStats.global"), desc: t("presskit.bio.quickStats.global_desc"), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 20, className: "text-purple-400" }) }
  ], [t]);
  const mediaItems = reactExports.useMemo(() => [
    { title: t("presskit.media.photos"), desc: t("presskit.media.photos_desc"), path: PRESS_LINKS.photos, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 32 }), isExternal: true },
    { title: t("presskit.media.bio"), desc: t("presskit.media.bio_desc"), path: PRESS_LINKS.epk, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 32 }), isExternal: false },
    { title: t("presskit.media.logos"), desc: t("presskit.media.logos_desc"), path: PRESS_LINKS.logos, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { size: 32 }), isExternal: false }
  ], [t]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("presskit.page_title"),
        description: t("presskit.page_meta_desc"),
        url: currentUrl,
        image: `${ARTIST.site.baseUrl}/images/artist/dj-zen-eyer-official-hero.jpg`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pt-24 pb-16 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none opacity-30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse", style: { animationDelay: "1s" } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "text-center mb-16", initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 0.2, duration: 0.6 }, className: "inline-block mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "inline-block mr-2", size: 16 }),
              t("presskit.tag")
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl font-black font-display mb-6", children: [
              "Sobre Zen Eyer ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "- EPK Oficial" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed", children: [
              t("presskit.role"),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: t("presskit.subtitle") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4, duration: 0.8 }, children: stats.map((stat, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...stat }, index)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-surface/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.8 }, className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "relative", whileHover: { scale: 1.02 }, transition: { type: "spring", stiffness: 300 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/images/artist/dj-zen-eyer-smiling-at-deck.jpg",
            alt: "DJ Zen Eyer - World Champion Brazilian Zouk DJ",
            className: "w-full h-full object-cover",
            loading: "lazy",
            decoding: "async",
            width: "600",
            height: "600"
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl font-black font-display mb-6 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "text-primary", size: 36 }),
            t("presskit.bio.title")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-lg text-white/80 leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("presskit.bio.p1")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("presskit.bio.p2")) } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { dangerouslySetInnerHTML: { __html: sanitizeHtml(t("presskit.bio.p3")) } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-4", children: quickStatsItems.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/20 rounded-lg", children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-white", children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-white/60", children: item.desc })
            ] })
          ] }, i)) })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black font-display mb-4", children: t("presskit.media.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/70", children: t("presskit.media.subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-8", children: mediaItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaKitCard, { ...item, t }, index)) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-surface/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black font-display mb-4", children: t("presskit.gallery.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/70", children: t("presskit.gallery.subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
          { src: "/images/artist/brazilian-zouk-dance-embrace.jpg", alt: "Brazilian Zouk Dance Embrace" },
          { src: "/images/artist/dj-zen-eyer-performing-live.jpg", alt: "DJ Zen Eyer Performing Live" },
          { src: "/images/artist/dj-zen-eyer-club-performance.jpg", alt: "DJ Zen Eyer Club Performance" },
          { src: "/images/artist/dj-zen-eyer-winner-trophy.jpg", alt: "DJ Zen Eyer Winner Trophy" },
          { src: "/images/artist/dj-zen-eyer-beach-brazilian-zouk.png", alt: "DJ Zen Eyer Beach Zouk" },
          { src: "/images/artist/dj-zen-eyer-nature-portrait.jpg", alt: "DJ Zen Eyer Nature Portrait" }
        ].map((photo, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer", whileHover: { scale: 1.05 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: photo.src,
            alt: photo.alt,
            className: "w-full h-full object-cover",
            loading: "lazy",
            decoding: "async",
            width: "400",
            height: "400"
          }
        ) }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: PRESS_LINKS.photos, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-lg inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 20 }),
          t("presskit.gallery.cta")
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "max-w-4xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl font-black font-display mb-6", children: t("presskit.contact.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/80 mb-8 max-w-2xl mx-auto", children: t("presskit.contact.subtitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: WHATSAPP_URL, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary btn-lg inline-flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 20 }),
            " WhatsApp"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${ARTIST.contact.email}`, className: "btn btn-outline btn-lg inline-flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 20 }),
            " Email"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: ARTIST.social.instagram.url, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-lg inline-flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 20 }),
            " Instagram"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 pt-8 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "text-primary mt-1", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-white mb-1", children: t("presskit.contact.base") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70", children: "Niterói, RJ - Brasil" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "text-primary mt-1", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-white mb-1", children: t("presskit.contact.availability") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70", children: t("presskit.contact.availability_value") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "text-primary mt-1", size: 20 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-white mb-1", children: t("presskit.contact.genre") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70", children: "Brazilian Zouk" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-8 border-t border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6 text-center", children: t("presskit.contact.links") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: RELEVANT_LINKS.map((link, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: link.url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 bg-surface/50 p-3 rounded-lg hover:bg-surface/80 transition-colors", children: [
            link.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: link.name })
          ] }, index)) })
        ] })
      ] }) }) }) })
    ] })
  ] });
};
export {
  PressKitPage as default
};
//# sourceMappingURL=PressKitPage-BLoOZchM.js.map
