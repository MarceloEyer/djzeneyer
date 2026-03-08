import { j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./motion-CwY3TCXX.js";
import { r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, v as useShopPageQuery, w as useAddToCartMutation, x as Helmet, l as safeUrl, s as sanitizeHtml, y as Info, z as ChevronRight } from "./index-Cac5tBAe.js";
import { T as Toast } from "./Toast-B8UHSRxp.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { L as LoaderCircle } from "./loader-circle-DTVp4yA4.js";
import { S as Shield } from "./shield-XNTU4cFV.js";
import { G as Gift } from "./gift-IUjGOuBb.js";
import { Z as Zap } from "./zap-BXTxIMT0.js";
import { P as Play } from "./play-CjRq6fsI.js";
import "./circle-check-big-BWROkmEK.js";
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const PagingIndicator = ({ count, active }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 ml-4 self-center h-0.5", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: `h-full w-4 rounded-full transition-all duration-300 ${i === active ? "bg-primary w-8" : "bg-white/20"}`
  },
  i
)) });
const ShopHero = reactExports.memo(({ product, onAddToCart, isAddingToCart, productBasePath }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[80vh] w-full group overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: safeUrl(product.images[0]?.sizes?.large || product.images[0]?.sizes?.medium_large || product.images[0]?.src, "https://placehold.co/1200x675/0D96FF/FFFFFF"),
          alt: product.name,
          className: "w-full h-full object-cover",
          loading: "eager",
          fetchPriority: "high"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#141414] to-transparent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-20 pb-32 md:pb-48", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8 },
        className: "max-w-3xl space-y-4 md:space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(13,150,255,0.5)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-black tracking-tighter text-xs md:text-sm uppercase flex items-center gap-2 bg-black/35 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm", children: [
              "DJ ZEN EYER ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: t("badge_featured") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display text-white leading-[0.92] drop-shadow-2xl max-w-4xl text-balance", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: t("shop.match_score") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: "2024" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border border-white/40 px-2 py-1 text-[11px] md:text-xs text-white/85 rounded-full bg-black/35", children: t("shop.cremosidade_level") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: "HD" })
          ] }),
          product.short_description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-lg md:text-xl text-white/80 line-clamp-3 md:line-clamp-2 drop-shadow-lg max-w-2xl font-light leading-relaxed",
              dangerouslySetInnerHTML: { __html: sanitizeHtml(product.short_description) }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 md:gap-4 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => onAddToCart(product.id),
                className: "flex items-center gap-2 bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg hover:bg-white/90 transition-colors shadow-xl",
                disabled: isAddingToCart,
                children: [
                  isAddingToCart ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "fill-black", size: 24 }),
                  t("shop.buy_now")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: `${productBasePath}/${product.slug}`,
                className: "flex items-center gap-2 bg-white/20 text-white px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg backdrop-blur-md hover:bg-white/30 transition-colors border border-white/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 24 }),
                  t("shop.product_details")
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] });
});
const ProductCard = reactExports.memo(({ product, formatPrice, onAddToCart, isAddingToCart, productBasePath }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "flex-shrink-0 w-[240px] md:w-[300px] lg:w-[350px] relative z-10 transition-all duration-300",
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      whileHover: {
        scale: 1.15,
        zIndex: 50,
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-outer bg-surface border border-white/5 rounded-md overflow-hidden shadow-2xl group/card h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `${productBasePath}/${product.slug}`, className: "block relative aspect-[16/9] overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: safeUrl(product.images[0]?.sizes?.medium || product.images[0]?.sizes?.medium_large || product.images[0]?.src, "https://placehold.co/640x360/0D96FF/FFFFFF"),
              alt: product.name,
              className: "w-full h-full object-cover",
              loading: "lazy",
              decoding: "async"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover/card:from-black/35 transition-colors" }),
          product.on_sale && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 bg-error text-white px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter", children: t("badge_sale") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-surface/95 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 delay-100 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.preventDefault();
                    if (!isAddingToCart) onAddToCart(product.id);
                  },
                  disabled: isAddingToCart,
                  "aria-busy": isAddingToCart,
                  "aria-label": t("shop.add_to_cart"),
                  className: `w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-all ${isAddingToCart ? "opacity-50 cursor-not-allowed" : "hover:bg-white/80"}`,
                  title: t("shop.add_to_cart"),
                  children: isAddingToCart ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "fill-black" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: `${productBasePath}/${product.slug}`,
                  className: "w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20",
                  title: t("shop.product_details"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 text-xs font-bold text-primary", children: formatPrice(product.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm md:text-base font-bold text-white mb-2 line-clamp-1", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-white/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 font-bold", children: t("shop.match_score") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border border-white/30 px-1.5 rounded-sm uppercase tracking-tighter", children: t("shop.cremosidade_level") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1", children: product.categories?.slice(0, 2).map((cat, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-white/40 after:content-['•'] after:ml-1 last:after:content-none whitespace-nowrap", children: cat.name }, idx)) })
        ] })
      ] })
    }
  );
});
const ProductRow = reactExports.memo(({ title, products, onAddToCart, isAdding, activeProductId, formatPrice, productBasePath }) => {
  const carouselRef = reactExports.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = reactExports.useState(false);
  const [canScrollRight, setCanScrollRight] = reactExports.useState(true);
  const [activePageIndex, setActivePageIndex] = reactExports.useState(0);
  const checkScroll = reactExports.useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      setActivePageIndex(Math.round(scrollLeft / clientWidth));
    }
  }, []);
  reactExports.useEffect(() => {
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        carousel.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [products, checkScroll]);
  const scroll = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -carouselRef.current.clientWidth : carouselRef.current.clientWidth,
        behavior: "smooth"
      });
    }
  };
  if (products.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 relative group z-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 md:px-12 lg:px-20 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl md:text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-primary transition-colors cursor-default", children: [
        title,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "inline-block ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300", size: 24 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PagingIndicator, { count: Math.ceil(products.length / 4), active: activePageIndex })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-visible", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
        canScrollLeft && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: () => scroll("left"),
            className: "absolute left-0 top-0 bottom-0 z-40 bg-black/40 hover:bg-black/60 w-12 md:w-16 flex items-center justify-center group/btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 48, className: "text-white group-hover/btn:scale-125 transition-transform" })
          }
        ),
        canScrollRight && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: () => scroll("right"),
            className: "absolute right-0 top-0 bottom-0 z-40 bg-black/40 hover:bg-black/60 w-12 md:w-16 flex items-center justify-center group/btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 48, className: "text-white group-hover/btn:scale-125 transition-transform" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: carouselRef,
          className: "flex gap-2 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-20 py-10 -my-10 scroll-smooth items-stretch",
          style: { scrollbarWidth: "none", msOverflowStyle: "none" },
          children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductCard,
            {
              product,
              formatPrice,
              onAddToCart,
              isAddingToCart: isAdding && activeProductId === product.id,
              productBasePath
            },
            product.id
          ))
        }
      )
    ] })
  ] });
});
const ShopPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0];
  const isPortuguese = i18n.language.startsWith("pt");
  const productBasePath = isPortuguese ? "/pt/loja/produto" : "/shop/product";
  const { data: shopData, isLoading: loading } = useShopPageQuery(currentLang);
  const addToCartMutation = useAddToCartMutation();
  const [addingToCart, setAddingToCart] = reactExports.useState(null);
  const [showToast, setShowToast] = reactExports.useState(false);
  const handleAddToCart = reactExports.useCallback(async (productId) => {
    setAddingToCart(productId);
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      setShowToast(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAddingToCart(null);
    }
  }, [addToCartMutation]);
  const formatPrice = reactExports.useCallback((price) => {
    if (!price) return isPortuguese ? "R$ 0,00" : "$ 0.00";
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? "pt-BR" : "en-US";
    const currency = isPortuguese ? "BRL" : "USD";
    return isNaN(numPrice) ? price : new Intl.NumberFormat(locale, { style: "currency", currency }).format(numPrice);
  }, [isPortuguese]);
  const featuredProduct = shopData?.featured || null;
  const newReleases = shopData?.new_releases || [];
  const bestSellers = shopData?.best_sellers || [];
  const curatedSelection = shopData?.curated || [];
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#141414] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-primary", size: 48 }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#141414] text-white relative overflow-x-clip", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 opacity-70", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 left-[-15%] h-[460px] w-[460px] rounded-full bg-primary/15 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[28%] right-[-12%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
        t("shop.page_title"),
        " | ",
        t("common.artist_name")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: t("shop.page_meta_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toast,
      {
        message: t("shop.product_added"),
        isVisible: showToast,
        onClose: () => setShowToast(false)
      }
    ),
    featuredProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShopHero,
      {
        product: featuredProduct,
        onAddToCart: handleAddToCart,
        isAddingToCart: addingToCart === featuredProduct.id,
        productBasePath
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 pb-20 -mt-8 md:-mt-12 lg:-mt-16 space-y-12 md:space-y-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductRow,
        {
          title: t("shop.new_releases"),
          products: newReleases,
          onAddToCart: handleAddToCart,
          isAdding: newReleases.some((p) => p.id === addingToCart),
          activeProductId: addingToCart,
          formatPrice,
          productBasePath
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductRow,
        {
          title: t("badge_sale"),
          products: bestSellers,
          onAddToCart: handleAddToCart,
          isAdding: bestSellers.some((p) => p.id === addingToCart),
          activeProductId: addingToCart,
          formatPrice,
          productBasePath
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductRow,
        {
          title: t("shop.top_picks"),
          products: curatedSelection,
          onAddToCart: handleAddToCart,
          isAdding: curatedSelection.some((p) => p.id === addingToCart),
          activeProductId: addingToCart,
          formatPrice,
          productBasePath
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 md:px-12 lg:px-20 py-20 bg-background border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12", children: [
      { icon: Truck, title: t("shop.benefits.instant_delivery"), desc: t("shop.benefits.instant_delivery_desc") },
      { icon: Shield, title: t("shop.benefits.secure_payment"), desc: t("shop.benefits.secure_payment_desc") },
      { icon: Gift, title: t("shop.benefits.tribe_perks"), desc: t("shop.benefits.tribe_perks_desc") },
      { icon: Zap, title: t("shop.benefits.vip_support"), desc: t("shop.benefits.vip_support_desc") }
    ].map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-3 group cursor-default", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary group-hover:scale-110 transition-transform duration-300 w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 32 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg md:text-xl text-white group-hover:text-primary transition-colors", children: item.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40 leading-relaxed", children: item.desc })
    ] }, idx)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      ` })
  ] });
};
export {
  ShopPage as default
};
//# sourceMappingURL=ShopPage-BkQpF_K0.js.map
