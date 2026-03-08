import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { R as React, L as Link } from "./vendor-CFCQ-ZJr.js";
import { c as createLucideIcon, B as useCart, n as normalizeLanguage, H as HeadlessSEO, i as getLocalizedRoute } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { S as ShoppingCart } from "./shopping-cart-C5N0VWkU.js";
import { A as ArrowRight } from "./arrow-right-DAPyJrnT.js";
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, removeItem } = useCart();
  const currentLang = React.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) });
  }
  const isEmpty = !cart || !cart.items || cart.items.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("common.cart.title"),
        description: t("common.cart.description"),
        isHomepage: false
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          className: "mb-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl font-bold font-display flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "text-primary" }),
            t("common.cart.title")
          ] })
        }
      ),
      isEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "text-center py-16 bg-surface rounded-xl border border-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 64, className: "mx-auto mb-4 text-white/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: t("common.cart.empty") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mb-8", children: t("common.cart.empty_desc") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("shop", currentLang), className: "btn btn-primary", children: t("common.cart.continue_shopping") })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            variants: containerVariants,
            initial: "hidden",
            animate: "visible",
            className: "lg:col-span-2 space-y-4",
            children: cart.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                variants: itemVariants,
                className: "flex gap-4 p-4 bg-surface rounded-lg border border-white/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-white/5 rounded-md overflow-hidden flex-shrink-0", children: item.images && item.images[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.images[0].src, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 24 }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-grow flex flex-col justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg line-clamp-2", children: item.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => removeItem(item.key),
                          className: "text-white/40 hover:text-error transition-colors p-1",
                          "aria-label": t("common.cart.remove_item"),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white/60", children: [
                        t("common.cart.qty"),
                        ": ",
                        item.quantity
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-primary", children: formatPrice(item.totals?.line_total || item.price) })
                    ] })
                  ] })
                ]
              },
              item.key || item.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.2 },
            className: "lg:col-span-1",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface p-6 rounded-xl border border-white/10 sticky top-24", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-4 border-b border-white/10 pb-4", children: t("common.cart.summary") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-white/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.cart.subtotal") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(cart.totals?.total_price || "0") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-white/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.cart.shipping") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.cart.shipping_calc") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xl font-bold border-t border-white/10 pt-4 mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.cart.total") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatPrice(cart.totals?.total_price || "0") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: getLocalizedRoute("checkout", currentLang),
                  className: "btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg",
                  children: [
                    t("common.cart.checkout"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 20 })
                  ]
                }
              )
            ] })
          }
        )
      ] })
    ] }) })
  ] });
};
export {
  CartPage as default
};
//# sourceMappingURL=CartPage-JDMXpbVY.js.map
