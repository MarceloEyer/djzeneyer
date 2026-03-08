import { u as useReducedMotion, j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { e as useParams, r as reactExports, f as generatePath, L as Link } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, n as normalizeLanguage, q as useTrackBySlug, A as ARTIST, M as Music2, Y as Youtube, l as safeUrl, i as getLocalizedRoute, H as HeadlessSEO, s as sanitizeHtml, E as ExternalLink, D as Download } from "./index-Cac5tBAe.js";
import { s as stripHtml } from "./text-DgctY_bk.js";
import { u as useTranslation, T as Trans } from "./i18n-ti7dkFnK.js";
import { A as ArrowLeft } from "./arrow-left-Bbmrj-yL.js";
import { P as Play } from "./play-CjRq6fsI.js";
import { C as Coffee } from "./coffee-AowewQG_.js";
const __iconNode = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("cloud", __iconNode);
const SpotifyIcon = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-6 w-6", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" }) });
const MusicPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);
  const prefersReducedMotion = useReducedMotion();
  const { data: singleTrack, isLoading: singleLoading } = useTrackBySlug(slug);
  const streamingPlatforms = reactExports.useMemo(() => [
    {
      name: "Spotify",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SpotifyIcon, {}),
      url: ARTIST.social.spotify.url,
      color: "hover:bg-[#1DB954]/20 border-[#1DB954]/20 hover:border-[#1DB954]/50"
    },
    {
      name: "Apple Music",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "text-[#FA243C]" }),
      url: ARTIST.social.appleMusic.url,
      color: "hover:bg-[#FA243C]/20 border-[#FA243C]/20 hover:border-[#FA243C]/50"
    },
    {
      name: "SoundCloud",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "text-[#FF5500]" }),
      url: ARTIST.social.soundcloud.url,
      color: "hover:bg-[#FF5500]/20 border-[#FF5500]/20 hover:border-[#FF5500]/50"
    },
    {
      name: "YouTube",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "text-[#FF0000]" }),
      url: ARTIST.social.youtube.url,
      color: "hover:bg-[#FF0000]/20 border-[#FF0000]/20 hover:border-[#FF0000]/50"
    }
  ], []);
  const spotifyPlatform = reactExports.useMemo(
    () => streamingPlatforms.find((platform) => platform.name === "Spotify"),
    [streamingPlatforms]
  );
  const secondaryPlatforms = reactExports.useMemo(
    () => streamingPlatforms.filter((platform) => platform.name !== "Spotify"),
    [streamingPlatforms]
  );
  if (!singleLoading && slug && singleTrack) {
    const origin = typeof window !== "undefined" ? window.location.origin : ARTIST.site.baseUrl;
    const trackImage = safeUrl(singleTrack.featured_image_src_full || singleTrack.featured_image_src, "/images/hero-background.webp");
    const trackUrl = `${origin}${generatePath(getLocalizedRoute("music-detail", currentLang), { slug })}`;
    const musicSchema = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      "name": stripHtml(singleTrack.title?.rendered || t("music.pageTitle")),
      "image": trackImage,
      "url": trackUrl,
      "byArtist": {
        "@type": "MusicGroup",
        "name": ARTIST.identity.stageName
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HeadlessSEO,
        {
          title: `${singleTrack.title?.rendered || t("music.pageTitle")} | Zen Music`,
          description: singleTrack.excerpt?.rendered || t("music.pageDesc"),
          url: trackUrl,
          image: trackImage,
          type: "music.song",
          schema: musicSchema
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pt-24 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("music", currentLang), className: "inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }),
          " ",
          t("music.back")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface/30 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row gap-12 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: safeUrl(singleTrack.featured_image_src_full || singleTrack.featured_image_src, "/images/hero-background.webp"),
                className: "w-full h-full object-cover",
                alt: singleTrack.title?.rendered || ""
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-left flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black font-display mb-4", dangerouslySetInnerHTML: { __html: sanitizeHtml(singleTrack.title?.rendered) } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-bold mb-8 tracking-widest uppercase", children: t("music.artist_tag") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 justify-center md:justify-start", children: [
                singleTrack.links?.spotify && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: safeUrl(singleTrack.links.spotify),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "btn btn-primary px-8 py-3 rounded-full flex items-center gap-2 relative overflow-hidden group/btn shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] transition-all bg-[#1DB954] text-black border-none",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { fill: "currentColor", size: 18 }),
                      " ",
                      t("common.platforms.spotify")
                    ]
                  }
                ),
                singleTrack.links?.soundcloud && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: safeUrl(singleTrack.links.soundcloud), target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline px-8 py-3 rounded-full flex items-center gap-2 border-white/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 18 }),
                  " ",
                  t("common.platforms.soundcloud")
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 border-t border-white/5 pt-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { size: 18, className: "text-primary" }),
              " ",
              t("music.about_track")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "prose prose-invert max-w-none text-white/60",
                dangerouslySetInnerHTML: { __html: sanitizeHtml(singleTrack.content?.rendered || singleTrack.excerpt?.rendered || "") }
              }
            )
          ] })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: `${t("music_page_title")} | DJ Zen Eyer`,
        description: t("music_page_meta_desc"),
        url: `${window.location.origin}${getLocalizedRoute("music", currentLang)}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pt-24 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
            animate: prefersReducedMotion ? void 0 : { opacity: 1, y: 0 },
            className: "mb-6",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-8xl font-black font-display tracking-tighter uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Trans, { i18nKey: "music.hub_title_rich", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Streaming" }),
              " Hub"
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.p,
          {
            initial: prefersReducedMotion ? false : { opacity: 0 },
            animate: prefersReducedMotion ? void 0 : { opacity: 1 },
            transition: prefersReducedMotion ? void 0 : { delay: 0.2 },
            className: "text-xl text-white/60",
            children: t("music.hub_subtitle")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 mb-16", children: [
        spotifyPlatform && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.a,
          {
            href: safeUrl(spotifyPlatform.url),
            target: "_blank",
            rel: "noopener noreferrer",
            initial: prefersReducedMotion ? false : { opacity: 0, scale: 0.95 },
            animate: prefersReducedMotion ? void 0 : { opacity: 1, scale: 1 },
            transition: prefersReducedMotion ? void 0 : { duration: 0.5 },
            className: "flex items-center justify-between p-8 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-[2rem] transition-all duration-500 group relative overflow-hidden active:scale-[0.98] shadow-2xl shadow-[#1DB954]/10 hover:shadow-[#1DB954]/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 flex items-center justify-center bg-[#1DB954] text-black rounded-full shadow-lg group-hover:scale-110 transition-transform duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpotifyIcon, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-2xl md:text-3xl font-black font-display uppercase tracking-widest text-[#1DB954] mb-1", children: spotifyPlatform.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 text-sm font-bold uppercase tracking-widest", children: t("music.listen_now_on") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { fill: "white", className: "text-white scale-150 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-500 hidden md:block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 24, className: "text-[#1DB954] group-hover:text-white transition-colors" })
              ] })
            ]
          },
          spotifyPlatform.name
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: secondaryPlatforms.map((platform, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.a,
          {
            href: safeUrl(platform.url),
            target: "_blank",
            rel: "noopener noreferrer",
            initial: prefersReducedMotion ? false : { opacity: 0, y: 10 },
            animate: prefersReducedMotion ? void 0 : { opacity: 1, y: 0 },
            transition: prefersReducedMotion ? void 0 : { delay: index * 0.1 + 0.3 },
            className: `flex items-center justify-between p-5 bg-surface/30 border rounded-2xl transition-all duration-300 group ${platform.color}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 flex justify-center opacity-70 group-hover:opacity-100 transition-opacity", children: platform.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold font-display uppercase tracking-wider", children: platform.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16, className: "text-white/10 group-hover:text-white/40 transition-colors" })
            ]
          },
          platform.name
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
            animate: prefersReducedMotion ? void 0 : { opacity: 1, y: 0 },
            transition: prefersReducedMotion ? void 0 : { delay: 0.7 },
            className: "bg-red-500/5 border border-red-500/10 rounded-3xl p-8 relative overflow-hidden group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 160 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-black font-display mb-4 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "text-red-500" }),
                " ",
                t("music.steal_button")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mb-8 max-w-xs", children: t("music.steal_desc") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://download.djzeneyer.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20",
                  children: [
                    t("music.steal_cta"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16 })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: prefersReducedMotion ? false : { opacity: 0, y: 20 },
            animate: prefersReducedMotion ? void 0 : { opacity: 1, y: 0 },
            transition: prefersReducedMotion ? void 0 : { delay: 0.8 },
            className: "bg-primary/5 border border-primary/10 rounded-3xl p-8 relative overflow-hidden group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coffee, { size: 160 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-black font-display mb-4 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coffee, { className: "text-primary" }),
                " ",
                t("music.support_button")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mb-8 max-w-xs", children: t("music.support_desc") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: getLocalizedRoute("support", currentLang),
                  className: "inline-flex items-center gap-2 bg-primary hover:brightness-110 text-black font-black px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20",
                  children: [
                    t("music.support_cta"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16 })
                  ]
                }
              )
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
export {
  MusicPage as default
};
//# sourceMappingURL=MusicPage-CMsYf2LI.js.map
