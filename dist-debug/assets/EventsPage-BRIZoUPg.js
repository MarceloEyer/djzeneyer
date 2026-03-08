import { j as jsxRuntimeExports } from "./motion-CwY3TCXX.js";
import { r as reactExports, e as useParams, R as React, L as Link, f as generatePath } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, l as safeUrl, m as Music, C as Calendar, n as normalizeLanguage, i as getLocalizedRoute, o as useEventById, H as HeadlessSEO, A as ARTIST, s as sanitizeHtml, e as MapPin, p as useEventsQuery } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { T as Toast } from "./Toast-B8UHSRxp.js";
import { A as ArrowLeft } from "./arrow-left-Bbmrj-yL.js";
import { S as Share2 } from "./share-2-H61oQa6n.js";
import "./circle-check-big-BWROkmEK.js";
const __iconNode = [
  ["path", { d: "M16 19h6", key: "xwg31i" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M19 16v6", key: "tddt3s" }],
  ["path", { d: "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5", key: "1glfrc" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }]
];
const CalendarPlus = createLucideIcon("calendar-plus", __iconNode);
const AddCalendarMenu = ({ event, variant = "primary", className = "" }) => {
  const { t } = useTranslation();
  const getDetails = () => {
    try {
      const title = event.title ? event.title.replace(/<\/?[^>]+(>|$)/g, "") : "DJ Zen Eyer Event";
      const rawDate = event.starts_at || "";
      const dateObj = new Date(rawDate);
      if (!rawDate || isNaN(dateObj.getTime())) {
        return null;
      }
      const formatICS = (d) => {
        if (isNaN(d.getTime())) throw new Error("Invalid Date");
        return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      };
      const start = formatICS(dateObj);
      const endDate = new Date(dateObj.getTime() + 4 * 60 * 60 * 1e3);
      const end = formatICS(endDate);
      const loc = event.location;
      const location = loc.venue ? `${loc.venue}, ${loc.city}` : loc.city || "TBA";
      const eventUrl = `${window.location.origin}${window.location.pathname}`;
      const details2 = `${t("events_view_details")}: ${eventUrl}`;
      return { title, start, end, location, details: details2 };
    } catch (error) {
      console.error("[AddCalendarMenu] Error processing date:", error, event);
      return null;
    }
  };
  const details = getDetails();
  if (!details) return null;
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.title)}&dates=${details.start}/${details.end}&details=${encodeURIComponent(details.details)}&location=${encodeURIComponent(details.location)}`;
  if (variant === "primary") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => window.open(googleUrl, "_blank"),
        className: `btn btn-outline border-primary/30 text-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-primary/10 transition-all ${className}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { size: 20 }),
          t("events_add_google")
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: () => window.open(googleUrl, "_blank"),
      className: `w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all ${className}`,
      title: t("events_add_google"),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { size: 16 })
    }
  );
};
const EventMedia = ({
  image,
  title,
  date,
  venue,
  className = ""
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("pt") ? "pt-BR" : "en-US";
  const formattedDate = date ? new Date(date).toLocaleDateString(lang, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "";
  const renderFallback = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full bg-surface relative flex flex-col items-center justify-center p-8 text-center overflow-hidden border border-white/10 rounded-[2.5rem]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "absolute -right-10 -bottom-10 w-64 h-64 rotate-12 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "absolute -left-10 -top-10 w-48 h-48 -rotate-12 text-secondary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-4 px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1 bg-primary mx-auto mb-6 rounded-full opacity-50" }),
      title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl md:text-5xl font-black uppercase tracking-tighter font-display text-white leading-[0.9] break-words drop-shadow-lg", dangerouslySetInnerHTML: { __html: title } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        formattedDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-bold uppercase tracking-[0.2em] text-sm", children: formattedDate }),
        venue && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 uppercase tracking-widest text-xs", children: venue })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ${className}`, children: image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: safeUrl(image),
      className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
      alt: title,
      onError: (e) => {
        e.target.style.display = "none";
        e.target.parentElement?.classList.add("bg-surface");
      }
    }
  ) : renderFallback() });
};
const EventSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-32 bg-surface/50 border border-white/5 rounded-2xl animate-pulse flex items-center gap-6 px-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-white/5 rounded-full" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-white/5 rounded w-1/4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-white/5 rounded w-1/2" })
  ] })
] }, i)) });
const EventDetailSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-8 animate-pulse", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-32 bg-white/5 rounded-lg mb-8" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl aspect-[4/5] bg-white/5 border border-white/10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-3/4 bg-white/5 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-1/2 bg-white/5 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-1/2 bg-white/5 rounded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 w-full bg-white/5 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-full bg-white/5 rounded-xl" })
    ] })
  ] })
] });
const EventDetailContent = ({ id, lang }) => {
  const { t } = useTranslation();
  const { data: event } = useEventById(id, { suspense: true });
  const [showToast, setShowToast] = reactExports.useState(false);
  if (!event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto py-20 text-center animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 40 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black mb-4 uppercase tracking-tighter", children: t("events_not_found") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mb-8 max-w-md mx-auto", children: t("events_not_found_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("events", lang), className: "btn btn-outline border-white/10 px-8 py-3 rounded-xl font-bold uppercase transition-all hover:bg-white/5 inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }),
        " ",
        t("events_back")
      ] })
    ] });
  }
  const share = () => {
    const canonical = event.canonical_url || `${window.location.origin}${getLocalizedRoute("events", lang)}/${event.event_id || ""}`;
    if (navigator.share) {
      navigator.share({ title: event.title, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };
  const rawDate = event.starts_at || event.datetime || "";
  const eventDate = new Date(rawDate);
  const isValidDate = !isNaN(eventDate.getTime());
  const loc = event.location ?? {
    venue: event.venue?.name ?? "",
    city: event.venue?.city ?? ""
  };
  const origin = typeof window !== "undefined" ? window.location.origin : ARTIST.site.baseUrl;
  const eventImage = safeUrl(event.image, "/images/zen-eyer-og-image.png");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: `${event.title} | ${t("nav.events")}`,
        description: event.description.substring(0, 160),
        url: `${origin}${generatePath(getLocalizedRoute("events-detail", lang), { id })}`,
        image: eventImage,
        type: "event",
        events: [{ ...event, image: eventImage }]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getLocalizedRoute("events", lang), className: "flex items-center gap-2 text-primary mb-8 font-extrabold uppercase tracking-widest text-sm hover:text-white transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }),
      " ",
      t("events_back")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EventMedia,
        {
          image: event.image,
          title: event.title,
          date: rawDate,
          venue: loc.venue
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-px bg-primary/30" }),
          isValidDate ? eventDate.toLocaleDateString(lang, { month: "long", year: "numeric" }) : t("tba")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-white leading-[0.9]", dangerouslySetInnerHTML: { __html: sanitizeHtml(event.title) } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-white/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: isValidDate ? eventDate.toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" }) : t("tba") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-white/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
              loc.venue,
              loc.city ? `, ${loc.city}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-invert mb-10 text-white/60 leading-relaxed text-lg", dangerouslySetInnerHTML: { __html: sanitizeHtml(event.description || event.content || "") } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AddCalendarMenu, { event, variant: "primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: share, className: "btn btn-outline border-white/10 w-full py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/50 hover:text-white font-bold uppercase tracking-widest text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 18 }),
              " ",
              t("share")
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toast,
      {
        message: t("link_copied"),
        isVisible: showToast,
        onClose: () => setShowToast(false)
      }
    )
  ] });
};
const EventListContent = ({ lang }) => {
  const { t } = useTranslation();
  const origin = typeof window !== "undefined" ? window.location.origin : ARTIST.site.baseUrl;
  const { data: events = [] } = useEventsQuery({
    mode: "upcoming",
    days: 365,
    limit: 50,
    lang
  }, { suspense: true });
  const [selectedRegion, setSelectedRegion] = reactExports.useState("all");
  const [showToast, setShowToast] = reactExports.useState(false);
  const regions = reactExports.useMemo(() => {
    const r = /* @__PURE__ */ new Set();
    events.forEach((e) => {
      if (e.location?.region) r.add(e.location.region);
    });
    return Array.from(r).sort();
  }, [events]);
  const filteredEvents = reactExports.useMemo(() => {
    if (selectedRegion === "all") return events;
    return events.filter((e) => e.location?.region === selectedRegion);
  }, [events, selectedRegion]);
  const groupedEvents = reactExports.useMemo(() => {
    const groups = {};
    filteredEvents.forEach((e) => {
      const date = new Date(e.starts_at);
      if (isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredEvents]);
  const share = (e) => {
    const canonical = e.canonical_url || `${window.location.origin}${getLocalizedRoute("events", lang)}/${e.event_id}`;
    if (navigator.share) {
      navigator.share({ title: e.title, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };
  if (events.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 bg-surface/30 rounded-3xl border border-white/5 animate-in fade-in duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40", children: t("events_no_results") }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("events_page_title"),
        description: t("events_page_meta_desc"),
        url: `${origin}${getLocalizedRoute("events", lang)}`,
        events: events.map((event) => ({
          ...event,
          image: event.image || "/images/zen-eyer-og-image.png"
        }))
      }
    ),
    regions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-2 mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedRegion("all"),
          className: `px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${selectedRegion === "all" ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`,
          children: t("common.all")
        }
      ),
      regions.map((region) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedRegion(region),
          className: `px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${selectedRegion === region ? "bg-primary text-black border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`,
          children: region
        },
        region
      ))
    ] }),
    filteredEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 bg-surface/30 rounded-3xl border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40", children: t("events_no_results_filter") }) }) : groupedEvents.map(([key, monthEvents]) => {
      const [y, m] = key.split("-");
      const MONTH_NAMES = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthShort = MONTH_NAMES[Number(m) - 1];
      const name = t(`events_month_${monthShort}`);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-4", children: [
          name,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60 drop-shadow-sm", children: y }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-white/5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: monthEvents.map((e) => {
          const eventDay = new Date(e.starts_at);
          const identifier = e.canonical_path ? e.canonical_path.split("/").pop() || e.event_id : e.event_id;
          const detailHref = generatePath(getLocalizedRoute("events-detail", lang), { id: identifier });
          const loc = e.location;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4 p-6 bg-surface/30 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black min-w-[50px]", children: String(eventDay.getDate()).padStart(2, "0") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                " ",
                loc.city,
                loc.region ? `, ${loc.region}` : "",
                loc.country ? ` (${loc.country})` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: detailHref, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold uppercase group-hover:text-primary transition-colors", dangerouslySetInnerHTML: { __html: sanitizeHtml(e.title) } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AddCalendarMenu, { event: e, variant: "ghost" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => share(e), className: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 16 }) })
            ] })
          ] }, e.event_id);
        }) })
      ] }, key);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toast,
      {
        message: t("link_copied"),
        isVisible: showToast,
        onClose: () => setShowToast(false)
      }
    )
  ] });
};
const EventsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.language);
  if (id) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pt-24 pb-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailContent, { id, lang }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pt-24 pb-20 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "text-center mb-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-black mb-4 font-display uppercase text-white tracking-tighter", children: [
      t("events.title_part1"),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: t("events.title_part2") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(EventSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventListContent, { lang }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-40 p-12 md:p-24 text-center bg-surface border border-white/5 rounded-[3rem] relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/images/artist/dj-zen-eyer-club-performance.jpg",
          alt: "",
          className: "w-full h-full object-cover grayscale"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "absolute -right-16 -bottom-16 text-white/5 w-96 h-96 rotate-12 relative z-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter", children: t("home_press_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("booking", lang), className: "btn btn-primary px-10 py-4 rounded-xl font-bold uppercase", children: t("contact") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("presskit", lang), className: "btn btn-outline border-white/10 px-10 py-4 rounded-xl font-bold uppercase", children: t("press_kit") })
      ] })
    ] })
  ] }) });
};
const EventsPage_default = reactExports.memo(EventsPage);
export {
  EventsPage_default as default
};
//# sourceMappingURL=EventsPage-BRIZoUPg.js.map
