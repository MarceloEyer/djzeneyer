var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/data/artistData.ts
var START_YEAR, CURRENT_YEAR, ARTIST, getWhatsAppUrl, getSocialUrls, getVerificationUrls, ARTIST_SCHEMA_BASE;
var init_artistData = __esm({
  "src/data/artistData.ts"() {
    START_YEAR = 2015;
    CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
    ARTIST = {
      // 🆔 Identidade
      identity: {
        stageName: "DJ Zen Eyer",
        shortName: "Zen Eyer",
        fullName: "Marcelo Eyer Fernandes",
        displayTitle: "Zen Eyer",
        birthDate: "1985-08-20",
        // Wikidata + MusicBrainz
        nationality: "Brazilian"
      },
      // 🏆 Títulos e Credenciais (informação complementar, não contradiz Wikidata)
      titles: {
        primary: "2\xD7 World Champion Brazilian Zouk DJ (Current Champion)",
        event: "Ilha do Zouk DJ Championship",
        eventUrl: "https://alexdecarvalho.com.br/ilhadozouk/dj-championship/",
        location: "Ilha Grande, Rio de Janeiro, Brazil",
        year: 2022,
        categories: ["DJ Championship", "Best Remix"],
        description: "Champion in the DJ Championship and Best Remix categories at Ilha do Zouk 2022, current title holder."
      },
      // 🧠 Diferencial (Mensa)
      mensa: {
        isMember: true,
        organization: "Mensa International",
        url: "https://www.mensa.org",
        description: "Member of the high IQ society (top 2%)."
      },
      // 📊 Estatísticas (estimativas / não conflitam com fontes externas)
      stats: {
        yearsActive: CURRENT_YEAR - START_YEAR,
        countriesPlayed: 11,
        eventsPlayed: (CURRENT_YEAR - START_YEAR) * 50,
        streamsTotal: "N/A",
        followersTotal: "N/A",
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      },
      // 🌎 Festivais de Destaque
      // Datas adicionadas baseadas nos anos informados e calendário típico dos eventos
      festivals: [
        {
          name: "One Zouk Congress",
          country: "Australia",
          flag: "\u{1F1E6}\u{1F1FA}",
          url: "https://www.onezoukcongress.com/",
          date: "2022-05-19"
          // Edição de 2022 (Maio)
        },
        {
          name: "Dutch Zouk",
          country: "Netherlands",
          flag: "\u{1F1F3}\u{1F1F1}",
          url: "https://www.dutchzouk.nl/",
          date: "2025-10-15"
          // Edição de 2025 (Outubro)
        },
        {
          name: "Prague Zouk Congress",
          country: "Czech Republic",
          flag: "\u{1F1E8}\u{1F1FF}",
          url: "https://www.praguezoukcongress.com/",
          date: "2017-07-27"
          // Edição de 2017 (Julho/Agosto)
        },
        {
          name: "LA Zouk Marathon",
          country: "United States",
          flag: "\u{1F1FA}\u{1F1F8}",
          url: "https://www.lazoukmarathon.com/",
          date: "2024-06-07"
          // Edição de 2024 (Junho)
        },
        {
          name: "Zurich Zouk Congress",
          country: "Switzerland",
          flag: "\u{1F1E8}\u{1F1ED}",
          url: "https://www.zurichzoukcongress.com/",
          date: "2023-09-22"
          // Data estimada baseada no calendário anual (Setembro)
        },
        {
          name: "Rio Zouk Congress",
          country: "Brazil",
          flag: "\u{1F1E7}\u{1F1F7}",
          url: "https://www.riozoukcongress.com/",
          date: "2025-01-10"
          // Edição de 2025 (Janeiro)
        },
        {
          name: "IZC Brazil",
          country: "Brazil",
          flag: "\u{1F1E7}\u{1F1F7}",
          url: "https://www.instagram.com/izcbrazil/",
          date: "2024-01-20"
          // Data estimada (Geralmente segue a temporada de Janeiro/Fev)
        },
        {
          name: "Polish Zouk Festival - Katowice",
          country: "Poland",
          flag: "\u{1F1F5}\u{1F1F1}",
          url: "https://www.polishzoukfestival.pl/",
          upcoming: true,
          date: "2025-11-20"
          // Data estimada para edição futura
        }
      ],
      // 🔗 Identificadores de Autoridade
      identifiers: {
        wikidata: "Q136551855",
        wikidataUrl: "https://www.wikidata.org/wiki/Q136551855",
        musicbrainz: "13afa63c-8164-4697-9cad-c5100062a154",
        musicbrainzUrl: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
        isni: "0000000528931015",
        discogs: "16872046",
        discogsUrl: "https://www.discogs.com/artist/16872046",
        residentAdvisor: "djzeneyer",
        residentAdvisorUrl: "https://pt-br.ra.co/dj/djzeneyer",
        danceWikiFandom: "https://dance.fandom.com/wiki/Zen_Eyer"
      },
      // 📱 Redes Sociais / Plataformas
      social: {
        instagram: { handle: "@djzeneyer", url: "https://instagram.com/djzeneyer" },
        facebook: { handle: "djzeneyer", url: "https://facebook.com/djzeneyer" },
        youtube: { handle: "@djzeneyer", url: "https://www.youtube.com/@djzeneyer" },
        soundcloud: { handle: "djzeneyer", url: "https://soundcloud.com/djzeneyer" },
        spotify: {
          id: "68SHKGndTlq3USQ2LZmyLw",
          url: "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
        },
        appleMusic: { url: "https://music.apple.com/us/artist/zen-eyer/1439280950" },
        bandsintown: { url: "https://www.bandsintown.com/a/15552355-dj-zen-eyer" },
        mixcloud: { url: "https://www.mixcloud.com/zeneyer" }
      },
      // 📍 Contato
      contact: {
        email: "booking@djzeneyer.com",
        whatsapp: {
          number: "5521987413091",
          display: "+55 21 98741-3091"
        },
        location: {
          city: "Niter\xF3i",
          state: "RJ",
          country: "Brazil",
          areaDetail: "Born in Rio de Janeiro, based in Niter\xF3i"
        }
      },
      // 💡 Filosofia & Marca
      philosophy: {
        slogan: "A pressa \xE9 inimiga da cremosidade",
        style: "Cremosidade",
        styleDefinition: "Smooth, continuous Brazilian Zouk musical flow with long, seamless transitions that preserve emotional tension on the dance floor.",
        mission: "Bring the soul and passion of Brazilian Zouk to dancers around the world through immersive DJ sets and creative remixes."
      },
      // 🌐 Site / Navegação
      site: {
        baseUrl: "https://djzeneyer.com",
        defaultDescription: "Official website of DJ Zen Eyer, Brazilian Zouk DJ and music producer from Rio de Janeiro, member of Mensa International and 2\xD7 world champion at Ilha do Zouk DJ Championship.",
        pages: {
          home: "/",
          about: "/about",
          events: "/events",
          music: "/music",
          tribe: "/zentribe",
          presskit: "/work-with-me",
          shop: "/shop",
          faq: "/faq"
        }
      }
    };
    getWhatsAppUrl = (message) => {
      const defaultMsg = "Ol\xE1 Zen Eyer! Gostaria de conversar sobre booking.";
      return `https://wa.me/${ARTIST.contact.whatsapp.number}?text=${encodeURIComponent(
        message || defaultMsg
      )}`;
    };
    getSocialUrls = () => Object.values(ARTIST.social).map((s) => s.url);
    getVerificationUrls = () => [
      ARTIST.identifiers.wikidataUrl,
      ARTIST.identifiers.musicbrainzUrl,
      ARTIST.identifiers.discogsUrl,
      ARTIST.identifiers.residentAdvisorUrl,
      ARTIST.identifiers.danceWikiFandom
    ];
    ARTIST_SCHEMA_BASE = {
      "@type": "Person",
      "@id": `${ARTIST.site.baseUrl}/#artist`,
      name: ARTIST.identity.stageName,
      alternateName: [ARTIST.identity.shortName, ARTIST.identity.fullName],
      jobTitle: "Brazilian Zouk DJ and music producer",
      description: `${ARTIST.titles.primary}. Member of ${ARTIST.mensa.organization}. Known for the "${ARTIST.philosophy.style}" musical style.`,
      genre: ["Brazilian Zouk", "Zouk", "Dance Music"],
      knowsAbout: ["Brazilian Zouk", "DJing", "Music Production", "Remixing", "Festival Performance"],
      url: ARTIST.site.baseUrl,
      image: `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`,
      sameAs: [...getSocialUrls(), ...getVerificationUrls()],
      award: [
        {
          "@type": "Award",
          name: "Ilha do Zouk DJ Championship winner",
          datePublished: "2022"
        },
        {
          "@type": "Award",
          name: "Ilha do Zouk Best Remix winner",
          datePublished: "2022"
        }
      ],
      memberOf: {
        "@type": "Organization",
        name: ARTIST.mensa.organization,
        url: ARTIST.mensa.url
      }
    };
  }
});

// src/utils/seo.ts
var ensureTrailingSlash, getHrefLangUrls;
var init_seo = __esm({
  "src/utils/seo.ts"() {
    ensureTrailingSlash = (url) => {
      if (!url) return "/";
      if (url.endsWith("/")) return url;
      const hasQuery = url.includes("?");
      const hasHash = url.includes("#");
      if (hasQuery || hasHash) {
        const [basePath, ...rest] = url.split(/(\?|#)/);
        return `${basePath}/${rest.join("")}`;
      }
      if (/\.[a-z0-9]{2,4}$/i.test(url)) return url;
      return `${url}/`;
    };
    getHrefLangUrls = (path, baseUrl) => {
      const cleanPath = path.replace(/^\/pt/, "").replace(/^\//, "").replace(/\/$/, "") || "/";
      const suffix = cleanPath === "/" ? "" : `/${cleanPath}/`;
      const enUrl = ensureTrailingSlash(`${baseUrl}${suffix}`);
      const ptUrl = ensureTrailingSlash(`${baseUrl}/pt${suffix}`);
      return [
        { lang: "en", url: enUrl },
        { lang: "pt-BR", url: ptUrl },
        { lang: "x-default", url: enUrl }
      ];
    };
  }
});

// src/components/HeadlessSEO.tsx
import React2 from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
var ensureAbsoluteUrl, HeadlessSEO;
var init_HeadlessSEO = __esm({
  "src/components/HeadlessSEO.tsx"() {
    init_artistData();
    init_routes();
    init_seo();
    ensureAbsoluteUrl = (u, baseUrl) => {
      if (!u) return baseUrl;
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      const cleanBase = baseUrl.replace(/\/$/, "");
      const cleanPath = u.replace(/^\//, "");
      return `${cleanBase}/${cleanPath}`;
    };
    HeadlessSEO = ({
      data,
      schema,
      title,
      description,
      url,
      image,
      type = "website",
      hrefLang = [],
      noindex = false,
      keywords,
      isHomepage = false,
      preload = [],
      locale
    }) => {
      const baseUrl = ARTIST.site.baseUrl;
      const { i18n } = useTranslation();
      const location = useLocation();
      const currentLang = i18n.language || "en";
      const computedHrefLang = React2.useMemo(() => {
        if (hrefLang && hrefLang.length > 0) return hrefLang;
        const links = [];
        const siteUrlClean = baseUrl.replace(/\/$/, "");
        const currentPathNormalized = location.pathname.startsWith("/") ? location.pathname : `/${location.pathname}`;
        const currentFullUrl = ensureTrailingSlash(`${siteUrlClean}${currentPathNormalized}`);
        links.push({
          lang: currentLang === "pt" ? "pt-BR" : "en",
          url: currentFullUrl
        });
        try {
          const alternates = getAlternateLinks(location.pathname, currentLang);
          Object.entries(alternates).forEach(([lang, path]) => {
            const safePath = path.startsWith("/") ? path : `/${path}`;
            const url2 = ensureTrailingSlash(`${siteUrlClean}${safePath}`);
            if (lang === "x-default") {
              links.push({ lang: "x-default", url: url2 });
            } else {
              links.push({ lang: lang === "pt" ? "pt-BR" : "en", url: url2 });
            }
          });
        } catch (err) {
          console.error("Error generating alternate links:", err);
        }
        return links;
      }, [hrefLang, location.pathname, currentLang, baseUrl]);
      const finalTitle = data?.title || title || "DJ Zen Eyer | World Champion Brazilian Zouk DJ";
      const finalDescription = data?.desc || description || ARTIST.site.defaultDescription;
      const truncatedDesc = finalDescription.length > 160 ? `${finalDescription.substring(0, 157)}...` : finalDescription;
      const finalUrlRaw = data?.canonical || url || baseUrl;
      const absoluteUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);
      const finalUrl = ensureTrailingSlash(absoluteUrl);
      const defaultImage = `${baseUrl}/images/zen-eyer-og-image.jpg`;
      const finalImage = ensureAbsoluteUrl(data?.image || image || defaultImage, baseUrl);
      const shouldNoIndex = data?.noindex || noindex;
      let currentLocale = locale;
      if (!currentLocale) {
        currentLocale = finalUrl.includes("/pt/") ? "pt_BR" : "en_US";
      }
      const htmlLangAttribute = currentLocale === "pt_BR" ? "pt-BR" : "en";
      const nameParts = ARTIST.identity.fullName.split(" ").filter(Boolean);
      const authorFirstName = nameParts[0] || ARTIST.identity.stageName;
      const authorLastName = nameParts.slice(1).join(" ") || ARTIST.identity.stageName;
      const isProfileType = type === "profile";
      let finalSchema = schema;
      if (!finalSchema && isHomepage) {
        finalSchema = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${baseUrl}/#website`,
              url: baseUrl,
              name: "DJ Zen Eyer - Official Website",
              description: ARTIST.site.defaultDescription,
              publisher: { "@id": `${baseUrl}/#artist` },
              inLanguage: ["en", "pt-BR"]
            },
            { ...ARTIST_SCHEMA_BASE, "@id": `${baseUrl}/#artist` },
            {
              "@type": "WebPage",
              "@id": `${baseUrl}/#webpage`,
              url: baseUrl,
              name: finalTitle,
              isPartOf: { "@id": `${baseUrl}/#website` },
              about: { "@id": `${baseUrl}/#artist` },
              description: truncatedDesc,
              inLanguage: htmlLangAttribute
            }
          ]
        };
      } else if (!finalSchema) {
        finalSchema = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: finalTitle,
          description: truncatedDesc,
          url: finalUrl
        };
      }
      return /* @__PURE__ */ React2.createElement(Helmet, null, /* @__PURE__ */ React2.createElement("html", { lang: htmlLangAttribute }), /* @__PURE__ */ React2.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ React2.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), /* @__PURE__ */ React2.createElement("meta", { name: "theme-color", content: "#000000" }), preload.map((item, index) => /* @__PURE__ */ React2.createElement("link", { key: `preload-${index}`, rel: "preload", ...item })), /* @__PURE__ */ React2.createElement("title", null, finalTitle), /* @__PURE__ */ React2.createElement("meta", { name: "description", content: truncatedDesc }), /* @__PURE__ */ React2.createElement("link", { rel: "canonical", href: finalUrl }), keywords && /* @__PURE__ */ React2.createElement("meta", { name: "keywords", content: keywords }), /* @__PURE__ */ React2.createElement("meta", { name: "author", content: ARTIST.identity.stageName }), /* @__PURE__ */ React2.createElement("meta", { name: "creator", content: ARTIST.identity.fullName }), /* @__PURE__ */ React2.createElement("meta", { name: "publisher", content: ARTIST.identity.stageName }), /* @__PURE__ */ React2.createElement("meta", { name: "subject", content: "Brazilian Zouk DJ & Music Producer" }), /* @__PURE__ */ React2.createElement(
        "meta",
        {
          name: "robots",
          content: shouldNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      ), /* @__PURE__ */ React2.createElement("meta", { property: "og:site_name", content: "DJ Zen Eyer" }), /* @__PURE__ */ React2.createElement("meta", { property: "og:type", content: type }), /* @__PURE__ */ React2.createElement("meta", { property: "og:title", content: finalTitle }), /* @__PURE__ */ React2.createElement("meta", { property: "og:description", content: truncatedDesc }), /* @__PURE__ */ React2.createElement("meta", { property: "og:url", content: finalUrl }), /* @__PURE__ */ React2.createElement("meta", { property: "og:image", content: finalImage }), /* @__PURE__ */ React2.createElement("meta", { property: "og:image:secure_url", content: finalImage }), /* @__PURE__ */ React2.createElement("meta", { property: "og:image:width", content: "1200" }), /* @__PURE__ */ React2.createElement("meta", { property: "og:image:height", content: "630" }), /* @__PURE__ */ React2.createElement("meta", { property: "og:locale", content: currentLocale }), /* @__PURE__ */ React2.createElement("meta", { property: "og:locale:alternate", content: currentLocale === "en_US" ? "pt_BR" : "en_US" }), isProfileType && /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("meta", { property: "profile:first_name", content: authorFirstName }), /* @__PURE__ */ React2.createElement("meta", { property: "profile:last_name", content: authorLastName }), /* @__PURE__ */ React2.createElement("meta", { property: "profile:username", content: "djzeneyer" })), /* @__PURE__ */ React2.createElement("meta", { name: "twitter:card", content: "summary_large_image" }), /* @__PURE__ */ React2.createElement("meta", { name: "twitter:title", content: finalTitle }), /* @__PURE__ */ React2.createElement("meta", { name: "twitter:description", content: truncatedDesc }), /* @__PURE__ */ React2.createElement("meta", { name: "twitter:image", content: finalImage }), /* @__PURE__ */ React2.createElement("meta", { name: "twitter:site", content: "@djzeneyer" }), /* @__PURE__ */ React2.createElement("meta", { name: "twitter:creator", content: "@djzeneyer" }), computedHrefLang.map(({ lang, url: hrefUrl }) => /* @__PURE__ */ React2.createElement("link", { key: lang, rel: "alternate", hrefLang: lang, href: hrefUrl })), finalSchema && /* @__PURE__ */ React2.createElement("script", { type: "application/ld+json" }, JSON.stringify(finalSchema).replace(/</g, "\\u003c")));
    };
  }
});

// src/config/api.ts
var getApiConfig, getRestUrl, getSiteUrl, isProduction, isDevelopment, buildApiUrl;
var init_api = __esm({
  "src/config/api.ts"() {
    getApiConfig = () => {
      if (window.wpData?.restUrl) {
        return {
          siteUrl: window.wpData.siteUrl || "",
          restUrl: window.wpData.restUrl || "",
          nonce: window.wpData.nonce || "",
          turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || ""
        };
      }
      return {
        siteUrl: import.meta.env.VITE_WP_SITE_URL || "https://djzeneyer.com",
        restUrl: import.meta.env.VITE_WP_REST_URL || "https://djzeneyer.com/wp-json/",
        nonce: "dev-nonce",
        turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || ""
      };
    };
    getRestUrl = () => {
      const config = getApiConfig();
      return config.restUrl.replace(/\/$/, "");
    };
    getSiteUrl = () => {
      const config = getApiConfig();
      return config.siteUrl;
    };
    isProduction = () => {
      return !!window.wpData?.restUrl;
    };
    isDevelopment = () => {
      return !isProduction();
    };
    buildApiUrl = (endpoint, params) => {
      const baseUrl = getRestUrl();
      const cleanEndpoint = endpoint.replace(/^\//, "");
      let url = `${baseUrl}/${cleanEndpoint}`;
      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }
      return url;
    };
    if (isDevelopment()) {
      console.log("[API Config] \u{1F527} Modo Desenvolvimento");
      console.log("[API Config] \u{1F4CD} REST URL:", getRestUrl());
      console.log("[API Config] \u{1F310} Site URL:", getSiteUrl());
    }
  }
});

// src/config/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
var STALE_TIME, CACHE_TIME, queryClient, QUERY_KEYS;
var init_queryClient = __esm({
  "src/config/queryClient.ts"() {
    STALE_TIME = {
      /** Menu: 5 minutos (muda raramente) */
      MENU: 5 * 60 * 1e3,
      /** Eventos: 2 minutos (pode ter atualizações frequentes) */
      EVENTS: 2 * 60 * 1e3,
      /** Músicas: 5 minutos (catálogo estável) */
      TRACKS: 5 * 60 * 1e3,
      /** Produtos: 3 minutos (preços podem mudar) */
      PRODUCTS: 3 * 60 * 1e3,
      /** Carrinho: 30 segundos (muda frequentemente) */
      CART: 30 * 1e3,
      /** Perfil do usuário: 5 minutos */
      USER_PROFILE: 5 * 60 * 1e3,
      /** GamiPress: 1 minuto (pontos/achievements atualizam rápido) */
      GAMIPRESS: 1 * 60 * 1e3
    };
    CACHE_TIME = {
      /** Padrão: 10 minutos */
      DEFAULT: 10 * 60 * 1e3,
      /** Dados estáticos: 30 minutos */
      STATIC: 30 * 60 * 1e3,
      /** Dados dinâmicos: 5 minutos */
      DYNAMIC: 5 * 60 * 1e3
    };
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Cache padrão: 5 minutos
          staleTime: STALE_TIME.TRACKS,
          // Garbage collection: 10 minutos
          gcTime: CACHE_TIME.DEFAULT,
          // Refetch ao focar na janela (útil para dados que mudam frequentemente)
          refetchOnWindowFocus: false,
          // Refetch ao reconectar (útil para mobile)
          refetchOnReconnect: true,
          // Retry automático com backoff exponencial
          retry: 2,
          retryDelay: (attemptIndex) => Math.min(1e3 * 2 ** attemptIndex, 3e4),
          // Não refetch automaticamente em mount (usa cache)
          refetchOnMount: false
        },
        mutations: {
          // Retry para mutations (POST, PUT, DELETE)
          retry: 1
        }
      }
    });
    QUERY_KEYS = {
      /** Menu de navegação */
      menu: {
        all: ["menu"],
        list: (lang) => ["menu", "list", lang]
      },
      /** Eventos */
      events: {
        all: ["events"],
        list: (limit) => ["events", "list", limit],
        detail: (id) => ["events", "detail", id]
      },
      /** Músicas/Tracks */
      tracks: {
        all: ["tracks"],
        list: (filters) => ["tracks", "list", filters],
        detail: (slug) => ["tracks", "detail", slug]
      },
      /** Produtos (Shop) */
      products: {
        all: ["products"],
        list: (lang) => ["products", "list", lang],
        detail: (id) => ["products", "detail", id]
      },
      /** Carrinho */
      cart: {
        current: ["cart", "current"]
      },
      /** Usuário */
      user: {
        profile: (userId) => ["user", "profile", userId],
        gamipress: (userId) => ["user", "gamipress", userId]
      }
    };
  }
});

// src/hooks/useQueries.ts
import { useQuery } from "@tanstack/react-query";
var useEventsQuery, useTracksQuery;
var init_useQueries = __esm({
  "src/hooks/useQueries.ts"() {
    init_api();
    init_queryClient();
    useEventsQuery = (limit = 10) => {
      return useQuery({
        queryKey: QUERY_KEYS.events.list(limit),
        queryFn: async () => {
          const apiUrl = buildApiUrl("zen-bit/v1/events", { limit: String(limit) });
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error(`API ${res.status}`);
          const data = await res.json();
          return data.success && Array.isArray(data.events) ? data.events : [];
        },
        staleTime: STALE_TIME.EVENTS,
        retry: 2
      });
    };
    useTracksQuery = () => {
      return useQuery({
        queryKey: QUERY_KEYS.tracks.list(),
        queryFn: async () => {
          const apiUrl = buildApiUrl("wp/v2/remixes", {
            per_page: "100",
            // OPTIMIZATION: Limit fields to reduce payload size
            _fields: "id,title,category_name,tag_names,links,featured_image_src"
          });
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error("Failed to fetch tracks");
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        },
        staleTime: STALE_TIME.TRACKS,
        gcTime: 15 * 60 * 1e3
      });
    };
  }
});

// src/components/EventsList.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation as useTranslation2 } from "react-i18next";
import { Calendar, MapPin, ExternalLink, Clock, Ticket } from "lucide-react";
function EventsList({ limit = 10, showTitle = true, variant = "full" }) {
  const { t, i18n } = useTranslation2();
  const currentLocale = i18n.language.startsWith("pt") ? "pt-BR" : "en-US";
  const { data: events = [], isLoading: loading, error } = useEventsQuery(limit);
  if (error) {
    console.error("Error fetching events:", error);
  }
  const formatDate2 = (date, options) => {
    return date.toLocaleDateString(currentLocale, options);
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString(currentLocale, { hour: "2-digit", minute: "2-digit" });
  };
  const getCompleteEventData = (event) => {
    const eventDate = new Date(event.datetime);
    const endDate = new Date(eventDate.getTime() + 4 * 60 * 60 * 1e3);
    const venueName = event.venue?.name || "Local a definir";
    const city = event.venue?.city || "City";
    const country = event.venue?.country || "BR";
    const region = event.venue?.region || "";
    const currency = country === "Brazil" || country === "BR" || country === "Brasil" ? "BRL" : "USD";
    return {
      // SEO: Imagem é recomendada/obrigatória para Rich Cards
      image: event.image || "/images/event-default.svg",
      // SEO: Descrição é recomendada. Geramos uma automática se faltar.
      description: event.description || `DJ Zen Eyer performing live Brazilian Zouk set at ${venueName} in ${city}, ${country}.`,
      endDate: endDate.toISOString(),
      locationName: venueName,
      city,
      region,
      country,
      // SEO: Offers é recomendado
      price: "0",
      priceCurrency: currency
    };
  };
  const jsonLdMarkup = useMemo(() => {
    if (events.length === 0) return null;
    const renderEventJsonLd = (event) => {
      const completeData = getCompleteEventData(event);
      const ticketUrl = event.offers?.[0]?.url || event.url || "https://djzeneyer.com/events";
      return {
        "@type": "MusicEvent",
        name: event.title || "DJ Zen Eyer Live",
        description: completeData.description,
        startDate: event.datetime,
        endDate: completeData.endDate,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: completeData.image,
        location: {
          "@type": "Place",
          name: completeData.locationName,
          address: {
            "@type": "PostalAddress",
            addressLocality: completeData.city,
            addressRegion: completeData.region,
            addressCountry: completeData.country
          }
        },
        performer: {
          "@type": "MusicGroup",
          name: "DJ Zen Eyer",
          genre: "Brazilian Zouk",
          url: "https://djzeneyer.com",
          sameAs: [
            "https://www.instagram.com/djzeneyer/",
            "https://soundcloud.com/djzeneyer",
            "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
          ]
        },
        organizer: {
          "@type": "Organization",
          name: completeData.locationName,
          // Usa o local como organizador se não houver outro
          url: ticketUrl
        },
        offers: {
          "@type": "Offer",
          url: ticketUrl,
          availability: "https://schema.org/InStock",
          price: completeData.price,
          priceCurrency: completeData.priceCurrency,
          validFrom: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    };
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EventSeries",
      name: "Zen Eyer World Tour",
      url: `https://djzeneyer.com/${i18n.language}/events`,
      description: "Official tour dates for DJ Zen Eyer, two-time world champion Brazilian Zouk DJ",
      performer: {
        "@type": "MusicGroup",
        name: "DJ Zen Eyer",
        url: "https://djzeneyer.com"
      },
      subEvent: events.map(renderEventJsonLd)
    }).replace(/</g, "\\u003c");
  }, [events, i18n.language]);
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center py-12", role: "status" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, t("events.loading", "Loading events...")));
  }
  if (events.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "text-center py-12 text-white/60" }, /* @__PURE__ */ React.createElement(Calendar, { size: 48, className: "mx-auto mb-4 text-white/20", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("p", null, t("events.noEvents", "No events scheduled at the moment. Check back soon!")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "w-full" }, variant === "full" && showTitle && /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold mb-8 text-center font-display text-white" }, t("events.title", "Upcoming Events")), /* @__PURE__ */ React.createElement("div", { className: variant === "compact" ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, events.map((event, index) => {
    const eventDate = new Date(event.datetime);
    const completeData = getCompleteEventData(event);
    const ticketUrl = event.offers?.[0]?.url || event.url;
    const eventLocation = `${completeData.city}, ${completeData.country}`;
    const formattedDate = formatDate2(eventDate, { day: "numeric", month: "long", year: "numeric" });
    const formattedTime = formatTime(eventDate);
    const ariaLabel = t(
      "events.ticketAriaLabel",
      "View tickets for {{title}} at {{location}}",
      { title: event.title, location: eventLocation }
    );
    if (variant === "compact") {
      return /* @__PURE__ */ React.createElement(
        motion.article,
        {
          key: event.id,
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: index * 0.1 },
          className: "card hover:border-primary/50 transition-all duration-300 group"
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4 p-4" }, /* @__PURE__ */ React.createElement("time", { dateTime: event.datetime, className: "flex-shrink-0 text-center bg-surface rounded-lg p-3 border border-white/10" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-primary" }, eventDate.getDate()), /* @__PURE__ */ React.createElement("div", { className: "text-xs uppercase text-white/60" }, formatDate2(eventDate, { month: "short" }))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors" }, event.title), /* @__PURE__ */ React.createElement("div", { className: "space-y-1 text-sm text-white/70" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(MapPin, { size: 14, className: "flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, completeData.locationName)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Clock, { size: 14, className: "flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "truncate" }, eventLocation)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
          "a",
          {
            href: ticketUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "btn btn-sm btn-primary flex-shrink-0 flex items-center gap-2",
            "aria-label": ariaLabel
          },
          /* @__PURE__ */ React.createElement(Ticket, { size: 14 }),
          /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, t("events.tickets", "Tickets"))
        )))
      );
    }
    return /* @__PURE__ */ React.createElement(
      motion.article,
      {
        key: event.id,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.1 },
        className: "card group hover:border-primary/50 transition-all duration-300 overflow-hidden"
      },
      /* @__PURE__ */ React.createElement("div", { className: "relative h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" }), event.image ? /* @__PURE__ */ React.createElement("img", { src: event.image, alt: "", className: "absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" }) : null, /* @__PURE__ */ React.createElement("time", { dateTime: event.datetime, className: "relative z-10 text-center drop-shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl font-bold text-primary" }, eventDate.getDate()), /* @__PURE__ */ React.createElement("div", { className: "text-xl uppercase text-white/90 font-semibold" }, formatDate2(eventDate, { month: "short" })), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-white/80" }, eventDate.getFullYear()))),
      /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-white" }, event.title), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4 text-sm text-white/70" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ React.createElement(MapPin, { size: 16, className: "flex-shrink-0 mt-0.5 text-primary" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-semibold text-white" }, completeData.locationName), /* @__PURE__ */ React.createElement("div", null, completeData.city, ", ", completeData.country))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calendar, { size: 16, className: "flex-shrink-0 text-secondary" }), /* @__PURE__ */ React.createElement("span", null, formattedDate)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Clock, { size: 16, className: "flex-shrink-0 text-accent" }), /* @__PURE__ */ React.createElement("span", null, formattedTime))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
        "a",
        {
          href: ticketUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "btn btn-primary w-full flex items-center justify-center gap-2 group/btn",
          "aria-label": ariaLabel
        },
        /* @__PURE__ */ React.createElement(Ticket, { size: 18 }),
        /* @__PURE__ */ React.createElement("span", null, t("events.viewTickets", "View Tickets")),
        /* @__PURE__ */ React.createElement(ExternalLink, { size: 16, className: "group-hover/btn:translate-x-1 transition-transform" })
      )))
    );
  })), jsonLdMarkup && /* @__PURE__ */ React.createElement(
    "script",
    {
      type: "application/ld+json",
      dangerouslySetInnerHTML: { __html: jsonLdMarkup }
    }
  ));
}
var init_EventsList = __esm({
  "src/components/EventsList.tsx"() {
    init_useQueries();
  }
});

// src/pages/HomePage.tsx
import React3, { useMemo as useMemo2, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as motion2 } from "framer-motion";
import { useTranslation as useTranslation3 } from "react-i18next";
import {
  PlayCircle,
  Calendar as Calendar2,
  Users,
  Music,
  Award,
  Trophy,
  Globe,
  Mail,
  ExternalLink as ExternalLink2,
  Sparkles,
  Download
} from "lucide-react";
var FEATURES_DATA, FESTIVALS_HIGHLIGHT, STATS, CONTAINER_VARIANTS, ITEM_VARIANTS, StatCard, FeatureCard, FestivalBadge, HomePage, HomePage_default;
var init_HomePage = __esm({
  "src/pages/HomePage.tsx"() {
    init_HeadlessSEO();
    init_artistData();
    init_EventsList();
    FEATURES_DATA = [
      { id: "music", icon: /* @__PURE__ */ React3.createElement(Music, { size: 32 }), titleKey: "home_feat_exclusive_title", descKey: "home_feat_exclusive_desc" },
      { id: "achievements", icon: /* @__PURE__ */ React3.createElement(Award, { size: 32 }), titleKey: "home_feat_achievements_title", descKey: "home_feat_achievements_desc" },
      { id: "community", icon: /* @__PURE__ */ React3.createElement(Users, { size: 32 }), titleKey: "home_feat_community_title", descKey: "home_feat_community_desc" }
    ];
    FESTIVALS_HIGHLIGHT = ARTIST.festivals.slice(0, 6);
    STATS = [
      { value: "2\xD7", label: "World Champion", icon: Trophy },
      { value: `${ARTIST.stats.countriesPlayed}+`, label: "Countries", icon: Globe },
      { value: `${ARTIST.stats.yearsActive}+`, label: "Years Active", icon: Sparkles }
    ];
    CONTAINER_VARIANTS = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };
    ITEM_VARIANTS = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };
    StatCard = React3.memo(({ value, label, icon: Icon }) => /* @__PURE__ */ React3.createElement(motion2.div, { className: "text-center p-4", variants: ITEM_VARIANTS, whileHover: { scale: 1.05 } }, /* @__PURE__ */ React3.createElement(Icon, { className: "w-6 h-6 mx-auto mb-2 text-primary", "aria-hidden": "true" }), /* @__PURE__ */ React3.createElement("div", { className: "text-3xl md:text-4xl font-bold text-white font-display" }, value), /* @__PURE__ */ React3.createElement("div", { className: "text-sm text-white/70 uppercase tracking-wider" }, label)));
    FeatureCard = React3.memo(({ icon, title, description, variants }) => /* @__PURE__ */ React3.createElement(motion2.article, { className: "card p-8 text-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors", variants }, /* @__PURE__ */ React3.createElement("div", { className: "text-primary inline-block p-4 bg-primary/10 rounded-full mb-4" }, icon), /* @__PURE__ */ React3.createElement("h3", { className: "text-xl font-semibold mb-2" }, title), /* @__PURE__ */ React3.createElement("p", { className: "text-white/70" }, description)));
    FestivalBadge = React3.memo(({ name, flag }) => /* @__PURE__ */ React3.createElement("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors cursor-default" }, /* @__PURE__ */ React3.createElement("span", { role: "img", "aria-label": `Flag of ${name}` }, flag), /* @__PURE__ */ React3.createElement("span", null, name)));
    HomePage = () => {
      const { t, i18n } = useTranslation3();
      const [seoSettings, setSeoSettings] = useState(null);
      const isPortuguese = i18n.language?.startsWith("pt");
      const currentPath = "/";
      const currentUrl = ARTIST.site.baseUrl;
      useEffect(() => {
        const wpRestUrl = window.wpData?.restUrl || "https://djzeneyer.com/wp-json";
        fetch(`${wpRestUrl}/zen-seo/v1/settings`).then((res) => res.json()).then((response) => {
          if (response.success) {
            setSeoSettings(response.data);
          }
        }).catch((err) => console.error("Zen SEO Plugin not reachable:", err));
      }, []);
      const schemaData = useMemo2(() => ({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${ARTIST.site.baseUrl}/#website`,
            "url": ARTIST.site.baseUrl,
            "name": seoSettings?.real_name || "DJ Zen Eyer - Official Website",
            "description": "Official website of DJ Zen Eyer, 2\xD7 World Champion Brazilian Zouk DJ & Producer",
            "publisher": { "@id": `${ARTIST.site.baseUrl}/#artist` },
            "inLanguage": ["en", "pt-BR"],
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${ARTIST.site.baseUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          },
          {
            ...ARTIST_SCHEMA_BASE,
            "@id": `${ARTIST.site.baseUrl}/#artist`,
            "name": seoSettings?.real_name || "DJ Zen Eyer",
            "nationality": { "@type": "Country", "name": "Brazil" },
            "birthDate": ARTIST.identity.birthDate,
            "jobTitle": "DJ & Music Producer",
            "knowsAbout": ["Brazilian Zouk", "Music Production", "DJing", "Remixing", "Kizomba"],
            "homeLocation": {
              "@type": "Place",
              "address": { "@type": "PostalAddress", "addressLocality": "S\xE3o Paulo", "addressRegion": "SP", "addressCountry": "BR" }
            },
            "award": [
              { "@type": "Award", "name": "Best Remix", "description": "Brazilian Zouk World Championships", "dateAwarded": "2022" },
              { "@type": "Award", "name": "Best DJ Performance", "description": "Brazilian Zouk World Championships", "dateAwarded": "2022" }
            ],
            "hasOccupation": [
              {
                "@type": "Occupation",
                "name": "DJ",
                "skills": "Audio Mixing, Playlist Curation, Live Performance",
                "occupationalCategory": "27-2099.00"
              },
              {
                "@type": "Occupation",
                "name": "Music Producer",
                "skills": "Audio Engineering, Remixing, Mastering"
              }
            ],
            "performerIn": FESTIVALS_HIGHLIGHT.map((f) => ({
              "@type": "MusicEvent",
              "name": f.name,
              "startDate": f.date,
              "location": {
                "@type": "Place",
                "name": f.country,
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": f.country
                }
              },
              "eventStatus": "https://schema.org/EventScheduled",
              "performer": { "@id": `${ARTIST.site.baseUrl}/#artist` }
            }))
          },
          {
            "@type": "WebPage",
            "@id": `${ARTIST.site.baseUrl}/#webpage`,
            "url": ARTIST.site.baseUrl,
            "name": "DJ Zen Eyer | 2\xD7 World Champion Brazilian Zouk DJ & Producer",
            "description": "Two-time world champion DJ specializing in Brazilian Zouk. Book for international festivals and exclusive events.",
            "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
            "primaryImageOfPage": {
              "@type": "ImageObject",
              "url": seoSettings?.default_og_image || `${ARTIST.site.baseUrl}/images/hero-background.webp`,
              "width": 1920,
              "height": 1080
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": ARTIST.site.baseUrl }]
            }
          }
        ]
      }), [isPortuguese, currentUrl, seoSettings]);
      return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(
        HeadlessSEO,
        {
          title: seoSettings?.real_name ? `${seoSettings.real_name} | 2\xD7 World Champion` : "DJ Zen Eyer | 2\xD7 World Champion Brazilian Zouk DJ & Producer",
          description: `DJ Zen Eyer, two-time world champion. Creator of "${ARTIST.philosophy.slogan}".`,
          url: currentUrl,
          image: seoSettings?.default_og_image || `${currentUrl}/images/zen-eyer-og-image.jpg`,
          isHomepage: true,
          schema: schemaData,
          keywords: "DJ Zen Eyer, Brazilian Zouk DJ, Zouk Brasileiro, world champion DJ, Brazilian Zouk music, dance festival DJ, Zouk producer"
        }
      ), /* @__PURE__ */ React3.createElement("section", { className: "relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-12", "aria-label": "Introduction" }, /* @__PURE__ */ React3.createElement("div", { className: "absolute inset-0 z-0 bg-black" }, /* @__PURE__ */ React3.createElement(motion2.div, { initial: { scale: 1.1 }, animate: { scale: 1 }, transition: { duration: 12, ease: "linear" }, className: "w-full h-full" }, /* @__PURE__ */ React3.createElement("picture", null, /* @__PURE__ */ React3.createElement("source", { media: "(max-width: 768px)", srcSet: "/images/hero-background-mobile.webp" }), /* @__PURE__ */ React3.createElement("source", { media: "(min-width: 769px)", srcSet: "/images/hero-background.webp" }), /* @__PURE__ */ React3.createElement(
        "img",
        {
          src: "/images/hero-background.webp",
          alt: "DJ Zen Eyer performing a live Brazilian Zouk set with immersive lighting at an international festival",
          className: "w-full h-full object-cover object-center opacity-40",
          width: "1920",
          height: "1080",
          loading: "eager",
          fetchPriority: "high",
          decoding: "async"
        }
      ))), /* @__PURE__ */ React3.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" })), /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4 relative z-10" }, /* @__PURE__ */ React3.createElement(motion2.div, { className: "max-w-4xl mx-auto", initial: "hidden", animate: "visible", variants: CONTAINER_VARIANTS }, /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "mb-6" }, /* @__PURE__ */ React3.createElement("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium backdrop-blur-sm" }, /* @__PURE__ */ React3.createElement(Trophy, { size: 16 }), /* @__PURE__ */ React3.createElement("span", { className: "font-semibold" }, "2\xD7 World Champion - Zouk World Championships"))), /* @__PURE__ */ React3.createElement(motion2.h1, { variants: ITEM_VARIANTS, className: "text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-4 tracking-tight" }, "DJ Zen Eyer"), /* @__PURE__ */ React3.createElement(motion2.p, { variants: ITEM_VARIANTS, className: "text-xl md:text-2xl text-white/90 mb-2 font-light" }, isPortuguese ? "Bicampe\xE3o Mundial de Zouk Brasileiro" : "2\xD7 World Champion Brazilian Zouk DJ & Producer"), /* @__PURE__ */ React3.createElement(motion2.p, { variants: ITEM_VARIANTS, className: "text-lg md:text-xl italic text-primary/90 mb-8" }, '"', ARTIST.philosophy.slogan, '" \u2122'), /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto mb-10" }, STATS.map((stat) => /* @__PURE__ */ React3.createElement(StatCard, { key: stat.label, ...stat }))), /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap gap-4 justify-center mb-6" }, /* @__PURE__ */ React3.createElement(
        "a",
        {
          href: ARTIST.social.soundcloud.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "btn btn-primary btn-lg flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow",
          "aria-label": "Listen to DJ Zen Eyer on SoundCloud"
        },
        /* @__PURE__ */ React3.createElement(PlayCircle, { size: 22 }),
        /* @__PURE__ */ React3.createElement("span", null, isPortuguese ? "Ouvir no SoundCloud" : "Listen on SoundCloud")
      ), /* @__PURE__ */ React3.createElement(
        Link,
        {
          to: isPortuguese ? "/pt/contrate" : "/work-with-me",
          className: "btn btn-outline btn-lg flex items-center gap-2 backdrop-blur-sm",
          "aria-label": "Book DJ Zen Eyer or Get Press Kit"
        },
        /* @__PURE__ */ React3.createElement(Mail, { size: 22 }),
        /* @__PURE__ */ React3.createElement("span", null, isPortuguese ? "Contrate / Press Kit" : "Booking / Press Kit")
      )), /* @__PURE__ */ React3.createElement(motion2.p, { variants: ITEM_VARIANTS, className: "text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed" }, isPortuguese ? "Sets completos e remixes exclusivos. Para agenda, v\xE1 para Events. Para bookings, acesse Work With Me." : "Full sets and exclusive remixes. Check Events for schedule. Head to Work With Me for bookings."))), /* @__PURE__ */ React3.createElement(motion2.div, { className: "absolute bottom-8 left-1/2 -translate-x-1/2", animate: { y: [0, 10, 0] }, transition: { repeat: Infinity, duration: 2 }, "aria-hidden": "true" }, /* @__PURE__ */ React3.createElement("div", { className: "w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm" }, /* @__PURE__ */ React3.createElement("div", { className: "w-1.5 h-3 bg-white/50 rounded-full mt-2" })))), /* @__PURE__ */ React3.createElement("section", { className: "py-20 bg-surface", id: "about" }, /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React3.createElement(motion2.div, { className: "max-w-4xl mx-auto", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: CONTAINER_VARIANTS }, /* @__PURE__ */ React3.createElement(motion2.article, { variants: ITEM_VARIANTS, className: "prose prose-invert prose-lg max-w-none" }, /* @__PURE__ */ React3.createElement("h2", { className: "text-3xl font-bold mb-6 text-white font-display" }, t("home_bio_title")), /* @__PURE__ */ React3.createElement("div", { className: "text-xl leading-relaxed mb-6 text-white/90" }, /* @__PURE__ */ React3.createElement("p", { dangerouslySetInnerHTML: { __html: t("home_bio_intro") } })), /* @__PURE__ */ React3.createElement("p", { className: "text-lg leading-relaxed text-white/80 mb-6", dangerouslySetInnerHTML: { __html: t("home_bio_style") } }), /* @__PURE__ */ React3.createElement("p", { className: "text-lg leading-relaxed text-white/80", dangerouslySetInnerHTML: { __html: t("home_bio_mensa") } }))))), /* @__PURE__ */ React3.createElement("section", { className: "py-16 bg-background border-y border-white/5" }, /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React3.createElement(motion2.div, { className: "max-w-4xl mx-auto text-center", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: CONTAINER_VARIANTS }, /* @__PURE__ */ React3.createElement(motion2.h2, { variants: ITEM_VARIANTS, className: "text-2xl md:text-3xl font-bold mb-3 font-display" }, isPortuguese ? "Pr\xF3ximos Shows" : "Upcoming Shows"), /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "mb-8" }, /* @__PURE__ */ React3.createElement(EventsList, { limit: 3, showTitle: false, variant: "compact" })), /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ React3.createElement(Link, { to: "/events/", className: "btn btn-primary btn-lg flex items-center gap-2" }, /* @__PURE__ */ React3.createElement(Calendar2, { size: 20 }), /* @__PURE__ */ React3.createElement("span", null, isPortuguese ? "Agenda completa" : "Full schedule")), /* @__PURE__ */ React3.createElement("a", { href: ARTIST.social.bandsintown?.url, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-lg flex items-center gap-2", "aria-label": "Follow DJ Zen Eyer on Bandsintown" }, /* @__PURE__ */ React3.createElement(ExternalLink2, { size: 18 }), /* @__PURE__ */ React3.createElement("span", null, "Bandsintown")))))), /* @__PURE__ */ React3.createElement("section", { className: "py-16 bg-background" }, /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React3.createElement(motion2.div, { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto", variants: CONTAINER_VARIANTS, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 } }, FEATURES_DATA.map((feature) => /* @__PURE__ */ React3.createElement(FeatureCard, { key: feature.id, icon: feature.icon, title: t(feature.titleKey), description: t(feature.descKey), variants: ITEM_VARIANTS }))))), /* @__PURE__ */ React3.createElement("section", { className: "py-20 bg-surface" }, /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React3.createElement(motion2.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: CONTAINER_VARIANTS, className: "text-center" }, /* @__PURE__ */ React3.createElement(motion2.h2, { variants: ITEM_VARIANTS, className: "text-2xl md:text-3xl font-bold mb-2 font-display" }, isPortuguese ? "Presen\xE7a Internacional" : "International Presence"), /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap justify-center gap-3 mt-8" }, FESTIVALS_HIGHLIGHT.map((festival) => /* @__PURE__ */ React3.createElement(FestivalBadge, { key: festival.name, name: festival.name, flag: festival.flag })), /* @__PURE__ */ React3.createElement("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary" }, /* @__PURE__ */ React3.createElement("span", null, "+", isPortuguese ? "muitos outros" : "many more")))))), /* @__PURE__ */ React3.createElement("section", { className: "py-16 bg-background" }, /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React3.createElement("div", { className: "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" }, /* @__PURE__ */ React3.createElement(motion2.div, { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, className: "p-8 bg-surface border-l-4 border-primary rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors" }, /* @__PURE__ */ React3.createElement("h3", { className: "text-xl font-bold mb-3 flex items-center gap-2 font-display" }, /* @__PURE__ */ React3.createElement(Download, { size: 20, className: "text-primary" }), " ", isPortuguese ? "Imprensa & M\xEDdia" : "Press & Media"), /* @__PURE__ */ React3.createElement("p", { className: "text-white/70 mb-4 text-sm" }, isPortuguese ? "Acesse fotos, bio e assets." : "Access photos, bio and assets."), /* @__PURE__ */ React3.createElement(Link, { to: isPortuguese ? "/pt/contrate" : "/work-with-me", className: "inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors" }, isPortuguese ? "BAIXAR PRESS KIT" : "DOWNLOAD PRESS KIT", " \u2192")), /* @__PURE__ */ React3.createElement(motion2.div, { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: 0.1 }, className: "p-8 bg-surface border-l-4 border-green-500 rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors" }, /* @__PURE__ */ React3.createElement("h3", { className: "text-xl font-bold mb-3 flex items-center gap-2 font-display" }, /* @__PURE__ */ React3.createElement(Calendar2, { size: 20, className: "text-green-500" }), " ", isPortuguese ? "Contratantes" : "Bookers"), /* @__PURE__ */ React3.createElement("p", { className: "text-white/70 mb-4 text-sm" }, isPortuguese ? 'Leve o "Zen Experience" para o seu evento.' : 'Bring the "Zen Experience" to your event.'), /* @__PURE__ */ React3.createElement(Link, { to: isPortuguese ? "/pt/contrate" : "/work-with-me", className: "inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-semibold transition-colors" }, isPortuguese ? "OR\xC7AMENTO" : "REQUEST BOOKING", " \u2192"))))), /* @__PURE__ */ React3.createElement("section", { className: "py-12 bg-background border-t border-white/5" }, /* @__PURE__ */ React3.createElement("div", { className: "container mx-auto px-4 text-center" }, /* @__PURE__ */ React3.createElement(motion2.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }, /* @__PURE__ */ React3.createElement("p", { className: "text-xs font-semibold text-white/40 mb-4 uppercase tracking-widest" }, isPortuguese ? "Perfis Verificados" : "Verified Profiles"), /* @__PURE__ */ React3.createElement("div", { className: "flex flex-wrap justify-center gap-6 text-sm" }, /* @__PURE__ */ React3.createElement("a", { href: `https://musicbrainz.org/artist/${ARTIST.identifiers.musicbrainz}`, target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-primary transition-colors flex items-center gap-1" }, "MusicBrainz ", /* @__PURE__ */ React3.createElement(ExternalLink2, { size: 10 })), /* @__PURE__ */ React3.createElement("a", { href: `https://www.wikidata.org/wiki/${ARTIST.identifiers.wikidata}`, target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-primary transition-colors flex items-center gap-1" }, "Wikidata ", /* @__PURE__ */ React3.createElement(ExternalLink2, { size: 10 })), /* @__PURE__ */ React3.createElement("a", { href: ARTIST.social.spotify.url, target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-primary transition-colors flex items-center gap-1" }, "Spotify ", /* @__PURE__ */ React3.createElement(ExternalLink2, { size: 10 })))))), /* @__PURE__ */ React3.createElement("section", { className: "py-24 relative overflow-hidden bg-background" }, /* @__PURE__ */ React3.createElement("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/50 to-background opacity-60" }), /* @__PURE__ */ React3.createElement(motion2.div, { className: "container mx-auto px-4 text-center relative z-10", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, variants: CONTAINER_VARIANTS }, /* @__PURE__ */ React3.createElement(motion2.h2, { variants: ITEM_VARIANTS, className: "text-4xl md:text-6xl font-bold mb-6 font-display" }, isPortuguese ? "Junte-se \xE0 " : "Join the ", /* @__PURE__ */ React3.createElement("span", { className: "text-primary" }, "Zen Tribe")), /* @__PURE__ */ React3.createElement(motion2.p, { variants: ITEM_VARIANTS, className: "text-xl text-white/70 mb-10 max-w-2xl mx-auto" }, isPortuguese ? "N\xE3o \xE9 s\xF3 sobre m\xFAsica. \xC9 sobre vibra\xE7\xE3o. Entre para a lista VIP." : "It's not just about music. It's about the vibe. Join the VIP list."), /* @__PURE__ */ React3.createElement(motion2.div, { variants: ITEM_VARIANTS, className: "flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ React3.createElement(Link, { to: "/zentribe/", className: "btn btn-primary btn-lg min-w-[200px]" }, isPortuguese ? "Entrar na Tribo" : "Join the Tribe")))));
    };
    HomePage_default = HomePage;
  }
});

// src/pages/AboutPage.tsx
var AboutPage_exports = {};
__export(AboutPage_exports, {
  default: () => AboutPage_default
});
import React4 from "react";
import { motion as motion3 } from "framer-motion";
import {
  Music2,
  Globe as Globe2,
  Heart,
  Brain,
  Trophy as Trophy2,
  Users as Users2,
  Star,
  Sparkles as Sparkles2,
  Mail as Envelope
} from "lucide-react";
var ABOUT_SCHEMA, MILESTONES, ACHIEVEMENTS_DATA, AboutPage, AboutPage_default;
var init_AboutPage = __esm({
  "src/pages/AboutPage.tsx"() {
    init_HeadlessSEO();
    init_artistData();
    ABOUT_SCHEMA = {
      "@context": "https://schema.org",
      "@graph": [
        {
          ...ARTIST_SCHEMA_BASE
        },
        {
          "@type": "WebPage",
          "@id": `${ARTIST.site.baseUrl}/about#webpage`,
          url: `${ARTIST.site.baseUrl}/about`,
          name: "About DJ Zen Eyer",
          description: 'Learn the personal story of DJ Zen Eyer, Brazilian Zouk DJ and music producer from Rio de Janeiro, and the philosophy behind his "cremosidade" musical style.',
          isPartOf: { "@id": `${ARTIST.site.baseUrl}/#website` },
          about: { "@id": `${ARTIST.site.baseUrl}/#artist` },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${ARTIST.site.baseUrl}/`
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: `${ARTIST.site.baseUrl}/about`
              }
            ]
          }
        }
      ]
    };
    MILESTONES = [
      {
        year: "2005-2010",
        title: "Primeiros Passos",
        description: "Descobriu a paix\xE3o pela m\xFAsica aos 15 anos, influenciado pela cultura brasileira e ritmos caribenhos. Come\xE7ou a explorar equipamentos de DJ e produ\xE7\xE3o musical em Niter\xF3i, RJ.",
        icon: /* @__PURE__ */ React4.createElement(Heart, { className: "w-8 h-8 text-white" }),
        color: "bg-gradient-to-br from-red-500 to-pink-600"
      },
      {
        year: "2012",
        title: "Encontro com o Zouk",
        description: "Teve seu primeiro contato com o Zouk Brasileiro em uma festa local. Foi amor \xE0 primeira vista: 'Era como se a m\xFAsica falasse diretamente \xE0 minha alma', lembra Zen Eyer.",
        icon: /* @__PURE__ */ React4.createElement(Music2, { className: "w-8 h-8 text-white" }),
        color: "bg-gradient-to-br from-purple-500 to-indigo-600"
      },
      {
        year: "2015-2019",
        title: "Dedica\xE7\xE3o Total",
        description: "Deixou seu emprego corporativo para se dedicar 100% \xE0 m\xFAsica. Passou anos estudando t\xE9cnicas de DJ, produ\xE7\xE3o musical e a psicologia por tr\xE1s das pistas de dan\xE7a.",
        icon: /* @__PURE__ */ React4.createElement(Brain, { className: "w-8 h-8 text-white" }),
        color: "bg-gradient-to-br from-blue-500 to-cyan-600"
      },
      {
        year: "2022",
        title: "Consagra\xE7\xE3o Mundial",
        description: 'Conquistou o bicampeonato mundial de Zouk Brasileiro, provando que sua abordagem emocional e t\xE9cnica era \xFAnica. "Foi a realiza\xE7\xE3o de um sonho de inf\xE2ncia", conta.',
        icon: /* @__PURE__ */ React4.createElement(Trophy2, { className: "w-8 h-8 text-white" }),
        color: "bg-gradient-to-br from-yellow-500 to-amber-600"
      }
    ];
    ACHIEVEMENTS_DATA = [
      {
        label: "Anos de paix\xE3o",
        value: "15+",
        icon: /* @__PURE__ */ React4.createElement(Heart, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
      },
      {
        label: "Eventos \xEDntimos",
        value: "200+",
        icon: /* @__PURE__ */ React4.createElement(Users2, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
      },
      {
        label: "Hist\xF3rias compartilhadas",
        value: "10K+",
        icon: /* @__PURE__ */ React4.createElement(Globe2, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
      },
      {
        label: "Sorrisos criados",
        value: "\u221E",
        icon: /* @__PURE__ */ React4.createElement(Star, { className: "w-8 h-8 mx-auto mb-4 text-primary" })
      }
    ];
    AboutPage = () => {
      const currentPath = "/about";
      const currentUrl = `${ARTIST.site.baseUrl}${currentPath}`;
      return /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement(
        HeadlessSEO,
        {
          title: "About DJ Zen Eyer | Brazilian Zouk DJ & Producer",
          description: "Learn the personal story of DJ Zen Eyer, Brazilian Zouk DJ and music producer from Rio de Janeiro, and the philosophy behind his signature cremosidade style.",
          url: currentUrl,
          image: `${ARTIST.site.baseUrl}/images/zen-eyer-about-emotional.jpg`,
          type: "profile",
          schema: ABOUT_SCHEMA
        }
      ), /* @__PURE__ */ React4.createElement("div", { className: "min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white" }, /* @__PURE__ */ React4.createElement("section", { className: "relative pt-32 pb-20 px-4 overflow-hidden" }, /* @__PURE__ */ React4.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/10 via-surface/10 to-accent/10 blur-3xl" }), /* @__PURE__ */ React4.createElement("div", { className: "container mx-auto max-w-6xl relative z-10" }, /* @__PURE__ */ React4.createElement(
        motion3.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8 },
          className: "text-center"
        },
        /* @__PURE__ */ React4.createElement(
          motion3.div,
          {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { delay: 0.2, duration: 0.6 },
            className: "inline-block mb-4"
          },
          /* @__PURE__ */ React4.createElement("div", { className: "bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm" }, /* @__PURE__ */ React4.createElement(Sparkles2, { className: "inline-block mr-2", size: 16 }), "MINHA HIST\xD3RIA")
        ),
        /* @__PURE__ */ React4.createElement("h1", { className: "text-5xl md:text-7xl font-black font-display mb-6" }, "A", " ", /* @__PURE__ */ React4.createElement("span", { className: "text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text" }, "Jornada")),
        /* @__PURE__ */ React4.createElement("p", { className: "text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed" }, "Da paix\xE3o pela m\xFAsica \xE0 conex\xE3o com milhares de almas atrav\xE9s do Zouk Brasileiro")
      ))), /* @__PURE__ */ React4.createElement("section", { className: "py-16 px-4" }, /* @__PURE__ */ React4.createElement("div", { className: "container mx-auto max-w-6xl" }, /* @__PURE__ */ React4.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6" }, ACHIEVEMENTS_DATA.map((item, index) => /* @__PURE__ */ React4.createElement(
        motion3.div,
        {
          key: index,
          initial: { opacity: 0, scale: 0.9 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
          transition: { delay: index * 0.1 },
          className: "bg-surface/50 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all"
        },
        item.icon,
        /* @__PURE__ */ React4.createElement("div", { className: "text-3xl md:text-4xl font-bold text-gradient mb-2" }, item.value),
        /* @__PURE__ */ React4.createElement("div", { className: "text-white/60 text-sm" }, item.label)
      ))))), /* @__PURE__ */ React4.createElement("section", { className: "py-20 px-4" }, /* @__PURE__ */ React4.createElement("div", { className: "container mx-auto max-w-4xl" }, /* @__PURE__ */ React4.createElement(
        motion3.div,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          className: "space-y-6 text-lg text-white/80 leading-relaxed"
        },
        /* @__PURE__ */ React4.createElement("p", null, "Tudo come\xE7ou em ", /* @__PURE__ */ React4.createElement("strong", null, "Niter\xF3i, RJ"), ", onde um jovem Marcelo Eyer Fernandes descobriu que a m\xFAsica poderia ser mais do que som: poderia ser ", /* @__PURE__ */ React4.createElement("strong", null, "emo\xE7\xE3o pura"), ". Aos 15 anos, enquanto seus amigos ouviam rock e pop, ele se perdia nos ritmos caribenhos e brasileiros que encontrava em velhas fitas cassete de seu pai."),
        /* @__PURE__ */ React4.createElement("p", null, "O encontro com o ", /* @__PURE__ */ React4.createElement("strong", null, "Zouk Brasileiro"), " foi um divisor de \xE1guas. 'Lembro como se fosse hoje', conta Zen Eyer. 'Era 2012, uma festa pequena em Copacabana. Quando ouvi aquele som suave mas pulsante, senti que tinha encontrado minha linguagem.' Aquela noite mudou tudo: ele vendeu seu primeiro equipamento de DJ com o dinheiro que juntou trabalhando em um bar."),
        /* @__PURE__ */ React4.createElement("p", null, "Os anos seguintes foram de ", /* @__PURE__ */ React4.createElement("strong", null, "dedica\xE7\xE3o obsessiva"), ". Enquanto trabalhava durante o dia, passava noites estudando t\xE9cnicas de mixagem, teoria musical e, acima de tudo,", " ", /* @__PURE__ */ React4.createElement("strong", null, "como fazer as pessoas sentirem"), " atrav\xE9s da m\xFAsica. 'N\xE3o queria ser apenas mais um DJ. Queria criar momentos onde as pessoas se esquecessem de tudo e apenas sentissem', explica."),
        /* @__PURE__ */ React4.createElement("p", null, "A consagra\xE7\xE3o veio em ", /* @__PURE__ */ React4.createElement("strong", null, "2022"), ", quando se tornou", " ", /* @__PURE__ */ React4.createElement("strong", null, "bicampe\xE3o mundial"), " de Zouk Brasileiro. Mas o que mais o orgulha n\xE3o s\xE3o os trof\xE9us, e sim as", " ", /* @__PURE__ */ React4.createElement("strong", null, "hist\xF3rias que coleciona"), ": o casal que se reconectou em um de seus sets, a jovem que superou a timidez dan\xE7ando ao som de suas m\xFAsicas, os amigos que se abra\xE7aram chorando em meio \xE0 pista."),
        /* @__PURE__ */ React4.createElement("p", null, "Hoje, Zen Eyer \xE9 conhecido por sua ", /* @__PURE__ */ React4.createElement("strong", null, "'cremosidade'"), " ", "- um estilo que une t\xE9cnica impec\xE1vel com uma sensibilidade rara. 'Cada set que fa\xE7o \xE9 como uma conversa \xEDntima com quem est\xE1 dan\xE7ando. Quero que saiam da pista sentindo que viveram algo \xFAnico', confessa."),
        /* @__PURE__ */ React4.createElement("p", { className: "text-primary font-semibold" }, "Sua miss\xE3o vai al\xE9m da m\xFAsica: 'Quero que as pessoas lembre que s\xE3o capazes de sentir profundamente, de se conectar, de serem vulner\xE1veis. O Zouk Brasileiro \xE9 apenas a trilha sonora para isso.'")
      ))), /* @__PURE__ */ React4.createElement("section", { className: "py-20 px-4 bg-surface/30" }, /* @__PURE__ */ React4.createElement("div", { className: "container mx-auto max-w-5xl" }, /* @__PURE__ */ React4.createElement(
        motion3.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "text-4xl md:text-5xl font-display font-bold text-center mb-16"
        },
        "Momentos que",
        " ",
        /* @__PURE__ */ React4.createElement("span", { className: "text-gradient" }, "Mudaram Tudo")
      ), /* @__PURE__ */ React4.createElement("div", { className: "space-y-12" }, MILESTONES.map((milestone, index) => /* @__PURE__ */ React4.createElement(
        motion3.div,
        {
          key: index,
          initial: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          className: "relative"
        },
        /* @__PURE__ */ React4.createElement("div", { className: "card p-6 md:p-8 hover:border-primary/50 transition-all" }, /* @__PURE__ */ React4.createElement("div", { className: "flex items-start gap-6" }, /* @__PURE__ */ React4.createElement(
          "div",
          {
            className: `flex-shrink-0 w-16 h-16 rounded-full ${milestone.color} flex items-center justify-center`
          },
          milestone.icon
        ), /* @__PURE__ */ React4.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React4.createElement("div", { className: "text-primary font-bold mb-2" }, milestone.year), /* @__PURE__ */ React4.createElement("h3", { className: "text-2xl font-display font-bold mb-3" }, milestone.title), /* @__PURE__ */ React4.createElement("p", { className: "text-white/70 leading-relaxed" }, milestone.description))))
      ))))), /* @__PURE__ */ React4.createElement("section", { className: "py-20 px-4" }, /* @__PURE__ */ React4.createElement("div", { className: "container mx-auto max-w-4xl" }, /* @__PURE__ */ React4.createElement(
        motion3.div,
        {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          className: "card p-8 md:p-12 text-center bg-surface/50 rounded-2xl border border-white/10"
        },
        /* @__PURE__ */ React4.createElement(Heart, { className: "w-16 h-16 mx-auto mb-6 text-primary" }),
        /* @__PURE__ */ React4.createElement("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6" }, "Minha ", /* @__PURE__ */ React4.createElement("span", { className: "text-gradient" }, "Filosofia")),
        /* @__PURE__ */ React4.createElement("p", { className: "text-lg text-white/80 leading-relaxed italic" }, `"A m\xFAsica \xE9 minha forma de criar um espa\xE7o seguro onde as pessoas podem ser quem realmente s\xE3o. N\xE3o toca s\xF3 os ouvidos - toca a alma. Cada batida, cada transi\xE7\xE3o, cada sil\xEAncio \xE9 pensado para que algu\xE9m na pista sinta: 'Isso \xE9 sobre mim. Isso \xE9 para mim.'"`),
        /* @__PURE__ */ React4.createElement("div", { className: "mt-8 text-white/60 font-semibold" }, "\u2014 Zen Eyer")
      ))), /* @__PURE__ */ React4.createElement("section", { className: "py-20 px-4" }, /* @__PURE__ */ React4.createElement("div", { className: "container mx-auto max-w-4xl" }, /* @__PURE__ */ React4.createElement(
        motion3.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.8 },
          className: "bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-10 md:p-12 border border-primary/30 text-center"
        },
        /* @__PURE__ */ React4.createElement(Sparkles2, { className: "w-12 h-12 mx-auto mb-6 text-primary" }),
        /* @__PURE__ */ React4.createElement("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6" }, "Vamos ", /* @__PURE__ */ React4.createElement("span", { className: "text-gradient" }, "Conversar?")),
        /* @__PURE__ */ React4.createElement("p", { className: "text-xl text-white/80 mb-8 max-w-2xl mx-auto" }, "Se voc\xEA se identificou com essa hist\xF3ria ou quer saber mais sobre a filosofia por tr\xE1s da minha m\xFAsica, adoro conhecer pessoas que tamb\xE9m acreditam no poder da conex\xE3o atrav\xE9s da arte."),
        /* @__PURE__ */ React4.createElement(
          motion3.a,
          {
            href: getWhatsAppUrl("Ol\xE1 Zen! Vi sua hist\xF3ria no site e gostaria de compartilhar a minha tamb\xE9m."),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "btn btn-primary btn-lg inline-flex items-center gap-3",
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 }
          },
          /* @__PURE__ */ React4.createElement(Envelope, { className: "w-5 h-5" }),
          "Compartilhe Sua Hist\xF3ria"
        )
      )))));
    };
    AboutPage_default = AboutPage;
  }
});

// src/pages/EventsPage.tsx
var EventsPage_exports = {};
__export(EventsPage_exports, {
  default: () => EventsPage_default
});
import { useEffect as useEffect2, useState as useState2, memo } from "react";
import { motion as motion4 } from "framer-motion";
import { useTranslation as useTranslation4 } from "react-i18next";
import { useParams, Link as Link2 } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  MapPin as MapPin2,
  Ticket as Ticket2,
  Plus,
  Briefcase,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
var EventsPage, EventsPage_default;
var init_EventsPage = __esm({
  "src/pages/EventsPage.tsx"() {
    init_HeadlessSEO();
    init_routes();
    EventsPage = () => {
      const { id } = useParams();
      const { t, i18n } = useTranslation4();
      const [events, setEvents] = useState2([]);
      const [singleEvent, setSingleEvent] = useState2(null);
      const [loading, setLoading] = useState2(true);
      const getRouteForKey = (key) => {
        const route = ROUTES_CONFIG.find((r) => getLocalizedPaths(r, "en")[0] === key);
        if (!route) return `/${key}`;
        const normalizedLanguage = normalizeLanguage(i18n.language);
        return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
      };
      useEffect2(() => {
        const abortController = new AbortController();
        setLoading(true);
        const fetchEvents = async () => {
          try {
            const response = await fetch(`https://djzeneyer.com/wp-json/wp/v2/events${id ? `/${id}` : ""}?_embed`, {
              signal: abortController.signal
            });
            const data = await response.json();
            if (id) {
              setSingleEvent(data);
            } else {
              setEvents(data);
            }
            setLoading(false);
          } catch (err) {
            if (err.name !== "AbortError") {
              console.error("Failed to fetch events:", err);
              setLoading(false);
            }
          }
        };
        fetchEvents();
        return () => abortController.abort();
      }, [id]);
      if (!loading && id && singleEvent) {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
          HeadlessSEO,
          {
            title: `${singleEvent.title?.rendered || "Evento"} | Zen Events`,
            description: singleEvent.excerpt?.rendered || "",
            url: `https://djzeneyer.com/events/${id}`
          }
        ), /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 max-w-5xl" }, /* @__PURE__ */ React.createElement(Link2, { to: getRouteForKey("events"), className: "inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold" }, /* @__PURE__ */ React.createElement(ArrowLeft, { size: 20 }), " ", t("events_back_to_list", "Voltar para Eventos")), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-2 gap-12" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl" }, /* @__PURE__ */ React.createElement(
          "img",
          {
            src: singleEvent._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp",
            className: "w-full aspect-[4/5] object-cover",
            alt: singleEvent.title?.rendered
          }
        ))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "bg-primary/10 border border-primary/20 self-start px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6" }, t("events_status_upcoming", "Pr\xF3ximo Evento")), /* @__PURE__ */ React.createElement("h1", { className: "text-4xl md:text-5xl font-black font-display mb-6", dangerouslySetInnerHTML: { __html: singleEvent.title?.rendered || "" } }), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 mb-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 text-white/80" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary" }, /* @__PURE__ */ React.createElement(CalendarIcon, { size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-white/40 uppercase font-bold tracking-tighter" }, "Data"), /* @__PURE__ */ React.createElement("p", { className: "font-bold" }, new Date(singleEvent.date).toLocaleDateString()))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 text-white/80" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary" }, /* @__PURE__ */ React.createElement(MapPin2, { size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-white/40 uppercase font-bold tracking-tighter" }, "Local"), /* @__PURE__ */ React.createElement("p", { className: "font-bold" }, "S\xE3o Paulo, Brasil")))), /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "prose prose-invert max-w-none mb-10 text-white/70",
            dangerouslySetInnerHTML: { __html: singleEvent.content?.rendered || "" }
          }
        ), /* @__PURE__ */ React.createElement("div", { className: "mt-auto flex flex-col sm:flex-row gap-4" }, /* @__PURE__ */ React.createElement("a", { href: "#", className: "btn btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg" }, /* @__PURE__ */ React.createElement(Ticket2, { size: 22 }), " GARANTIR INGRESSO"), /* @__PURE__ */ React.createElement(Link2, { to: getRouteForKey("shop"), className: "btn btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-lg" }, /* @__PURE__ */ React.createElement(Plus, { size: 22 }), " ", t("footer_shop", "Shop"))))))));
      }
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        HeadlessSEO,
        {
          title: "Zen Events | Zouk Brasileiro Worldwide",
          description: "Confira a agenda de eventos, workshops e congressos com DJ Zen Eyer.",
          url: "https://djzeneyer.com/events"
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mb-20" }, /* @__PURE__ */ React.createElement(
        motion4.h1,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "text-5xl md:text-8xl font-black font-display tracking-tighter mb-6"
        },
        "ZEN ",
        /* @__PURE__ */ React.createElement("span", { className: "text-primary italic" }, "EXPERIENCE")
      ), /* @__PURE__ */ React.createElement(
        motion4.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "text-xl md:text-2xl text-white/60 font-medium"
        },
        "Acompanhe minha agenda mundial. De workshops intensivos a congressos internacionais."
      )), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-12 gap-12" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-8 border-b border-white/10 pb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-display font-bold flex items-center gap-3" }, /* @__PURE__ */ React.createElement(CalendarIcon, { className: "text-primary" }), " ", t("events_upcoming", "Pr\xF3ximos Eventos")), /* @__PURE__ */ React.createElement("span", { className: "text-white/40 text-sm font-mono" }, events.length, " EVENTOS ENCONTRADOS")), loading ? /* @__PURE__ */ React.createElement("div", { className: "space-y-6 animate-pulse" }, [1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "h-48 bg-white/5 rounded-3xl w-full" }))) : /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, events.map((event, index) => /* @__PURE__ */ React.createElement(
        motion4.div,
        {
          key: event.id,
          initial: { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { delay: index * 0.1 },
          className: "group bg-surface/30 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500"
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row p-6 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "md:w-48 h-48 rounded-2xl overflow-hidden shrink-0" }, /* @__PURE__ */ React.createElement(
          "img",
          {
            src: event._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp",
            className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700",
            alt: event.title?.rendered
          }
        )), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 text-primary text-xs font-bold uppercase mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(CalendarIcon, { size: 14 }), " ", new Date(event.date).toLocaleDateString()), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(MapPin2, { size: 14 }), " S\xE3o Paulo, SP")), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl md:text-3xl font-black font-display mb-4 group-hover:text-primary transition-colors", dangerouslySetInnerHTML: { __html: event.title?.rendered || "" } })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Link2, { to: `${getRouteForKey("events")}/${event.id}`, className: "text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all" }, "DETALHES DO EVENTO ", /* @__PURE__ */ React.createElement(ArrowRight, { size: 16 })), /* @__PURE__ */ React.createElement("a", { href: "#", className: "btn btn-primary px-6 py-2 rounded-full text-xs font-bold" }, "TICKETS"))))
      )))), /* @__PURE__ */ React.createElement("aside", { className: "lg:col-span-4 space-y-12" }, /* @__PURE__ */ React.createElement("div", { className: "bg-primary/10 border border-primary/20 rounded-3xl p-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-display font-bold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Briefcase, { className: "text-primary" }), " ", t("footer_work_with_me", "Work With Me")), /* @__PURE__ */ React.createElement("p", { className: "text-white/70 text-sm leading-relaxed mb-6" }, "Interessado em levar a experi\xEAncia Zen Eyer para o seu evento? Solicite um or\xE7amento para bookings internacionais."), /* @__PURE__ */ React.createElement(Link2, { to: getRouteForKey("work-with-me"), className: "w-full btn btn-primary flex items-center justify-center gap-2 py-3" }, "CONTATO ", /* @__PURE__ */ React.createElement(Send, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "border border-white/10 rounded-3xl p-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-display font-bold mb-6" }, t("events_categories", "Categorias")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, ["Congressos", "Workshops", "Social", "Online", "Festivais"].map((cat) => /* @__PURE__ */ React.createElement("span", { key: cat, className: "px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-primary/20 hover:border-primary/40 cursor-pointer transition-colors" }, cat)))))))));
    };
    EventsPage_default = memo(EventsPage);
  }
});

// src/pages/MusicPage.tsx
var MusicPage_exports = {};
__export(MusicPage_exports, {
  default: () => MusicPage_default
});
import React5, { useState as useState3, useMemo as useMemo3 } from "react";
import { motion as motion5 } from "framer-motion";
import { useTranslation as useTranslation5 } from "react-i18next";
import { Music2 as Music23, Filter, Youtube, Cloud, Play, ArrowLeft as ArrowLeft2 } from "lucide-react";
import { useParams as useParams2, Link as Link3 } from "react-router-dom";
var MusicPage, MusicPage_default;
var init_MusicPage = __esm({
  "src/pages/MusicPage.tsx"() {
    init_HeadlessSEO();
    init_useQueries();
    init_routes();
    MusicPage = () => {
      const { slug } = useParams2();
      const { t, i18n } = useTranslation5();
      const { data: tracks = [], isLoading: loading, error } = useTracksQuery();
      const [activeTag, setActiveTag] = useState3("Todos");
      const [searchQuery, setSearchQuery] = useState3("");
      const getRouteForKey = (key) => {
        const route = ROUTES_CONFIG.find((r) => getLocalizedPaths(r, "en")[0] === key);
        if (!route) return `/${key}`;
        const normalizedLanguage = normalizeLanguage(i18n.language);
        return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
      };
      const singleTrack = useMemo3(() => {
        if (!slug || !tracks.length) return null;
        return tracks.find((t2) => t2.slug === slug);
      }, [slug, tracks]);
      if (error) {
        console.error("Error fetching tracks:", error);
      }
      if (!loading && slug && singleTrack) {
        return /* @__PURE__ */ React5.createElement(React5.Fragment, null, /* @__PURE__ */ React5.createElement(
          HeadlessSEO,
          {
            title: `${singleTrack.title?.rendered || "Music"} | Zen Music`,
            description: singleTrack.excerpt?.rendered || "Ou\xE7a as \xFAltimas produ\xE7\xF5es de DJ Zen Eyer.",
            url: `https://djzeneyer.com/music/${slug}`
          }
        ), /* @__PURE__ */ React5.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React5.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React5.createElement(Link3, { to: getRouteForKey("music"), className: "inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold" }, /* @__PURE__ */ React5.createElement(ArrowLeft2, { size: 20 }), " VOLTAR PARA M\xDASICAS"), /* @__PURE__ */ React5.createElement("div", { className: "bg-surface/30 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative group" }, /* @__PURE__ */ React5.createElement("div", { className: "absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity" }, /* @__PURE__ */ React5.createElement(Music23, { size: 200 })), /* @__PURE__ */ React5.createElement("div", { className: "relative z-10 flex flex-col md:flex-row gap-12 items-center" }, /* @__PURE__ */ React5.createElement("div", { className: "w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0" }, /* @__PURE__ */ React5.createElement(
          "img",
          {
            src: singleTrack._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp",
            className: "w-full h-full object-cover",
            alt: singleTrack.title?.rendered
          }
        )), /* @__PURE__ */ React5.createElement("div", { className: "text-center md:text-left flex-1" }, /* @__PURE__ */ React5.createElement("h1", { className: "text-4xl md:text-6xl font-black font-display mb-4", dangerouslySetInnerHTML: { __html: singleTrack.title?.rendered } }), /* @__PURE__ */ React5.createElement("p", { className: "text-primary font-bold mb-8 tracking-widest uppercase" }, "DJ Zen Eyer Original"), /* @__PURE__ */ React5.createElement("div", { className: "flex flex-wrap gap-4 justify-center md:justify-start" }, /* @__PURE__ */ React5.createElement("button", { className: "btn btn-primary px-10 py-4 rounded-full flex items-center gap-3 text-lg font-bold" }, /* @__PURE__ */ React5.createElement(Play, { fill: "currentColor", size: 20 }), " OUVIR AGORA"), /* @__PURE__ */ React5.createElement("a", { href: singleTrack.acf?.soundcloud_url, target: "_blank", rel: "noopener", className: "btn btn-outline px-8 py-4 rounded-full flex items-center gap-2" }, /* @__PURE__ */ React5.createElement(Cloud, { size: 20 }), " SOUNDCLOUD")))), /* @__PURE__ */ React5.createElement("div", { className: "mt-16 border-t border-white/5 pt-10" }, /* @__PURE__ */ React5.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React5.createElement(Filter, { size: 18, className: "text-primary" }), " SOBRE A FAIXA"), /* @__PURE__ */ React5.createElement(
          "div",
          {
            className: "prose prose-invert max-w-none text-white/60",
            dangerouslySetInnerHTML: { __html: singleTrack.content?.rendered || "" }
          }
        ))))));
      }
      const tags = ["Todos", ...new Set(tracks.flatMap((t2) => t2.tags_names || []))];
      const filteredTracks = tracks.filter((track) => {
        const matchesTag = activeTag === "Todos" || track.tags_names?.includes(activeTag);
        const matchesSearch = track.title.rendered.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
      });
      return /* @__PURE__ */ React5.createElement(React5.Fragment, null, /* @__PURE__ */ React5.createElement(
        HeadlessSEO,
        {
          title: "Zen Music | High-Energy Zouk Remixes",
          description: "Explore as produ\xE7\xF5es musicais, remixes e sets originais de DJ Zen Eyer.",
          url: "https://djzeneyer.com/music"
        }
      ), /* @__PURE__ */ React5.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React5.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React5.createElement("div", { className: "max-w-4xl mb-16" }, /* @__PURE__ */ React5.createElement("h1", { className: "text-5xl md:text-8xl font-black font-display tracking-tighter mb-6" }, "ZEN ", /* @__PURE__ */ React5.createElement("span", { className: "text-primary italic" }, "SOUNDS")), /* @__PURE__ */ React5.createElement("p", { className: "text-xl text-white/60" }, "Remixes oficiais e produ\xE7\xF5es originais para a pista.")), /* @__PURE__ */ React5.createElement("div", { className: "flex flex-col md:flex-row gap-8 mb-12 items-center justify-between" }, /* @__PURE__ */ React5.createElement("div", { className: "flex flex-wrap gap-2" }, tags.map((tag) => /* @__PURE__ */ React5.createElement(
        "button",
        {
          key: tag,
          onClick: () => setActiveTag(tag),
          className: `px-6 py-2 rounded-full text-sm font-bold border transition-all ${activeTag === tag ? "bg-primary border-primary text-black" : "bg-white/5 border-white/10 hover:border-primary/50"}`
        },
        tag
      ))), /* @__PURE__ */ React5.createElement("div", { className: "relative w-full md:w-80" }, /* @__PURE__ */ React5.createElement(
        "input",
        {
          type: "text",
          placeholder: "Buscar m\xFAsica...",
          className: "w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value)
        }
      ))), loading ? /* @__PURE__ */ React5.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse" }, [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ React5.createElement("div", { key: i, className: "h-80 bg-white/5 rounded-3xl" }))) : /* @__PURE__ */ React5.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8" }, filteredTracks.map((track) => /* @__PURE__ */ React5.createElement(
        motion5.div,
        {
          key: track.id,
          layout: true,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "bg-surface/30 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all group"
        },
        /* @__PURE__ */ React5.createElement("div", { className: "aspect-square relative overflow-hidden" }, /* @__PURE__ */ React5.createElement(
          "img",
          {
            src: track._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp",
            className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
            alt: track.title.rendered
          }
        ), /* @__PURE__ */ React5.createElement("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4" }, /* @__PURE__ */ React5.createElement(
          Link3,
          {
            to: `${getRouteForKey("music")}/${track.slug}`,
            className: "w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
          },
          /* @__PURE__ */ React5.createElement(Play, { fill: "currentColor", size: 20 })
        ))),
        /* @__PURE__ */ React5.createElement("div", { className: "p-6" }, /* @__PURE__ */ React5.createElement("h3", { className: "text-xl font-bold font-display mb-2 truncate", dangerouslySetInnerHTML: { __html: track.title.rendered } }), /* @__PURE__ */ React5.createElement("div", { className: "flex items-center justify-between mt-4" }, /* @__PURE__ */ React5.createElement("span", { className: "text-xs text-white/40 font-mono" }, "ZEN EYER REMIX"), /* @__PURE__ */ React5.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React5.createElement(Youtube, { size: 18, className: "text-white/20 hover:text-primary cursor-pointer" }), /* @__PURE__ */ React5.createElement(Cloud, { size: 18, className: "text-white/20 hover:text-primary cursor-pointer" }))))
      ))))));
    };
    MusicPage_default = MusicPage;
  }
});

// src/contexts/UserContext.tsx
import React6, { createContext, useState as useState4, useContext, useEffect as useEffect4 } from "react";
var UserContext, useUser;
var init_UserContext = __esm({
  "src/contexts/UserContext.tsx"() {
    UserContext = createContext(void 0);
    useUser = () => {
      const context = useContext(UserContext);
      if (context === void 0) {
        throw new Error("useUser must be used within a UserProvider");
      }
      return context;
    };
  }
});

// src/pages/ZenTribePage.tsx
var ZenTribePage_exports = {};
__export(ZenTribePage_exports, {
  default: () => ZenTribePage_default
});
import React7, { memo as memo2 } from "react";
import { motion as motion6 } from "framer-motion";
import { useTranslation as useTranslation6 } from "react-i18next";
import { Award as Award2, Star as Star3, Users as Users4, TrendingUp, Shield, Gift, Clock as Clock2, Zap } from "lucide-react";
var ORGANIZATION_SCHEMA, CONTAINER_VARIANTS2, ACHIEVEMENTS_DATA2, BenefitCard, MembershipCard, AchievementCard, ZenTribePage, ZenTribePage_default;
var init_ZenTribePage = __esm({
  "src/pages/ZenTribePage.tsx"() {
    init_HeadlessSEO();
    init_UserContext();
    ORGANIZATION_SCHEMA = {
      "@type": "Organization",
      "@id": "https://djzeneyer.com/zentribe#organization",
      "name": "Zen Tribe - Comunidade Global de Zouk Brasileiro",
      "alternateName": "Tribo Zen",
      "url": "https://djzeneyer.com/zentribe",
      "founder": {
        "@id": "https://djzeneyer.com/#artist"
      },
      "description": "Comunidade exclusiva para amantes do Zouk Brasileiro, oferecendo acesso antecipado a m\xFAsicas, eventos VIP e sistema de recompensas gamificado.",
      "areaServed": {
        "@type": "Place",
        "name": "Worldwide"
      },
      "slogan": "Conectando almas atrav\xE9s do Zouk Brasileiro",
      "knowsAbout": ["Brazilian Zouk Community", "DJ Zen Eyer Music", "Zouk Dance Culture"],
      "memberOf": {
        "@type": "Organization",
        "name": "International Brazilian Zouk Community"
      }
    };
    CONTAINER_VARIANTS2 = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };
    ACHIEVEMENTS_DATA2 = [
      { emoji: "\u{1F3A7}", titleKey: "zenTribe.achievements.firstTrack.title", descKey: "zenTribe.achievements.firstTrack.desc", unlocked: true },
      { emoji: "\u{1F680}", titleKey: "zenTribe.achievements.firstEvent.title", descKey: "zenTribe.achievements.firstEvent.desc", unlocked: true },
      { emoji: "\u{1F50D}", titleKey: "zenTribe.achievements.collector.title", descKey: "zenTribe.achievements.collector.desc", unlocked: false },
      { emoji: "\u{1F98B}", titleKey: "zenTribe.achievements.marketer.title", descKey: "zenTribe.achievements.marketer.desc", unlocked: false },
      { emoji: "\u{1F3AA}", titleKey: "zenTribe.achievements.legend.title", descKey: "zenTribe.achievements.legend.desc", unlocked: false },
      { emoji: "\u23F1\uFE0F", titleKey: "zenTribe.achievements.streak.title", descKey: "zenTribe.achievements.streak.desc", unlocked: false }
    ];
    BenefitCard = memo2(({ icon, title, description, color }) => /* @__PURE__ */ React7.createElement(
      motion6.div,
      {
        className: "card p-6 glow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        variants: {
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
          }
        }
      },
      /* @__PURE__ */ React7.createElement("div", { className: `w-12 h-12 rounded-full bg-${color}/20 flex items-center justify-center mb-4` }, icon),
      /* @__PURE__ */ React7.createElement("h3", { className: "text-xl font-semibold mb-2" }, title),
      /* @__PURE__ */ React7.createElement("p", { className: "text-white/70" }, description)
    ));
    BenefitCard.displayName = "BenefitCard";
    MembershipCard = memo2(({ tier, user, t }) => /* @__PURE__ */ React7.createElement(
      motion6.div,
      {
        className: `card overflow-hidden relative transition-all duration-300 hover:shadow-lg ${tier.popular ? "border-2 border-secondary" : ""}`,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: tier.popular ? 0 : 0.1 }
      },
      tier.popular && /* @__PURE__ */ React7.createElement("div", { className: "absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-sm font-medium" }, t("zenTribe.mostPopular")),
      /* @__PURE__ */ React7.createElement("div", { className: `p-6 bg-${tier.color}/10` }, /* @__PURE__ */ React7.createElement("div", { className: `w-12 h-12 rounded-full bg-${tier.color}/20 flex items-center justify-center mb-4 text-${tier.color}` }, tier.icon), /* @__PURE__ */ React7.createElement("h3", { className: "text-2xl font-bold mb-2 font-display" }, tier.name), /* @__PURE__ */ React7.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React7.createElement("span", { className: "text-3xl font-bold" }, tier.price))),
      /* @__PURE__ */ React7.createElement("div", { className: "p-6" }, /* @__PURE__ */ React7.createElement("ul", { className: "space-y-3 mb-6" }, tier.features.map((feature, i) => /* @__PURE__ */ React7.createElement("li", { key: i, className: "flex items-start" }, /* @__PURE__ */ React7.createElement("div", { className: `text-${tier.color} mr-2 mt-1`, "aria-hidden": "true" }, /* @__PURE__ */ React7.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React7.createElement("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ React7.createElement("span", { className: "text-white/80" }, feature)))), /* @__PURE__ */ React7.createElement(
        "button",
        {
          className: `w-full btn ${tier.popular ? "btn-secondary" : "btn-outline"} transition-all duration-300 hover:scale-[1.02]`,
          "aria-label": `Join ${tier.name} membership`
        },
        user?.isLoggedIn ? t("zenTribe.upgradeNow") : t("zenTribe.joinNow")
      ))
    ));
    MembershipCard.displayName = "MembershipCard";
    AchievementCard = memo2(({ emoji, title, description, unlocked, t }) => /* @__PURE__ */ React7.createElement("div", { className: `bg-surface/50 rounded-lg p-4 transition-all duration-300 ${unlocked ? "hover:bg-surface/70" : "opacity-60"}` }, /* @__PURE__ */ React7.createElement("div", { className: "text-4xl mb-3" }, emoji), /* @__PURE__ */ React7.createElement("h4", { className: "font-display text-lg mb-1" }, title), /* @__PURE__ */ React7.createElement("p", { className: "text-sm text-white/70" }, description), unlocked && /* @__PURE__ */ React7.createElement("div", { className: "mt-2 text-xs text-success flex items-center" }, /* @__PURE__ */ React7.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-1" }, /* @__PURE__ */ React7.createElement("polyline", { points: "20 6 9 17 4 12" })), t("zenTribe.unlocked"))));
    AchievementCard.displayName = "AchievementCard";
    ZenTribePage = () => {
      const { t } = useTranslation6();
      const { user } = useUser();
      const membershipTiers = [
        {
          name: t("zenTribe.tiers.novice.name"),
          price: t("zenTribe.tiers.novice.price"),
          features: [
            t("zenTribe.tiers.novice.feature1"),
            t("zenTribe.tiers.novice.feature2"),
            t("zenTribe.tiers.novice.feature3"),
            t("zenTribe.tiers.novice.feature4")
          ],
          color: "primary",
          icon: /* @__PURE__ */ React7.createElement(Users4, { size: 24, "aria-hidden": "true" }),
          popular: false
        },
        {
          name: t("zenTribe.tiers.voyager.name"),
          price: t("zenTribe.tiers.voyager.price"),
          features: [
            t("zenTribe.tiers.voyager.feature1"),
            t("zenTribe.tiers.voyager.feature2"),
            t("zenTribe.tiers.voyager.feature3"),
            t("zenTribe.tiers.voyager.feature4"),
            t("zenTribe.tiers.voyager.feature5")
          ],
          color: "secondary",
          icon: /* @__PURE__ */ React7.createElement(Star3, { size: 24, "aria-hidden": "true" }),
          popular: true
        },
        {
          name: t("zenTribe.tiers.master.name"),
          price: t("zenTribe.tiers.master.price"),
          features: [
            t("zenTribe.tiers.master.feature1"),
            t("zenTribe.tiers.master.feature2"),
            t("zenTribe.tiers.master.feature3"),
            t("zenTribe.tiers.master.feature4"),
            t("zenTribe.tiers.master.feature5"),
            t("zenTribe.tiers.master.feature6")
          ],
          color: "accent",
          icon: /* @__PURE__ */ React7.createElement(Shield, { size: 24, "aria-hidden": "true" }),
          popular: false
        }
      ];
      const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
      const currentPath = "/zentribe";
      const currentUrl = "https://djzeneyer.com" + currentPath;
      return /* @__PURE__ */ React7.createElement(React7.Fragment, null, /* @__PURE__ */ React7.createElement(
        HeadlessSEO,
        {
          title: t("tribe_page_title"),
          description: t("tribe_page_meta_desc"),
          url: currentUrl,
          image: "https://djzeneyer.com/images/zen-tribe-og.jpg",
          ogType: "website",
          schema: ORGANIZATION_SCHEMA,
          keywords: "Zen Tribe, Tribo Zen, Brazilian Zouk community, DJ Zen Eyer membership, Zouk exclusive content, gamification, VIP events"
        }
      ), /* @__PURE__ */ React7.createElement("div", { className: "pt-24 min-h-screen" }, /* @__PURE__ */ React7.createElement("div", { className: "bg-surface py-12 md:py-16", id: "tribe-intro" }, /* @__PURE__ */ React7.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React7.createElement(
        motion6.div,
        {
          className: "text-center",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        },
        /* @__PURE__ */ React7.createElement("div", { className: "inline-block mb-4" }, /* @__PURE__ */ React7.createElement("div", { className: "bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm" }, t("zenTribe.badge"))),
        /* @__PURE__ */ React7.createElement("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display" }, t("zenTribe.welcome"), " ", /* @__PURE__ */ React7.createElement("span", { className: "text-primary" }, t("zenTribe.tribe"))),
        /* @__PURE__ */ React7.createElement("p", { className: "text-lg md:text-xl text-white/70 max-w-2xl mx-auto" }, t("zenTribe.subtitle")),
        /* @__PURE__ */ React7.createElement("div", { className: "mt-8 flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ React7.createElement(
          "button",
          {
            className: "btn btn-primary transition-all duration-300 hover:scale-105",
            onClick: () => scrollToSection("membership-tiers"),
            "aria-label": "View membership options"
          },
          t("zenTribe.viewMemberships")
        ), /* @__PURE__ */ React7.createElement(
          "button",
          {
            className: "btn btn-outline transition-all duration-300 hover:scale-105",
            onClick: () => scrollToSection("tribe-benefits"),
            "aria-label": "Learn more about tribe benefits"
          },
          t("zenTribe.learnMore")
        ))
      ))), /* @__PURE__ */ React7.createElement("section", { className: "py-16 bg-background", id: "tribe-benefits" }, /* @__PURE__ */ React7.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React7.createElement(
        motion6.h2,
        {
          className: "text-2xl md:text-3xl font-bold mb-12 text-center font-display",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        },
        t("zenTribe.whyJoin")
      ), /* @__PURE__ */ React7.createElement(
        motion6.div,
        {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8",
          variants: CONTAINER_VARIANTS2,
          initial: "hidden",
          animate: "visible"
        },
        /* @__PURE__ */ React7.createElement(
          BenefitCard,
          {
            icon: /* @__PURE__ */ React7.createElement(Award2, { className: "text-primary", size: 24, "aria-hidden": "true" }),
            title: t("zenTribe.benefits.exclusiveMusic.title"),
            description: t("zenTribe.benefits.exclusiveMusic.desc"),
            color: "primary"
          }
        ),
        /* @__PURE__ */ React7.createElement(
          BenefitCard,
          {
            icon: /* @__PURE__ */ React7.createElement(Star3, { className: "text-secondary", size: 24, "aria-hidden": "true" }),
            title: t("zenTribe.benefits.earlyAccess.title"),
            description: t("zenTribe.benefits.earlyAccess.desc"),
            color: "secondary"
          }
        ),
        /* @__PURE__ */ React7.createElement(
          BenefitCard,
          {
            icon: /* @__PURE__ */ React7.createElement(TrendingUp, { className: "text-accent", size: 24, "aria-hidden": "true" }),
            title: t("zenTribe.benefits.vipStatus.title"),
            description: t("zenTribe.benefits.vipStatus.desc"),
            color: "accent"
          }
        ),
        /* @__PURE__ */ React7.createElement(
          BenefitCard,
          {
            icon: /* @__PURE__ */ React7.createElement(Users4, { className: "text-success", size: 24, "aria-hidden": "true" }),
            title: t("zenTribe.benefits.community.title"),
            description: t("zenTribe.benefits.community.desc"),
            color: "success"
          }
        )
      ))), /* @__PURE__ */ React7.createElement("section", { className: "py-16 bg-surface", id: "membership-tiers" }, /* @__PURE__ */ React7.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React7.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React7.createElement("h2", { className: "text-2xl md:text-3xl font-bold mb-4 font-display" }, t("zenTribe.chooseMembership")), /* @__PURE__ */ React7.createElement("p", { className: "text-lg md:text-xl text-white/70 max-w-2xl mx-auto" }, t("zenTribe.selectTier"))), /* @__PURE__ */ React7.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" }, membershipTiers.map((tier, index) => /* @__PURE__ */ React7.createElement(MembershipCard, { key: index, tier, user, t }))))), /* @__PURE__ */ React7.createElement("section", { className: "py-16 bg-background", id: "achievement-system" }, /* @__PURE__ */ React7.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React7.createElement("div", { className: "flex flex-col lg:flex-row items-start gap-8 lg:gap-12" }, /* @__PURE__ */ React7.createElement(
        motion6.div,
        {
          className: "lg:w-1/2",
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5 }
        },
        /* @__PURE__ */ React7.createElement("h2", { className: "text-4xl font-bold mb-6 font-display" }, t("zenTribe.levelUpTitle")),
        /* @__PURE__ */ React7.createElement("p", { className: "text-lg text-white/70 mb-8" }, t("zenTribe.levelUpDesc")),
        /* @__PURE__ */ React7.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ React7.createElement("div", { className: "flex items-start" }, /* @__PURE__ */ React7.createElement(TrendingUp, { className: "text-primary mr-4 mt-1", size: 24 }), /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("h3", { className: "text-xl font-display mb-2" }, t("zenTribe.xpTitle")), /* @__PURE__ */ React7.createElement("p", { className: "text-white/70" }, t("zenTribe.xpDesc")))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-start" }, /* @__PURE__ */ React7.createElement(Award2, { className: "text-secondary mr-4 mt-1", size: 24 }), /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("h3", { className: "text-xl font-display mb-2" }, t("zenTribe.badgesTitle")), /* @__PURE__ */ React7.createElement("p", { className: "text-white/70" }, t("zenTribe.badgesDesc")))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-start" }, /* @__PURE__ */ React7.createElement(Gift, { className: "text-accent mr-4 mt-1", size: 24 }), /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("h3", { className: "text-xl font-display mb-2" }, t("zenTribe.rewardsTitle")), /* @__PURE__ */ React7.createElement("p", { className: "text-white/70" }, t("zenTribe.rewardsDesc")))), /* @__PURE__ */ React7.createElement("div", { className: "flex items-start" }, /* @__PURE__ */ React7.createElement(Clock2, { className: "text-success mr-4 mt-1", size: 24 }), /* @__PURE__ */ React7.createElement("div", null, /* @__PURE__ */ React7.createElement("h3", { className: "text-xl font-display mb-2" }, t("zenTribe.streaksTitle")), /* @__PURE__ */ React7.createElement("p", { className: "text-white/70" }, t("zenTribe.streaksDesc")))))
      ), /* @__PURE__ */ React7.createElement(
        motion6.div,
        {
          className: "lg:w-1/2 bg-surface rounded-xl p-8",
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.2 }
        },
        /* @__PURE__ */ React7.createElement("div", { className: "flex items-center gap-2 mb-8" }, /* @__PURE__ */ React7.createElement(Zap, { className: "text-primary", size: 24 }), /* @__PURE__ */ React7.createElement("h3", { className: "text-2xl font-display" }, t("zenTribe.achievementShowcase"))),
        /* @__PURE__ */ React7.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4" }, ACHIEVEMENTS_DATA2.map((achievement, index) => /* @__PURE__ */ React7.createElement(
          AchievementCard,
          {
            key: index,
            emoji: achievement.emoji,
            title: t(achievement.titleKey),
            description: t(achievement.descKey),
            unlocked: achievement.unlocked,
            t
          }
        ))),
        /* @__PURE__ */ React7.createElement("div", { className: "mt-8" }, /* @__PURE__ */ React7.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React7.createElement("h4", { className: "text-xl font-display" }, t("zenTribe.currentLevel")), /* @__PURE__ */ React7.createElement("span", { className: "text-2xl text-primary" }, "3")), /* @__PURE__ */ React7.createElement("h5", { className: "text-lg mb-4" }, t("zenTribe.zenApprentice")), /* @__PURE__ */ React7.createElement("p", { className: "text-sm text-white/70 mb-2" }, t("zenTribe.progressToLevel")), /* @__PURE__ */ React7.createElement("div", { className: "h-2 bg-background rounded-full overflow-hidden" }, /* @__PURE__ */ React7.createElement("div", { className: "h-full bg-primary rounded-full", style: { width: "87.5%" } })), /* @__PURE__ */ React7.createElement("p", { className: "text-right text-sm text-white/70 mt-1" }, "350/400 XP"))
      ))))));
    };
    ZenTribePage_default = ZenTribePage;
  }
});

// src/pages/PressKitPage.tsx
var PressKitPage_exports = {};
__export(PressKitPage_exports, {
  default: () => PressKitPage_default
});
import React8, { memo as memo3 } from "react";
import { useTranslation as useTranslation7 } from "react-i18next";
import { motion as motion7 } from "framer-motion";
import {
  Download as Download4,
  Phone,
  FileText,
  ImageIcon,
  Music2 as Music24,
  Award as Award3,
  Globe as Globe4,
  Users as Users5,
  Star as Star4,
  Mail as Mail2,
  Instagram,
  Calendar as Calendar3,
  MapPin as MapPin3,
  Sparkles as Sparkles3,
  PlayCircle as PlayCircle2,
  Radio,
  Database,
  ExternalLink as ExternalLink4
} from "lucide-react";
var PRESS_LINKS, CONTENT_PT, CONTENT_EN, RELEVANT_LINKS, WHATSAPP_CONFIG, WHATSAPP_URL, StatCard2, MediaKitCard, PressKitPage, PressKitPage_default;
var init_PressKitPage = __esm({
  "src/pages/PressKitPage.tsx"() {
    init_artistData();
    init_HeadlessSEO();
    init_seo();
    PRESS_LINKS = {
      photos: "https://photos.djzeneyer.com",
      // ✅ Seu subdomínio personalizado
      epk: "/media/dj-zen-eyer-epk.pdf",
      // 📁 Coloque este arquivo em public/media/
      logos: "/media/dj-zen-eyer-logos.zip"
      // 📁 Coloque este arquivo em public/media/
    };
    CONTENT_PT = {
      seo: {
        title: "Press Kit Oficial - Zen Eyer | DJ Brasileiro de Zouk Brasileiro",
        description: "Press Kit oficial de Zen Eyer, DJ brasileiro bicampe\xE3o mundial de Zouk Brasileiro. Baixe fotos, biografia e informa\xE7\xF5es para imprensa."
      },
      hero: {
        tag: "Press Kit Oficial",
        title_prefix: "Zen",
        title_suffix: "Eyer",
        role: "DJ brasileiro bicampe\xE3o mundial de Zouk Brasileiro",
        subtitle: "Sets cremosos, emocionais e conectados \xE0 dan\xE7a"
      },
      stats: [
        { number: "11+", label: "Pa\xEDses", icon: /* @__PURE__ */ React8.createElement(Globe4, { size: 32 }), color: "bg-gradient-to-br from-blue-500 to-blue-700" },
        { number: "50K+", label: "Pessoas impactadas", icon: /* @__PURE__ */ React8.createElement(Users5, { size: 32 }), color: "bg-gradient-to-br from-purple-500 to-purple-700" },
        { number: "500K+", label: "Streams globais", icon: /* @__PURE__ */ React8.createElement(Music24, { size: 32 }), color: "bg-gradient-to-br from-pink-500 to-pink-700" },
        { number: "10+", label: "Anos de carreira", icon: /* @__PURE__ */ React8.createElement(Award3, { size: 32 }), color: "bg-gradient-to-br from-green-500 to-green-700" }
      ],
      bio: {
        title: "Sobre Zen Eyer",
        p1: /* @__PURE__ */ React8.createElement(React8.Fragment, null, /* @__PURE__ */ React8.createElement("strong", { className: "text-white" }, "Zen Eyer"), " (Marcelo Eyer Fernandes) \xE9 um ", /* @__PURE__ */ React8.createElement("strong", null, "DJ brasileiro especializado em Zouk Brasileiro"), ', bicampe\xE3o mundial no g\xEAnero (2022) e membro da Mensa International. Seu estilo \xFAnico, chamado de "', /* @__PURE__ */ React8.createElement("strong", null, "cremosidade"), '", combina t\xE9cnica apurada com emo\xE7\xE3o profunda, criando sets que s\xE3o verdadeiras jornadas musicais para os dan\xE7arinos.'),
        p2: /* @__PURE__ */ React8.createElement(React8.Fragment, null, "Com mais de 10 anos de carreira, Zen Eyer j\xE1 se apresentou em ", /* @__PURE__ */ React8.createElement("strong", null, "100+ eventos em 11 pa\xEDses"), ", incluindo Holanda, Espanha, Rep\xFAblica Tcheca e Alemanha. Seu repert\xF3rio \xE9 100% focado no Zouk Brasileiro, com influ\xEAncias de kizomba, lambada e black music, sempre priorizando a conex\xE3o emocional com a dan\xE7a."),
        p3: /* @__PURE__ */ React8.createElement(React8.Fragment, null, "Como produtor musical, Zen Eyer cria remixes exclusivos e edi\xE7\xF5es especiais para o floor de Zouk, com mais de ", /* @__PURE__ */ React8.createElement("strong", null, "500.000 streams globais"), ". \xC9 criador do evento ", /* @__PURE__ */ React8.createElement("strong", null, "reZENha"), " e da comunidade ", /* @__PURE__ */ React8.createElement("strong", null, "Tribo Zen"), ", que oferece conte\xFAdo exclusivo para amantes do Zouk Brasileiro."),
        quickStats: [
          { title: "Cremosidade", desc: "Sets fluidos e emocionais", icon: /* @__PURE__ */ React8.createElement(Star4, { size: 20, className: "text-primary" }) },
          { title: "Repert\xF3rio", desc: "Zouk, Kizomba, Lambada", icon: /* @__PURE__ */ React8.createElement(Music24, { size: 20, className: "text-accent" }) },
          { title: "Conex\xE3o", desc: "Foco na dan\xE7a", icon: /* @__PURE__ */ React8.createElement(Users5, { size: 20, className: "text-success" }) },
          { title: "Global", desc: "Presen\xE7a internacional", icon: /* @__PURE__ */ React8.createElement(Globe4, { size: 20, className: "text-purple-400" }) }
        ]
      },
      media: {
        title: "Material para Imprensa",
        subtitle: "Tudo que voc\xEA precisa para divulga\xE7\xE3o e marketing",
        items: [
          { title: "Fotos para Imprensa", desc: "Galeria oficial em alta resolu\xE7\xE3o", path: PRESS_LINKS.photos, icon: /* @__PURE__ */ React8.createElement(ImageIcon, { size: 32 }), isExternal: true },
          { title: "Biografia Completa", desc: "PDF com Bio e Rider T\xE9cnico", path: PRESS_LINKS.epk, icon: /* @__PURE__ */ React8.createElement(FileText, { size: 32 }), isExternal: false },
          { title: "Logos e Branding", desc: "Logos oficiais em PNG/SVG", path: PRESS_LINKS.logos, icon: /* @__PURE__ */ React8.createElement(Music24, { size: 32 }), isExternal: false }
        ]
      },
      gallery: {
        title: "Fotos para Imprensa",
        subtitle: "Imagens em alta resolu\xE7\xE3o para uso promocional",
        cta: "Ver Galeria Completa"
      },
      contact: {
        title: "Vamos Criar Algo Incr\xEDvel",
        subtitle: "Pronto para elevar seu evento? Entre em contato para discutir bookings ou colabora\xE7\xF5es.",
        baseTitle: "Baseado em",
        baseValue: "Niter\xF3i, RJ - Brasil",
        availabilityTitle: "Disponibilidade",
        availabilityValue: "Bookings internacionais",
        genreTitle: "G\xEAnero",
        genreValue: "Zouk Brasileiro",
        linksTitle: "Links Oficiais"
      }
    };
    CONTENT_EN = {
      seo: {
        title: "Official Press Kit - Zen Eyer | Brazilian Zouk DJ & Producer",
        description: "Official Press Kit for Zen Eyer, 2x World Champion Brazilian Zouk DJ. Download high-res photos, biography, and technical rider."
      },
      hero: {
        tag: "Official Press Kit",
        title_prefix: "Zen",
        title_suffix: "Eyer",
        role: "2x World Champion Brazilian Zouk DJ & Producer",
        subtitle: "Creamy sets, emotional journeys, and deep dance connection"
      },
      stats: [
        { number: "11+", label: "Countries", icon: /* @__PURE__ */ React8.createElement(Globe4, { size: 32 }), color: "bg-gradient-to-br from-blue-500 to-blue-700" },
        { number: "50K+", label: "People impacted", icon: /* @__PURE__ */ React8.createElement(Users5, { size: 32 }), color: "bg-gradient-to-br from-purple-500 to-purple-700" },
        { number: "500K+", label: "Global streams", icon: /* @__PURE__ */ React8.createElement(Music24, { size: 32 }), color: "bg-gradient-to-br from-pink-500 to-pink-700" },
        { number: "10+", label: "Years active", icon: /* @__PURE__ */ React8.createElement(Award3, { size: 32 }), color: "bg-gradient-to-br from-green-500 to-green-700" }
      ],
      bio: {
        title: "About Zen Eyer",
        p1: /* @__PURE__ */ React8.createElement(React8.Fragment, null, /* @__PURE__ */ React8.createElement("strong", { className: "text-white" }, "Zen Eyer"), " (Marcelo Eyer Fernandes) is a ", /* @__PURE__ */ React8.createElement("strong", null, "Brazilian Zouk DJ specialized in the genre"), ', 2x World Champion (2022), and member of Mensa International. His unique style, known as "', /* @__PURE__ */ React8.createElement("strong", null, "creaminess"), '" (cremosidade), combines precise technique with deep emotion, creating sets that are true musical journeys for dancers.'),
        p2: /* @__PURE__ */ React8.createElement(React8.Fragment, null, "With over 10 years of career, Zen Eyer has performed at ", /* @__PURE__ */ React8.createElement("strong", null, "100+ events in 11 countries"), ", including the Netherlands, Spain, Czech Republic, and Germany. His repertoire is 100% focused on Brazilian Zouk, with influences from Kizomba, Lambada, and Black Music, always prioritizing the emotional connection with the dance."),
        p3: /* @__PURE__ */ React8.createElement(React8.Fragment, null, "As a music producer, Zen Eyer creates exclusive remixes and special edits for the Zouk floor, with over ", /* @__PURE__ */ React8.createElement("strong", null, "500,000 global streams"), ". He is the creator of the event ", /* @__PURE__ */ React8.createElement("strong", null, "reZENha"), " and the ", /* @__PURE__ */ React8.createElement("strong", null, "Tribo Zen"), " community."),
        quickStats: [
          { title: "Creaminess", desc: "Fluid & emotional sets", icon: /* @__PURE__ */ React8.createElement(Star4, { size: 20, className: "text-primary" }) },
          { title: "Repertoire", desc: "Zouk, Kizomba, Lambada", icon: /* @__PURE__ */ React8.createElement(Music24, { size: 20, className: "text-accent" }) },
          { title: "Connection", desc: "Dance-focused", icon: /* @__PURE__ */ React8.createElement(Users5, { size: 20, className: "text-success" }) },
          { title: "Global", desc: "International presence", icon: /* @__PURE__ */ React8.createElement(Globe4, { size: 20, className: "text-purple-400" }) }
        ]
      },
      media: {
        title: "Press Materials",
        subtitle: "Everything you need for promotion and marketing",
        items: [
          { title: "Press Photos", desc: "High-res photos gallery", path: PRESS_LINKS.photos, icon: /* @__PURE__ */ React8.createElement(ImageIcon, { size: 32 }), isExternal: true },
          { title: "Full Biography", desc: "PDF with Bio and Tech Rider", path: PRESS_LINKS.epk, icon: /* @__PURE__ */ React8.createElement(FileText, { size: 32 }), isExternal: false },
          { title: "Logos & Branding", desc: "Official logos in PNG/SVG", path: PRESS_LINKS.logos, icon: /* @__PURE__ */ React8.createElement(Music24, { size: 32 }), isExternal: false }
        ]
      },
      gallery: {
        title: "Press Photos",
        subtitle: "High-resolution images for promotional use",
        cta: "View Full Gallery"
      },
      contact: {
        title: "Let's Create Magic",
        subtitle: "Ready to elevate your event? Get in touch to discuss bookings or collaborations.",
        baseTitle: "Based in",
        baseValue: "Niter\xF3i, RJ - Brazil",
        availabilityTitle: "Availability",
        availabilityValue: "International Bookings",
        genreTitle: "Genre",
        genreValue: "Brazilian Zouk",
        linksTitle: "Official Links"
      }
    };
    RELEVANT_LINKS = [
      { name: "Instagram", url: ARTIST.social.instagram.url, icon: /* @__PURE__ */ React8.createElement(Instagram, { size: 20 }) },
      { name: "YouTube", url: ARTIST.social.youtube.url, icon: /* @__PURE__ */ React8.createElement(Radio, { size: 20 }) },
      { name: "Spotify", url: ARTIST.social.spotify.url, icon: /* @__PURE__ */ React8.createElement(PlayCircle2, { size: 20 }) },
      { name: "Apple Music", url: ARTIST.social.appleMusic.url, icon: /* @__PURE__ */ React8.createElement(PlayCircle2, { size: 20 }) },
      { name: "MusicBrainz", url: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154", icon: /* @__PURE__ */ React8.createElement(Database, { size: 20 }) },
      { name: "Wikidata", url: "https://www.wikidata.org/wiki/Q136551855", icon: /* @__PURE__ */ React8.createElement(Globe4, { size: 20 }) },
      { name: "Discogs", url: "https://www.discogs.com/artist/16872046", icon: /* @__PURE__ */ React8.createElement(Database, { size: 20 }) },
      { name: "Resident Advisor", url: "https://pt-br.ra.co/dj/djzeneyer", icon: /* @__PURE__ */ React8.createElement(ExternalLink4, { size: 20 }) }
    ];
    WHATSAPP_CONFIG = {
      number: "5521987413091",
      message: "Ol\xE1 Zen Eyer! Gostaria de conversar sobre uma poss\xEDvel colabora\xE7\xE3o ou booking. Como podemos prosseguir?"
    };
    WHATSAPP_URL = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.message)}`;
    StatCard2 = memo3(({ icon, number, label, color }) => /* @__PURE__ */ React8.createElement(
      motion7.div,
      {
        whileHover: { scale: 1.05, y: -5 },
        className: `${color} p-6 rounded-2xl text-center backdrop-blur-sm border border-white/20 shadow-xl`,
        transition: { type: "spring", stiffness: 300 }
      },
      /* @__PURE__ */ React8.createElement("div", { className: "text-white inline-block p-4 bg-white/10 rounded-full mb-4" }, icon),
      /* @__PURE__ */ React8.createElement("h3", { className: "font-black text-4xl text-white mb-2" }, number),
      /* @__PURE__ */ React8.createElement("p", { className: "text-white/90 font-semibold" }, label)
    ));
    StatCard2.displayName = "StatCard";
    MediaKitCard = memo3(({ icon, title, description, path, isExternal }) => /* @__PURE__ */ React8.createElement(
      motion7.a,
      {
        href: path,
        download: !isExternal,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "group bg-surface/50 p-8 rounded-2xl backdrop-blur-sm border border-white/10 transition-all hover:border-primary hover:bg-surface/80 flex flex-col h-full",
        whileHover: { y: -8 },
        transition: { type: "spring", stiffness: 300 }
      },
      /* @__PURE__ */ React8.createElement("div", { className: "text-primary mx-auto mb-4 p-4 bg-primary/10 rounded-full inline-block group-hover:scale-110 transition-transform" }, icon),
      /* @__PURE__ */ React8.createElement("h3", { className: "font-bold text-xl text-white mb-2" }, title),
      /* @__PURE__ */ React8.createElement("p", { className: "text-white/70 mb-4 flex-grow" }, description),
      /* @__PURE__ */ React8.createElement("div", { className: "flex items-center justify-center gap-2 text-primary font-semibold mt-auto" }, isExternal ? /* @__PURE__ */ React8.createElement(ExternalLink4, { size: 20 }) : /* @__PURE__ */ React8.createElement(Download4, { size: 20 }), /* @__PURE__ */ React8.createElement("span", null, isExternal ? "Acessar" : "Download"))
    ));
    MediaKitCard.displayName = "MediaKitCard";
    PressKitPage = () => {
      const { i18n } = useTranslation7();
      const lang = i18n.language.startsWith("pt") ? "pt" : "en";
      const content = lang === "pt" ? CONTENT_PT : CONTENT_EN;
      const currentPath = "/press-kit";
      const currentUrl = "https://djzeneyer.com" + currentPath;
      const PERSON_SCHEMA = {
        "@type": "Person",
        "@id": "https://djzeneyer.com/#artist",
        "name": "DJ Zen Eyer",
        "alternateName": ["Zen Eyer", "Marcelo Eyer Fernandes"],
        "jobTitle": lang === "pt" ? "DJ e Produtor Musical" : "DJ & Music Producer",
        "description": content.seo.description,
        "url": "https://djzeneyer.com",
        "image": "https://djzeneyer.com/wp-content/uploads/2025/12/ZenEyer-2026.png",
        "sameAs": RELEVANT_LINKS.map((l) => l.url),
        "memberOf": { "@type": "Organization", "name": "Mensa International" },
        "award": [
          { "@type": "Award", "name": "World Champion DJ (Ilha do Zouk 2022)", "datePublished": "2022" },
          { "@type": "Award", "name": "Best Remix (Ilha do Zouk 2022)", "datePublished": "2022" }
        ]
      };
      return /* @__PURE__ */ React8.createElement(React8.Fragment, null, /* @__PURE__ */ React8.createElement(
        HeadlessSEO,
        {
          title: content.seo.title,
          description: content.seo.description,
          url: currentUrl,
          image: "https://djzeneyer.com/images/zen-eyer-presskit-cover.jpg",
          ogType: "profile",
          schema: { "@context": "https://schema.org", "@graph": [PERSON_SCHEMA] },
          hrefLang: getHrefLangUrls(currentPath, "https://djzeneyer.com")
        }
      ), /* @__PURE__ */ React8.createElement("div", { className: "min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white" }, /* @__PURE__ */ React8.createElement("div", { className: "relative pt-24 pb-16 overflow-hidden" }, /* @__PURE__ */ React8.createElement("div", { className: "absolute inset-0 pointer-events-none opacity-30" }, /* @__PURE__ */ React8.createElement("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" }), /* @__PURE__ */ React8.createElement("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse", style: { animationDelay: "1s" } })), /* @__PURE__ */ React8.createElement("div", { className: "container mx-auto px-4 relative z-10" }, /* @__PURE__ */ React8.createElement(motion7.div, { className: "text-center mb-16", initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }, /* @__PURE__ */ React8.createElement(motion7.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 0.2, duration: 0.6 }, className: "inline-block mb-4" }, /* @__PURE__ */ React8.createElement("div", { className: "bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm" }, /* @__PURE__ */ React8.createElement(Sparkles3, { className: "inline-block mr-2", size: 16 }), content.hero.tag)), /* @__PURE__ */ React8.createElement("h1", { className: "text-5xl md:text-7xl font-black font-display mb-6" }, content.hero.title_prefix, " ", /* @__PURE__ */ React8.createElement("span", { className: "text-primary" }, content.hero.title_suffix)), /* @__PURE__ */ React8.createElement("p", { className: "text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed" }, content.hero.role, /* @__PURE__ */ React8.createElement("br", null), /* @__PURE__ */ React8.createElement("span", { className: "text-primary font-semibold" }, content.hero.subtitle))), /* @__PURE__ */ React8.createElement(motion7.div, { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4, duration: 0.8 } }, content.stats.map((stat, index) => /* @__PURE__ */ React8.createElement(StatCard2, { key: index, ...stat }))))), /* @__PURE__ */ React8.createElement("section", { className: "py-20 bg-surface/30" }, /* @__PURE__ */ React8.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React8.createElement(motion7.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.8 }, className: "max-w-6xl mx-auto" }, /* @__PURE__ */ React8.createElement("div", { className: "grid md:grid-cols-2 gap-12 items-center" }, /* @__PURE__ */ React8.createElement(motion7.div, { className: "relative", whileHover: { scale: 1.02 }, transition: { type: "spring", stiffness: 300 } }, /* @__PURE__ */ React8.createElement("div", { className: "aspect-square rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl" }, /* @__PURE__ */ React8.createElement(
        "img",
        {
          src: "https://djzeneyer.com/wp-content/uploads/2025/12/ZenEyer-2026.png",
          alt: "Zen Eyer - Press Photo",
          className: "w-full h-full object-cover",
          loading: "lazy",
          decoding: "async",
          width: "600",
          height: "600"
        }
      ))), /* @__PURE__ */ React8.createElement("div", null, /* @__PURE__ */ React8.createElement("h2", { className: "text-4xl font-black font-display mb-6 flex items-center gap-3" }, /* @__PURE__ */ React8.createElement(Music24, { className: "text-primary", size: 36 }), content.bio.title), /* @__PURE__ */ React8.createElement("div", { className: "space-y-4 text-lg text-white/80 leading-relaxed" }, /* @__PURE__ */ React8.createElement("p", null, content.bio.p1), /* @__PURE__ */ React8.createElement("p", null, content.bio.p2), /* @__PURE__ */ React8.createElement("p", null, content.bio.p3)), /* @__PURE__ */ React8.createElement("div", { className: "mt-8 grid grid-cols-2 gap-4" }, content.bio.quickStats.map((item, i) => /* @__PURE__ */ React8.createElement("div", { key: i, className: "flex items-start gap-3" }, /* @__PURE__ */ React8.createElement("div", { className: "p-2 bg-primary/20 rounded-lg" }, item.icon), /* @__PURE__ */ React8.createElement("div", null, /* @__PURE__ */ React8.createElement("div", { className: "font-bold text-white" }, item.title), /* @__PURE__ */ React8.createElement("div", { className: "text-sm text-white/60" }, item.desc)))))))))), /* @__PURE__ */ React8.createElement("section", { className: "py-20" }, /* @__PURE__ */ React8.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React8.createElement(motion7.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, className: "max-w-6xl mx-auto" }, /* @__PURE__ */ React8.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React8.createElement("h2", { className: "text-4xl font-black font-display mb-4" }, content.media.title), /* @__PURE__ */ React8.createElement("p", { className: "text-xl text-white/70" }, content.media.subtitle)), /* @__PURE__ */ React8.createElement("div", { className: "grid md:grid-cols-3 gap-8" }, content.media.items.map((item, index) => /* @__PURE__ */ React8.createElement(MediaKitCard, { key: index, ...item })))))), /* @__PURE__ */ React8.createElement("section", { className: "py-20 bg-surface/30" }, /* @__PURE__ */ React8.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React8.createElement(motion7.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, className: "max-w-6xl mx-auto" }, /* @__PURE__ */ React8.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React8.createElement("h2", { className: "text-4xl font-black font-display mb-4" }, content.gallery.title), /* @__PURE__ */ React8.createElement("p", { className: "text-xl text-white/70" }, content.gallery.subtitle)), /* @__PURE__ */ React8.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4" }, [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ React8.createElement(motion7.div, { key: i, className: "aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer", whileHover: { scale: 1.05 } }, /* @__PURE__ */ React8.createElement(
        "img",
        {
          src: `/images/press-photo-${i}.svg`,
          alt: `Zen Eyer Press Photo ${i}`,
          className: "w-full h-full object-cover",
          loading: "lazy",
          decoding: "async",
          width: "400",
          height: "400"
        }
      )))), /* @__PURE__ */ React8.createElement("div", { className: "text-center mt-8" }, /* @__PURE__ */ React8.createElement("a", { href: PRESS_LINKS.photos, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-lg inline-flex items-center gap-2" }, /* @__PURE__ */ React8.createElement(ImageIcon, { size: 20 }), content.gallery.cta))))), /* @__PURE__ */ React8.createElement("section", { className: "py-20" }, /* @__PURE__ */ React8.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React8.createElement(motion7.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "max-w-4xl mx-auto text-center" }, /* @__PURE__ */ React8.createElement("div", { className: "bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30" }, /* @__PURE__ */ React8.createElement("h2", { className: "text-4xl md:text-5xl font-black font-display mb-6" }, content.contact.title), /* @__PURE__ */ React8.createElement("p", { className: "text-xl text-white/80 mb-8 max-w-2xl mx-auto" }, content.contact.subtitle), /* @__PURE__ */ React8.createElement("div", { className: "flex flex-wrap justify-center gap-4" }, /* @__PURE__ */ React8.createElement("a", { href: WHATSAPP_URL, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary btn-lg inline-flex items-center gap-3" }, /* @__PURE__ */ React8.createElement(Phone, { size: 20 }), " WhatsApp"), /* @__PURE__ */ React8.createElement("a", { href: `mailto:${ARTIST.contact.email}`, className: "btn btn-outline btn-lg inline-flex items-center gap-3" }, /* @__PURE__ */ React8.createElement(Mail2, { size: 20 }), " Email"), /* @__PURE__ */ React8.createElement("a", { href: ARTIST.social.instagram.url, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline btn-lg inline-flex items-center gap-3" }, /* @__PURE__ */ React8.createElement(Instagram, { size: 20 }), " Instagram")), /* @__PURE__ */ React8.createElement("div", { className: "mt-12 pt-8 border-t border-white/10" }, /* @__PURE__ */ React8.createElement("div", { className: "grid md:grid-cols-3 gap-6 text-left" }, /* @__PURE__ */ React8.createElement("div", { className: "flex items-start gap-3" }, /* @__PURE__ */ React8.createElement(MapPin3, { className: "text-primary mt-1", size: 20 }), /* @__PURE__ */ React8.createElement("div", null, /* @__PURE__ */ React8.createElement("div", { className: "font-bold text-white mb-1" }, content.contact.baseTitle), /* @__PURE__ */ React8.createElement("div", { className: "text-white/70" }, content.contact.baseValue))), /* @__PURE__ */ React8.createElement("div", { className: "flex items-start gap-3" }, /* @__PURE__ */ React8.createElement(Calendar3, { className: "text-primary mt-1", size: 20 }), /* @__PURE__ */ React8.createElement("div", null, /* @__PURE__ */ React8.createElement("div", { className: "font-bold text-white mb-1" }, content.contact.availabilityTitle), /* @__PURE__ */ React8.createElement("div", { className: "text-white/70" }, content.contact.availabilityValue))), /* @__PURE__ */ React8.createElement("div", { className: "flex items-start gap-3" }, /* @__PURE__ */ React8.createElement(Music24, { className: "text-primary mt-1", size: 20 }), /* @__PURE__ */ React8.createElement("div", null, /* @__PURE__ */ React8.createElement("div", { className: "font-bold text-white mb-1" }, content.contact.genreTitle), /* @__PURE__ */ React8.createElement("div", { className: "text-white/70" }, content.contact.genreValue))))), /* @__PURE__ */ React8.createElement("div", { className: "mt-12 pt-8 border-t border-white/10" }, /* @__PURE__ */ React8.createElement("h3", { className: "text-xl font-bold mb-6 text-center" }, content.contact.linksTitle), /* @__PURE__ */ React8.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4" }, RELEVANT_LINKS.map((link, index) => /* @__PURE__ */ React8.createElement("a", { key: index, href: link.url, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 bg-surface/50 p-3 rounded-lg hover:bg-surface/80 transition-colors" }, link.icon, /* @__PURE__ */ React8.createElement("span", null, link.name)))))))))));
    };
    PressKitPage_default = PressKitPage;
  }
});

// src/pages/ShopPage.tsx
var ShopPage_exports = {};
__export(ShopPage_exports, {
  default: () => ShopPage_default
});
import React9, { useState as useState6, useEffect as useEffect5, useCallback, useRef } from "react";
import { Link as Link4 } from "react-router-dom";
import { motion as motion8, AnimatePresence as AnimatePresence3 } from "framer-motion";
import { useTranslation as useTranslation8 } from "react-i18next";
import { Helmet as Helmet2 } from "react-helmet-async";
import DOMPurify from "dompurify";
import {
  Loader2,
  ShoppingCart,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Star as Star5,
  Clock as Clock3,
  Info as Info2,
  Truck,
  Shield as Shield2,
  Gift as Gift2,
  Zap as Zap2
} from "lucide-react";
var ProductCarousel, ShopPage, ShopPage_default;
var init_ShopPage = __esm({
  "src/pages/ShopPage.tsx"() {
    ProductCarousel = ({ title, products, onAddToCart, addingToCart, formatPrice, productBasePath }) => {
      const { t } = useTranslation8();
      const carouselRef = useRef(null);
      const [canScrollLeft, setCanScrollLeft] = useState6(false);
      const [canScrollRight, setCanScrollRight] = useState6(true);
      const checkScroll = useCallback(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          setCanScrollLeft(scrollLeft > 0);
          setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
      }, []);
      useEffect5(() => {
        checkScroll();
        const carousel = carouselRef.current;
        if (carousel) {
          carousel.addEventListener("scroll", checkScroll);
          return () => carousel.removeEventListener("scroll", checkScroll);
        }
      }, [products, checkScroll]);
      const scroll = (direction) => {
        if (carouselRef.current) {
          const scrollAmount = carouselRef.current.clientWidth * 0.8;
          carouselRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
          });
        }
      };
      if (products.length === 0) return null;
      return /* @__PURE__ */ React9.createElement("div", { className: "mb-12 relative group px-4 md:px-8" }, /* @__PURE__ */ React9.createElement("h2", { className: "text-2xl md:text-3xl font-bold mb-6 font-display text-white" }, title), /* @__PURE__ */ React9.createElement("div", { className: "relative" }, /* @__PURE__ */ React9.createElement(AnimatePresence3, null, canScrollLeft && /* @__PURE__ */ React9.createElement(
        motion8.button,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => scroll("left"),
          "aria-label": "Scroll left",
          className: "absolute left-0 top-0 bottom-0 z-20 bg-black/50 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-12"
        },
        /* @__PURE__ */ React9.createElement(ChevronLeft, { size: 40, className: "text-white" })
      ), canScrollRight && /* @__PURE__ */ React9.createElement(
        motion8.button,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => scroll("right"),
          "aria-label": "Scroll right",
          className: "absolute right-0 top-0 bottom-0 z-20 bg-black/50 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-12"
        },
        /* @__PURE__ */ React9.createElement(ChevronRight, { size: 40, className: "text-white" })
      )), /* @__PURE__ */ React9.createElement(
        "div",
        {
          ref: carouselRef,
          className: "flex gap-4 overflow-x-auto scrollbar-hide py-4 scroll-smooth",
          style: { scrollbarWidth: "none", msOverflowStyle: "none" }
        },
        products.map((product) => /* @__PURE__ */ React9.createElement(
          motion8.div,
          {
            key: product.id,
            className: "flex-shrink-0 w-64 md:w-72 lg:w-80 relative group/card",
            whileHover: { scale: 1.05, zIndex: 10, transition: { duration: 0.3 } }
          },
          /* @__PURE__ */ React9.createElement("div", { className: "card overflow-hidden shadow-xl bg-surface border border-white/5 rounded-lg h-full flex flex-col" }, /* @__PURE__ */ React9.createElement(Link4, { to: `${productBasePath}/${product.slug}`, className: "block relative aspect-[16/9] overflow-hidden" }, /* @__PURE__ */ React9.createElement(
            "img",
            {
              src: product.images[0]?.sizes?.medium || product.images[0]?.src || "https://placehold.co/640x360/0D96FF/FFFFFF?text=Event",
              alt: product.images[0]?.alt || product.name,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110",
              loading: "lazy"
            }
          ), /* @__PURE__ */ React9.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" }), product.on_sale && /* @__PURE__ */ React9.createElement("div", { className: "absolute top-2 right-2 bg-error text-white px-2 py-1 rounded text-xs font-bold uppercase shadow-sm" }, t("badge_sale"))), /* @__PURE__ */ React9.createElement("div", { className: "p-4 flex flex-col flex-grow" }, /* @__PURE__ */ React9.createElement(Link4, { to: `${productBasePath}/${product.slug}` }, /* @__PURE__ */ React9.createElement("h3", { className: "text-base font-bold mb-1 text-white line-clamp-1 hover:text-primary transition-colors" }, product.name)), /* @__PURE__ */ React9.createElement("div", { className: "flex items-center justify-between text-xs text-white/60 mb-3" }, /* @__PURE__ */ React9.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React9.createElement(Star5, { size: 12, className: "text-yellow-500 fill-yellow-500" }), " 4.9"), /* @__PURE__ */ React9.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React9.createElement(Clock3, { size: 12 }), " 1h 45m")), /* @__PURE__ */ React9.createElement("div", { className: "flex flex-wrap gap-1 mb-4" }, product.categories?.slice(0, 2).map((cat, idx) => /* @__PURE__ */ React9.createElement("span", { key: idx, className: "text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/5" }, cat.name))), /* @__PURE__ */ React9.createElement("div", { className: "mt-auto flex items-center justify-between pt-3 border-t border-white/10" }, /* @__PURE__ */ React9.createElement("div", { className: "flex flex-col" }, product.on_sale && product.regular_price && /* @__PURE__ */ React9.createElement("span", { className: "text-xs text-white/40 line-through" }, formatPrice(product.regular_price)), /* @__PURE__ */ React9.createElement("span", { className: "text-lg font-bold text-primary" }, formatPrice(product.price))), product.stock_status === "instock" ? /* @__PURE__ */ React9.createElement(
            "button",
            {
              onClick: (e) => {
                e.preventDefault();
                onAddToCart(product.id);
              },
              disabled: addingToCart === product.id,
              className: "p-2 bg-white/10 hover:bg-primary hover:text-white rounded-full transition-colors disabled:opacity-50",
              "aria-label": t("shop_buy_button")
            },
            addingToCart === product.id ? /* @__PURE__ */ React9.createElement(Loader2, { size: 18, className: "animate-spin" }) : /* @__PURE__ */ React9.createElement(ShoppingCart, { size: 18 })
          ) : /* @__PURE__ */ React9.createElement("span", { className: "text-xs text-white/30 uppercase font-bold border border-white/10 px-2 py-1 rounded" }, t("shop_out_of_stock")))))
        ))
      )));
    };
    ShopPage = () => {
      const { t, i18n } = useTranslation8();
      const currentLang = i18n.language.split("-")[0];
      const isPortuguese = i18n.language.startsWith("pt");
      const productBasePath = isPortuguese ? "/pt/loja/produto" : "/shop/product";
      const [products, setProducts] = useState6([]);
      const [loading, setLoading] = useState6(true);
      const [error, setError] = useState6(null);
      const [addingToCart, setAddingToCart] = useState6(null);
      const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
        const apiUrl = `${baseUrl}djzeneyer/v1/products?lang=${currentLang}`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`${t("shop_error_fetch")}: ${response.status}`);
          const data = await response.json();
          setProducts(data);
        } catch (err) {
          console.error("Error fetching products:", err);
          setError(err.message || t("shop_error_unknown"));
        } finally {
          setLoading(false);
        }
      }, [currentLang, t]);
      useEffect5(() => {
        fetchProducts();
      }, [fetchProducts]);
      const addToCart = async (productId) => {
        setAddingToCart(productId);
        try {
          const response = await fetch("/wp-json/wc/store/cart/add-item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": window.wpData?.nonce || ""
            },
            credentials: "include",
            body: JSON.stringify({ id: productId, quantity: 1 })
          });
          if (response.ok) {
            console.log("Product added to cart");
          }
        } catch (error2) {
          console.error("Error adding to cart:", error2);
        } finally {
          setAddingToCart(null);
        }
      };
      const formatPrice = (price) => {
        if (!price) return "R$ 0,00";
        const numPrice = parseFloat(price);
        const locale = isPortuguese ? "pt-BR" : "en-US";
        return isNaN(numPrice) ? price : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
      };
      const featuredProduct = products.find((p) => p.categories?.some((c) => c.name.toLowerCase() === "featured")) || products[0];
      const upcomingProducts = products.filter((p) => p.id !== featuredProduct?.id).slice(0, 8);
      const popularProducts = products.slice(8, 16);
      if (loading) return /* @__PURE__ */ React9.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background text-white" }, /* @__PURE__ */ React9.createElement(Loader2, { className: "animate-spin text-primary", size: 48 }));
      if (error) return /* @__PURE__ */ React9.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background text-white p-4" }, /* @__PURE__ */ React9.createElement("div", { className: "text-center max-w-md" }, /* @__PURE__ */ React9.createElement(AlertCircle, { className: "mx-auto mb-4 text-error", size: 48 }), /* @__PURE__ */ React9.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Error loading shop"), /* @__PURE__ */ React9.createElement("p", { className: "opacity-70" }, error), /* @__PURE__ */ React9.createElement("button", { onClick: fetchProducts, className: "mt-4 btn btn-primary" }, "Try Again")));
      return /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement(Helmet2, null, /* @__PURE__ */ React9.createElement("title", null, t("shop_page_title"), " | DJ Zen Eyer"), /* @__PURE__ */ React9.createElement("meta", { name: "description", content: t("shop_page_meta_desc") })), /* @__PURE__ */ React9.createElement("div", { className: "min-h-screen pb-20 bg-background text-white" }, featuredProduct && /* @__PURE__ */ React9.createElement("div", { className: "relative h-[60vh] md:h-[80vh] w-full mb-8" }, /* @__PURE__ */ React9.createElement("div", { className: "absolute inset-0" }, /* @__PURE__ */ React9.createElement(
        "img",
        {
          src: featuredProduct.images[0]?.src || "https://placehold.co/1200x675/0D96FF/FFFFFF?text=DJ+Zen+Eyer",
          alt: featuredProduct.name,
          className: "w-full h-full object-cover"
        }
      ), /* @__PURE__ */ React9.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }), /* @__PURE__ */ React9.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" })), /* @__PURE__ */ React9.createElement("div", { className: "absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex flex-col justify-end h-full pointer-events-none" }, /* @__PURE__ */ React9.createElement("div", { className: "max-w-3xl pointer-events-auto" }, /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ React9.createElement("span", { className: "bg-primary text-black font-bold px-2 py-1 text-xs uppercase tracking-wide rounded" }, "Featured Event"), featuredProduct.on_sale && /* @__PURE__ */ React9.createElement("span", { className: "bg-error text-white font-bold px-2 py-1 text-xs uppercase tracking-wide rounded" }, "Sale")), /* @__PURE__ */ React9.createElement("h1", { className: "text-4xl md:text-6xl font-black mb-4 font-display leading-tight drop-shadow-lg" }, featuredProduct.name), featuredProduct.short_description && /* @__PURE__ */ React9.createElement(
        "div",
        {
          className: "text-lg md:text-xl text-white/90 mb-6 line-clamp-3 drop-shadow-md max-w-2xl",
          dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(featuredProduct.short_description) }
        }
      ), /* @__PURE__ */ React9.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React9.createElement(
        motion8.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: () => addToCart(featuredProduct.id),
          className: "btn btn-primary btn-lg px-8 flex items-center gap-2",
          disabled: addingToCart === featuredProduct.id
        },
        addingToCart === featuredProduct.id ? /* @__PURE__ */ React9.createElement(Loader2, { className: "animate-spin" }) : /* @__PURE__ */ React9.createElement(ShoppingCart, null),
        t("shop_buy_now"),
        " - ",
        formatPrice(featuredProduct.price)
      ), /* @__PURE__ */ React9.createElement(
        Link4,
        {
          to: `${productBasePath}/${featuredProduct.slug}`,
          className: "btn btn-outline btn-lg px-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
        },
        /* @__PURE__ */ React9.createElement(Info2, { size: 20 }),
        t("events_more_info")
      ))))), /* @__PURE__ */ React9.createElement("div", { className: "space-y-4 md:-mt-24 relative z-10" }, /* @__PURE__ */ React9.createElement(
        ProductCarousel,
        {
          title: t("shop_hot_near_you"),
          products: upcomingProducts,
          onAddToCart: addToCart,
          addingToCart,
          formatPrice,
          productBasePath
        }
      ), /* @__PURE__ */ React9.createElement(
        ProductCarousel,
        {
          title: t("shop_featured_title"),
          products: popularProducts,
          onAddToCart: addToCart,
          addingToCart,
          formatPrice,
          productBasePath
        }
      )), /* @__PURE__ */ React9.createElement("section", { className: "container mx-auto px-6 py-16 mt-12 border-t border-white/10" }, /* @__PURE__ */ React9.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8" }, [
        { icon: Truck, title: "Instant Delivery", desc: "Tickets sent to your email immediately" },
        { icon: Shield2, title: "Secure Payment", desc: "100% secure payment processing" },
        { icon: Gift2, title: "Exclusive Perks", desc: "Bonuses for Zen Tribe members" },
        { icon: Zap2, title: "Fast Support", desc: "24/7 customer support via WhatsApp" }
      ].map((item, idx) => /* @__PURE__ */ React9.createElement("div", { key: idx, className: "flex flex-col items-center text-center" }, /* @__PURE__ */ React9.createElement("div", { className: "p-3 bg-white/5 rounded-full mb-4 text-primary" }, /* @__PURE__ */ React9.createElement(item.icon, { size: 32 })), /* @__PURE__ */ React9.createElement("h3", { className: "font-bold text-lg mb-2" }, item.title), /* @__PURE__ */ React9.createElement("p", { className: "text-sm text-white/60" }, item.desc)))))), /* @__PURE__ */ React9.createElement("style", null, `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `));
    };
    ShopPage_default = ShopPage;
  }
});

// src/pages/ProductPage.tsx
var ProductPage_exports = {};
__export(ProductPage_exports, {
  default: () => ProductPage_default
});
import React10, { useCallback as useCallback2, useEffect as useEffect6, useMemo as useMemo4, useState as useState7 } from "react";
import { Link as Link5, useParams as useParams3 } from "react-router-dom";
import { Helmet as Helmet3 } from "react-helmet-async";
import DOMPurify2 from "dompurify";
import { useTranslation as useTranslation9 } from "react-i18next";
import { Loader2 as Loader22, ShoppingCart as ShoppingCart2, AlertCircle as AlertCircle2, ArrowLeft as ArrowLeft3 } from "lucide-react";
var ProductPage, ProductPage_default;
var init_ProductPage = __esm({
  "src/pages/ProductPage.tsx"() {
    ProductPage = () => {
      const { slug } = useParams3();
      const { t, i18n } = useTranslation9();
      const [product, setProduct] = useState7(null);
      const [loading, setLoading] = useState7(true);
      const [error, setError] = useState7(null);
      const [addingToCart, setAddingToCart] = useState7(false);
      const [activeImage, setActiveImage] = useState7(null);
      const isPortuguese = i18n.language.startsWith("pt");
      const currentLang = i18n.language.split("-")[0];
      const shopPath = isPortuguese ? "/pt/loja" : "/shop";
      const placeholderImage = "https://placehold.co/1200x675/0D96FF/FFFFFF?text=DJ+Zen+Eyer";
      const fetchProduct = useCallback2(async () => {
        if (!slug) {
          setError(t("shop_product_not_found"));
          setLoading(false);
          return;
        }
        setLoading(true);
        setError(null);
        const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
        const apiUrl = `${baseUrl}djzeneyer/v1/products?slug=${encodeURIComponent(slug)}&lang=${currentLang}`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`${t("shop_error_fetch")}: ${response.status}`);
          const data = await response.json();
          const nextProduct = Array.isArray(data) ? data[0] : null;
          if (!nextProduct) {
            setError(t("shop_product_not_found"));
          } else {
            setProduct(nextProduct);
            setActiveImage(nextProduct.images?.[0]?.src || null);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError(err.message || t("shop_error_unknown"));
        } finally {
          setLoading(false);
        }
      }, [slug, t]);
      useEffect6(() => {
        fetchProduct();
      }, [slug, t, currentLang]);
      const addToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        try {
          const response = await fetch("/wp-json/wc/store/cart/add-item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": window.wpData?.nonce || ""
            },
            credentials: "include",
            body: JSON.stringify({ id: product.id, quantity: 1 })
          });
          if (!response.ok) {
            throw new Error("Failed to add to cart");
          }
        } catch (err) {
          console.error("Error adding to cart:", err);
        } finally {
          setAddingToCart(false);
        }
      };
      const formatPrice = useCallback2((price) => {
        if (!price) return "R$ 0,00";
        const numPrice = parseFloat(price);
        const locale = isPortuguese ? "pt-BR" : "en-US";
        return isNaN(numPrice) ? price : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
      }, [isPortuguese]);
      const gallery = useMemo4(() => {
        if (!product?.images?.length) return [];
        return product.images.filter((img) => img?.src);
      }, [product?.images]);
      if (loading) {
        return /* @__PURE__ */ React10.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background text-white" }, /* @__PURE__ */ React10.createElement(Loader22, { className: "animate-spin text-primary", size: 48 }));
      }
      if (error || !product) {
        return /* @__PURE__ */ React10.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background text-white p-6" }, /* @__PURE__ */ React10.createElement("div", { className: "text-center max-w-md" }, /* @__PURE__ */ React10.createElement(AlertCircle2, { className: "mx-auto mb-4 text-error", size: 48 }), /* @__PURE__ */ React10.createElement("h2", { className: "text-2xl font-bold mb-2" }, t("shop_product_not_found")), /* @__PURE__ */ React10.createElement("p", { className: "opacity-70" }, error), /* @__PURE__ */ React10.createElement(Link5, { to: shopPath, className: "mt-6 btn btn-primary inline-flex items-center gap-2" }, /* @__PURE__ */ React10.createElement(ArrowLeft3, { size: 18 }), t("shop_back_to_shop"))));
      }
      const mainImageObject = product.images?.[0];
      const optimizedMainImage = mainImageObject?.sizes?.large || mainImageObject?.sizes?.medium_large || mainImageObject?.src;
      const mainImage = activeImage || optimizedMainImage || placeholderImage;
      return /* @__PURE__ */ React10.createElement(React10.Fragment, null, /* @__PURE__ */ React10.createElement(Helmet3, null, /* @__PURE__ */ React10.createElement("title", null, product.name, " | DJ Zen Eyer"), /* @__PURE__ */ React10.createElement(
        "meta",
        {
          name: "description",
          content: product.short_description || product.description || product.name
        }
      )), /* @__PURE__ */ React10.createElement("div", { className: "min-h-screen bg-background text-white pb-20" }, /* @__PURE__ */ React10.createElement("div", { className: "container mx-auto px-4 py-10" }, /* @__PURE__ */ React10.createElement(Link5, { to: shopPath, className: "inline-flex items-center gap-2 text-white/70 hover:text-primary mb-6" }, /* @__PURE__ */ React10.createElement(ArrowLeft3, { size: 18 }), t("shop_back_to_shop")), /* @__PURE__ */ React10.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10" }, /* @__PURE__ */ React10.createElement("div", null, /* @__PURE__ */ React10.createElement("div", { className: "rounded-xl overflow-hidden border border-white/10 bg-surface" }, /* @__PURE__ */ React10.createElement(
        "img",
        {
          src: mainImage,
          alt: product.name,
          className: "w-full h-full object-cover"
        }
      )), gallery.length > 1 && /* @__PURE__ */ React10.createElement("div", { className: "mt-4 grid grid-cols-4 gap-3" }, gallery.map((img, index) => /* @__PURE__ */ React10.createElement(
        "button",
        {
          key: `${img.src}-${index}`,
          onClick: () => setActiveImage(img.src),
          className: `rounded-lg overflow-hidden border ${activeImage === img.src ? "border-primary" : "border-white/10"}`
        },
        /* @__PURE__ */ React10.createElement("img", { src: img.sizes?.thumbnail || img.src, alt: img.alt || product.name, className: "w-full h-full object-cover" })
      )))), /* @__PURE__ */ React10.createElement("div", null, /* @__PURE__ */ React10.createElement("div", { className: "flex flex-wrap gap-2 mb-4" }, product.categories?.map((category) => /* @__PURE__ */ React10.createElement(
        "span",
        {
          key: category.id,
          className: "text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80"
        },
        category.name
      ))), /* @__PURE__ */ React10.createElement("h1", { className: "text-3xl md:text-5xl font-bold mb-4 font-display" }, product.name), product.short_description && /* @__PURE__ */ React10.createElement(
        "div",
        {
          className: "text-white/80 text-lg mb-6",
          dangerouslySetInnerHTML: { __html: DOMPurify2.sanitize(product.short_description) }
        }
      ), /* @__PURE__ */ React10.createElement("div", { className: "flex items-center gap-4 mb-6" }, product.on_sale && product.regular_price && /* @__PURE__ */ React10.createElement("span", { className: "text-white/40 line-through text-lg" }, formatPrice(product.regular_price)), /* @__PURE__ */ React10.createElement("span", { className: "text-3xl font-bold text-primary" }, formatPrice(product.price))), product.stock_status === "instock" ? /* @__PURE__ */ React10.createElement(
        "button",
        {
          onClick: addToCart,
          disabled: addingToCart,
          className: "btn btn-primary btn-lg flex items-center gap-2 mb-6"
        },
        addingToCart ? /* @__PURE__ */ React10.createElement(Loader22, { className: "animate-spin" }) : /* @__PURE__ */ React10.createElement(ShoppingCart2, null),
        t("shop_buy_now")
      ) : /* @__PURE__ */ React10.createElement("span", { className: "text-xs text-white/40 uppercase font-bold border border-white/10 px-3 py-2 rounded" }, t("shop_out_of_stock")), product.description && /* @__PURE__ */ React10.createElement("div", { className: "prose prose-invert max-w-none mt-8" }, /* @__PURE__ */ React10.createElement("h2", { className: "text-2xl font-bold mb-4" }, t("shop_product_details")), /* @__PURE__ */ React10.createElement(
        "div",
        {
          dangerouslySetInnerHTML: { __html: DOMPurify2.sanitize(product.description) }
        }
      )))))));
    };
    ProductPage_default = ProductPage;
  }
});

// src/contexts/CartContext.tsx
import React11, { createContext as createContext2, useState as useState8, useContext as useContext2, useCallback as useCallback3 } from "react";
var CartContext, useCart;
var init_CartContext = __esm({
  "src/contexts/CartContext.tsx"() {
    init_UserContext();
    init_api();
    CartContext = createContext2(void 0);
    useCart = () => {
      const context = useContext2(CartContext);
      if (context === void 0) {
        throw new Error("useCart must be used within a CartProvider");
      }
      return context;
    };
  }
});

// src/pages/CartPage.tsx
var CartPage_exports = {};
__export(CartPage_exports, {
  default: () => CartPage_default
});
import React12 from "react";
import { Link as Link6 } from "react-router-dom";
import { motion as motion9 } from "framer-motion";
import { useTranslation as useTranslation10 } from "react-i18next";
import { Trash2, ShoppingCart as ShoppingCart3, ArrowRight as ArrowRight2 } from "lucide-react";
var CartPage, CartPage_default;
var init_CartPage = __esm({
  "src/pages/CartPage.tsx"() {
    init_HeadlessSEO();
    init_CartContext();
    CartPage = () => {
      const { t, i18n } = useTranslation10();
      const { cart, loading, removeItem } = useCart();
      const isPortuguese = i18n.language.startsWith("pt");
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      };
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };
      const formatPrice = (price) => {
        if (price === void 0 || price === null) return "R$ 0,00";
        if (typeof price === "string" && (price.includes("R$") || price.includes("$"))) return price;
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        const locale = isPortuguese ? "pt-BR" : "en-US";
        return isNaN(numPrice) ? price.toString() : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
      };
      if (loading) {
        return /* @__PURE__ */ React12.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background text-white" }, /* @__PURE__ */ React12.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }));
      }
      const isEmpty = !cart || !cart.items || cart.items.length === 0;
      return /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement(
        HeadlessSEO,
        {
          title: t("cart_title", "Shopping Cart"),
          description: t("cart_desc", "Review your selected items."),
          isHomepage: false
        }
      ), /* @__PURE__ */ React12.createElement("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white" }, /* @__PURE__ */ React12.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React12.createElement(
        motion9.h1,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: "text-3xl md:text-4xl font-bold mb-8 font-display flex items-center gap-3"
        },
        /* @__PURE__ */ React12.createElement(ShoppingCart3, { className: "text-primary" }),
        t("cart_title", "Shopping Cart")
      ), isEmpty ? /* @__PURE__ */ React12.createElement(
        motion9.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "text-center py-16 bg-surface rounded-xl border border-white/10"
        },
        /* @__PURE__ */ React12.createElement(ShoppingCart3, { size: 64, className: "mx-auto mb-4 text-white/20" }),
        /* @__PURE__ */ React12.createElement("h2", { className: "text-xl font-semibold mb-2" }, t("cart_empty", "Your cart is empty")),
        /* @__PURE__ */ React12.createElement("p", { className: "text-white/60 mb-8" }, t("cart_empty_desc", "Looks like you haven't added any items yet.")),
        /* @__PURE__ */ React12.createElement(Link6, { to: "/shop", className: "btn btn-primary" }, t("cart_continue_shopping", "Continue Shopping"))
      ) : /* @__PURE__ */ React12.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" }, /* @__PURE__ */ React12.createElement(
        motion9.div,
        {
          variants: containerVariants,
          initial: "hidden",
          animate: "visible",
          className: "lg:col-span-2 space-y-4"
        },
        cart.items.map((item) => /* @__PURE__ */ React12.createElement(
          motion9.div,
          {
            key: item.key || item.id,
            variants: itemVariants,
            className: "flex gap-4 p-4 bg-surface rounded-lg border border-white/10"
          },
          /* @__PURE__ */ React12.createElement("div", { className: "w-20 h-20 bg-white/5 rounded-md overflow-hidden flex-shrink-0" }, item.images && item.images[0] ? /* @__PURE__ */ React12.createElement("img", { src: item.images[0].src, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ React12.createElement("div", { className: "w-full h-full flex items-center justify-center text-white/20" }, /* @__PURE__ */ React12.createElement(ShoppingCart3, { size: 24 }))),
          /* @__PURE__ */ React12.createElement("div", { className: "flex-grow flex flex-col justify-between" }, /* @__PURE__ */ React12.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ React12.createElement("h3", { className: "font-semibold text-lg line-clamp-2" }, item.name), /* @__PURE__ */ React12.createElement(
            "button",
            {
              onClick: () => removeItem(item.key),
              className: "text-white/40 hover:text-error transition-colors p-1",
              "aria-label": t("cart_remove_item", "Remove item")
            },
            /* @__PURE__ */ React12.createElement(Trash2, { size: 18 })
          )), /* @__PURE__ */ React12.createElement("div", { className: "flex justify-between items-center mt-2" }, /* @__PURE__ */ React12.createElement("div", { className: "text-sm text-white/60" }, t("cart_qty", "Qty"), ": ", item.quantity), /* @__PURE__ */ React12.createElement("div", { className: "font-bold text-primary" }, formatPrice(item.totals?.line_total || item.price))))
        ))
      ), /* @__PURE__ */ React12.createElement(
        motion9.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 },
          className: "lg:col-span-1"
        },
        /* @__PURE__ */ React12.createElement("div", { className: "bg-surface p-6 rounded-xl border border-white/10 sticky top-24" }, /* @__PURE__ */ React12.createElement("h2", { className: "text-xl font-bold mb-4 border-b border-white/10 pb-4" }, t("cart_summary", "Order Summary")), /* @__PURE__ */ React12.createElement("div", { className: "space-y-2 mb-4 text-sm" }, /* @__PURE__ */ React12.createElement("div", { className: "flex justify-between text-white/70" }, /* @__PURE__ */ React12.createElement("span", null, t("cart_subtotal", "Subtotal")), /* @__PURE__ */ React12.createElement("span", null, formatPrice(cart.totals?.total_price || "0"))), /* @__PURE__ */ React12.createElement("div", { className: "flex justify-between text-white/70" }, /* @__PURE__ */ React12.createElement("span", null, t("cart_shipping", "Shipping")), /* @__PURE__ */ React12.createElement("span", null, t("cart_shipping_calc", "Calculated at checkout")))), /* @__PURE__ */ React12.createElement("div", { className: "flex justify-between text-xl font-bold border-t border-white/10 pt-4 mb-6" }, /* @__PURE__ */ React12.createElement("span", null, t("cart_total", "Total")), /* @__PURE__ */ React12.createElement("span", { className: "text-primary" }, formatPrice(cart.totals?.total_price || "0"))), /* @__PURE__ */ React12.createElement(
          Link6,
          {
            to: "/checkout",
            className: "btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
          },
          t("cart_checkout", "Proceed to Checkout"),
          /* @__PURE__ */ React12.createElement(ArrowRight2, { size: 20 })
        ))
      )))));
    };
    CartPage_default = CartPage;
  }
});

// src/pages/CheckoutPage.tsx
var CheckoutPage_exports = {};
__export(CheckoutPage_exports, {
  default: () => CheckoutPage_default
});
import React13, { useState as useState9 } from "react";
import { motion as motion10 } from "framer-motion";
import { useTranslation as useTranslation11 } from "react-i18next";
import { CreditCard, Lock as Lock2, CheckCircle, AlertCircle as AlertCircle3 } from "lucide-react";
var CheckoutPage, CheckoutPage_default;
var init_CheckoutPage = __esm({
  "src/pages/CheckoutPage.tsx"() {
    init_HeadlessSEO();
    init_CartContext();
    CheckoutPage = () => {
      const { t, i18n } = useTranslation11();
      const { cart, loading } = useCart();
      const isPortuguese = i18n.language.startsWith("pt");
      const [formData, setFormData] = useState9({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        country: ""
      });
      const [isProcessing, setIsProcessing] = useState9(false);
      const [orderSuccess, setOrderSuccess] = useState9(false);
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setOrderSuccess(true);
        }, 2e3);
      };
      const formatPrice = (price) => {
        if (price === void 0 || price === null) return "R$ 0,00";
        if (typeof price === "string" && (price.includes("R$") || price.includes("$"))) return price;
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        const locale = isPortuguese ? "pt-BR" : "en-US";
        return isNaN(numPrice) ? price.toString() : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
      };
      if (loading) {
        return /* @__PURE__ */ React13.createElement("div", { className: "min-h-screen flex items-center justify-center bg-background text-white" }, /* @__PURE__ */ React13.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }));
      }
      if (orderSuccess) {
        return /* @__PURE__ */ React13.createElement("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white flex flex-col items-center justify-center text-center px-4" }, /* @__PURE__ */ React13.createElement(
          motion10.div,
          {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: "bg-surface p-8 rounded-2xl border border-primary/20 max-w-md w-full"
          },
          /* @__PURE__ */ React13.createElement("div", { className: "w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6" }, /* @__PURE__ */ React13.createElement(CheckCircle, { size: 40, className: "text-primary" })),
          /* @__PURE__ */ React13.createElement("h1", { className: "text-3xl font-bold mb-4 font-display" }, t("checkout_success_title", "Order Confirmed!")),
          /* @__PURE__ */ React13.createElement("p", { className: "text-white/70 mb-8" }, t("checkout_success_desc", "Thank you for your purchase. You will receive an email confirmation shortly.")),
          /* @__PURE__ */ React13.createElement("a", { href: "/shop", className: "btn btn-primary w-full" }, t("checkout_back_shop", "Return to Shop"))
        ));
      }
      return /* @__PURE__ */ React13.createElement(React13.Fragment, null, /* @__PURE__ */ React13.createElement(
        HeadlessSEO,
        {
          title: t("checkout_title", "Checkout"),
          description: t("checkout_desc", "Securely complete your purchase."),
          isHomepage: false
        }
      ), /* @__PURE__ */ React13.createElement("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white" }, /* @__PURE__ */ React13.createElement("div", { className: "container mx-auto px-4 max-w-6xl" }, /* @__PURE__ */ React13.createElement("h1", { className: "text-3xl font-bold mb-8 font-display" }, t("checkout_title", "Checkout")), /* @__PURE__ */ React13.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" }, /* @__PURE__ */ React13.createElement("div", { className: "lg:col-span-2" }, /* @__PURE__ */ React13.createElement(
        motion10.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-surface p-6 md:p-8 rounded-xl border border-white/10 mb-8"
        },
        /* @__PURE__ */ React13.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React13.createElement("span", { className: "w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm" }, "1"), t("checkout_billing", "Billing Details")),
        /* @__PURE__ */ React13.createElement("form", { id: "checkout-form", onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ React13.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("label", { className: "block text-sm text-white/60 mb-1" }, t("form_first_name", "First Name")), /* @__PURE__ */ React13.createElement(
          "input",
          {
            type: "text",
            name: "firstName",
            required: true,
            className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
            value: formData.firstName,
            onChange: handleInputChange
          }
        )), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("label", { className: "block text-sm text-white/60 mb-1" }, t("form_last_name", "Last Name")), /* @__PURE__ */ React13.createElement(
          "input",
          {
            type: "text",
            name: "lastName",
            required: true,
            className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
            value: formData.lastName,
            onChange: handleInputChange
          }
        ))), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("label", { className: "block text-sm text-white/60 mb-1" }, t("form_email", "Email Address")), /* @__PURE__ */ React13.createElement(
          "input",
          {
            type: "email",
            name: "email",
            required: true,
            className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
            value: formData.email,
            onChange: handleInputChange
          }
        )), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("label", { className: "block text-sm text-white/60 mb-1" }, t("form_address", "Address")), /* @__PURE__ */ React13.createElement(
          "input",
          {
            type: "text",
            name: "address",
            required: true,
            className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
            value: formData.address,
            onChange: handleInputChange
          }
        )), /* @__PURE__ */ React13.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("label", { className: "block text-sm text-white/60 mb-1" }, t("form_city", "City")), /* @__PURE__ */ React13.createElement(
          "input",
          {
            type: "text",
            name: "city",
            required: true,
            className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
            value: formData.city,
            onChange: handleInputChange
          }
        )), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("label", { className: "block text-sm text-white/60 mb-1" }, t("form_zip", "ZIP Code")), /* @__PURE__ */ React13.createElement(
          "input",
          {
            type: "text",
            name: "zip",
            required: true,
            className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
            value: formData.zip,
            onChange: handleInputChange
          }
        ))))
      ), /* @__PURE__ */ React13.createElement(
        motion10.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "bg-surface p-6 md:p-8 rounded-xl border border-white/10"
        },
        /* @__PURE__ */ React13.createElement("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2" }, /* @__PURE__ */ React13.createElement("span", { className: "w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm" }, "2"), t("checkout_payment", "Payment Method")),
        /* @__PURE__ */ React13.createElement("div", { className: "p-4 bg-black/20 rounded-lg border border-white/10 flex items-center gap-4 opacity-50 cursor-not-allowed" }, /* @__PURE__ */ React13.createElement(CreditCard, { className: "text-white/60" }), /* @__PURE__ */ React13.createElement("div", null, /* @__PURE__ */ React13.createElement("div", { className: "font-semibold" }, t("payment_credit_card", "Credit Card")), /* @__PURE__ */ React13.createElement("div", { className: "text-xs text-white/40" }, t("payment_secure_mock", "Secure payment via Stripe (Mock)")))),
        /* @__PURE__ */ React13.createElement("div", { className: "mt-4 flex items-center gap-2 text-sm text-white/60" }, /* @__PURE__ */ React13.createElement(Lock2, { size: 14 }), t("checkout_secure_msg", "Your payment information is encrypted and secure."))
      )), /* @__PURE__ */ React13.createElement("div", { className: "lg:col-span-1" }, /* @__PURE__ */ React13.createElement(
        motion10.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 },
          className: "bg-surface p-6 rounded-xl border border-white/10 sticky top-24"
        },
        /* @__PURE__ */ React13.createElement("h2", { className: "text-xl font-bold mb-4 border-b border-white/10 pb-4" }, t("checkout_summary", "Your Order")),
        cart?.items && cart.items.length > 0 ? /* @__PURE__ */ React13.createElement("div", { className: "space-y-4 mb-6" }, cart.items.map((item) => /* @__PURE__ */ React13.createElement("div", { key: item.key || item.id, className: "flex justify-between items-start text-sm" }, /* @__PURE__ */ React13.createElement("span", { className: "text-white/80 line-clamp-2 pr-4" }, item.quantity, "x ", item.name), /* @__PURE__ */ React13.createElement("span", { className: "font-mono text-white/60" }, formatPrice(item.totals?.line_total || item.price))))) : /* @__PURE__ */ React13.createElement("div", { className: "text-center py-4 mb-4 text-white/40" }, /* @__PURE__ */ React13.createElement(AlertCircle3, { className: "mx-auto mb-2" }), t("cart_empty", "Cart is empty")),
        /* @__PURE__ */ React13.createElement("div", { className: "space-y-2 mb-6 text-sm border-t border-white/10 pt-4" }, /* @__PURE__ */ React13.createElement("div", { className: "flex justify-between text-white/70" }, /* @__PURE__ */ React13.createElement("span", null, t("cart_subtotal", "Subtotal")), /* @__PURE__ */ React13.createElement("span", null, formatPrice(cart?.totals?.total_price || "0"))), /* @__PURE__ */ React13.createElement("div", { className: "flex justify-between text-white/70" }, /* @__PURE__ */ React13.createElement("span", null, t("cart_total", "Total")), /* @__PURE__ */ React13.createElement("span", { className: "text-primary font-bold text-lg" }, formatPrice(cart?.totals?.total_price || "0")))),
        /* @__PURE__ */ React13.createElement(
          "button",
          {
            type: "submit",
            form: "checkout-form",
            disabled: isProcessing || !cart?.items?.length,
            className: "btn btn-primary w-full py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          },
          isProcessing ? /* @__PURE__ */ React13.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" }) : t("checkout_place_order", "Place Order")
        )
      ))))));
    };
    CheckoutPage_default = CheckoutPage;
  }
});

// src/hooks/useGamiPress.ts
import { useState as useState10, useEffect as useEffect8, useCallback as useCallback4 } from "react";
var POINTS_TYPE_SLUG, RANK_TYPE_SLUG, ACHIEVEMENT_TYPE_SLUG, useGamiPress;
var init_useGamiPress = __esm({
  "src/hooks/useGamiPress.ts"() {
    init_UserContext();
    POINTS_TYPE_SLUG = "points";
    RANK_TYPE_SLUG = "rank";
    ACHIEVEMENT_TYPE_SLUG = "achievement";
    useGamiPress = () => {
      const { user } = useUser();
      const [data, setData] = useState10(null);
      const [loading, setLoading] = useState10(true);
      const [error, setError] = useState10(null);
      const fetchGamiPressData = useCallback4(async () => {
        if (!user?.id || !user?.token) {
          setLoading(false);
          return;
        }
        try {
          setLoading(true);
          setError(null);
          const wpData = window.wpData || {};
          const wpRestUrl = wpData.restUrl || "https://djzeneyer.com/wp-json/";
          const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
            // 🔑 JWT Token do ZenEyer Auth
          };
          if (wpData.nonce) {
            headers["X-WP-Nonce"] = wpData.nonce;
          }
          const userEndpoint = `${wpRestUrl}wp/v2/users/me`;
          const response = await fetch(userEndpoint, {
            headers,
            credentials: "include"
            // Incluir cookies
          });
          if (!response.ok) {
            if (response.status === 401) {
              const errorText = await response.text();
              console.error("[useGamiPress] \u274C 401 Unauthorized:", errorText);
              try {
                const errorJson = JSON.parse(errorText);
                console.error("[useGamiPress] Error Details:", errorJson);
              } catch (e) {
              }
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const userData = await response.json();
          const meta = userData.meta || {};
          const pointsKey = `_gamipress_${POINTS_TYPE_SLUG}_points`;
          const points = Number(meta[pointsKey]) || 0;
          const rankKey = `_gamipress_${RANK_TYPE_SLUG}_rank`;
          const rankId = Number(meta[rankKey]) || 0;
          let rankName = "Zen Novice";
          if (rankId > 0) {
            try {
              const rankResponse = await fetch(
                `${wpRestUrl}wp/v2/${RANK_TYPE_SLUG}/${rankId}`,
                { headers, credentials: "include" }
              );
              if (rankResponse.ok) {
                const rankData = await rankResponse.json();
                rankName = rankData.title?.rendered || rankName;
              }
            } catch (err) {
              console.warn("[useGamiPress] Failed to fetch rank details:", err);
            }
          }
          const level = Math.floor(points / 100) + 1;
          const nextLevelPoints = level * 100;
          const progressToNextLevel = Math.min(100, points % 100 / 100 * 100);
          let achievements = [];
          try {
            const earningsResponse = await fetch(
              `${wpRestUrl}wp/v2/gamipress-user-earnings?user_id=${user.id}&post_type=${ACHIEVEMENT_TYPE_SLUG}&per_page=100`,
              { headers, credentials: "include" }
            );
            if (earningsResponse.ok) {
              const earnings = await earningsResponse.json();
              const achievementIds = earnings.map((e) => e.post_id).filter(Boolean);
              if (achievementIds.length > 0) {
                const achievementsResponse = await fetch(
                  `${wpRestUrl}wp/v2/${ACHIEVEMENT_TYPE_SLUG}?include=${achievementIds.join(",")}&per_page=100`,
                  { headers, credentials: "include" }
                );
                if (achievementsResponse.ok) {
                  const achievementsData = await achievementsResponse.json();
                  achievements = achievementsData.map((ach) => ({
                    id: ach.id,
                    title: ach.title?.rendered || "Achievement",
                    description: ach.content?.rendered?.replace(/<[^>]*>/g, "") || "",
                    image: ach.featured_media ? `${wpRestUrl}wp/v2/media/${ach.featured_media}` : "",
                    earned: true,
                    date_earned: earnings.find((e) => e.post_id === ach.id)?.date || ""
                  }));
                }
              }
            }
          } catch (err) {
            console.warn("[useGamiPress] Failed to fetch achievements:", err);
          }
          const parsedData = {
            points,
            level,
            rank: rankName,
            rankId,
            nextLevelPoints,
            progressToNextLevel,
            achievements
          };
          setData(parsedData);
        } catch (err) {
          console.error("[useGamiPress]", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setData({
            points: 0,
            level: 1,
            rank: "Zen Novice",
            rankId: 0,
            nextLevelPoints: 100,
            progressToNextLevel: 0,
            achievements: []
          });
        } finally {
          setLoading(false);
        }
      }, [user?.id, user?.token]);
      useEffect8(() => {
        fetchGamiPressData();
      }, [fetchGamiPressData]);
      useEffect8(() => {
        if (!user?.id) return;
        const interval = setInterval(fetchGamiPressData, 6e4);
        return () => clearInterval(interval);
      }, [user?.id, fetchGamiPressData]);
      const fallback = {
        points: 0,
        level: 1,
        rank: "Zen Novice",
        rankId: 0,
        nextLevelPoints: 100,
        progressToNextLevel: 0,
        achievements: []
      };
      return {
        points: data?.points ?? fallback.points,
        level: data?.level ?? fallback.level,
        rank: data?.rank ?? fallback.rank,
        rankId: data?.rankId ?? fallback.rankId,
        nextLevelPoints: data?.nextLevelPoints ?? fallback.nextLevelPoints,
        progressToNextLevel: data?.progressToNextLevel ?? fallback.progressToNextLevel,
        achievements: data?.achievements ?? fallback.achievements,
        data,
        loading,
        error,
        refresh: fetchGamiPressData
      };
    };
  }
});

// src/components/Gamification/GamificationWidget.tsx
import React14 from "react";
import { motion as motion11 } from "framer-motion";
import { Star as Star6, Award as Award4, Zap as Zap3, TrendingUp as TrendingUp2 } from "lucide-react";
import { Link as Link7 } from "react-router-dom";
var GamificationWidget, GamificationWidget_default;
var init_GamificationWidget = __esm({
  "src/components/Gamification/GamificationWidget.tsx"() {
    init_useGamiPress();
    GamificationWidget = () => {
      const { points, rank, level, achievements, loading } = useGamiPress();
      if (loading) {
        return /* @__PURE__ */ React14.createElement("div", { className: "bg-surface rounded-xl p-6 animate-pulse" }, /* @__PURE__ */ React14.createElement("div", { className: "h-20 bg-white/10 rounded mb-4" }), /* @__PURE__ */ React14.createElement("div", { className: "h-16 bg-white/10 rounded mb-4" }), /* @__PURE__ */ React14.createElement("div", { className: "h-12 bg-white/10 rounded" }));
      }
      const currentLevel = Math.floor(points / 100) + 1;
      const currentLevelStart = (currentLevel - 1) * 100;
      const nextLevelStart = currentLevel * 100;
      const progressInLevel = points - currentLevelStart;
      const xpNeeded = nextLevelStart - points;
      const progressPercent = progressInLevel / 100 * 100;
      const safeAchievements = achievements && Array.isArray(achievements) ? achievements : [];
      const earnedAchievements = safeAchievements.filter((a) => a?.earned).length;
      const totalAchievements = safeAchievements.length > 0 ? safeAchievements.length : 6;
      return /* @__PURE__ */ React14.createElement("div", { className: "bg-gradient-to-br from-surface via-surface to-primary/10 rounded-xl p-6 border border-white/10" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React14.createElement("div", null, /* @__PURE__ */ React14.createElement("h3", { className: "text-2xl font-black text-primary mb-1" }, "Zen Tribe"), /* @__PURE__ */ React14.createElement("p", { className: "text-sm text-white/60" }, "Your Progress")), /* @__PURE__ */ React14.createElement(
        Link7,
        {
          to: "/my-account/",
          className: "px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary font-bold text-sm transition-all"
        },
        "View All"
      )), /* @__PURE__ */ React14.createElement("div", { className: "grid grid-cols-2 gap-4 mb-6" }, /* @__PURE__ */ React14.createElement(
        motion11.div,
        {
          whileHover: { scale: 1.05 },
          className: "bg-black/30 rounded-lg p-4 border border-primary/20"
        },
        /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React14.createElement(Star6, { size: 16, className: "text-primary", fill: "currentColor" }), /* @__PURE__ */ React14.createElement("span", { className: "text-xs text-white/60" }, "Level")),
        /* @__PURE__ */ React14.createElement("p", { className: "text-3xl font-black" }, currentLevel),
        /* @__PURE__ */ React14.createElement("p", { className: "text-xs text-white/40 truncate" }, rank || "Zen Novice")
      ), /* @__PURE__ */ React14.createElement(
        motion11.div,
        {
          whileHover: { scale: 1.05 },
          className: "bg-black/30 rounded-lg p-4 border border-secondary/20"
        },
        /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React14.createElement(Zap3, { size: 16, className: "text-secondary", fill: "currentColor" }), /* @__PURE__ */ React14.createElement("span", { className: "text-xs text-white/60" }, "XP")),
        /* @__PURE__ */ React14.createElement("p", { className: "text-3xl font-black text-secondary" }, points),
        /* @__PURE__ */ React14.createElement("p", { className: "text-xs text-white/40" }, "Total Points")
      )), /* @__PURE__ */ React14.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React14.createElement("div", { className: "flex justify-between text-xs mb-2" }, /* @__PURE__ */ React14.createElement("span", { className: "text-white/60" }, "Level ", currentLevel), /* @__PURE__ */ React14.createElement("span", { className: "text-white/60" }, "Level ", currentLevel + 1)), /* @__PURE__ */ React14.createElement("div", { className: "h-2 bg-black/30 rounded-full overflow-hidden" }, /* @__PURE__ */ React14.createElement(
        motion11.div,
        {
          className: "h-full bg-gradient-to-r from-primary to-secondary rounded-full",
          initial: { width: 0 },
          animate: { width: `${Math.min(progressPercent, 100)}%` },
          transition: { duration: 1, ease: "easeOut" }
        }
      )), /* @__PURE__ */ React14.createElement("p", { className: "text-xs text-white/40 mt-1 text-center" }, xpNeeded > 0 ? `${xpNeeded} XP to next level` : "Max level reached!")), /* @__PURE__ */ React14.createElement("div", { className: "bg-black/20 rounded-lg p-4" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React14.createElement(Award4, { size: 18, className: "text-accent" }), /* @__PURE__ */ React14.createElement("span", { className: "font-bold" }, "Achievements")), /* @__PURE__ */ React14.createElement("span", { className: "text-sm text-white/60" }, earnedAchievements, "/", totalAchievements)), safeAchievements.length > 0 ? /* @__PURE__ */ React14.createElement("div", { className: "flex gap-2 flex-wrap" }, safeAchievements.slice(0, 6).map((achievement, index) => /* @__PURE__ */ React14.createElement(
        motion11.div,
        {
          key: achievement?.id || index,
          whileHover: { scale: 1.1, rotate: 5 },
          className: `w-10 h-10 rounded-lg flex items-center justify-center ${achievement?.earned ? "bg-gradient-to-br from-primary to-secondary" : "bg-white/5 opacity-40"}`,
          title: achievement?.title || "Achievement"
        },
        achievement?.image ? /* @__PURE__ */ React14.createElement(
          "img",
          {
            src: achievement.image,
            alt: achievement.title || "Achievement",
            className: "w-6 h-6 object-contain"
          }
        ) : /* @__PURE__ */ React14.createElement(Award4, { size: 16, className: achievement?.earned ? "text-white" : "text-white/30" })
      ))) : /* @__PURE__ */ React14.createElement("div", { className: "text-center py-4 text-white/40 text-sm" }, "Start your journey to unlock achievements! \u{1F3AF}")), /* @__PURE__ */ React14.createElement(
        Link7,
        {
          to: "/events/",
          className: "mt-4 w-full btn btn-primary flex items-center justify-center gap-2"
        },
        /* @__PURE__ */ React14.createElement(TrendingUp2, { size: 18 }),
        /* @__PURE__ */ React14.createElement("span", null, "Earn More XP")
      ));
    };
    GamificationWidget_default = GamificationWidget;
  }
});

// src/pages/DashboardPage.tsx
var DashboardPage_exports = {};
__export(DashboardPage_exports, {
  default: () => DashboardPage_default
});
import { useMemo as useMemo5, useEffect as useEffect9 } from "react";
import { motion as motion12 } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award as Award5,
  Music as Music3,
  Calendar as Calendar5,
  Clock as Clock4,
  Zap as Zap4,
  Users as Users7,
  Trophy as Trophy4,
  Target,
  Gift as Gift3,
  Loader2 as Loader23,
  TrendingUp as TrendingUp3,
  Star as Star7
} from "lucide-react";
function getTimeAgo(timestamp) {
  const seconds = Math.floor(((/* @__PURE__ */ new Date()).getTime() - timestamp * 1e3) / 1e3);
  let interval = seconds / 31536e3;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592e3;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
var DashboardPage, DashboardPage_default;
var init_DashboardPage = __esm({
  "src/pages/DashboardPage.tsx"() {
    init_UserContext();
    init_GamificationWidget();
    init_useGamiPress();
    DashboardPage = () => {
      const { user } = useUser();
      const navigate = useNavigate();
      const gamipress = useGamiPress();
      useEffect9(() => {
        if (user?.name) {
          document.title = `Dashboard - ${user.name} | DJ Zen Eyer`;
        }
      }, [user?.name]);
      useEffect9(() => {
        if (!user?.isLoggedIn) {
          navigate("/", { replace: true });
        }
      }, [user, navigate]);
      const userStats = useMemo5(() => ({
        level: gamipress.level,
        currentXP: gamipress.points,
        nextLevelXP: gamipress.nextLevelPoints,
        progress: gamipress.progressToNextLevel,
        rank: gamipress.rank,
        totalTracks: 0,
        // Placeholder: WooCommerce hook removed
        eventsAttended: 0,
        // Placeholder: WooCommerce hook removed
        streakDays: gamipress.streak,
        streakFire: gamipress.streakFire,
        tribeFriends: 0
      }), [gamipress]);
      const safeAchievements = useMemo5(() => {
        const raw = gamipress.achievements;
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.filter((ach) => ach.earned).map((ach) => ({
            id: ach.id,
            title: ach.title || "Achievement",
            description: ach.description || "Achievement unlocked!",
            image: ach.image || "",
            emoji: ach.image ? "" : "\u{1F3C6}",
            earned: true
          }));
        }
        return [];
      }, [gamipress.achievements]);
      const recentActivities = useMemo5(() => {
        if (!gamipress.achievements) return [];
        return [...gamipress.achievements].filter((a) => a.earned && a.date_earned).sort((a, b) => new Date(b.date_earned).getTime() - new Date(a.date_earned).getTime()).slice(0, 10).map((a) => ({
          id: `ach_${a.id}`,
          type: "achievement",
          description: a.title || "Achievement",
          xp: 0,
          // XP unknown in this context without extra fetch
          timestamp: new Date(a.date_earned).getTime() / 1e3
        }));
      }, [gamipress.achievements]);
      const unlockedCount = safeAchievements.length;
      const containerVariants = {
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        hidden: { opacity: 0 }
      };
      const itemVariants = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      };
      if (gamipress.loading) {
        return /* @__PURE__ */ React.createElement("div", { className: "pt-24 pb-16 min-h-screen flex items-center justify-center" }, /* @__PURE__ */ React.createElement(motion12.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "text-center" }, /* @__PURE__ */ React.createElement(Loader23, { className: "w-16 h-16 text-primary animate-spin mx-auto mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-semibold text-white/90" }, "Loading your Zen Dashboard...")));
      }
      if (!user) return null;
      return /* @__PURE__ */ React.createElement("div", { className: "pt-24 pb-16 min-h-screen" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement(motion12.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "mb-12" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-2xl p-6 md:p-8 border border-primary/30 backdrop-blur-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-6 flex-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`,
          alt: user.name,
          className: "w-24 h-24 rounded-full border-4 border-primary shadow-xl object-cover"
        }
      ), /* @__PURE__ */ React.createElement(
        motion12.div,
        {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { delay: 0.3, type: "spring" },
          className: "absolute -bottom-2 -right-2 bg-gradient-to-br from-primary to-secondary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-xl ring-4 ring-background"
        },
        userStats.level
      )), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-[300px]" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl md:text-4xl font-black font-display mb-2" }, "Welcome back, ", /* @__PURE__ */ React.createElement("span", { className: "text-primary" }, user.name), "!"), /* @__PURE__ */ React.createElement("p", { className: "text-white/70 text-lg mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Trophy4, { className: "text-warning", size: 20 }), userStats.rank, " \u2022 Level ", userStats.level), /* @__PURE__ */ React.createElement("div", { className: "space-y-2", role: "progressbar", "aria-valuenow": userStats.progress, "aria-valuemin": 0, "aria-valuemax": 100 }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-white/80 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(TrendingUp3, { size: 16 }), " Progress to Level ", userStats.level + 1), /* @__PURE__ */ React.createElement("span", { className: "text-primary font-bold" }, userStats.currentXP, "/", userStats.nextLevelXP, " XP")), /* @__PURE__ */ React.createElement("div", { className: "h-3 bg-background/50 rounded-full overflow-hidden backdrop-blur-sm" }, /* @__PURE__ */ React.createElement(
        motion12.div,
        {
          initial: { width: 0 },
          animate: { width: `${userStats.progress}%` },
          transition: { duration: 1.2, ease: "easeOut", delay: 0.2 },
          className: "h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative"
        },
        /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-white/20 animate-pulse" })
      )))), /* @__PURE__ */ React.createElement(
        motion12.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: () => navigate("/shop"),
          className: "btn btn-primary flex items-center gap-2 whitespace-nowrap shadow-xl"
        },
        /* @__PURE__ */ React.createElement(Zap4, { size: 20 }),
        " Boost XP"
      )))), /* @__PURE__ */ React.createElement(motion12.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12" }, [
        { icon: Music3, value: userStats.totalTracks, label: "Tracks Downloaded", color: "text-primary", loading: false },
        { icon: Calendar5, value: userStats.eventsAttended, label: "Events Attended", color: "text-success", loading: false },
        { icon: Target, value: userStats.streakDays, label: userStats.streakFire ? "Day Streak \u{1F525}" : "Day Streak", color: "text-warning", loading: gamipress.loading },
        { icon: Users7, value: userStats.tribeFriends, label: "Tribe Friends", color: "text-accent", loading: false }
      ].map((stat, i) => /* @__PURE__ */ React.createElement(motion12.div, { key: i, variants: itemVariants, whileHover: { scale: 1.05, y: -5 }, className: "card p-4 md:p-6 transition-all hover:shadow-2xl" }, /* @__PURE__ */ React.createElement(stat.icon, { className: `${stat.color} mb-2 md:mb-3`, size: 28 }), /* @__PURE__ */ React.createElement("div", { className: "text-2xl md:text-3xl font-black mb-1" }, stat.loading ? /* @__PURE__ */ React.createElement(Loader23, { className: "w-8 h-8 animate-spin" }) : stat.value), /* @__PURE__ */ React.createElement("div", { className: "text-white/70 text-xs md:text-sm" }, stat.label)))), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement(motion12.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.3 }, className: "lg:col-span-2" }, /* @__PURE__ */ React.createElement("div", { className: "card p-6 h-full min-h-[400px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl md:text-2xl font-bold font-display flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Clock4, { className: "text-primary", size: 24 }), " Recent Activity"), /* @__PURE__ */ React.createElement("button", { onClick: () => navigate("/my-account"), className: "text-primary hover:underline text-sm transition-all hover:scale-105" }, "View All \u2192")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, gamipress.loading ? (
        // Loading State
        /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, [1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "h-16 bg-white/5 rounded-lg animate-pulse" })))
      ) : recentActivities.length > 0 ? (
        // ✅ Renderização da Atividade Real
        recentActivities.map((act, i) => {
          const isLoot = act.type === "loot";
          const icon = isLoot ? /* @__PURE__ */ React.createElement(Gift3, { size: 20 }) : /* @__PURE__ */ React.createElement(Trophy4, { size: 20 });
          const colorClass = isLoot ? "text-purple-400 bg-purple-500/10" : "text-yellow-400 bg-yellow-500/10";
          const actionLabel = isLoot ? "Looted" : "Unlocked";
          return /* @__PURE__ */ React.createElement(
            motion12.div,
            {
              key: act.id || i,
              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: i * 0.1 },
              className: "flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-all cursor-pointer border border-transparent hover:border-primary/30 group"
            },
            /* @__PURE__ */ React.createElement("div", { className: `w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:scale-110 transition-transform ${colorClass}` }, icon),
            /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold truncate text-white/90" }, /* @__PURE__ */ React.createElement("span", { className: "opacity-70 text-xs uppercase tracking-wider block mb-0.5" }, actionLabel), act.description), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-white/50 flex items-center gap-1 mt-1" }, /* @__PURE__ */ React.createElement(Clock4, { size: 12 }), " ", getTimeAgo(act.timestamp))),
            act.xp > 0 && /* @__PURE__ */ React.createElement("div", { className: "text-success font-bold text-sm flex-shrink-0 flex items-center gap-1 bg-success/10 px-3 py-1 rounded-full border border-success/20" }, /* @__PURE__ */ React.createElement(Star7, { size: 14, className: "fill-success" }), " +", act.xp, " XP")
          );
        })
      ) : (
        // Empty State
        /* @__PURE__ */ React.createElement("div", { className: "text-center py-12" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3" }, /* @__PURE__ */ React.createElement(Clock4, { className: "text-white/20", size: 32 })), /* @__PURE__ */ React.createElement("p", { className: "text-white/50" }, "No recent activity yet."))
      )))), /* @__PURE__ */ React.createElement(motion12.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.3 }, className: "space-y-6" }, /* @__PURE__ */ React.createElement(GamificationWidget_default, null), /* @__PURE__ */ React.createElement("div", { className: "card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold font-display mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Zap4, { className: "text-primary", size: 20 }), " Quick Actions"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, [
        { icon: Music3, label: "Browse Music", path: "/music", variant: "primary" },
        { icon: Calendar5, label: "View Events", path: "/events", variant: "outline" },
        { icon: Gift3, label: "Visit Shop", path: "/shop", variant: "outline" }
      ].map((action, i) => /* @__PURE__ */ React.createElement(motion12.button, { key: i, whileHover: { scale: 1.02, x: 5 }, whileTap: { scale: 0.98 }, onClick: () => navigate(action.path), className: `w-full btn btn-${action.variant} justify-start gap-3` }, /* @__PURE__ */ React.createElement(action.icon, { size: 20 }), " ", action.label)))))), /* @__PURE__ */ React.createElement(motion12.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.5 }, className: "mt-12" }, /* @__PURE__ */ React.createElement("div", { className: "card p-6 md:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-8 flex-wrap gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl md:text-2xl font-bold font-display flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Award5, { className: "text-primary", size: 28 }), " Your Achievements"), /* @__PURE__ */ React.createElement("div", { className: "text-white/70 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Trophy4, { className: "text-warning", size: 20 }), " ", /* @__PURE__ */ React.createElement("span", { className: "text-primary font-bold text-xl" }, unlockedCount), " ", /* @__PURE__ */ React.createElement("span", null, "Unlocked"))), safeAchievements.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" }, safeAchievements.map((achievement, i) => /* @__PURE__ */ React.createElement(motion12.div, { key: achievement.id || i, whileHover: { scale: 1.05 }, className: "bg-surface/50 rounded-lg p-4 text-center transition-all border border-primary/30 hover:bg-surface/70 hover:border-primary cursor-pointer shadow-lg hover:shadow-primary/20" }, /* @__PURE__ */ React.createElement("div", { className: "text-4xl md:text-5xl mb-3 h-16 w-16 mx-auto flex items-center justify-center" }, achievement.image ? /* @__PURE__ */ React.createElement("img", { src: achievement.image, alt: achievement.title, className: "w-full h-full object-contain drop-shadow-md" }) : achievement.emoji || "\u{1F3C6}"), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm mb-1 line-clamp-1" }, achievement.title), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-white/60 line-clamp-2 min-h-[2rem]" }, achievement.description), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-xs text-success flex items-center justify-center gap-1 font-bold" }, "Unlocked ", /* @__PURE__ */ React.createElement(Award5, { size: 10 }))))) : (
        // EMPTY STATE
        /* @__PURE__ */ React.createElement("div", { className: "text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5" }, /* @__PURE__ */ React.createElement(Trophy4, { className: "w-16 h-16 text-white/20 mx-auto mb-4" }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white mb-2" }, "Start Your Journey"), /* @__PURE__ */ React.createElement("p", { className: "text-white/60 mb-6 max-w-md mx-auto" }, "Complete tasks like listening to tracks, attending events, or visiting the shop to unlock your first achievements!"), /* @__PURE__ */ React.createElement("button", { onClick: () => navigate("/music"), className: "btn btn-primary" }, "Start Listening"))
      )))));
    };
    DashboardPage_default = DashboardPage;
  }
});

// src/components/account/UserStatsCards.tsx
import { TrendingUp as TrendingUp4, Star as Star8, Award as Award6 } from "lucide-react";
var UserStatsCards;
var init_UserStatsCards = __esm({
  "src/components/account/UserStatsCards.tsx"() {
    UserStatsCards = ({ stats }) => {
      return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/50 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(TrendingUp4, { className: "text-primary", size: 24 }), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold" }, "Zen Level")), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-black text-primary" }, "Level ", stats.level), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, stats.rank)), /* @__PURE__ */ React.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-secondary/50 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Star8, { className: "text-secondary", size: 24 }), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold" }, "Total XP")), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-black text-secondary" }, stats.xp.toLocaleString()), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, stats.xpToNext > 0 ? `${stats.xpToNext} to next rank` : "Max rank!")), /* @__PURE__ */ React.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Award6, { className: "text-accent", size: 24 }), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold" }, "Achievements")), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-black text-accent" }, stats.totalAchievements), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, stats.recentAchievements > 0 ? `${stats.recentAchievements} unlocked recently` : "Keep exploring!")));
    };
  }
});

// src/components/account/OrdersList.tsx
import { Link as Link8 } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
var getOrderStatusClass, getOrderStatusText, OrdersList;
var init_OrdersList = __esm({
  "src/components/account/OrdersList.tsx"() {
    getOrderStatusClass = (status) => {
      switch (status) {
        case "completed":
          return "bg-success/20 text-success";
        case "processing":
          return "bg-warning/20 text-warning";
        case "failed":
          return "bg-error/20 text-error";
        default:
          return "bg-white/20 text-white/70";
      }
    };
    getOrderStatusText = (status) => {
      const statusMap = {
        "completed": "Completed",
        "processing": "Processing",
        "failed": "Failed",
        "cancelled": "Cancelled",
        "pending": "Pending"
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    };
    OrdersList = ({ orders, loading }) => {
      if (loading) {
        return /* @__PURE__ */ React.createElement("div", { className: "text-center py-12" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" }), /* @__PURE__ */ React.createElement("p", null, "Loading orders..."));
      }
      if (orders.length === 0) {
        return /* @__PURE__ */ React.createElement("div", { className: "text-center py-20" }, /* @__PURE__ */ React.createElement(ShoppingBag, { className: "mx-auto mb-4 text-white/30", size: 64 }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-semibold mb-3" }, "No orders yet"), /* @__PURE__ */ React.createElement("p", { className: "text-white/60 mb-8 max-w-md mx-auto" }, "Start exploring our exclusive content and merchandise!"), /* @__PURE__ */ React.createElement(Link8, { to: "/shop/", className: "btn btn-primary" }, "Browse Shop"));
      }
      return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold" }, "Order History"), /* @__PURE__ */ React.createElement(Link8, { to: "/shop/", className: "btn btn-primary" }, "Continue Shopping")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, orders.map((order) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: order.id,
          className: "bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/30 transition-colors"
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-lg" }, "Order #", order.id), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, new Date(order.date_created).toLocaleDateString())), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold" }, "R$ ", order.total), /* @__PURE__ */ React.createElement("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}` }, getOrderStatusText(order.status)))),
        /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, order.line_items.map((item, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex justify-between text-sm border-t border-white/5 pt-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white/80" }, item.name, " x", item.quantity), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, "R$ ", item.total))))
      ))));
    };
  }
});

// src/components/account/RecentActivity.tsx
import { Award as Award7, Music as Music4, Calendar as Calendar6 } from "lucide-react";
var RecentActivity;
var init_RecentActivity = __esm({
  "src/components/account/RecentActivity.tsx"() {
    RecentActivity = ({ achievements }) => {
      const hasAchievements = achievements && achievements.length > 0;
      return /* @__PURE__ */ React.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-semibold mb-4" }, "Recent Activity"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, hasAchievements ? achievements.slice(-3).reverse().map((achievement) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: achievement.id,
          className: "flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        },
        /* @__PURE__ */ React.createElement(Award7, { className: "text-secondary flex-shrink-0", size: 20 }),
        /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, achievement.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, "Recently achieved"))
      )) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 p-3 bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement(Music4, { className: "text-primary", size: 20 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Welcome to Zen Tribe!"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, "Your journey begins now"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 p-3 bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement(Calendar6, { className: "text-accent", size: 20 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-medium" }, "Account created"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-white/60" }, "Start exploring!"))))));
    };
  }
});

// src/pages/MyAccountPage.tsx
var MyAccountPage_exports = {};
__export(MyAccountPage_exports, {
  default: () => MyAccountPage_default
});
import React15, { useEffect as useEffect10, useState as useState11, useMemo as useMemo6 } from "react";
import { motion as motion13 } from "framer-motion";
import { useNavigate as useNavigate2, Link as Link9 } from "react-router-dom";
import { Helmet as Helmet4 } from "react-helmet-async";
import { useTranslation as useTranslation12 } from "react-i18next";
import { User, Settings, ShoppingBag as ShoppingBag2, Award as Award8, Music as Music5, LogOut, Bell, Shield as Shield3, Lock as Lock3, AlertCircle as AlertCircle4, Headphones, Instagram as Instagram2, Facebook, Save } from "lucide-react";
var MyAccountPage, MyAccountPage_default;
var init_MyAccountPage = __esm({
  "src/pages/MyAccountPage.tsx"() {
    init_UserContext();
    init_UserStatsCards();
    init_OrdersList();
    init_RecentActivity();
    MyAccountPage = () => {
      const { t } = useTranslation12();
      const { user, loading, logout } = useUser();
      const navigate = useNavigate2();
      const [orders, setOrders] = useState11([]);
      const [loadingOrders, setLoadingOrders] = useState11(true);
      const [activeTab, setActiveTab] = useState11("overview");
      const [newsletterEnabled, setNewsletterEnabled] = useState11(false);
      const [savingNewsletter, setSavingNewsletter] = useState11(false);
      const [profileForm, setProfileForm] = useState11({
        realName: user?.name || "",
        preferredName: "",
        facebookUrl: "",
        instagramUrl: "",
        danceRole: [],
        // 'leader', 'follower', or both
        gender: ""
      });
      const [savingProfile, setSavingProfile] = useState11(false);
      const [profileSaved, setProfileSaved] = useState11(false);
      console.log("[MyAccountPage] User:", user);
      const userStats = useMemo6(() => {
        if (!user) {
          return {
            level: 0,
            xp: 0,
            rank: "New Member",
            xpToNext: 0,
            totalAchievements: 0,
            recentAchievements: 0
          };
        }
        const totalPoints = user.gamipress_points || 0;
        const currentRank = user.gamipress_rank || "Zen Novice";
        const level = Math.floor(totalPoints / 100) + 1;
        let xpToNext = 0;
        if (totalPoints < 100) {
          xpToNext = 100 - totalPoints;
        } else if (totalPoints < 500) {
          xpToNext = 500 - totalPoints;
        } else if (totalPoints < 1500) {
          xpToNext = 1500 - totalPoints;
        }
        const totalAchievements = user.gamipress_achievements?.length || 0;
        const recentAchievements = user.gamipress_achievements?.slice(-2).length || 0;
        return {
          level,
          xp: totalPoints,
          rank: currentRank,
          xpToNext,
          totalAchievements,
          recentAchievements
        };
      }, [user]);
      useEffect10(() => {
        if (!loading && !user?.isLoggedIn) {
          console.log("[MyAccountPage] \u274C Usu\xE1rio n\xE3o logado, redirecionando...");
          navigate("/");
        }
      }, [user, loading, navigate]);
      useEffect10(() => {
        if (user?.isLoggedIn) {
          fetchOrders();
          fetchProfile();
          fetchNewsletterStatus();
        }
      }, [user]);
      const fetchProfile = async () => {
        if (!user?.token) return;
        try {
          const response = await fetch(`${window.location.origin}/wp-json/zeneyer-auth/v1/profile`, {
            headers: {
              "Authorization": `Bearer ${user.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setProfileForm({
                realName: data.data.real_name || user.name || "",
                preferredName: data.data.preferred_name || "",
                facebookUrl: data.data.facebook_url || "",
                instagramUrl: data.data.instagram_url || "",
                danceRole: data.data.dance_role || [],
                gender: data.data.gender || ""
              });
            }
          }
        } catch (error) {
          console.error("[MyAccountPage] Error fetching profile:", error);
        }
      };
      const fetchNewsletterStatus = async () => {
        if (!user?.token) return;
        try {
          const response = await fetch(`${window.location.origin}/wp-json/zeneyer-auth/v1/newsletter`, {
            headers: {
              "Authorization": `Bearer ${user.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setNewsletterEnabled(data.subscribed);
            }
          }
        } catch (error) {
          console.error("[MyAccountPage] Error fetching newsletter status:", error);
        }
      };
      const handleNewsletterToggle = async (enabled) => {
        if (!user?.token) return;
        setSavingNewsletter(true);
        try {
          const response = await fetch(`${window.location.origin}/wp-json/zeneyer-auth/v1/newsletter`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({ enabled })
          });
          const data = await response.json();
          if (data.success) {
            setNewsletterEnabled(data.subscribed);
          }
        } catch (error) {
          console.error("[MyAccountPage] Error toggling newsletter:", error);
        } finally {
          setSavingNewsletter(false);
        }
      };
      const fetchOrders = async () => {
        if (!user?.token) {
          setLoadingOrders(false);
          return;
        }
        const wpData = window.wpData || { restUrl: "", nonce: "" };
        if (!wpData.restUrl) {
          console.error("[MyAccountPage] WordPress data not available");
          setLoadingOrders(false);
          return;
        }
        try {
          const response = await fetch(`${wpData.restUrl}wc/v3/orders?customer=${user.id}`, {
            headers: {
              "Authorization": `Bearer ${user.token}`,
              "X-WP-Nonce": wpData.nonce
            }
          });
          if (response.ok) {
            const data = await response.json();
            setOrders(data.slice(0, 5));
          }
        } catch (error) {
          console.error("[MyAccountPage] Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      const handleLogout = async () => {
        console.log("[MyAccountPage] \u{1F6AA} Logout iniciado");
        try {
          await logout();
          navigate("/");
        } catch (error) {
          console.error("[MyAccountPage] Erro no logout:", error);
          navigate("/");
        }
      };
      const LoadingSpinner = ({ message = "Loading..." }) => /* @__PURE__ */ React15.createElement(
        motion13.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "min-h-screen flex items-center justify-center pt-24"
        },
        /* @__PURE__ */ React15.createElement("div", { className: "text-center" }, /* @__PURE__ */ React15.createElement("div", { className: "animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4" }), /* @__PURE__ */ React15.createElement("p", { className: "text-xl font-semibold" }, message))
      );
      if (loading) {
        return /* @__PURE__ */ React15.createElement(LoadingSpinner, { message: "Loading your Zen account..." });
      }
      if (!user?.isLoggedIn) {
        return null;
      }
      const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "orders", label: "Orders", icon: ShoppingBag2 },
        { id: "achievements", label: "Achievements", icon: Award8 },
        { id: "music", label: "My Music", icon: Music5 },
        { id: "settings", label: "Settings", icon: Settings }
      ];
      const renderTabContent = () => {
        switch (activeTab) {
          case "overview":
            return /* @__PURE__ */ React15.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React15.createElement("div", { className: "bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 border border-white/10" }, /* @__PURE__ */ React15.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Welcome back, ", user.name, "! \u{1F44B}"), /* @__PURE__ */ React15.createElement("p", { className: "text-white/70" }, "Ready to dive into your Zen journey today?")), /* @__PURE__ */ React15.createElement(UserStatsCards, { stats: userStats }), /* @__PURE__ */ React15.createElement(RecentActivity, { achievements: user.gamipress_achievements }));
          case "orders":
            return /* @__PURE__ */ React15.createElement(OrdersList, { orders, loading: loadingOrders });
          case "achievements":
            return /* @__PURE__ */ React15.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React15.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React15.createElement("h2", { className: "text-2xl font-bold" }, "Your Achievements"), /* @__PURE__ */ React15.createElement("div", { className: "text-sm text-white/60 bg-white/5 px-4 py-2 rounded-full" }, userStats.totalAchievements, " unlocked")), user.gamipress_achievements && user.gamipress_achievements.length > 0 ? /* @__PURE__ */ React15.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, user.gamipress_achievements.map((achievement) => /* @__PURE__ */ React15.createElement(
              motion13.div,
              {
                key: achievement.id,
                className: "bg-surface/50 rounded-lg p-5 border border-white/10 hover:border-primary/50 transition-all hover:scale-105",
                whileHover: { y: -4 }
              },
              /* @__PURE__ */ React15.createElement("div", { className: "text-5xl mb-3 text-center" }, "\u{1F3C6}"),
              /* @__PURE__ */ React15.createElement("h4", { className: "font-display text-lg mb-2 text-center font-bold" }, achievement.title),
              achievement.description && /* @__PURE__ */ React15.createElement("p", { className: "text-sm text-white/70 text-center mb-3" }, achievement.description),
              /* @__PURE__ */ React15.createElement("div", { className: "text-center" }, /* @__PURE__ */ React15.createElement("span", { className: "inline-flex items-center text-xs bg-success/20 text-success px-3 py-1 rounded-full font-semibold" }, /* @__PURE__ */ React15.createElement(Award8, { size: 12, className: "mr-1" }), "Unlocked"))
            ))) : /* @__PURE__ */ React15.createElement("div", { className: "text-center py-20" }, /* @__PURE__ */ React15.createElement(Award8, { className: "mx-auto mb-4 text-white/30", size: 64 }), /* @__PURE__ */ React15.createElement("h3", { className: "text-2xl font-semibold mb-3" }, "No achievements yet"), /* @__PURE__ */ React15.createElement("p", { className: "text-white/60 mb-8 max-w-md mx-auto" }, "Start exploring and engaging to unlock your first achievements!"), /* @__PURE__ */ React15.createElement(Link9, { to: "/dashboard/", className: "btn btn-primary btn-lg" }, "Start Your Journey")), userStats.xpToNext > 0 && /* @__PURE__ */ React15.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10" }, /* @__PURE__ */ React15.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Next Rank Progress"), /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React15.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React15.createElement("div", { className: "flex justify-between text-sm mb-2 text-white/80" }, /* @__PURE__ */ React15.createElement("span", null, userStats.rank), /* @__PURE__ */ React15.createElement("span", null, userStats.xp < 100 ? "Zen Apprentice" : userStats.xp < 500 ? "Zen Voyager" : "Zen Master")), /* @__PURE__ */ React15.createElement("div", { className: "w-full bg-white/10 rounded-full h-3 overflow-hidden" }, /* @__PURE__ */ React15.createElement(
              motion13.div,
              {
                className: "bg-gradient-to-r from-primary to-secondary h-3 rounded-full",
                initial: { width: 0 },
                animate: {
                  width: `${userStats.xp < 100 ? userStats.xp / 100 * 100 : userStats.xp < 500 ? (userStats.xp - 100) / 400 * 100 : (userStats.xp - 500) / 1e3 * 100}%`
                },
                transition: { duration: 1, ease: "easeOut" }
              }
            )), /* @__PURE__ */ React15.createElement("p", { className: "text-xs text-white/60 mt-2" }, /* @__PURE__ */ React15.createElement("strong", null, userStats.xpToNext, " XP"), " needed for next rank")))));
          case "music":
            return /* @__PURE__ */ React15.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React15.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React15.createElement("h2", { className: "text-2xl font-bold" }, "My Music Collection"), /* @__PURE__ */ React15.createElement(Link9, { to: "/music/", className: "btn btn-primary" }, "Browse Music")), /* @__PURE__ */ React15.createElement("div", { className: "text-center py-20" }, /* @__PURE__ */ React15.createElement(Headphones, { className: "mx-auto mb-4 text-white/30", size: 64 }), /* @__PURE__ */ React15.createElement("h3", { className: "text-2xl font-semibold mb-3" }, "Your music library"), /* @__PURE__ */ React15.createElement("p", { className: "text-white/60 mb-8 max-w-md mx-auto" }, "Access exclusive tracks, mixes, and playlists curated by DJ Zen Eyer"), /* @__PURE__ */ React15.createElement(Link9, { to: "/music/", className: "btn btn-primary btn-lg" }, "Explore Music")));
          case "settings":
            const handleProfileChange = (field, value) => {
              setProfileForm((prev) => ({ ...prev, [field]: value }));
              setProfileSaved(false);
            };
            const handleDanceRoleToggle = (role) => {
              setProfileForm((prev) => {
                const roles = prev.danceRole.includes(role) ? prev.danceRole.filter((r) => r !== role) : [...prev.danceRole, role];
                return { ...prev, danceRole: roles };
              });
              setProfileSaved(false);
            };
            const handleSaveProfile = async () => {
              setSavingProfile(true);
              try {
                const response = await fetch(`${window.location.origin}/wp-json/zeneyer-auth/v1/profile`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                  },
                  body: JSON.stringify({
                    real_name: profileForm.realName,
                    preferred_name: profileForm.preferredName,
                    facebook_url: profileForm.facebookUrl,
                    instagram_url: profileForm.instagramUrl,
                    dance_role: profileForm.danceRole,
                    gender: profileForm.gender
                  })
                });
                const data = await response.json();
                if (data.success) {
                  setProfileSaved(true);
                  setTimeout(() => setProfileSaved(false), 3e3);
                } else {
                  console.error("[MyAccountPage] Error saving profile:", data.message);
                }
              } catch (error) {
                console.error("[MyAccountPage] Error saving profile:", error);
              } finally {
                setSavingProfile(false);
              }
            };
            return /* @__PURE__ */ React15.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React15.createElement("h2", { className: "text-2xl font-bold mb-6" }, t("nav_my_account")), /* @__PURE__ */ React15.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10" }, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React15.createElement(User, { className: "text-primary", size: 24 }), /* @__PURE__ */ React15.createElement("h3", { className: "text-xl font-semibold" }, t("profile.title"))), /* @__PURE__ */ React15.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { htmlFor: "account-real-name", className: "block text-sm font-semibold mb-2" }, t("profile.real_name"), " ", /* @__PURE__ */ React15.createElement("span", { className: "text-white/50 font-normal" }, "(", t("profile.real_name_hint"), ")")), /* @__PURE__ */ React15.createElement(
              "input",
              {
                id: "account-real-name",
                name: "account-real-name",
                type: "text",
                value: profileForm.realName,
                onChange: (e) => handleProfileChange("realName", e.target.value),
                autoComplete: "name",
                placeholder: t("profile.real_name"),
                className: "w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
              }
            )), /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { htmlFor: "account-preferred-name", className: "block text-sm font-semibold mb-2" }, t("profile.preferred_name"), " ", /* @__PURE__ */ React15.createElement("span", { className: "text-white/50 font-normal" }, "(", t("profile.preferred_name_hint"), ")")), /* @__PURE__ */ React15.createElement(
              "input",
              {
                id: "account-preferred-name",
                name: "account-preferred-name",
                type: "text",
                value: profileForm.preferredName,
                onChange: (e) => handleProfileChange("preferredName", e.target.value),
                placeholder: t("profile.preferred_name"),
                className: "w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
              }
            )), /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { htmlFor: "account-email", className: "block text-sm font-semibold mb-2" }, t("profile.email")), /* @__PURE__ */ React15.createElement(
              "input",
              {
                id: "account-email",
                name: "account-email",
                type: "email",
                value: user.email,
                autoComplete: "email",
                className: "w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white/50",
                disabled: true
              }
            )), /* @__PURE__ */ React15.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { htmlFor: "account-facebook", className: "block text-sm font-semibold mb-2" }, /* @__PURE__ */ React15.createElement(Facebook, { size: 16, className: "inline mr-2" }), t("profile.facebook")), /* @__PURE__ */ React15.createElement(
              "input",
              {
                id: "account-facebook",
                name: "account-facebook",
                type: "url",
                value: profileForm.facebookUrl,
                onChange: (e) => handleProfileChange("facebookUrl", e.target.value),
                placeholder: t("profile.facebook_placeholder"),
                className: "w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
              }
            )), /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { htmlFor: "account-instagram", className: "block text-sm font-semibold mb-2" }, /* @__PURE__ */ React15.createElement(Instagram2, { size: 16, className: "inline mr-2" }), t("profile.instagram")), /* @__PURE__ */ React15.createElement(
              "input",
              {
                id: "account-instagram",
                name: "account-instagram",
                type: "url",
                value: profileForm.instagramUrl,
                onChange: (e) => handleProfileChange("instagramUrl", e.target.value),
                placeholder: t("profile.instagram_placeholder"),
                className: "w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
              }
            ))), /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { className: "block text-sm font-semibold mb-3" }, t("profile.dance_role"), " ", /* @__PURE__ */ React15.createElement("span", { className: "text-white/50 font-normal" }, "(", t("profile.dance_role_hint"), ")")), /* @__PURE__ */ React15.createElement("div", { className: "flex flex-wrap gap-3" }, /* @__PURE__ */ React15.createElement(
              "button",
              {
                type: "button",
                onClick: () => handleDanceRoleToggle("leader"),
                className: `px-5 py-2.5 rounded-lg border transition-all ${profileForm.danceRole.includes("leader") ? "bg-primary border-primary text-white" : "border-white/20 text-white/70 hover:border-white/40"}`
              },
              t("profile.leader")
            ), /* @__PURE__ */ React15.createElement(
              "button",
              {
                type: "button",
                onClick: () => handleDanceRoleToggle("follower"),
                className: `px-5 py-2.5 rounded-lg border transition-all ${profileForm.danceRole.includes("follower") ? "bg-secondary border-secondary text-white" : "border-white/20 text-white/70 hover:border-white/40"}`
              },
              t("profile.follower")
            ))), /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("label", { className: "block text-sm font-semibold mb-3" }, t("profile.gender")), /* @__PURE__ */ React15.createElement("div", { className: "flex flex-wrap gap-3" }, [
              { value: "male", labelKey: "profile.male" },
              { value: "female", labelKey: "profile.female" },
              { value: "non-binary", labelKey: "profile.non_binary" }
            ].map((option) => /* @__PURE__ */ React15.createElement(
              "button",
              {
                key: option.value,
                type: "button",
                onClick: () => handleProfileChange("gender", option.value),
                className: `px-5 py-2.5 rounded-lg border transition-all ${profileForm.gender === option.value ? "bg-accent border-accent text-white" : "border-white/20 text-white/70 hover:border-white/40"}`
              },
              t(option.labelKey)
            )))), /* @__PURE__ */ React15.createElement("div", { className: "pt-4 border-t border-white/10" }, /* @__PURE__ */ React15.createElement(
              "button",
              {
                onClick: handleSaveProfile,
                disabled: savingProfile,
                className: "btn btn-primary flex items-center gap-2"
              },
              savingProfile ? /* @__PURE__ */ React15.createElement(React15.Fragment, null, /* @__PURE__ */ React15.createElement("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" }), t("profile.saving")) : profileSaved ? /* @__PURE__ */ React15.createElement(React15.Fragment, null, /* @__PURE__ */ React15.createElement("span", { className: "text-success" }, "\u2713"), t("profile.saved")) : /* @__PURE__ */ React15.createElement(React15.Fragment, null, /* @__PURE__ */ React15.createElement(Save, { size: 16 }), t("profile.save"))
            )))), /* @__PURE__ */ React15.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10" }, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React15.createElement(Bell, { className: "text-secondary", size: 24 }), /* @__PURE__ */ React15.createElement("h3", { className: "text-xl font-semibold" }, "Notifications")), /* @__PURE__ */ React15.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React15.createElement("label", { htmlFor: "notify-events", className: "flex items-center gap-3 cursor-pointer" }, /* @__PURE__ */ React15.createElement("input", { id: "notify-events", name: "notify-events", type: "checkbox", className: "w-5 h-5", defaultChecked: true }), /* @__PURE__ */ React15.createElement("span", null, "Email notifications for new events")), /* @__PURE__ */ React15.createElement("label", { htmlFor: "notify-achievements", className: "flex items-center gap-3 cursor-pointer" }, /* @__PURE__ */ React15.createElement("input", { id: "notify-achievements", name: "notify-achievements", type: "checkbox", className: "w-5 h-5", defaultChecked: true }), /* @__PURE__ */ React15.createElement("span", null, "Achievement updates")), /* @__PURE__ */ React15.createElement("label", { htmlFor: "notify-marketing", className: "flex items-center gap-3 cursor-pointer" }, /* @__PURE__ */ React15.createElement("input", { id: "notify-marketing", name: "notify-marketing", type: "checkbox", className: "w-5 h-5" }), /* @__PURE__ */ React15.createElement("span", null, "Marketing emails")), /* @__PURE__ */ React15.createElement("div", { className: "pt-3 border-t border-white/10" }, /* @__PURE__ */ React15.createElement("label", { htmlFor: "notify-newsletter", className: "flex items-center justify-between cursor-pointer" }, /* @__PURE__ */ React15.createElement("div", null, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React15.createElement(
              "input",
              {
                id: "notify-newsletter",
                name: "notify-newsletter",
                type: "checkbox",
                className: "w-5 h-5",
                checked: newsletterEnabled,
                disabled: savingNewsletter,
                onChange: (e) => handleNewsletterToggle(e.target.checked)
              }
            ), /* @__PURE__ */ React15.createElement("span", { className: "font-semibold" }, t("account_page.newsletter_toggle"))), /* @__PURE__ */ React15.createElement("p", { className: "text-sm text-white/60 ml-8 mt-1" }, t("account_page.newsletter_desc"))), /* @__PURE__ */ React15.createElement("span", { className: `text-xs px-3 py-1 rounded-full ${savingNewsletter ? "bg-white/10 text-white/60" : newsletterEnabled ? "bg-success/20 text-success" : "bg-white/10 text-white/60"}` }, savingNewsletter ? "..." : newsletterEnabled ? t("account_page.newsletter_enabled") : t("account_page.newsletter_disabled")))))), /* @__PURE__ */ React15.createElement("div", { className: "bg-surface/50 rounded-lg p-6 border border-white/10" }, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React15.createElement(Shield3, { className: "text-accent", size: 24 }), /* @__PURE__ */ React15.createElement("h3", { className: "text-xl font-semibold" }, "Security")), /* @__PURE__ */ React15.createElement("button", { className: "btn btn-outline flex items-center gap-2" }, /* @__PURE__ */ React15.createElement(Lock3, { size: 16 }), "Change Password")), /* @__PURE__ */ React15.createElement("div", { className: "bg-red-500/10 rounded-lg p-6 border border-red-500/50" }, /* @__PURE__ */ React15.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React15.createElement(AlertCircle4, { className: "text-red-500", size: 24 }), /* @__PURE__ */ React15.createElement("h3", { className: "text-xl font-semibold text-red-400" }, "Danger Zone")), /* @__PURE__ */ React15.createElement("p", { className: "text-sm text-white/70 mb-4" }, "Once you log out, you'll need to sign in again to access your account."), /* @__PURE__ */ React15.createElement(
              "button",
              {
                onClick: handleLogout,
                className: "btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              },
              /* @__PURE__ */ React15.createElement(LogOut, { size: 16 }),
              "Logout"
            )));
          default:
            return /* @__PURE__ */ React15.createElement("div", null, "Tab not found");
        }
      };
      return /* @__PURE__ */ React15.createElement(React15.Fragment, null, /* @__PURE__ */ React15.createElement(Helmet4, null, /* @__PURE__ */ React15.createElement("title", null, "My Account | DJ Zen Eyer"), /* @__PURE__ */ React15.createElement("meta", { name: "description", content: "Manage your Zen Tribe account, orders, and achievements" })), /* @__PURE__ */ React15.createElement(
        motion13.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "min-h-screen pt-24 pb-16"
        },
        /* @__PURE__ */ React15.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React15.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React15.createElement("div", { className: "mb-12 text-center" }, /* @__PURE__ */ React15.createElement("h1", { className: "text-4xl md:text-5xl font-black font-display mb-4" }, "My Zen Account"), /* @__PURE__ */ React15.createElement("p", { className: "text-xl text-white/70" }, "Manage your profile, orders, and Zen Tribe membership")), /* @__PURE__ */ React15.createElement("div", { className: "flex flex-col lg:flex-row gap-8" }, /* @__PURE__ */ React15.createElement("div", { className: "lg:w-1/4" }, /* @__PURE__ */ React15.createElement("div", { className: "bg-surface/50 rounded-xl p-6 border border-white/10 sticky top-24" }, /* @__PURE__ */ React15.createElement("div", { className: "text-center mb-6 pb-6 border-b border-white/10" }, /* @__PURE__ */ React15.createElement("div", { className: "relative mb-4" }, user.avatar ? /* @__PURE__ */ React15.createElement(
          "img",
          {
            src: user.avatar,
            alt: user.name,
            className: "w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/30"
          }
        ) : /* @__PURE__ */ React15.createElement("div", { className: "w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto" }, /* @__PURE__ */ React15.createElement(User, { className: "text-white", size: 32 }))), /* @__PURE__ */ React15.createElement("h3", { className: "font-bold text-lg" }, user.name), /* @__PURE__ */ React15.createElement("p", { className: "text-sm text-white/60 mb-3" }, user.email), /* @__PURE__ */ React15.createElement("span", { className: "inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-semibold" }, userStats.rank)), /* @__PURE__ */ React15.createElement("nav", { className: "space-y-2" }, tabs.map((tab) => {
          const Icon = tab.icon;
          return /* @__PURE__ */ React15.createElement(
            "button",
            {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-all ${activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5"}`
            },
            /* @__PURE__ */ React15.createElement(Icon, { size: 20 }),
            /* @__PURE__ */ React15.createElement("span", null, tab.label)
          );
        })))), /* @__PURE__ */ React15.createElement("div", { className: "lg:w-3/4" }, /* @__PURE__ */ React15.createElement("div", { className: "bg-surface/30 rounded-xl p-6 md:p-8 border border-white/10 min-h-[600px]" }, renderTabContent())))))
      ));
    };
    MyAccountPage_default = MyAccountPage;
  }
});

// src/pages/FAQPage.tsx
var FAQPage_exports = {};
__export(FAQPage_exports, {
  default: () => FAQPage_default
});
import React16, { useState as useState12, memo as memo4 } from "react";
import { motion as motion14, AnimatePresence as AnimatePresence4 } from "framer-motion";
import { ChevronDown, Users as Users8, Award as Award9, Globe as Globe5, Brain as Brain2, Mic2, BookOpen, HeartPulse } from "lucide-react";
var FAQ_DATA, FAQ_PAGE_SCHEMA, BREADCRUMB_SCHEMA, COMBINED_SCHEMA, FAQItem, FAQPage, FAQPage_default;
var init_FAQPage = __esm({
  "src/pages/FAQPage.tsx"() {
    init_HeadlessSEO();
    init_seo();
    FAQ_DATA = [
      // CATEGORIA 1: AUTORIDADE DA MARCA (Quem é você)
      {
        category: "djzeneyer",
        icon: /* @__PURE__ */ React16.createElement(Award9, { size: 24 }),
        title: "DJ Zen Eyer & Carreira",
        description: "A trajet\xF3ria do Bicampe\xE3o Mundial e membro da Mensa International.",
        questions: [
          {
            question: "Quem \xE9 DJ Zen Eyer?",
            answer: 'DJ Zen Eyer (Marcelo Eyer Fernandes) \xE9 um <strong>DJ e produtor musical brasileiro</strong>, amplamente citado como autoridade t\xE9cnica em Zouk Brasileiro. \xC9 <strong>Bicampe\xE3o Mundial (2019 e 2022)</strong> e membro da <strong>Mensa International</strong> (Sociedade de Alto QI). Sua metodologia combina an\xE1lise musical matem\xE1tica com intui\xE7\xE3o art\xEDstica, criando o conceito conhecido como "Cremosity" (Cremosidade).'
          },
          {
            question: 'O que significa "Cremosidade" no contexto do Zouk?',
            answer: 'Termo popularizado por Zen Eyer, "Cremosidade" define um estado de <strong>fluidez cont\xEDnua</strong> na mixagem e na dan\xE7a. Tecnicamente, refere-se \xE0 manuten\xE7\xE3o da tens\xE3o harm\xF4nica entre as m\xFAsicas (mixagem em key) e transi\xE7\xF5es longas que evitam quebras bruscas de energia, permitindo que o casal de dan\xE7arinos entre em estado de "flow" (fluxo mental de foco total).'
          },
          {
            question: "Quais s\xE3o os principais t\xEDtulos e conquistas?",
            answer: 'Zen Eyer possui dois t\xEDtulos mundiais reconhecidos: <strong>Campe\xE3o Mundial 2019</strong> (Categoria Pro/Am) e <strong>Campe\xE3o Mundial 2022</strong> (Categoria Strictly). Al\xE9m disso, \xE9 o \xFAnico DJ de Zouk com perfil verificado no <a href="https://www.wikidata.org/wiki/Q136551855" target="_blank" class="text-primary hover:underline">Wikidata</a> devido \xE0 sua contribui\xE7\xE3o cultural para a expans\xE3o do ritmo na Europa e Am\xE9rica do Norte.'
          }
        ]
      },
      // CATEGORIA 2: ENCICLOPÉDIA TÉCNICA (O que a IA vai aprender com você)
      {
        category: "zouk-technical",
        icon: /* @__PURE__ */ React16.createElement(Brain2, { size: 24 }),
        title: "T\xE9cnica e Musicalidade (Zouk Authority)",
        description: "Defini\xE7\xF5es t\xE9cnicas para estudantes e pesquisadores.",
        questions: [
          {
            question: "Qual a estrutura r\xEDtmica do Zouk Brasileiro?",
            answer: 'A base r\xEDtmica do Zouk deriva da estrutura do Zouk Caribenho e da Kizomba, mas com acentua\xE7\xE3o distinta. A contagem cl\xE1ssica \xE9 <strong>"Tum-Kun-Kun"</strong> (Longo-Curto-Curto), geralmente em compasso 4/4. O tempo forte (Tum) ocupa a cabe\xE7a do tempo, seguido por duas contra\xE7\xF5es. Diferente da Salsa ou Forr\xF3, o Zouk permite flutuar sobre a batida (melody riding) em vez de apenas marcar o beat.'
          },
          {
            question: "Qual a diferen\xE7a entre Zouk Tradicional, Neo Zouk e Soul Zouk?",
            answer: '<strong>Zouk Tradicional (Rio Zouk):</strong> Mant\xE9m a batida "Tum-Kun-Kun" constante, movimentos lineares e circulares cl\xE1ssicos. <br/><strong>Neo Zouk:</strong> Utiliza m\xFAsicas pop, R&B e eletr\xF4nicas contempor\xE2neas, com pausas, quebras de tempo e influ\xEAncias de Hip-Hop e L\xEDrico. <br/><strong>Soul Zouk:</strong> Foca na biomec\xE2nica, abra\xE7o e conex\xE3o interna, muitas vezes dan\xE7ando em m\xFAsicas sem batida marcada (ac\xFAsticas).'
          },
          {
            question: "Como melhorar a musicalidade na dan\xE7a?",
            answer: "Segundo a metodologia Zen Eyer, a musicalidade se divide em tr\xEAs camadas: 1) <strong>Beat:</strong> Marcar o tempo (b\xE1sico); 2) <strong>Melodia:</strong> Dan\xE7ar a voz ou instrumento principal (intermedi\xE1rio); 3) <strong>Atmosfera:</strong> Expressar a inten\xE7\xE3o e a textura do som (avan\xE7ado). DJs de alta performance constroem sets que obrigam o dan\xE7arino a transitar entre essas camadas."
          }
        ]
      },
      // CATEGORIA 3: CULTURA E INICIANTES (Perguntas comuns no Google)
      {
        category: "zouk-culture",
        icon: /* @__PURE__ */ React16.createElement(HeartPulse, { size: 24 }),
        title: "Cultura e Inicia\xE7\xE3o",
        description: "D\xFAvidas comuns de quem est\xE1 come\xE7ando.",
        questions: [
          {
            question: "Zouk Brasileiro \xE9 a mesma coisa que Lambada?",
            answer: 'N\xE3o, mas s\xE3o "parentes". O Zouk Brasileiro nasceu quando os dan\xE7arinos de Lambada come\xE7aram a dan\xE7ar sobre m\xFAsicas de Zouk Antilhano (Caribenho) na falta de m\xFAsicas de Lambada nos anos 90. O Zouk \xE9 mais lento, mais fluido e tem menos chicotes de cabe\xE7a r\xE1pidos que a Lambada original, embora o estilo "Lambazouk" preserve essa energia r\xE1pida.'
          },
          {
            question: "Preciso de um parceiro fixo para aprender?",
            answer: "N\xE3o. O Zouk Brasileiro \xE9 uma dan\xE7a social baseada na condu\xE7\xE3o e resposta. Nas aulas e bailes, \xE9 comum o rod\xEDzio de parceiros. Aprender a dan\xE7ar com pessoas de diferentes biotipos e n\xEDveis \xE9 essencial para desenvolver uma condu\xE7\xE3o (ou resposta) clara e adapt\xE1vel."
          },
          {
            question: "Existe etiqueta na pista de dan\xE7a de Zouk?",
            answer: "Sim. Os pilares da etiqueta moderna s\xE3o: 1) <strong>Consentimento:</strong> O convite pode ser recusado sem justificativa. 2) <strong>Higiene:</strong> Uso de desodorante e toalhas/mudas de roupa em festas quentes. 3) <strong>Feedback:</strong> Comunicar imediatamente qualquer dor ou desconforto f\xEDsico. 4) <strong>N\xE3o ensinar na pista:</strong> O baile \xE9 momento de lazer, n\xE3o de corre\xE7\xE3o t\xE9cnica (salvo se solicitado)."
          }
        ]
      },
      // CATEGORIA 4: SERVIÇOS E COMUNIDADE
      {
        category: "community",
        icon: /* @__PURE__ */ React16.createElement(Users8, { size: 24 }),
        title: "Tribo Zen & Contrata\xE7\xE3o",
        description: "Como fazer parte do movimento.",
        questions: [
          {
            question: "O que \xE9 a Tribo Zen?",
            answer: "A <strong>Tribo Zen</strong> \xE9 uma comunidade internacional de amantes do Zouk e da musicalidade refinada. Membros t\xEAm acesso antecipado a sets, downloads de edits exclusivos em alta qualidade (WAV/MP3), descontos em festivais parceiros e influ\xEAncia direta nas produ\xE7\xF5es do artista."
          },
          {
            question: "Posso usar suas m\xFAsicas em v\xEDdeos no Instagram/YouTube?",
            answer: "<strong>Sim!</strong> O uso \xE9 liberado para dan\xE7arinos, professores e core\xF3grafos. Pe\xE7o apenas que marquem <strong>@djzeneyer</strong> na legenda e nos stories para que eu possa repostar e divulgar o trabalho de voc\xEAs. Para uso comercial em larga escala (TV, Publicidade), entre em contato para licenciamento."
          },
          {
            question: "Como contratar DJ Zen Eyer para meu congresso?",
            answer: 'Para bookings internacionais ou nacionais, utilize o canal oficial via e-mail <strong>booking@djzeneyer.com</strong> ou WhatsApp. O Presskit completo com Tech Rider e fotos promocionais est\xE1 dispon\xEDvel na p\xE1gina "Presskit" deste site.'
          }
        ]
      }
    ];
    FAQ_PAGE_SCHEMA = {
      "@type": "FAQPage",
      "@id": "https://djzeneyer.com/faq#faqpage",
      "mainEntity": FAQ_DATA.flatMap(
        (category) => category.questions.map((q) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer.replace(/<[^>]*>/g, "")
            // Texto limpo para robots
          }
        }))
      )
    };
    BREADCRUMB_SCHEMA = {
      "@type": "BreadcrumbList",
      "@id": "https://djzeneyer.com/faq#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://djzeneyer.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "FAQ",
          "item": "https://djzeneyer.com/faq"
        }
      ]
    };
    COMBINED_SCHEMA = {
      "@context": "https://schema.org",
      "@graph": [FAQ_PAGE_SCHEMA, BREADCRUMB_SCHEMA]
    };
    FAQItem = memo4(({ question, answer, isOpen, onToggle }) => /* @__PURE__ */ React16.createElement(
      motion14.div,
      {
        className: "bg-surface/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300",
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true }
      },
      /* @__PURE__ */ React16.createElement(
        "button",
        {
          onClick: onToggle,
          className: "w-full flex items-center justify-between p-6 text-left hover:bg-surface/50 transition-colors group",
          "aria-expanded": isOpen
        },
        /* @__PURE__ */ React16.createElement("h3", { className: "text-lg font-bold text-white pr-4 group-hover:text-primary transition-colors font-display" }, question),
        /* @__PURE__ */ React16.createElement(
          motion14.div,
          {
            animate: { rotate: isOpen ? 180 : 0 },
            transition: { duration: 0.3 },
            className: "flex-shrink-0"
          },
          /* @__PURE__ */ React16.createElement(ChevronDown, { className: "text-primary/70 group-hover:text-primary transition-colors", size: 24 })
        )
      ),
      /* @__PURE__ */ React16.createElement(AnimatePresence4, null, isOpen && /* @__PURE__ */ React16.createElement(
        motion14.div,
        {
          initial: { height: 0, opacity: 0 },
          animate: { height: "auto", opacity: 1 },
          exit: { height: 0, opacity: 0 },
          transition: { duration: 0.3 },
          className: "overflow-hidden"
        },
        /* @__PURE__ */ React16.createElement(
          "div",
          {
            className: "px-6 pb-6 text-white/80 leading-relaxed prose prose-invert max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white border-t border-white/5 pt-4",
            dangerouslySetInnerHTML: { __html: answer }
          }
        )
      ))
    ));
    FAQItem.displayName = "FAQItem";
    FAQPage = () => {
      const [openIndex, setOpenIndex] = useState12(null);
      const handleToggle = (id) => {
        setOpenIndex(openIndex === id ? null : id);
      };
      const currentPath = "/faq";
      const currentUrl = "https://djzeneyer.com" + currentPath;
      return /* @__PURE__ */ React16.createElement(React16.Fragment, null, /* @__PURE__ */ React16.createElement(
        HeadlessSEO,
        {
          title: "FAQ & Zouk Encyclopedia - DJ Zen Eyer",
          description: "Respostas oficiais do Bicampe\xE3o Mundial DJ Zen Eyer sobre Zouk Brasileiro, t\xE9cnica, musicalidade, Tribo Zen e contrata\xE7\xE3o.",
          url: currentUrl,
          image: "https://djzeneyer.com/images/zen-eyer-faq-og.jpg",
          ogType: "website",
          schema: COMBINED_SCHEMA,
          hrefLang: getHrefLangUrls(currentPath, "https://djzeneyer.com"),
          keywords: "Zouk Brasileiro FAQ, o que \xE9 zouk, DJ Zen Eyer, cremosidade, musicalidade zouk, contratar DJ, aulas de zouk"
        }
      ), /* @__PURE__ */ React16.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React16.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React16.createElement(
        motion14.div,
        {
          className: "text-center mb-20",
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8 }
        },
        /* @__PURE__ */ React16.createElement("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 text-sm font-bold tracking-widest uppercase" }, /* @__PURE__ */ React16.createElement(BookOpen, { size: 16 }), " Knowledge Base"),
        /* @__PURE__ */ React16.createElement("h1", { className: "text-4xl md:text-6xl font-black font-display mb-6" }, "Perguntas ", /* @__PURE__ */ React16.createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500" }, "Frequentes")),
        /* @__PURE__ */ React16.createElement("p", { className: "text-xl text-white/60 max-w-2xl mx-auto" }, "A fonte oficial de informa\xE7\xF5es sobre a carreira de Zen Eyer e uma enciclop\xE9dia compacta sobre o universo do Zouk Brasileiro.")
      ), /* @__PURE__ */ React16.createElement("div", { className: "max-w-4xl mx-auto space-y-16" }, FAQ_DATA.map((category, catIndex) => /* @__PURE__ */ React16.createElement(
        motion14.div,
        {
          key: catIndex,
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: catIndex * 0.1 }
        },
        /* @__PURE__ */ React16.createElement("div", { className: "flex items-start gap-4 mb-8" }, /* @__PURE__ */ React16.createElement("div", { className: "p-3 bg-surface rounded-xl text-primary border border-white/10 shadow-lg shadow-primary/5" }, category.icon), /* @__PURE__ */ React16.createElement("div", null, /* @__PURE__ */ React16.createElement("h2", { className: "text-2xl md:text-3xl font-bold font-display text-white mb-2" }, category.title), category.description && /* @__PURE__ */ React16.createElement("p", { className: "text-white/50 text-sm" }, category.description))),
        /* @__PURE__ */ React16.createElement("div", { className: "space-y-4" }, category.questions.map((q, qIndex) => {
          const uniqueId = `${catIndex}-${qIndex}`;
          return /* @__PURE__ */ React16.createElement(
            FAQItem,
            {
              key: uniqueId,
              question: q.question,
              answer: q.answer,
              isOpen: openIndex === uniqueId,
              onToggle: () => handleToggle(uniqueId)
            }
          );
        }))
      ))), /* @__PURE__ */ React16.createElement(
        motion14.div,
        {
          className: "mt-24 text-center border-t border-white/10 pt-16",
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true }
        },
        /* @__PURE__ */ React16.createElement("h3", { className: "text-2xl font-display font-bold mb-6" }, "N\xE3o achou o que procurava?"),
        /* @__PURE__ */ React16.createElement("div", { className: "flex flex-col sm:flex-row justify-center gap-4" }, /* @__PURE__ */ React16.createElement("a", { href: "https://wa.me/5521987413091", className: "btn btn-primary px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2" }, /* @__PURE__ */ React16.createElement(Mic2, { size: 18 }), " Falar no WhatsApp"), /* @__PURE__ */ React16.createElement("a", { href: "mailto:booking@djzeneyer.com", className: "btn btn-outline px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10" }, /* @__PURE__ */ React16.createElement(Globe5, { size: 18 }), " Enviar E-mail"))
      ))));
    };
    FAQPage_default = FAQPage;
  }
});

// src/pages/PhilosophyPage.tsx
var PhilosophyPage_exports = {};
__export(PhilosophyPage_exports, {
  default: () => PhilosophyPage_default
});
import React17 from "react";
import { motion as motion15 } from "framer-motion";
import { Brain as Brain3, Heart as Heart3, Music2 as Music25, Sparkles as Sparkles4 } from "lucide-react";
import { useTranslation as useTranslation13 } from "react-i18next";
var PhilosophyPage, PhilosophyPage_default;
var init_PhilosophyPage = __esm({
  "src/pages/PhilosophyPage.tsx"() {
    init_HeadlessSEO();
    init_artistData();
    PhilosophyPage = () => {
      const { t } = useTranslation13();
      return /* @__PURE__ */ React17.createElement(React17.Fragment, null, /* @__PURE__ */ React17.createElement(
        HeadlessSEO,
        {
          title: `${t("footer_music_philosophy")} | ${ARTIST.identity.stageName}`,
          description: `${ARTIST.philosophy.slogan}. ${ARTIST.philosophy.styleDefinition}`,
          path: "/my-philosophy",
          type: "article"
        }
      ), /* @__PURE__ */ React17.createElement("div", { className: "min-h-screen bg-background text-white" }, /* @__PURE__ */ React17.createElement("section", { className: "container mx-auto px-4 py-20 md:py-28" }, /* @__PURE__ */ React17.createElement(
        motion15.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "max-w-4xl mx-auto"
        },
        /* @__PURE__ */ React17.createElement("div", { className: "text-center mb-16" }, /* @__PURE__ */ React17.createElement("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6" }, /* @__PURE__ */ React17.createElement(Brain3, { size: 40, className: "text-primary" })), /* @__PURE__ */ React17.createElement("h1", { className: "text-4xl md:text-5xl font-black mb-4" }, t("footer_music_philosophy")), /* @__PURE__ */ React17.createElement("p", { className: "text-xl text-white/70 italic" }, '"', ARTIST.philosophy.slogan, '"')),
        /* @__PURE__ */ React17.createElement("div", { className: "space-y-12" }, /* @__PURE__ */ React17.createElement(
          motion15.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.2 },
            className: "bg-white/5 rounded-2xl p-8 border border-white/10"
          },
          /* @__PURE__ */ React17.createElement("div", { className: "flex items-start gap-4 mb-4" }, /* @__PURE__ */ React17.createElement(Music25, { size: 32, className: "text-primary flex-shrink-0" }), /* @__PURE__ */ React17.createElement("div", null, /* @__PURE__ */ React17.createElement("h2", { className: "text-2xl font-bold mb-3" }, "Cremosidade"), /* @__PURE__ */ React17.createElement("p", { className: "text-white/80 leading-relaxed" }, ARTIST.philosophy.styleDefinition)))
        ), /* @__PURE__ */ React17.createElement(
          motion15.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.4 },
            className: "bg-white/5 rounded-2xl p-8 border border-white/10"
          },
          /* @__PURE__ */ React17.createElement("div", { className: "flex items-start gap-4 mb-4" }, /* @__PURE__ */ React17.createElement(Heart3, { size: 32, className: "text-primary flex-shrink-0" }), /* @__PURE__ */ React17.createElement("div", null, /* @__PURE__ */ React17.createElement("h2", { className: "text-2xl font-bold mb-3" }, "Miss\xE3o"), /* @__PURE__ */ React17.createElement("p", { className: "text-white/80 leading-relaxed" }, ARTIST.philosophy.mission)))
        ), /* @__PURE__ */ React17.createElement(
          motion15.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.6 },
            className: "bg-white/5 rounded-2xl p-8 border border-white/10"
          },
          /* @__PURE__ */ React17.createElement("div", { className: "flex items-start gap-4 mb-4" }, /* @__PURE__ */ React17.createElement(Sparkles4, { size: 32, className: "text-primary flex-shrink-0" }), /* @__PURE__ */ React17.createElement("div", null, /* @__PURE__ */ React17.createElement("h2", { className: "text-2xl font-bold mb-3" }, "Em Breve"), /* @__PURE__ */ React17.createElement("p", { className: "text-white/80 leading-relaxed" }, "Mais conte\xFAdo sobre a filosofia musical de ", ARTIST.identity.stageName, " ser\xE1 adicionado em breve. Acompanhe nas redes sociais para n\xE3o perder novidades!")))
        ))
      ))));
    };
    PhilosophyPage_default = PhilosophyPage;
  }
});

// src/pages/NewsPage.tsx
var NewsPage_exports = {};
__export(NewsPage_exports, {
  default: () => NewsPage_default
});
import React18, { useEffect as useEffect11, useState as useState13 } from "react";
import { motion as motion16 } from "framer-motion";
import { Calendar as Calendar7, Clock as Clock5, ArrowRight as ArrowRight3, TrendingUp as TrendingUp5, Hash, ArrowLeft as ArrowLeft4 } from "lucide-react";
import { Link as Link10, useParams as useParams4 } from "react-router-dom";
import { useTranslation as useTranslation14 } from "react-i18next";
var formatDate, stripHtml, NewsPage, NewsPage_default;
var init_NewsPage = __esm({
  "src/pages/NewsPage.tsx"() {
    init_HeadlessSEO();
    init_routes();
    formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    stripHtml = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };
    NewsPage = () => {
      const { slug } = useParams4();
      const { i18n, t } = useTranslation14();
      const [posts, setPosts] = useState13([]);
      const [singlePost, setSinglePost] = useState13(null);
      const [loading, setLoading] = useState13(true);
      const getRouteForKey = (key) => {
        const route = ROUTES_CONFIG.find((r) => getLocalizedPaths(r, "en")[0] === key);
        if (!route) return `/${key}`;
        const normalizedLanguage = normalizeLanguage(i18n.language);
        return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
      };
      useEffect11(() => {
        setLoading(true);
        const endpoint = slug ? `https://djzeneyer.com/wp-json/wp/v2/posts?slug=${slug}&_embed` : `https://djzeneyer.com/wp-json/wp/v2/posts?_embed&per_page=10`;
        fetch(endpoint).then((res) => res.json()).then((data) => {
          if (slug) {
            setSinglePost(data[0] || null);
          } else {
            setPosts(data);
          }
          setLoading(false);
        }).catch((err) => {
          console.error("Failed to fetch news:", err);
          setLoading(false);
        });
      }, [slug]);
      if (!loading && slug && singlePost) {
        return /* @__PURE__ */ React18.createElement(React18.Fragment, null, /* @__PURE__ */ React18.createElement(
          HeadlessSEO,
          {
            title: `${stripHtml(singlePost.title.rendered)} | Zen News`,
            description: stripHtml(singlePost.excerpt.rendered),
            url: `https://djzeneyer.com/news/${singlePost.slug}`
          }
        ), /* @__PURE__ */ React18.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React18.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React18.createElement(Link10, { to: getRouteForKey("news"), className: "inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8 font-bold" }, /* @__PURE__ */ React18.createElement(ArrowLeft4, { size: 20 }), " VOLTAR PARA NOT\xCDCIAS"), /* @__PURE__ */ React18.createElement("article", null, /* @__PURE__ */ React18.createElement("header", { className: "mb-10 text-center" }, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center justify-center gap-4 text-white/50 text-sm mb-4 font-mono uppercase tracking-widest" }, /* @__PURE__ */ React18.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React18.createElement(Calendar7, { size: 14 }), " ", formatDate(singlePost.date)), /* @__PURE__ */ React18.createElement("span", null, "\u2022"), /* @__PURE__ */ React18.createElement("span", null, "Por ", singlePost._embedded?.author?.[0]?.name || "Zen Eyer")), /* @__PURE__ */ React18.createElement("h1", { className: "text-4xl md:text-6xl font-black font-display leading-tight mb-8", dangerouslySetInnerHTML: { __html: singlePost.title.rendered } }), singlePost._embedded?.["wp:featuredmedia"]?.[0]?.source_url && /* @__PURE__ */ React18.createElement("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[40vh] md:h-[60vh]" }, /* @__PURE__ */ React18.createElement(
          "img",
          {
            src: singlePost._embedded["wp:featuredmedia"][0].source_url,
            className: "w-full h-full object-cover",
            alt: singlePost.title.rendered
          }
        ))), /* @__PURE__ */ React18.createElement(
          "div",
          {
            className: "prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-primary hover:prose-a:text-white transition-colors",
            dangerouslySetInnerHTML: { __html: singlePost.content?.rendered || "" }
          }
        )))));
      }
      const featuredPost = posts[0];
      const secondaryPosts = posts.slice(1);
      return /* @__PURE__ */ React18.createElement(React18.Fragment, null, /* @__PURE__ */ React18.createElement(
        HeadlessSEO,
        {
          title: "Zen News | Insights & Updates",
          description: "Not\xEDcias oficiais, lan\xE7amentos e artigos sobre o universo do Zouk Brasileiro por DJ Zen Eyer.",
          url: "https://djzeneyer.com/news"
        }
      ), /* @__PURE__ */ React18.createElement("div", { className: "min-h-screen bg-background text-white pt-24 pb-20" }, /* @__PURE__ */ React18.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React18.createElement("header", { className: "mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6" }, /* @__PURE__ */ React18.createElement("div", null, /* @__PURE__ */ React18.createElement(
        motion16.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          className: "flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase mb-2"
        },
        /* @__PURE__ */ React18.createElement("div", { className: "w-2 h-2 bg-primary rounded-full animate-pulse" }),
        "Live Feed"
      ), /* @__PURE__ */ React18.createElement("h1", { className: "text-5xl md:text-7xl font-black font-display tracking-tight text-white" }, "ZEN ", /* @__PURE__ */ React18.createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500" }, "NEWS"))), /* @__PURE__ */ React18.createElement("div", { className: "text-right text-white/50 text-sm hidden md:block" }, /* @__PURE__ */ React18.createElement("p", null, "Curadoria de Conte\xFAdo"), /* @__PURE__ */ React18.createElement("p", null, "Zouk Brasileiro & Produ\xE7\xE3o Musical"), /* @__PURE__ */ React18.createElement("p", null, (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })))), loading ? /* @__PURE__ */ React18.createElement("div", { className: "animate-pulse space-y-8" }, /* @__PURE__ */ React18.createElement("div", { className: "h-[500px] bg-white/5 rounded-2xl w-full" }), /* @__PURE__ */ React18.createElement("div", { className: "grid md:grid-cols-3 gap-8" }, /* @__PURE__ */ React18.createElement("div", { className: "h-64 bg-white/5 rounded-xl" }), /* @__PURE__ */ React18.createElement("div", { className: "h-64 bg-white/5 rounded-xl" }), /* @__PURE__ */ React18.createElement("div", { className: "h-64 bg-white/5 rounded-xl" }))) : /* @__PURE__ */ React18.createElement(React18.Fragment, null, featuredPost && /* @__PURE__ */ React18.createElement(
        motion16.article,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8 },
          className: "relative group cursor-pointer mb-20"
        },
        /* @__PURE__ */ React18.createElement("div", { className: "relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl" }, /* @__PURE__ */ React18.createElement(
          "img",
          {
            src: featuredPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp",
            alt: featuredPost.title.rendered,
            className: "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          }
        ), /* @__PURE__ */ React18.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" }), /* @__PURE__ */ React18.createElement("div", { className: "absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4" }, /* @__PURE__ */ React18.createElement("div", { className: "flex items-center gap-4 text-primary font-bold mb-4" }, /* @__PURE__ */ React18.createElement("span", { className: "bg-primary/20 px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-md border border-primary/30" }, "Destaque"), /* @__PURE__ */ React18.createElement("span", { className: "flex items-center gap-2 text-white/80 text-sm" }, /* @__PURE__ */ React18.createElement(Calendar7, { size: 14 }), " ", formatDate(featuredPost.date))), /* @__PURE__ */ React18.createElement(
          "h2",
          {
            className: "text-4xl md:text-6xl font-black font-display leading-tight mb-6 group-hover:text-primary transition-colors",
            dangerouslySetInnerHTML: { __html: featuredPost.title.rendered }
          }
        ), /* @__PURE__ */ React18.createElement("div", { className: "prose prose-invert max-w-2xl mb-8 hidden md:block" }, /* @__PURE__ */ React18.createElement(
          "p",
          {
            className: "text-lg text-white/80 line-clamp-3",
            dangerouslySetInnerHTML: { __html: stripHtml(featuredPost.excerpt.rendered) }
          }
        )), /* @__PURE__ */ React18.createElement(Link10, { to: `${getRouteForKey("news")}/${featuredPost.slug}`, className: "inline-flex items-center gap-2 text-white font-bold text-lg hover:gap-4 transition-all" }, "LER MAT\xC9RIA COMPLETA ", /* @__PURE__ */ React18.createElement("div", { className: "bg-white text-black rounded-full p-1" }, /* @__PURE__ */ React18.createElement(ArrowRight3, { size: 16 })))))
      ), /* @__PURE__ */ React18.createElement("div", { className: "mb-8 flex items-center gap-2 text-xl font-display font-bold text-white/90" }, /* @__PURE__ */ React18.createElement(TrendingUp5, { className: "text-primary" }), /* @__PURE__ */ React18.createElement("span", null, "Latest Stories")), /* @__PURE__ */ React18.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8" }, secondaryPosts.map((post, index) => /* @__PURE__ */ React18.createElement(
        motion16.article,
        {
          key: post.id,
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: index * 0.1 },
          className: "group flex flex-col h-full bg-surface/30 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:bg-surface/50 transition-all duration-300"
        },
        /* @__PURE__ */ React18.createElement(Link10, { to: `${getRouteForKey("news")}/${post.slug}`, className: "block h-56 overflow-hidden relative" }, /* @__PURE__ */ React18.createElement(
          "img",
          {
            src: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/images/hero-background.webp",
            alt: post.title.rendered,
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          }
        ), /* @__PURE__ */ React18.createElement("div", { className: "absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10" }, /* @__PURE__ */ React18.createElement(Clock5, { size: 12, className: "inline mr-1" }), " 3 min read")),
        /* @__PURE__ */ React18.createElement("div", { className: "p-6 flex-1 flex flex-col" }, /* @__PURE__ */ React18.createElement("div", { className: "text-xs text-primary mb-3 font-bold uppercase tracking-wider flex items-center gap-2" }, /* @__PURE__ */ React18.createElement(Hash, { size: 12 }), " News"), /* @__PURE__ */ React18.createElement(Link10, { to: `${getRouteForKey("news")}/${post.slug}` }, /* @__PURE__ */ React18.createElement(
          "h3",
          {
            className: "text-xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2",
            dangerouslySetInnerHTML: { __html: post.title.rendered }
          }
        )), /* @__PURE__ */ React18.createElement(
          "p",
          {
            className: "text-white/60 text-sm line-clamp-3 mb-6 flex-1",
            dangerouslySetInnerHTML: { __html: stripHtml(post.excerpt.rendered) }
          }
        ), /* @__PURE__ */ React18.createElement("div", { className: "flex items-center justify-between border-t border-white/10 pt-4 mt-auto" }, /* @__PURE__ */ React18.createElement("span", { className: "text-xs text-white/40 font-medium" }, formatDate(post.date)), /* @__PURE__ */ React18.createElement(Link10, { to: `${getRouteForKey("news")}/${post.slug}`, className: "text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4" }, "Read More")))
      )))), !loading && posts.length > 0 && /* @__PURE__ */ React18.createElement("div", { className: "mt-20 text-center border-t border-white/10 pt-10" }, /* @__PURE__ */ React18.createElement("p", { className: "text-white/40 text-sm mb-4" }, "Voc\xEA chegou ao fim das atualiza\xE7\xF5es recentes."), /* @__PURE__ */ React18.createElement("button", { className: "btn btn-outline text-sm px-8 py-3 rounded-full hover:bg-white/5" }, "Ver Arquivo Completo")))));
    };
    NewsPage_default = NewsPage;
  }
});

// src/pages/MediaPage.tsx
var MediaPage_exports = {};
__export(MediaPage_exports, {
  default: () => MediaPage_default
});
import React19 from "react";
import { Helmet as Helmet5 } from "react-helmet-async";
import { useTranslation as useTranslation15 } from "react-i18next";
import { motion as motion17 } from "framer-motion";
import { Newspaper, ExternalLink as ExternalLink5, Download as Download5, Image as ImageIcon2 } from "lucide-react";
var MediaPage, MediaPage_default;
var init_MediaPage = __esm({
  "src/pages/MediaPage.tsx"() {
    init_artistData();
    MediaPage = () => {
      const { t } = useTranslation15();
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
          icon: ImageIcon2,
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
          icon: Download5,
          available: false
        }
      ];
      return /* @__PURE__ */ React19.createElement(React19.Fragment, null, /* @__PURE__ */ React19.createElement(Helmet5, null, /* @__PURE__ */ React19.createElement("title", null, t("media_page.title"), " | DJ Zen Eyer"), /* @__PURE__ */ React19.createElement("meta", { name: "description", content: t("media_page.subtitle") }), /* @__PURE__ */ React19.createElement("meta", { name: "robots", content: "index, follow" })), /* @__PURE__ */ React19.createElement("div", { className: "min-h-screen pt-24 pb-16" }, /* @__PURE__ */ React19.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React19.createElement(
        motion17.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "text-center mb-16"
        },
        /* @__PURE__ */ React19.createElement("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6" }, t("media_page.title").split("&")[0], " & ", /* @__PURE__ */ React19.createElement("span", { className: "text-primary" }, t("media_page.title").split("&")[1] || "Press Kit")),
        /* @__PURE__ */ React19.createElement("p", { className: "text-xl text-white/70 max-w-3xl mx-auto" }, t("media_page.subtitle"))
      ), /* @__PURE__ */ React19.createElement(
        motion17.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "card mb-16 p-8"
        },
        /* @__PURE__ */ React19.createElement("h2", { className: "text-2xl font-display font-bold mb-6" }, t("media_page.quick_facts")),
        /* @__PURE__ */ React19.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React19.createElement("div", null, /* @__PURE__ */ React19.createElement("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2" }, t("media_page.artist_name")), /* @__PURE__ */ React19.createElement("p", { className: "text-lg font-semibold" }, "DJ Zen Eyer")), /* @__PURE__ */ React19.createElement("div", null, /* @__PURE__ */ React19.createElement("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2" }, t("media_page.legal_name")), /* @__PURE__ */ React19.createElement("p", { className: "text-lg font-semibold" }, "Marcelo Eyer Fernandes")), /* @__PURE__ */ React19.createElement("div", null, /* @__PURE__ */ React19.createElement("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2" }, t("media_page.genre")), /* @__PURE__ */ React19.createElement("p", { className: "text-lg font-semibold" }, "Brazilian Zouk")), /* @__PURE__ */ React19.createElement("div", null, /* @__PURE__ */ React19.createElement("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2" }, t("media_page.location")), /* @__PURE__ */ React19.createElement("p", { className: "text-lg font-semibold" }, "S\xE3o Paulo, Brazil")), /* @__PURE__ */ React19.createElement("div", null, /* @__PURE__ */ React19.createElement("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2" }, t("media_page.cnpj")), /* @__PURE__ */ React19.createElement("p", { className: "text-lg font-semibold font-mono" }, "44.063.765/0001-46")), /* @__PURE__ */ React19.createElement("div", null, /* @__PURE__ */ React19.createElement("h3", { className: "text-sm text-white/60 uppercase tracking-wider mb-2" }, t("media_page.isni")), /* @__PURE__ */ React19.createElement("p", { className: "text-lg font-semibold font-mono" }, "0000 0005 2893 1015")))
      ), /* @__PURE__ */ React19.createElement(
        motion17.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.3 },
          className: "mb-16"
        },
        /* @__PURE__ */ React19.createElement("h2", { className: "text-3xl font-display font-bold mb-8" }, t("media_page.press_highlights")),
        /* @__PURE__ */ React19.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, pressHighlights.map((item, index) => /* @__PURE__ */ React19.createElement("div", { key: index, className: "card p-6 border-l-4 border-primary" }, /* @__PURE__ */ React19.createElement("div", { className: "flex justify-between items-start mb-3" }, /* @__PURE__ */ React19.createElement("h3", { className: "text-xl font-bold" }, item.title), /* @__PURE__ */ React19.createElement("span", { className: "text-sm text-white/50 font-mono" }, item.year)), /* @__PURE__ */ React19.createElement("p", { className: "text-white/70 mb-3" }, item.description), /* @__PURE__ */ React19.createElement("p", { className: "text-sm text-primary" }, item.source))))
      ), /* @__PURE__ */ React19.createElement(
        motion17.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.4 },
          className: "mb-16"
        },
        /* @__PURE__ */ React19.createElement("h2", { className: "text-3xl font-display font-bold mb-8" }, t("media_page.media_assets")),
        /* @__PURE__ */ React19.createElement("div", { className: "grid md:grid-cols-3 gap-6" }, mediaAssets.map((asset, index) => /* @__PURE__ */ React19.createElement("div", { key: index, className: "card p-6 text-center" }, /* @__PURE__ */ React19.createElement("div", { className: `inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${asset.available ? "bg-primary/20" : "bg-white/5"}` }, /* @__PURE__ */ React19.createElement(asset.icon, { size: 28, className: asset.available ? "text-primary" : "text-white/30" })), /* @__PURE__ */ React19.createElement("h3", { className: "text-lg font-bold mb-2" }, asset.title), /* @__PURE__ */ React19.createElement("p", { className: "text-white/60 text-sm mb-4" }, asset.description), asset.available ? /* @__PURE__ */ React19.createElement("button", { className: "btn btn-primary btn-sm w-full" }, /* @__PURE__ */ React19.createElement(Download5, { size: 16, className: "mr-2" }), t("media_page.download")) : /* @__PURE__ */ React19.createElement("span", { className: "text-xs text-white/40 uppercase tracking-wider" }, t("media_page.coming_soon")))))
      ), /* @__PURE__ */ React19.createElement(
        motion17.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.5 },
          className: "card p-8 text-center"
        },
        /* @__PURE__ */ React19.createElement("h2", { className: "text-3xl font-display font-bold mb-4" }, t("media_page.press_inquiries")),
        /* @__PURE__ */ React19.createElement("p", { className: "text-white/70 mb-6 max-w-2xl mx-auto" }, t("media_page.press_inquiries_desc")),
        /* @__PURE__ */ React19.createElement(
          "a",
          {
            href: `mailto:${ARTIST.contact.email}`,
            className: "btn btn-primary btn-lg inline-flex items-center gap-2"
          },
          /* @__PURE__ */ React19.createElement(ExternalLink5, { size: 20 }),
          t("media_page.contact_press_office")
        )
      ), /* @__PURE__ */ React19.createElement(
        motion17.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.6 },
          className: "mt-16 text-center"
        },
        /* @__PURE__ */ React19.createElement("p", { className: "text-white/50 mb-4" }, t("media_page.verified_profiles")),
        /* @__PURE__ */ React19.createElement("div", { className: "flex justify-center gap-6 flex-wrap" }, /* @__PURE__ */ React19.createElement(
          "a",
          {
            href: "https://www.wikidata.org/wiki/Q136551855",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-white/60 hover:text-primary transition-colors flex items-center gap-2"
          },
          "Wikidata ",
          /* @__PURE__ */ React19.createElement(ExternalLink5, { size: 14 })
        ), /* @__PURE__ */ React19.createElement(
          "a",
          {
            href: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-white/60 hover:text-primary transition-colors flex items-center gap-2"
          },
          "MusicBrainz ",
          /* @__PURE__ */ React19.createElement(ExternalLink5, { size: 14 })
        ))
      ))));
    };
    MediaPage_default = MediaPage;
  }
});

// src/pages/PrivacyPolicyPage.tsx
var PrivacyPolicyPage_exports = {};
__export(PrivacyPolicyPage_exports, {
  default: () => PrivacyPolicyPage_default
});
import React20 from "react";
import { Helmet as Helmet6 } from "react-helmet-async";
import { motion as motion18 } from "framer-motion";
import { Shield as Shield4, Lock as Lock4, Eye, Database as Database2, Mail as Mail3 } from "lucide-react";
var PrivacyPolicyPage, PrivacyPolicyPage_default;
var init_PrivacyPolicyPage = __esm({
  "src/pages/PrivacyPolicyPage.tsx"() {
    PrivacyPolicyPage = () => {
      const lastUpdated = "January 2024";
      const sections = [
        {
          icon: Database2,
          title: "1. Information We Collect",
          content: [
            "Personal identification information (name, email address, phone number)",
            "Usage data and analytics (pages visited, time spent, interactions)",
            "Device information (browser type, operating system, IP address)",
            "Cookies and tracking technologies for enhanced user experience",
            "Payment information (processed securely through third-party processors)"
          ]
        },
        {
          icon: Eye,
          title: "2. How We Use Your Information",
          content: [
            "To provide and maintain our services",
            "To notify you about changes to our services",
            "To provide customer support and respond to inquiries",
            "To send promotional emails and newsletters (with your consent)",
            "To analyze usage patterns and improve our website and services",
            "To detect, prevent, and address technical issues and security threats"
          ]
        },
        {
          icon: Lock4,
          title: "3. Data Security",
          content: [
            "We implement industry-standard security measures to protect your data",
            "SSL/TLS encryption for all data transmission",
            "Regular security audits and vulnerability assessments",
            "Restricted access to personal information on a need-to-know basis",
            "However, no method of transmission over the Internet is 100% secure"
          ]
        },
        {
          icon: Shield4,
          title: "4. Data Sharing and Disclosure",
          content: [
            "We do not sell your personal information to third parties",
            "We may share data with trusted service providers who assist in operations",
            "We may disclose information when required by law or to protect our rights",
            "Analytics partners may receive aggregated, anonymized data",
            "Payment processors handle transaction data according to their own policies"
          ]
        },
        {
          icon: Mail3,
          title: "5. Your Rights",
          content: [
            "Access: Request a copy of your personal data",
            "Correction: Request correction of inaccurate or incomplete data",
            "Deletion: Request deletion of your personal data (subject to legal obligations)",
            "Opt-out: Unsubscribe from marketing communications at any time",
            "Data portability: Request transfer of your data to another service"
          ]
        }
      ];
      return /* @__PURE__ */ React20.createElement(React20.Fragment, null, /* @__PURE__ */ React20.createElement(Helmet6, null, /* @__PURE__ */ React20.createElement("title", null, "Privacy Policy | DJ Zen Eyer"), /* @__PURE__ */ React20.createElement("meta", { name: "description", content: "Privacy Policy for DJ Zen Eyer official website. Learn how we collect, use, and protect your personal information." }), /* @__PURE__ */ React20.createElement("meta", { name: "robots", content: "index, follow" })), /* @__PURE__ */ React20.createElement("div", { className: "min-h-screen pt-24 pb-16" }, /* @__PURE__ */ React20.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "text-center mb-12"
        },
        /* @__PURE__ */ React20.createElement("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6" }, /* @__PURE__ */ React20.createElement(Shield4, { size: 40, className: "text-primary" })),
        /* @__PURE__ */ React20.createElement("h1", { className: "text-4xl md:text-5xl font-display font-bold mb-4" }, "Privacy ", /* @__PURE__ */ React20.createElement("span", { className: "text-primary" }, "Policy")),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70" }, "Last updated: ", /* @__PURE__ */ React20.createElement("span", { className: "text-primary font-semibold" }, lastUpdated))
      ), /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 },
          className: "card p-8 mb-8"
        },
        /* @__PURE__ */ React20.createElement("p", { className: "text-lg text-white/80 leading-relaxed mb-4" }, "DJ Zen Eyer (Marcelo Eyer Fernandes, CNPJ: 44.063.765/0001-46) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website."),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 leading-relaxed" }, "By using our website, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access the website.")
      ), sections.map((section, index) => /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          key: index,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 + index * 0.1 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React20.createElement("div", { className: "flex items-start gap-4 mb-4" }, /* @__PURE__ */ React20.createElement("div", { className: "flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center" }, /* @__PURE__ */ React20.createElement(section.icon, { size: 24, className: "text-primary" })), /* @__PURE__ */ React20.createElement("h2", { className: "text-2xl font-display font-bold mt-1" }, section.title)),
        /* @__PURE__ */ React20.createElement("ul", { className: "space-y-3 ml-16" }, section.content.map((item, i) => /* @__PURE__ */ React20.createElement("li", { key: i, className: "flex items-start gap-3" }, /* @__PURE__ */ React20.createElement("span", { className: "text-primary mt-1.5" }, "\u2022"), /* @__PURE__ */ React20.createElement("span", { className: "text-white/70 leading-relaxed" }, item))))
      )), /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.7 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React20.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "6. Cookies and Tracking Technologies"),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 leading-relaxed mb-4" }, "We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier."),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 leading-relaxed" }, "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.")
      ), /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.8 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React20.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "7. Third-Party Services"),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 leading-relaxed mb-4" }, "We may employ third-party companies and individuals to facilitate our services, provide services on our behalf, or assist us in analyzing how our service is used. These third parties may have access to your personal information to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose."),
        /* @__PURE__ */ React20.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React20.createElement("p", { className: "text-white/80" }, /* @__PURE__ */ React20.createElement("strong", null, "Analytics:"), " Google Analytics"), /* @__PURE__ */ React20.createElement("p", { className: "text-white/80" }, /* @__PURE__ */ React20.createElement("strong", null, "Payment Processing:"), " Stripe, PayPal"), /* @__PURE__ */ React20.createElement("p", { className: "text-white/80" }, /* @__PURE__ */ React20.createElement("strong", null, "Email Services:"), " MailPoet"))
      ), /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.9 },
          className: "card p-8 mb-6 border-l-4 border-primary"
        },
        /* @__PURE__ */ React20.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "8. LGPD Compliance (Brazilian Law)"),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 leading-relaxed mb-4" }, "We comply with the Brazilian General Data Protection Law (LGPD - Lei Geral de Prote\xE7\xE3o de Dados). As a Brazilian entity, we are committed to:"),
        /* @__PURE__ */ React20.createElement("ul", { className: "space-y-2 text-white/70" }, /* @__PURE__ */ React20.createElement("li", { className: "flex items-start gap-3" }, /* @__PURE__ */ React20.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React20.createElement("span", null, "Processing data lawfully, fairly, and transparently")), /* @__PURE__ */ React20.createElement("li", { className: "flex items-start gap-3" }, /* @__PURE__ */ React20.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React20.createElement("span", null, "Collecting data only for specified, explicit, and legitimate purposes")), /* @__PURE__ */ React20.createElement("li", { className: "flex items-start gap-3" }, /* @__PURE__ */ React20.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React20.createElement("span", null, "Keeping data accurate and up to date")), /* @__PURE__ */ React20.createElement("li", { className: "flex items-start gap-3" }, /* @__PURE__ */ React20.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React20.createElement("span", null, "Retaining data only as long as necessary")))
      ), /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React20.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "9. Changes to This Privacy Policy"),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 leading-relaxed" }, 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.')
      ), /* @__PURE__ */ React20.createElement(
        motion18.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.1 },
          className: "card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent"
        },
        /* @__PURE__ */ React20.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "10. Contact Us"),
        /* @__PURE__ */ React20.createElement("p", { className: "text-white/70 mb-6" }, "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:"),
        /* @__PURE__ */ React20.createElement("div", { className: "space-y-2 text-white/80" }, /* @__PURE__ */ React20.createElement("p", null, /* @__PURE__ */ React20.createElement("strong", null, "Marcelo Eyer Fernandes")), /* @__PURE__ */ React20.createElement("p", null, "CNPJ: 44.063.765/0001-46"), /* @__PURE__ */ React20.createElement("p", null, "S\xE3o Paulo, SP - Brazil"), /* @__PURE__ */ React20.createElement(
          "a",
          {
            href: "mailto:contact@djzeneyer.com",
            className: "text-primary hover:underline inline-block mt-2"
          },
          "contact@djzeneyer.com"
        ))
      ))));
    };
    PrivacyPolicyPage_default = PrivacyPolicyPage;
  }
});

// src/pages/ReturnPolicyPage.tsx
var ReturnPolicyPage_exports = {};
__export(ReturnPolicyPage_exports, {
  default: () => ReturnPolicyPage_default
});
import React21 from "react";
import { motion as motion19 } from "framer-motion";
import { useTranslation as useTranslation16 } from "react-i18next";
var ReturnPolicyPage, ReturnPolicyPage_default;
var init_ReturnPolicyPage = __esm({
  "src/pages/ReturnPolicyPage.tsx"() {
    init_HeadlessSEO();
    init_artistData();
    ReturnPolicyPage = () => {
      const { t } = useTranslation16();
      return /* @__PURE__ */ React21.createElement(React21.Fragment, null, /* @__PURE__ */ React21.createElement(
        HeadlessSEO,
        {
          title: t("return_policy_title", "Return & Refund Policy"),
          description: t("return_policy_desc", "Our policy on returns and refunds for products and tickets."),
          isHomepage: false
        }
      ), /* @__PURE__ */ React21.createElement("div", { className: "min-h-screen pt-24 pb-20 bg-background text-white" }, /* @__PURE__ */ React21.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React21.createElement(
        motion19.article,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "prose prose-invert prose-lg max-w-none"
        },
        /* @__PURE__ */ React21.createElement("h1", { className: "font-display text-4xl md:text-5xl mb-8" }, t("return_policy_h1", "Return & Refund Policy")),
        /* @__PURE__ */ React21.createElement("div", { className: "p-6 bg-surface border border-white/10 rounded-xl mb-10 text-white/80" }, /* @__PURE__ */ React21.createElement("p", { className: "lead" }, t("return_policy_intro", "At DJ Zen Eyer, we want you to be completely satisfied with your purchase. However, we understand that sometimes things don't work out. Please read our policy below regarding returns and refunds."))),
        /* @__PURE__ */ React21.createElement("h2", null, t("return_policy_digital_title", "1. Digital Products")),
        /* @__PURE__ */ React21.createElement("p", null, t("return_policy_digital_text", "Due to the nature of digital products (music downloads, sample packs, presets), all sales are final. Once a file has been downloaded, we cannot offer a refund. If you have technical issues with a file, please contact support.")),
        /* @__PURE__ */ React21.createElement("h2", null, t("return_policy_tickets_title", "2. Event Tickets")),
        /* @__PURE__ */ React21.createElement("p", null, t("return_policy_tickets_text", "Tickets for events are generally non-refundable unless the event is cancelled or significantly rescheduled.")),
        /* @__PURE__ */ React21.createElement("ul", null, /* @__PURE__ */ React21.createElement("li", null, /* @__PURE__ */ React21.createElement("strong", null, t("return_policy_cancellations_label", "Cancellations:")), " ", t("return_policy_cancellations_text", "If an event is cancelled, you will receive a full refund automatically.")), /* @__PURE__ */ React21.createElement("li", null, /* @__PURE__ */ React21.createElement("strong", null, t("return_policy_transfers_label", "Transfers:")), " ", t("return_policy_transfers_text", "You may transfer your ticket to another person up to 24 hours before the event starts. Please contact us to process the name change.")), /* @__PURE__ */ React21.createElement("li", null, /* @__PURE__ */ React21.createElement("strong", null, t("return_policy_rescheduling_label", "Rescheduling:")), " ", t("return_policy_rescheduling_text", "If an event is rescheduled, your ticket will be valid for the new date. If you cannot attend the new date, you may request a refund within 14 days of the announcement."))),
        /* @__PURE__ */ React21.createElement("h2", null, t("return_policy_merch_title", "3. Physical Merchandise")),
        /* @__PURE__ */ React21.createElement("p", null, t("return_policy_merch_text", "For physical items (t-shirts, hoodies, accessories), we accept returns within 30 days of delivery.")),
        /* @__PURE__ */ React21.createElement("ul", null, /* @__PURE__ */ React21.createElement("li", null, t("return_policy_merch_c1", "Items must be unworn, unwashed, and in their original condition.")), /* @__PURE__ */ React21.createElement("li", null, t("return_policy_merch_c2", "You are responsible for return shipping costs unless the item arrived damaged or incorrect.")), /* @__PURE__ */ React21.createElement("li", null, t("return_policy_merch_c3", "Refunds are processed to the original payment method within 5-10 business days after we receive the return."))),
        /* @__PURE__ */ React21.createElement("h2", null, t("return_policy_request_title", "4. How to Request a Refund")),
        /* @__PURE__ */ React21.createElement("p", null, t("return_policy_request_text", "To initiate a return or refund request, please email us at"), " ", /* @__PURE__ */ React21.createElement("strong", null, ARTIST.contact.email), " ", t("return_policy_request_text_2", "with your order number and details of the issue.")),
        /* @__PURE__ */ React21.createElement("div", { className: "mt-12 pt-8 border-t border-white/10 text-sm text-white/50" }, /* @__PURE__ */ React21.createElement("p", null, t("return_policy_last_updated", "Last updated: January 2024")))
      ))));
    };
    ReturnPolicyPage_default = ReturnPolicyPage;
  }
});

// src/pages/TermsPage.tsx
var TermsPage_exports = {};
__export(TermsPage_exports, {
  default: () => TermsPage_default
});
import React22 from "react";
import { Helmet as Helmet7 } from "react-helmet-async";
import { motion as motion20 } from "framer-motion";
import { FileText as FileText2, AlertCircle as AlertCircle5, Scale, Ban, CheckCircle as CheckCircle2 } from "lucide-react";
var TermsPage, TermsPage_default;
var init_TermsPage = __esm({
  "src/pages/TermsPage.tsx"() {
    TermsPage = () => {
      const lastUpdated = "January 2024";
      const sections = [
        {
          icon: CheckCircle2,
          title: "1. Acceptance of Terms",
          content: `By accessing and using this website (djzeneyer.com), you accept and agree to be bound by the
      terms and provisions of this agreement. If you do not agree to these Terms of Use, please do not use
      this website. We reserve the right to modify these terms at any time, and such modifications shall be
      effective immediately upon posting on this website.`
        },
        {
          icon: Scale,
          title: "2. Use License",
          content: `Permission is granted to temporarily access the materials (information or software) on
      DJ Zen Eyer's website for personal, non-commercial transitory viewing only. This is the grant of a
      license, not a transfer of title, and under this license you may not: (a) modify or copy the materials;
      (b) use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
      (c) attempt to decompile or reverse engineer any software contained on DJ Zen Eyer's website; (d) remove
      any copyright or other proprietary notations from the materials; or (e) transfer the materials to another
      person or "mirror" the materials on any other server.`
        },
        {
          icon: AlertCircle5,
          title: "3. Disclaimer",
          content: `The materials on DJ Zen Eyer's website are provided on an 'as is' basis. DJ Zen Eyer makes no
      warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
      limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
      non-infringement of intellectual property or other violation of rights. Further, DJ Zen Eyer does not
      warrant or make any representations concerning the accuracy, likely results, or reliability of the use of
      the materials on its website or otherwise relating to such materials or on any sites linked to this site.`
        },
        {
          icon: Ban,
          title: "4. Limitations",
          content: `In no event shall DJ Zen Eyer or its suppliers be liable for any damages (including, without
      limitation, damages for loss of data or profit, or due to business interruption) arising out of the use
      or inability to use the materials on DJ Zen Eyer's website, even if DJ Zen Eyer or a DJ Zen Eyer authorized
      representative has been notified orally or in writing of the possibility of such damage. Because some
      jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential
      or incidental damages, these limitations may not apply to you.`
        }
      ];
      const additionalTerms = [
        {
          title: "Intellectual Property",
          points: [
            "All content, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of DJ Zen Eyer (Marcelo Eyer Fernandes) or its content suppliers.",
            "The content is protected by Brazilian and international copyright laws.",
            "Unauthorized use of any materials may violate copyright, trademark, and other laws.",
            "You may not reproduce, distribute, display, or create derivative works without express written permission."
          ]
        },
        {
          title: "User Conduct",
          points: [
            "You agree not to use the website for any unlawful purpose or in any way that interrupts, damages, or impairs the service.",
            "You will not attempt to gain unauthorized access to any portion of the website.",
            "You will not use automated systems (bots, scrapers) without permission.",
            "You will not upload or transmit viruses or any other type of malicious code.",
            "You will respect the privacy and rights of other users."
          ]
        },
        {
          title: "Purchases and Payments",
          points: [
            "All purchases are subject to availability and confirmation of payment.",
            "Prices are subject to change without notice.",
            "We reserve the right to refuse or cancel any order.",
            "Payment processing is handled by secure third-party processors.",
            "Refund and cancellation policies are outlined at the time of purchase."
          ]
        },
        {
          title: "User Accounts",
          points: [
            "You are responsible for maintaining the confidentiality of your account credentials.",
            "You agree to accept responsibility for all activities that occur under your account.",
            "You must provide accurate and complete information when creating an account.",
            "We reserve the right to suspend or terminate accounts that violate these terms.",
            "You must notify us immediately of any unauthorized use of your account."
          ]
        },
        {
          title: "Third-Party Links",
          points: [
            "This website may contain links to third-party websites.",
            "DJ Zen Eyer has no control over and assumes no responsibility for third-party content.",
            "The presence of links does not imply endorsement.",
            "You access third-party sites at your own risk.",
            "Please review the terms and privacy policies of any third-party sites."
          ]
        }
      ];
      return /* @__PURE__ */ React22.createElement(React22.Fragment, null, /* @__PURE__ */ React22.createElement(Helmet7, null, /* @__PURE__ */ React22.createElement("title", null, "Terms of Use | DJ Zen Eyer"), /* @__PURE__ */ React22.createElement("meta", { name: "description", content: "Terms of Use for DJ Zen Eyer official website. Read the terms and conditions governing the use of our services." }), /* @__PURE__ */ React22.createElement("meta", { name: "robots", content: "index, follow" })), /* @__PURE__ */ React22.createElement("div", { className: "min-h-screen pt-24 pb-16" }, /* @__PURE__ */ React22.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "text-center mb-12"
        },
        /* @__PURE__ */ React22.createElement("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6" }, /* @__PURE__ */ React22.createElement(FileText2, { size: 40, className: "text-primary" })),
        /* @__PURE__ */ React22.createElement("h1", { className: "text-4xl md:text-5xl font-display font-bold mb-4" }, "Terms of ", /* @__PURE__ */ React22.createElement("span", { className: "text-primary" }, "Use")),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70" }, "Last updated: ", /* @__PURE__ */ React22.createElement("span", { className: "text-primary font-semibold" }, lastUpdated))
      ), /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 },
          className: "card p-8 mb-8 border-l-4 border-primary"
        },
        /* @__PURE__ */ React22.createElement("p", { className: "text-lg text-white/80 leading-relaxed mb-4" }, "Welcome to the official website of DJ Zen Eyer (Marcelo Eyer Fernandes, CNPJ: 44.063.765/0001-46). These Terms of Use govern your access to and use of our website, services, and content."),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70 leading-relaxed" }, "By accessing or using our website, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use our website.")
      ), sections.map((section, index) => /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          key: index,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 + index * 0.1 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React22.createElement("div", { className: "flex items-start gap-4 mb-4" }, /* @__PURE__ */ React22.createElement("div", { className: "flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center" }, /* @__PURE__ */ React22.createElement(section.icon, { size: 24, className: "text-primary" })), /* @__PURE__ */ React22.createElement("h2", { className: "text-2xl font-display font-bold mt-1" }, section.title)),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70 leading-relaxed ml-16" }, section.content)
      )), additionalTerms.map((term, index) => /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          key: index,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.6 + index * 0.1 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React22.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, `${index + 5}. ${term.title}`),
        /* @__PURE__ */ React22.createElement("ul", { className: "space-y-3" }, term.points.map((point, i) => /* @__PURE__ */ React22.createElement("li", { key: i, className: "flex items-start gap-3" }, /* @__PURE__ */ React22.createElement("span", { className: "text-primary mt-1.5" }, "\u2022"), /* @__PURE__ */ React22.createElement("span", { className: "text-white/70 leading-relaxed" }, point))))
      )), /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.1 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React22.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "10. Governing Law"),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70 leading-relaxed mb-4" }, "These Terms of Use shall be governed by and construed in accordance with the laws of Brazil, without regard to its conflict of law provisions. Any legal action or proceeding arising under these terms will be brought exclusively in the courts located in S\xE3o Paulo, Brazil."),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70 leading-relaxed" }, "By using this website, you consent to the jurisdiction and venue of such courts in S\xE3o Paulo, Brazil.")
      ), /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.2 },
          className: "card p-8 mb-6"
        },
        /* @__PURE__ */ React22.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "11. Modifications to Terms"),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70 leading-relaxed" }, "DJ Zen Eyer reserves the right to revise these Terms of Use at any time without prior notice. By continuing to use this website after changes are posted, you agree to be bound by the revised terms. We encourage you to periodically review this page for the latest information on our terms.")
      ), /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.3 },
          className: "card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent"
        },
        /* @__PURE__ */ React22.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "Questions About These Terms?"),
        /* @__PURE__ */ React22.createElement("p", { className: "text-white/70 mb-6" }, "If you have any questions about these Terms of Use, please contact us:"),
        /* @__PURE__ */ React22.createElement("div", { className: "space-y-2 text-white/80" }, /* @__PURE__ */ React22.createElement("p", null, /* @__PURE__ */ React22.createElement("strong", null, "DJ Zen Eyer")), /* @__PURE__ */ React22.createElement("p", null, "Marcelo Eyer Fernandes"), /* @__PURE__ */ React22.createElement("p", null, "CNPJ: 44.063.765/0001-46"), /* @__PURE__ */ React22.createElement("p", null, "S\xE3o Paulo, SP - Brazil"), /* @__PURE__ */ React22.createElement(
          "a",
          {
            href: "mailto:contact@djzeneyer.com",
            className: "text-primary hover:underline inline-block mt-2"
          },
          "contact@djzeneyer.com"
        ))
      ), /* @__PURE__ */ React22.createElement(
        motion20.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.4 },
          className: "text-center text-white/50 text-sm mt-8"
        },
        /* @__PURE__ */ React22.createElement("p", null, "By using this website, you acknowledge that you have read and understood these Terms of Use"),
        /* @__PURE__ */ React22.createElement("p", null, "and agree to be bound by them.")
      ))));
    };
    TermsPage_default = TermsPage;
  }
});

// src/pages/CodeOfConductPage.tsx
var CodeOfConductPage_exports = {};
__export(CodeOfConductPage_exports, {
  default: () => CodeOfConductPage_default
});
import React23 from "react";
import { Helmet as Helmet8 } from "react-helmet-async";
import { motion as motion21 } from "framer-motion";
import { Heart as Heart4, Users as Users9, Shield as Shield5, AlertTriangle, Ban as Ban2, Mail as Mail4 } from "lucide-react";
var CodeOfConductPage, CodeOfConductPage_default;
var init_CodeOfConductPage = __esm({
  "src/pages/CodeOfConductPage.tsx"() {
    CodeOfConductPage = () => {
      const lastUpdated = "January 2024";
      const principles = [
        {
          icon: Heart4,
          title: "Respect & Inclusion",
          description: "Treat everyone with respect, kindness, and empathy. We celebrate diversity and welcome people of all backgrounds, identities, and experiences.",
          examples: [
            "Use inclusive language",
            "Be respectful of different viewpoints",
            "Welcome newcomers warmly",
            "Celebrate our diverse community"
          ]
        },
        {
          icon: Users9,
          title: "Community First",
          description: "We are a community built on the love of Brazilian Zouk and music. Support each other, share knowledge, and help create a positive environment.",
          examples: [
            "Support fellow dancers and artists",
            "Share knowledge and experiences",
            "Contribute positively to discussions",
            "Help maintain a welcoming atmosphere"
          ]
        },
        {
          icon: Shield5,
          title: "Safety & Consent",
          description: "Everyone deserves to feel safe and comfortable. Consent is paramount in all interactions, both online and at events.",
          examples: [
            "Always ask before physical contact",
            "Respect personal boundaries",
            "Speak up if you feel uncomfortable",
            "Report any concerning behavior"
          ]
        }
      ];
      const prohibitedBehavior = [
        {
          title: "Harassment & Discrimination",
          items: [
            "Any form of harassment based on race, ethnicity, gender, sexual orientation, disability, age, religion, or any other protected characteristic",
            "Sexual harassment, unwanted advances, or inappropriate comments",
            "Bullying, intimidation, or threatening behavior",
            "Stalking or unwanted persistent contact"
          ]
        },
        {
          title: "Disruptive Behavior",
          items: [
            "Spam, trolling, or deliberately derailing conversations",
            "Sharing false or misleading information",
            "Promoting hate groups or extremist ideologies",
            "Engaging in illegal activities or promoting illegal content"
          ]
        },
        {
          title: "Privacy Violations",
          items: [
            "Sharing someone's personal information without consent (doxxing)",
            "Recording or photographing people without permission",
            "Sharing private conversations publicly",
            "Impersonating others or creating fake accounts"
          ]
        }
      ];
      const consequences = [
        {
          level: "First Offense (Minor)",
          action: "Warning",
          description: "Verbal or written warning with explanation of the violation"
        },
        {
          level: "Repeated or Serious Offense",
          action: "Temporary Suspension",
          description: "Temporary removal from events, platform, or community spaces"
        },
        {
          level: "Severe or Persistent Violation",
          action: "Permanent Ban",
          description: "Permanent removal from all DJ Zen Eyer events and community spaces"
        }
      ];
      return /* @__PURE__ */ React23.createElement(React23.Fragment, null, /* @__PURE__ */ React23.createElement(Helmet8, null, /* @__PURE__ */ React23.createElement("title", null, "Code of Conduct | DJ Zen Eyer"), /* @__PURE__ */ React23.createElement("meta", { name: "description", content: "Community Code of Conduct for DJ Zen Eyer events and online spaces. Learn about our expectations and standards for respectful behavior." }), /* @__PURE__ */ React23.createElement("meta", { name: "robots", content: "index, follow" })), /* @__PURE__ */ React23.createElement("div", { className: "min-h-screen pt-24 pb-16" }, /* @__PURE__ */ React23.createElement("div", { className: "container mx-auto px-4 max-w-4xl" }, /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6 },
          className: "text-center mb-12"
        },
        /* @__PURE__ */ React23.createElement("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6" }, /* @__PURE__ */ React23.createElement(Heart4, { size: 40, className: "text-primary" })),
        /* @__PURE__ */ React23.createElement("h1", { className: "text-4xl md:text-5xl font-display font-bold mb-4" }, "Code of ", /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "Conduct")),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70" }, "Last updated: ", /* @__PURE__ */ React23.createElement("span", { className: "text-primary font-semibold" }, lastUpdated))
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.1 },
          className: "card p-8 mb-8 border-l-4 border-primary"
        },
        /* @__PURE__ */ React23.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "Our Commitment"),
        /* @__PURE__ */ React23.createElement("p", { className: "text-lg text-white/80 leading-relaxed mb-4" }, "DJ Zen Eyer is committed to creating a welcoming, safe, and inclusive environment for all members of our community. This Code of Conduct applies to all interactions within our community, including events, online platforms, and any spaces associated with DJ Zen Eyer."),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 leading-relaxed" }, "By participating in our community, you agree to abide by this Code of Conduct. We expect all community members to help create a positive environment where everyone feels respected and valued.")
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.2 },
          className: "mb-12"
        },
        /* @__PURE__ */ React23.createElement("h2", { className: "text-3xl font-display font-bold mb-8 text-center" }, "Core Principles"),
        /* @__PURE__ */ React23.createElement("div", { className: "grid md:grid-cols-3 gap-6" }, principles.map((principle, index) => /* @__PURE__ */ React23.createElement(
          motion21.div,
          {
            key: index,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.3 + index * 0.1 },
            className: "card p-6 text-center"
          },
          /* @__PURE__ */ React23.createElement("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4" }, /* @__PURE__ */ React23.createElement(principle.icon, { size: 32, className: "text-primary" })),
          /* @__PURE__ */ React23.createElement("h3", { className: "text-xl font-bold mb-3" }, principle.title),
          /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 mb-4 leading-relaxed" }, principle.description),
          /* @__PURE__ */ React23.createElement("div", { className: "text-left space-y-2" }, principle.examples.map((example, i) => /* @__PURE__ */ React23.createElement("div", { key: i, className: "flex items-start gap-2 text-sm text-white/60" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary mt-0.5" }, "\u2713"), /* @__PURE__ */ React23.createElement("span", null, example))))
        )))
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.6 },
          className: "mb-12"
        },
        /* @__PURE__ */ React23.createElement("div", { className: "flex items-center gap-3 mb-6" }, /* @__PURE__ */ React23.createElement("div", { className: "w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center" }, /* @__PURE__ */ React23.createElement(Ban2, { size: 24, className: "text-red-400" })), /* @__PURE__ */ React23.createElement("h2", { className: "text-3xl font-display font-bold" }, "Prohibited Behavior")),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 mb-6" }, "The following behaviors are strictly prohibited and will result in consequences as outlined below:"),
        /* @__PURE__ */ React23.createElement("div", { className: "space-y-6" }, prohibitedBehavior.map((category, index) => /* @__PURE__ */ React23.createElement(
          motion21.div,
          {
            key: index,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.7 + index * 0.1 },
            className: "card p-6 border-l-4 border-red-500/50"
          },
          /* @__PURE__ */ React23.createElement("h3", { className: "text-xl font-bold mb-4 text-red-400" }, category.title),
          /* @__PURE__ */ React23.createElement("ul", { className: "space-y-2" }, category.items.map((item, i) => /* @__PURE__ */ React23.createElement("li", { key: i, className: "flex items-start gap-3 text-white/70" }, /* @__PURE__ */ React23.createElement("span", { className: "text-red-400 mt-1" }, "\xD7"), /* @__PURE__ */ React23.createElement("span", null, item))))
        )))
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1 },
          className: "card p-8 mb-8 bg-gradient-to-br from-primary/10 to-transparent"
        },
        /* @__PURE__ */ React23.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React23.createElement("div", { className: "w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center" }, /* @__PURE__ */ React23.createElement(AlertTriangle, { size: 24, className: "text-primary" })), /* @__PURE__ */ React23.createElement("h2", { className: "text-2xl font-display font-bold" }, "Reporting Violations")),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 mb-6 leading-relaxed" }, "If you experience or witness behavior that violates this Code of Conduct, please report it immediately. All reports will be treated with confidentiality and seriousness."),
        /* @__PURE__ */ React23.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React23.createElement("div", null, /* @__PURE__ */ React23.createElement("h3", { className: "font-bold text-white mb-2" }, "How to Report:"), /* @__PURE__ */ React23.createElement("ul", { className: "space-y-2 text-white/70" }, /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "At events: Speak to event staff or organizers immediately")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Online: Use the report function on the platform")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Email: ", /* @__PURE__ */ React23.createElement("a", { href: "mailto:conduct@djzeneyer.com", className: "text-primary hover:underline" }, "conduct@djzeneyer.com"))))), /* @__PURE__ */ React23.createElement("div", { className: "border-t border-white/10 pt-4" }, /* @__PURE__ */ React23.createElement("h3", { className: "font-bold text-white mb-2" }, "What Happens After a Report:"), /* @__PURE__ */ React23.createElement("ul", { className: "space-y-2 text-white/70" }, /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "1."), /* @__PURE__ */ React23.createElement("span", null, "We will acknowledge receipt within 24-48 hours")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "2."), /* @__PURE__ */ React23.createElement("span", null, "We will investigate the incident thoroughly and impartially")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "3."), /* @__PURE__ */ React23.createElement("span", null, "We will take appropriate action based on our findings")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "4."), /* @__PURE__ */ React23.createElement("span", null, "We will follow up with you about the outcome (as appropriate)")))))
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.1 },
          className: "mb-8"
        },
        /* @__PURE__ */ React23.createElement("h2", { className: "text-3xl font-display font-bold mb-6" }, "Enforcement & Consequences"),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 mb-6" }, "Violations of this Code of Conduct may result in the following consequences, depending on the severity and frequency of the violation:"),
        /* @__PURE__ */ React23.createElement("div", { className: "space-y-4" }, consequences.map((consequence, index) => /* @__PURE__ */ React23.createElement(
          motion21.div,
          {
            key: index,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 1.2 + index * 0.1 },
            className: "card p-6 flex items-start gap-4"
          },
          /* @__PURE__ */ React23.createElement("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold" }, index + 1),
          /* @__PURE__ */ React23.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React23.createElement("h3", { className: "font-bold text-lg mb-1" }, consequence.level), /* @__PURE__ */ React23.createElement("p", { className: "text-primary font-semibold mb-2" }, consequence.action), /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 text-sm" }, consequence.description))
        )))
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.5 },
          className: "card p-8 mb-8"
        },
        /* @__PURE__ */ React23.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "Scope"),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 leading-relaxed mb-4" }, "This Code of Conduct applies to all spaces managed by DJ Zen Eyer, including but not limited to:"),
        /* @__PURE__ */ React23.createElement("ul", { className: "space-y-2 text-white/70" }, /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Live events and performances")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Online communities and social media groups")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Official website and digital platforms")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Workshops, classes, and educational content")), /* @__PURE__ */ React23.createElement("li", { className: "flex items-start gap-2" }, /* @__PURE__ */ React23.createElement("span", { className: "text-primary" }, "\u2022"), /* @__PURE__ */ React23.createElement("span", null, "Any space representing DJ Zen Eyer")))
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.6 },
          className: "card p-8 text-center"
        },
        /* @__PURE__ */ React23.createElement("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4" }, /* @__PURE__ */ React23.createElement(Mail4, { size: 32, className: "text-primary" })),
        /* @__PURE__ */ React23.createElement("h2", { className: "text-2xl font-display font-bold mb-4" }, "Questions or Concerns?"),
        /* @__PURE__ */ React23.createElement("p", { className: "text-white/70 mb-6" }, "If you have questions about this Code of Conduct or need to report a violation:"),
        /* @__PURE__ */ React23.createElement(
          "a",
          {
            href: "mailto:conduct@djzeneyer.com",
            className: "btn btn-primary btn-lg inline-flex items-center gap-2"
          },
          /* @__PURE__ */ React23.createElement(Mail4, { size: 20 }),
          "Contact Us"
        )
      ), /* @__PURE__ */ React23.createElement(
        motion21.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 1.7 },
          className: "text-center text-white/50 text-sm mt-8 space-y-2"
        },
        /* @__PURE__ */ React23.createElement("p", null, "By participating in our community, you acknowledge that you have read and agree to follow"),
        /* @__PURE__ */ React23.createElement("p", null, "this Code of Conduct and understand the consequences of violations."),
        /* @__PURE__ */ React23.createElement("p", { className: "pt-4 text-white/70" }, "Together, we create a better community. \u{1F499}")
      ))));
    };
    CodeOfConductPage_default = CodeOfConductPage;
  }
});

// src/pages/SupportArtistPage.tsx
var SupportArtistPage_exports = {};
__export(SupportArtistPage_exports, {
  default: () => SupportArtistPage_default
});
import { motion as motion22 } from "framer-motion";
import { useTranslation as useTranslation17 } from "react-i18next";
import { DollarSign, CreditCard as CreditCard2, Banknote, Heart as Heart5, Music as Music6, Globe as Globe6, Building2, CheckCircle2 as CheckCircle22 } from "lucide-react";
var SupportArtistPage, SupportArtistPage_default;
var init_SupportArtistPage = __esm({
  "src/pages/SupportArtistPage.tsx"() {
    init_HeadlessSEO();
    SupportArtistPage = () => {
      const { t, i18n } = useTranslation17();
      const paymentMethods = [
        {
          id: "inter",
          title: t("support.inter.title", "Inter Global Account (Preferred)"),
          description: t("support.inter.description", "US and Brazil bank accounts for international and local payments"),
          icon: Building2,
          priority: 1,
          color: "from-orange-500 to-orange-600",
          accounts: [
            {
              country: t("support.inter.usa", "United States"),
              details: [
                { label: t("support.accountName", "Account Name"), value: "Marcelo Eyer Fernandes" },
                { label: t("support.routingNumber", "Routing Number"), value: "084106768" },
                { label: t("support.accountNumber", "Account Number"), value: "9100169982" },
                { label: t("support.accountType", "Account Type"), value: "Checking" },
                { label: t("support.swiftCode", "SWIFT/BIC"), value: "CINTUS33XXX" }
              ]
            },
            {
              country: t("support.inter.brazil", "Brazil"),
              details: [
                { label: t("support.accountName", "Account Name"), value: "Marcelo Eyer Fernandes" },
                { label: t("support.bank", "Bank"), value: "Banco Inter (077)" },
                { label: t("support.branch", "Branch"), value: "0001" },
                { label: t("support.account", "Account"), value: "94635616-7" },
                { label: t("support.pixKey", "PIX Key"), value: "contato@djzeneyer.com" }
              ]
            }
          ]
        },
        {
          id: "wise",
          title: t("support.wise.title", "Wise (TransferWise)"),
          description: t("support.wise.description", "Low-fee international transfers to multiple currencies"),
          icon: Globe6,
          priority: 2,
          color: "from-green-500 to-green-600",
          link: "https://wise.com",
          email: "contato@djzeneyer.com"
        },
        {
          id: "paypal",
          title: t("support.paypal.title", "PayPal"),
          description: t("support.paypal.description", "Quick and easy payments worldwide"),
          icon: CreditCard2,
          priority: 3,
          color: "from-blue-500 to-blue-600",
          link: "https://paypal.me/djzeneyer",
          email: "contato@djzeneyer.com"
        }
      ];
      const supportReasons = [
        {
          icon: Music6,
          title: t("support.reasons.music.title", "Support New Music"),
          description: t("support.reasons.music.description", "Help produce and release new Brazilian Zouk tracks")
        },
        {
          icon: Heart5,
          title: t("support.reasons.community.title", "Community Growth"),
          description: t("support.reasons.community.description", "Support workshops, events, and educational content")
        },
        {
          icon: Globe6,
          title: t("support.reasons.worldwide.title", "Worldwide Presence"),
          description: t("support.reasons.worldwide.description", "Enable international tours and collaborations")
        }
      ];
      return /* @__PURE__ */ React.createElement("div", { className: "pt-24 pb-16 min-h-screen" }, /* @__PURE__ */ React.createElement(
        HeadlessSEO,
        {
          title: t("support.seo.title", "Support DJ Zen Eyer | Payment Information"),
          description: t("support.seo.description", "Support DJ Zen Eyer through donations or hire for events. Multiple payment methods available worldwide including Inter Global, Wise, and PayPal."),
          keywords: t("support.seo.keywords", "support artist, hire dj, payment methods, international payments, brazilian zouk dj"),
          ogImage: "/images/zen-eyer-og-image.svg"
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement(motion22.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "text-center mb-16" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl md:text-6xl font-black font-display mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent" }, t("support.header.title", "Support the Music")), /* @__PURE__ */ React.createElement("p", { className: "text-xl text-white/70 max-w-3xl mx-auto leading-relaxed" }, t("support.header.description", "Your support helps create new music, educational content, and build the Brazilian Zouk community worldwide. Whether you're hiring for an event or making a donation, every contribution makes a difference."))), /* @__PURE__ */ React.createElement(motion22.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mb-16" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl md:text-3xl font-bold font-display mb-8 text-center" }, t("support.reasons.title", "Why Your Support Matters")), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-6" }, supportReasons.map((reason, index) => /* @__PURE__ */ React.createElement(motion22.div, { key: reason.title, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 + index * 0.1 }, className: "card p-6 text-center hover:border-primary/50 transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(reason.icon, { className: "text-primary", size: 32 })), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold mb-3" }, reason.title), /* @__PURE__ */ React.createElement("p", { className: "text-white/70" }, reason.description))))), /* @__PURE__ */ React.createElement(motion22.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 } }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl md:text-3xl font-bold font-display mb-8 text-center" }, t("support.payment.title", "Payment Methods")), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, paymentMethods.map((method, index) => /* @__PURE__ */ React.createElement(motion22.div, { key: method.id, initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.5 + index * 0.1 }, className: "card overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: `bg-gradient-to-r ${method.color} p-6` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(method.icon, { className: "text-white", size: 24 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-white flex items-center gap-2" }, method.title, method.priority === 1 && /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full" }, t("support.preferred", "Preferred"))), /* @__PURE__ */ React.createElement("p", { className: "text-white/90 text-sm" }, method.description))), /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full" }, /* @__PURE__ */ React.createElement("span", { className: "text-2xl font-bold text-white" }, method.priority)))), /* @__PURE__ */ React.createElement("div", { className: "p-6" }, method.id === "inter" && method.accounts && /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, method.accounts.map((account, accountIndex) => /* @__PURE__ */ React.createElement("div", { key: accountIndex, className: accountIndex > 0 ? "pt-6 border-t border-white/10" : "" }, /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-bold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Globe6, { size: 20, className: "text-primary" }), account.country), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-4" }, account.details.map((detail, detailIndex) => /* @__PURE__ */ React.createElement("div", { key: detailIndex, className: "bg-surface/30 rounded-lg p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-white/50 mb-1" }, detail.label), /* @__PURE__ */ React.createElement("div", { className: "font-mono text-white font-bold" }, detail.value))))))), (method.id === "wise" || method.id === "paypal") && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, method.email && /* @__PURE__ */ React.createElement("div", { className: "bg-surface/30 rounded-lg p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-white/50 mb-1" }, t("support.email", "Email")), /* @__PURE__ */ React.createElement("div", { className: "font-mono text-white font-bold" }, method.email)), method.link && /* @__PURE__ */ React.createElement("a", { href: method.link, target: "_blank", rel: "noopener noreferrer", className: "btn btn-primary w-full justify-center" }, /* @__PURE__ */ React.createElement(DollarSign, { size: 20 }), t("support.sendPayment", "Send Payment via"), " ", method.title))))))), /* @__PURE__ */ React.createElement(motion22.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "mt-16 card p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30" }, /* @__PURE__ */ React.createElement(Banknote, { className: "mx-auto mb-4 text-primary", size: 48 }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold mb-4" }, t("support.business.title", "Event Bookings & Business Inquiries")), /* @__PURE__ */ React.createElement("p", { className: "text-white/70 mb-6 max-w-2xl mx-auto" }, t("support.business.description", "For event bookings, workshop requests, or business collaborations, please send payment details to the email below. Include event details, location, and date for faster processing.")), /* @__PURE__ */ React.createElement("a", { href: "mailto:contato@djzeneyer.com?subject=Event Booking Inquiry", className: "btn btn-primary inline-flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CheckCircle22, { size: 20 }), t("support.business.contact", "Contact for Bookings"))), /* @__PURE__ */ React.createElement(motion22.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1 }, className: "mt-12 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-xl text-white/70 italic" }, t("support.thankYou", "\u2728 Your support keeps the music alive. Thank you! \u2728")))));
    };
    SupportArtistPage_default = SupportArtistPage;
  }
});

// src/pages/TicketsPage.tsx
var TicketsPage_exports = {};
__export(TicketsPage_exports, {
  default: () => TicketsPage_default
});
import React24, { useState as useState14, useEffect as useEffect12 } from "react";
import { Link as Link11 } from "react-router-dom";
import { motion as motion23 } from "framer-motion";
import { useTranslation as useTranslation18 } from "react-i18next";
import { Calendar as Calendar8, MapPin as MapPin5, ArrowRight as ArrowRight4 } from "lucide-react";
var TicketsPage, TicketsPage_default;
var init_TicketsPage = __esm({
  "src/pages/TicketsPage.tsx"() {
    init_HeadlessSEO();
    TicketsPage = () => {
      const { t, i18n } = useTranslation18();
      const currentLang = i18n.language.split("-")[0];
      const isPortuguese = i18n.language.startsWith("pt");
      const [tickets, setTickets] = useState14([]);
      const [loading, setLoading] = useState14(true);
      useEffect12(() => {
        const fetchTickets = async () => {
          setLoading(true);
          const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
          const apiUrl = `${baseUrl}djzeneyer/v1/products?lang=${currentLang}`;
          try {
            const response = await fetch(apiUrl);
            if (response.ok) {
              const data = await response.json();
              setTickets(data);
            }
          } catch (error) {
            console.error("Failed to fetch tickets", error);
          } finally {
            setLoading(false);
          }
        };
        fetchTickets();
      }, [currentLang]);
      const formatPrice = (price) => {
        if (!price) return t("price_free", "Free");
        const numPrice = parseFloat(price);
        const locale = isPortuguese ? "pt-BR" : "en-US";
        return isNaN(numPrice) ? price : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
      };
      return /* @__PURE__ */ React24.createElement(React24.Fragment, null, /* @__PURE__ */ React24.createElement(
        HeadlessSEO,
        {
          title: t("tickets_title", "Tickets & Events"),
          description: t("tickets_desc", "Book your spot for the next Zen Experience."),
          isHomepage: false
        }
      ), /* @__PURE__ */ React24.createElement("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white" }, /* @__PURE__ */ React24.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React24.createElement(
        motion23.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: "text-center mb-16"
        },
        /* @__PURE__ */ React24.createElement("h1", { className: "text-4xl md:text-6xl font-bold mb-6 font-display" }, t("tickets_hero_title", "Upcoming Events")),
        /* @__PURE__ */ React24.createElement("p", { className: "text-xl text-white/60 max-w-2xl mx-auto" }, t("tickets_hero_subtitle", "Secure your access to exclusive workshops, parties and festivals."))
      ), loading ? /* @__PURE__ */ React24.createElement("div", { className: "flex justify-center py-20" }, /* @__PURE__ */ React24.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" })) : /* @__PURE__ */ React24.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, tickets.map((ticket, index) => /* @__PURE__ */ React24.createElement(
        motion23.div,
        {
          key: ticket.id,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.1 },
          className: "bg-surface rounded-xl overflow-hidden border border-white/10 group hover:border-primary/50 transition-colors"
        },
        /* @__PURE__ */ React24.createElement(Link11, { to: isPortuguese ? `/loja/produto/${ticket.slug}` : `/shop/product/${ticket.slug}`, className: "block relative aspect-video overflow-hidden" }, /* @__PURE__ */ React24.createElement(
          "img",
          {
            src: ticket.images[0]?.src || "https://placehold.co/600x400/1a1a1a/ffffff?text=Event",
            alt: ticket.name,
            className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          }
        ), /* @__PURE__ */ React24.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" }), /* @__PURE__ */ React24.createElement("div", { className: "absolute bottom-4 left-4 right-4" }, /* @__PURE__ */ React24.createElement("h3", { className: "text-2xl font-bold font-display leading-tight mb-2" }, ticket.name), /* @__PURE__ */ React24.createElement("div", { className: "flex items-center gap-4 text-sm text-white/80" }, /* @__PURE__ */ React24.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React24.createElement(Calendar8, { size: 14 }), " TBD"), /* @__PURE__ */ React24.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React24.createElement(MapPin5, { size: 14 }), " Online/TBD")))),
        /* @__PURE__ */ React24.createElement("div", { className: "p-6" }, /* @__PURE__ */ React24.createElement("p", { className: "text-white/60 line-clamp-2 mb-6 text-sm" }, ticket.short_description?.replace(/<[^>]*>/g, "") || t("event_desc_fallback", "Join us for an unforgettable experience.")), /* @__PURE__ */ React24.createElement("div", { className: "flex items-center justify-between mt-auto" }, /* @__PURE__ */ React24.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React24.createElement("span", { className: "text-xs text-white/40 uppercase tracking-wider" }, t("ticket_starting_at", "Starting at")), /* @__PURE__ */ React24.createElement("span", { className: "text-xl font-bold text-primary" }, formatPrice(ticket.price))), /* @__PURE__ */ React24.createElement(
          Link11,
          {
            to: isPortuguese ? `/loja/produto/${ticket.slug}` : `/shop/product/${ticket.slug}`,
            className: "btn btn-outline btn-sm rounded-full flex items-center gap-2"
          },
          t("tickets_details", "Details"),
          " ",
          /* @__PURE__ */ React24.createElement(ArrowRight4, { size: 16 })
        )))
      ))))));
    };
    TicketsPage_default = TicketsPage;
  }
});

// src/pages/TicketsCheckoutPage.tsx
var TicketsCheckoutPage_exports = {};
__export(TicketsCheckoutPage_exports, {
  default: () => TicketsCheckoutPage_default
});
import React25 from "react";
import { useTranslation as useTranslation19 } from "react-i18next";
var TicketsCheckoutPage, TicketsCheckoutPage_default;
var init_TicketsCheckoutPage = __esm({
  "src/pages/TicketsCheckoutPage.tsx"() {
    init_CheckoutPage();
    init_HeadlessSEO();
    TicketsCheckoutPage = () => {
      const { t } = useTranslation19();
      return /* @__PURE__ */ React25.createElement(React25.Fragment, null, /* @__PURE__ */ React25.createElement(
        HeadlessSEO,
        {
          title: t("tickets_checkout_title", "Secure Checkout - Tickets"),
          description: t("checkout_desc", "Complete your ticket purchase."),
          isHomepage: false
        }
      ), /* @__PURE__ */ React25.createElement(CheckoutPage_default, null));
    };
    TicketsCheckoutPage_default = TicketsCheckoutPage;
  }
});

// src/pages/NotFoundPage.tsx
var NotFoundPage_exports = {};
__export(NotFoundPage_exports, {
  default: () => NotFoundPage_default
});
import React26 from "react";
import { Link as Link12 } from "react-router-dom";
import { Home, Music as Music7, Calendar as Calendar9, Users as Users10 } from "lucide-react";
var NotFoundPage, NotFoundPage_default;
var init_NotFoundPage = __esm({
  "src/pages/NotFoundPage.tsx"() {
    NotFoundPage = () => {
      return /* @__PURE__ */ React26.createElement("div", { className: "min-h-screen pt-24 flex items-center justify-center" }, /* @__PURE__ */ React26.createElement("div", { className: "container mx-auto px-4 py-12 text-center" }, /* @__PURE__ */ React26.createElement("div", { className: "max-w-xl mx-auto" }, /* @__PURE__ */ React26.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React26.createElement("div", { className: "inline-block p-6 rounded-full bg-primary/10" }, /* @__PURE__ */ React26.createElement(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "64",
          height: "64",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "text-primary"
        },
        /* @__PURE__ */ React26.createElement("path", { d: "M9.1 4c-.5 0-.4.5-.4.5 0 .3.4.5.4.5l13.4 8c.4.3.6.8.3 1.1-.1.2-.3.3-.3.3l-13.1 8s-.7.5-1.2.2c-.5-.3-.5-.8-.5-.8V5.3s-.4-1.3.9-1.3h.5Z" }),
        /* @__PURE__ */ React26.createElement("path", { d: "M6.1 4c-.5 0-.4.5-.4.5 0 .3.4.5.4.5l13.4 8c.4.3.6.8.3 1.1-.1.2-.3.3-.3.3l-13.1 8s-.7.5-1.2.2c-.5-.3-.5-.8-.5-.8V5.3s-.4-1.3.9-1.3h.5Z", opacity: ".5" })
      ))), /* @__PURE__ */ React26.createElement("h1", { className: "text-5xl md:text-6xl font-bold mb-6 font-display" }, "404"), /* @__PURE__ */ React26.createElement("h2", { className: "text-2xl md:text-3xl font-bold mb-4 font-display" }, "Beat Not Found"), /* @__PURE__ */ React26.createElement("p", { className: "text-xl text-white/70 mb-8" }, "The track you're looking for seems to have been remixed or moved to another frequency."), /* @__PURE__ */ React26.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" }, /* @__PURE__ */ React26.createElement(
        Link12,
        {
          to: "/",
          className: "card p-4 text-center hover:bg-white/5 transition-colors"
        },
        /* @__PURE__ */ React26.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React26.createElement(Home, { className: "text-primary mb-2", size: 24 }), /* @__PURE__ */ React26.createElement("span", null, "Home"))
      ), /* @__PURE__ */ React26.createElement(
        Link12,
        {
          to: "/music/",
          className: "card p-4 text-center hover:bg-white/5 transition-colors"
        },
        /* @__PURE__ */ React26.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React26.createElement(Music7, { className: "text-secondary mb-2", size: 24 }), /* @__PURE__ */ React26.createElement("span", null, "Music"))
      ), /* @__PURE__ */ React26.createElement(
        Link12,
        {
          to: "/events/",
          className: "card p-4 text-center hover:bg-white/5 transition-colors"
        },
        /* @__PURE__ */ React26.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React26.createElement(Calendar9, { className: "text-accent mb-2", size: 24 }), /* @__PURE__ */ React26.createElement("span", null, "Events"))
      ), /* @__PURE__ */ React26.createElement(
        Link12,
        {
          to: "/tribe/",
          className: "card p-4 text-center hover:bg-white/5 transition-colors"
        },
        /* @__PURE__ */ React26.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React26.createElement(Users10, { className: "text-success mb-2", size: 24 }), /* @__PURE__ */ React26.createElement("span", null, "Zen Tribe"))
      )), /* @__PURE__ */ React26.createElement(Link12, { to: "/", className: "btn btn-primary px-8 py-3" }, "Back to Homepage"))));
    };
    NotFoundPage_default = NotFoundPage;
  }
});

// src/config/routes.ts
import { lazy } from "react";
var normalizeLanguage, AboutPage2, EventsPage2, MusicPage2, ZenTribePage2, PressKitPage2, ShopPage2, ProductPage2, CartPage2, CheckoutPage2, DashboardPage2, MyAccountPage2, FAQPage2, PhilosophyPage2, NewsPage2, MediaPage2, PrivacyPolicyPage2, ReturnPolicyPage2, TermsPage2, CodeOfConductPage2, SupportArtistPage2, TicketsPage2, TicketsCheckoutPage2, NotFoundPage2, ROUTES_CONFIG, NOT_FOUND_COMPONENT, getLocalizedPaths, getLanguagePrefix, buildFullPath, getRoutesForLanguage, findRouteByPath, getAlternateLinks;
var init_routes = __esm({
  "src/config/routes.ts"() {
    init_HomePage();
    normalizeLanguage = (lang) => {
      const normalized = lang.trim().toLowerCase();
      return normalized.startsWith("pt") ? "pt" : "en";
    };
    AboutPage2 = lazy(() => Promise.resolve().then(() => (init_AboutPage(), AboutPage_exports)));
    EventsPage2 = lazy(() => Promise.resolve().then(() => (init_EventsPage(), EventsPage_exports)));
    MusicPage2 = lazy(() => Promise.resolve().then(() => (init_MusicPage(), MusicPage_exports)));
    ZenTribePage2 = lazy(() => Promise.resolve().then(() => (init_ZenTribePage(), ZenTribePage_exports)));
    PressKitPage2 = lazy(() => Promise.resolve().then(() => (init_PressKitPage(), PressKitPage_exports)));
    ShopPage2 = lazy(() => Promise.resolve().then(() => (init_ShopPage(), ShopPage_exports)));
    ProductPage2 = lazy(() => Promise.resolve().then(() => (init_ProductPage(), ProductPage_exports)));
    CartPage2 = lazy(() => Promise.resolve().then(() => (init_CartPage(), CartPage_exports)));
    CheckoutPage2 = lazy(() => Promise.resolve().then(() => (init_CheckoutPage(), CheckoutPage_exports)));
    DashboardPage2 = lazy(() => Promise.resolve().then(() => (init_DashboardPage(), DashboardPage_exports)));
    MyAccountPage2 = lazy(() => Promise.resolve().then(() => (init_MyAccountPage(), MyAccountPage_exports)));
    FAQPage2 = lazy(() => Promise.resolve().then(() => (init_FAQPage(), FAQPage_exports)));
    PhilosophyPage2 = lazy(() => Promise.resolve().then(() => (init_PhilosophyPage(), PhilosophyPage_exports)));
    NewsPage2 = lazy(() => Promise.resolve().then(() => (init_NewsPage(), NewsPage_exports)));
    MediaPage2 = lazy(() => Promise.resolve().then(() => (init_MediaPage(), MediaPage_exports)));
    PrivacyPolicyPage2 = lazy(() => Promise.resolve().then(() => (init_PrivacyPolicyPage(), PrivacyPolicyPage_exports)));
    ReturnPolicyPage2 = lazy(() => Promise.resolve().then(() => (init_ReturnPolicyPage(), ReturnPolicyPage_exports)));
    TermsPage2 = lazy(() => Promise.resolve().then(() => (init_TermsPage(), TermsPage_exports)));
    CodeOfConductPage2 = lazy(() => Promise.resolve().then(() => (init_CodeOfConductPage(), CodeOfConductPage_exports)));
    SupportArtistPage2 = lazy(() => Promise.resolve().then(() => (init_SupportArtistPage(), SupportArtistPage_exports)));
    TicketsPage2 = lazy(() => Promise.resolve().then(() => (init_TicketsPage(), TicketsPage_exports)));
    TicketsCheckoutPage2 = lazy(() => Promise.resolve().then(() => (init_TicketsCheckoutPage(), TicketsCheckoutPage_exports)));
    NotFoundPage2 = lazy(() => Promise.resolve().then(() => (init_NotFoundPage(), NotFoundPage_exports)));
    ROUTES_CONFIG = [
      // Home (Index)
      {
        component: HomePage_default,
        paths: { en: "", pt: "" },
        isIndex: true
      },
      // About
      {
        component: AboutPage2,
        paths: { en: "about", pt: "sobre" }
      },
      // Events (com rota dinâmica :id)
      {
        component: EventsPage2,
        paths: { en: "events", pt: "eventos" }
      },
      {
        component: EventsPage2,
        paths: { en: "events/:id", pt: "eventos/:id" }
      },
      // Music (com rota dinâmica :slug)
      {
        component: MusicPage2,
        paths: { en: "music", pt: "musica" }
      },
      {
        component: MusicPage2,
        paths: { en: "music/:slug", pt: "musica/:slug" }
      },
      // News / Blog
      {
        component: NewsPage2,
        paths: { en: "news", pt: "noticias" }
      },
      {
        component: NewsPage2,
        paths: { en: "news/:slug", pt: "noticias/:slug" }
      },
      // Zen Tribe (múltiplos aliases)
      {
        component: ZenTribePage2,
        paths: { en: ["zentribe", "tribe", "zen-tribe"], pt: ["tribo-zen", "tribo"] }
      },
      // Press Kit / Work With Me
      {
        component: PressKitPage2,
        paths: { en: "work-with-me", pt: "trabalhe-comigo" }
      },
      // Shop (com wildcard para subrotas)
      {
        component: ProductPage2,
        paths: { en: "shop/product/:slug", pt: "loja/produto/:slug" }
      },
      {
        component: ShopPage2,
        paths: { en: "shop", pt: "loja" },
        hasWildcard: true
      },
      // Cart / Carrinho
      {
        component: CartPage2,
        paths: { en: "cart", pt: "carrinho" }
      },
      // Checkout / Finalizar Compra
      {
        component: CheckoutPage2,
        paths: { en: "checkout", pt: "finalizar-compra" }
      },
      // Tickets / Compra de Ingressos
      {
        component: TicketsPage2,
        paths: { en: "tickets", pt: "ingressos" }
      },
      // Tickets Checkout / Finalizar Ingressos
      {
        component: TicketsCheckoutPage2,
        paths: { en: "tickets-checkout", pt: "finalizar-ingressos" }
      },
      // Dashboard
      {
        component: DashboardPage2,
        paths: { en: "dashboard", pt: "painel" }
      },
      // My Account
      {
        component: MyAccountPage2,
        paths: { en: "my-account", pt: "minha-conta" }
      },
      // FAQ
      {
        component: FAQPage2,
        paths: { en: "faq", pt: "perguntas-frequentes" }
      },
      // Philosophy
      {
        component: PhilosophyPage2,
        paths: { en: "my-philosophy", pt: "minha-filosofia" }
      },
      // Media / Press
      {
        component: MediaPage2,
        paths: { en: "media", pt: "na-midia" }
      },
      // Support the Artist / Apoie o Artista
      {
        component: SupportArtistPage2,
        paths: { en: "support-the-artist", pt: "apoie-o-artista" }
      },
      // Privacy Policy / Política de Privacidade
      {
        component: PrivacyPolicyPage2,
        paths: { en: "privacy-policy", pt: "politica-de-privacidade" }
      },
      // Return Policy / Reembolso
      {
        component: ReturnPolicyPage2,
        paths: { en: "return-policy", pt: "reembolso" }
      },
      // Terms of Use / Termos
      {
        component: TermsPage2,
        paths: { en: "terms", pt: "termos" }
      },
      // Code of Conduct / Regras de Conduta
      {
        component: CodeOfConductPage2,
        paths: { en: "conduct", pt: "regras-de-conduta" }
      }
    ];
    NOT_FOUND_COMPONENT = NotFoundPage2;
    getLocalizedPaths = (routeConfig, lang) => {
      const paths = routeConfig.paths[lang];
      return Array.isArray(paths) ? paths : [paths];
    };
    getLanguagePrefix = (lang) => {
      return lang === "pt" ? "/pt" : "/";
    };
    buildFullPath = (path, lang) => {
      const prefix = getLanguagePrefix(lang);
      if (!path) return prefix;
      return prefix === "/" ? `/${path}` : `${prefix}/${path}`;
    };
    getRoutesForLanguage = (lang) => {
      return ROUTES_CONFIG.flatMap((route) => {
        const paths = getLocalizedPaths(route, lang);
        return paths.map((path) => ({
          component: route.component,
          path,
          isIndex: route.isIndex,
          hasWildcard: route.hasWildcard
        }));
      });
    };
    findRouteByPath = (path, lang) => {
      return ROUTES_CONFIG.find((route) => {
        const paths = getLocalizedPaths(route, lang);
        return paths.some((p) => {
          const fullPath = buildFullPath(p, lang);
          return fullPath === path || path.startsWith(fullPath + "/");
        });
      });
    };
    getAlternateLinks = (currentPath, currentLang) => {
      const alternates = {};
      if (!currentPath || currentPath === "/") {
        return { en: "/", pt: "/" };
      }
      const cleanPath = currentPath.startsWith("/") ? currentPath.slice(1) : currentPath;
      for (const route of ROUTES_CONFIG) {
        const paths = getLocalizedPaths(route, "en");
        const enPath = Array.isArray(paths) ? paths[0] : paths;
        const pathsPt = getLocalizedPaths(route, "pt");
        const ptPath = Array.isArray(pathsPt) ? pathsPt[0] : pathsPt;
        if (cleanPath === enPath || cleanPath.startsWith(enPath + "/")) {
          alternates.en = `/${enPath}`;
          alternates.pt = `/${ptPath}`;
          return alternates;
        }
        if (cleanPath === ptPath || cleanPath.startsWith(ptPath + "/")) {
          alternates.en = `/${enPath}`;
          alternates.pt = `/${ptPath}`;
          return alternates;
        }
      }
      return { en: currentPath, pt: currentPath };
    };
  }
});
init_routes();
export {
  NOT_FOUND_COMPONENT,
  ROUTES_CONFIG,
  buildFullPath,
  findRouteByPath,
  getAlternateLinks,
  getLanguagePrefix,
  getLocalizedPaths,
  getRoutesForLanguage,
  normalizeLanguage
};
