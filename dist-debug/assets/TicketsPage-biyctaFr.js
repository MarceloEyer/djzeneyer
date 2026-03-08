import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { H as HeadlessSEO, l as safeUrl, C as Calendar, e as MapPin, i as getLocalizedRoute, s as sanitizeHtml } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { A as ArrowRight } from "./arrow-right-DAPyJrnT.js";
const TicketsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0];
  const isPortuguese = i18n.language.startsWith("pt");
  const [tickets, setTickets] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
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
    if (!price) return t("price_free");
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? "pt-BR" : "en-US";
    return isNaN(numPrice) ? price : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("common.checkout.tickets_title"),
        description: t("common.checkout.description"),
        isHomepage: false
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: "text-center mb-16",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6 font-display", children: t("events_title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/60 max-w-2xl mx-auto", children: t("events_subtitle") })
          ]
        }
      ),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: tickets.map((ticket, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.1 },
          className: "bg-surface rounded-xl overflow-hidden border border-white/10 group hover:border-primary/50 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute(`/shop/product/${ticket.slug}`, i18n.language), className: "block relative aspect-video overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: safeUrl(ticket.images[0]?.src, "https://placehold.co/600x400/1a1a1a/ffffff?text=Event"),
                  alt: ticket.name,
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-4 right-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold font-display leading-tight mb-2", children: ticket.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-white/80", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
                    " TBD"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
                    " Online/TBD"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 line-clamp-2 mb-6 text-sm", children: sanitizeHtml(ticket.short_description).replace(/<[^>]*>/g, "") || t("event_desc_fallback") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40 uppercase tracking-wider", children: t("shop.starting_at") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-primary", children: formatPrice(ticket.price) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: getLocalizedRoute(`/shop/product/${ticket.slug}`, i18n.language),
                    className: "btn btn-outline btn-sm rounded-full flex items-center gap-2",
                    children: [
                      t("nav.about"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        ticket.id
      )) })
    ] }) })
  ] });
};
export {
  TicketsPage as default
};
//# sourceMappingURL=TicketsPage-biyctaFr.js.map
