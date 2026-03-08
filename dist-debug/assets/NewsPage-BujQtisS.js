import { j as jsxRuntimeExports } from "./motion-CwY3TCXX.js";
import "./vendor-CFCQ-ZJr.js";
const formatDate = (dateString, lang = "pt-BR") => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(lang, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    console.error("[NewsPage] Error formatting date:", e, dateString);
    return dateString;
  }
};
const NewsPage = () => {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const normalizedLanguage = normalizeLanguage(i18n.language);
  const { data: postsData, isLoading: loadingList } = useNewsQuery(normalizedLanguage, { enabled: !slug });
  const { data: singlePost, isLoading: loadingDetail } = useNewsBySlug(slug, normalizedLanguage);
  const posts = postsData || [];
  const loading = slug ? loadingDetail : loadingList;
  const getRouteForKey = (key) => {
    return getLocalizedRoute(key, normalizedLanguage);
  };
  if (!loading && slug && singlePost) {
    const origin = typeof window !== "undefined" ? window.location.origin : ARTIST.site.baseUrl;
    const postImage = safeUrl(
      singlePost.featured_image_src_full || singlePost.featured_image_src || singlePost._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      "/images/zen-eyer-og-image.png"
    );
    const postUrl = `${origin}${generatePath(getLocalizedRoute("news-detail", normalizedLanguage), { slug: singlePost.slug })}`;
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": stripHtml(singlePost.title.rendered),
      "image": [postImage],
      "datePublished": singlePost.date,
      "dateModified": singlePost.modified || singlePost.date,
      "author": [{
        "@type": "Person",
        "name": singlePost.author_name || singlePost._embedded?.author?.[0]?.name || t("news.default_author")
      }],
      "url": postUrl
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HeadlessSEO,
        {
          title: `${stripHtml(singlePost.title.rendered)} | ${t("news.title")}`,
          description: stripHtml(singlePost.excerpt.rendered),
          url: postUrl,
          image: postImage,
          type: "article",
          schema: articleSchema
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pt-24 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getRouteForKey("news"), className: "inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8 font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }),
          " ",
          t("news.back_to_list")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 text-white/50 text-sm mb-4 font-mono uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
                " ",
                formatDate(singlePost.date, i18n.language)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                t("news.by"),
                " ",
                singlePost.author_name || singlePost._embedded?.author?.[0]?.name || t("news.default_author")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black font-display leading-tight mb-8", dangerouslySetInnerHTML: { __html: sanitizeHtml(singlePost.title.rendered) } }),
            postImage !== "#" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[40vh] md:h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: postImage,
                className: "w-full h-full object-cover",
                alt: stripHtml(singlePost.title.rendered)
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-primary hover:prose-a:text-white transition-colors",
              dangerouslySetInnerHTML: { __html: sanitizeHtml(singlePost.content?.rendered || "") }
            }
          )
        ] })
      ] }) })
    ] });
  }
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("news_page_title"),
        description: t("news_page_meta_desc"),
        url: `${window.location.origin}${getLocalizedRoute("news", normalizedLanguage)}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pt-24 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              className: "flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase mb-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-primary rounded-full animate-pulse" }),
                t("news.live_feed")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl md:text-7xl font-black font-display tracking-tight text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500", children: t("news.title") }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-white/50 text-sm hidden md:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("news.curatorship") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("news.zouk_production") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: (/* @__PURE__ */ new Date()).toLocaleDateString(i18n.language, { weekday: "long", day: "numeric", month: "long" }) })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[500px] bg-white/5 rounded-2xl w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 bg-white/5 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 bg-white/5 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 bg-white/5 rounded-xl" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        featuredPost && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.article,
          {
            className: "relative group cursor-pointer mb-20",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: generatePath(getLocalizedRoute("news-detail", normalizedLanguage), { slug: featuredPost.slug }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: safeUrl(featuredPost.featured_image_src_full || featuredPost.featured_image_src || featuredPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp"),
                  alt: featuredPost.title.rendered,
                  className: "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105",
                  loading: "eager"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4 text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-primary font-bold mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md border border-primary/30", children: t("news.featured") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-white/80 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
                    " ",
                    formatDate(featuredPost.date, i18n.language)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-4xl md:text-6xl font-black font-display leading-tight mb-6 group-hover:text-primary transition-colors text-white",
                    dangerouslySetInnerHTML: { __html: sanitizeHtml(featuredPost.title.rendered) }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-invert max-w-2xl mb-8 hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-lg text-white/80 line-clamp-3",
                    dangerouslySetInnerHTML: { __html: sanitizeHtml(stripHtml(featuredPost.excerpt.rendered)) }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-white font-bold text-lg hover:gap-4 transition-all", children: [
                  t("news.read_full"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white text-black rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 }) })
                ] })
              ] })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-2 text-xl font-display font-bold text-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("news.latest_stories") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: secondaryPosts.map((post, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.article,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: index * 0.1 },
            className: "group flex flex-col h-full bg-surface/30 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:bg-surface/50 transition-all duration-300 text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: generatePath(getLocalizedRoute("news-detail", normalizedLanguage), { slug: post.slug }), className: "block h-56 overflow-hidden relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: safeUrl(post.featured_image_src || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp"),
                    alt: stripHtml(post.title.rendered),
                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "inline mr-1" }),
                  " ",
                  t("news.read_time", { min: 3 })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex-1 flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-primary mb-3 font-bold uppercase tracking-wider flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 12 }),
                  " ",
                  t("news.label")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: generatePath(getLocalizedRoute("news-detail", normalizedLanguage), { slug: post.slug }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h3",
                  {
                    className: "text-xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2 text-white",
                    dangerouslySetInnerHTML: { __html: sanitizeHtml(post.title.rendered) }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-white/60 text-sm line-clamp-3 mb-6 flex-1",
                    dangerouslySetInnerHTML: { __html: sanitizeHtml(stripHtml(post.excerpt.rendered)) }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-white/10 pt-4 mt-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40 font-medium", children: formatDate(post.date, i18n.language) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: generatePath(getLocalizedRoute("news-detail", normalizedLanguage), { slug: post.slug }), className: "text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4", children: t("news.read_more") })
                ] })
              ] })
            ]
          },
          post.id
        )) })
      ] }),
      !loading && posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 text-center border-t border-white/10 pt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm mb-4", children: t("news.end_reached") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-outline text-sm px-8 py-3 rounded-full hover:bg-white/5", children: t("news.view_archive") })
      ] })
    ] }) })
  ] });
};
export {
  NewsPage as default
};
//# sourceMappingURL=NewsPage-BujQtisS.js.map
