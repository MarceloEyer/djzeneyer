import { j as jsxRuntimeExports } from "./motion-CwY3TCXX.js";
import { e as useParams, r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { x as Helmet, l as safeUrl, s as sanitizeHtml } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { L as LoaderCircle } from "./loader-circle-DTVp4yA4.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
import { A as ArrowLeft } from "./arrow-left-Bbmrj-yL.js";
import { S as ShoppingCart } from "./shopping-cart-C5N0VWkU.js";
const ProductPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [addingToCart, setAddingToCart] = reactExports.useState(false);
  const [activeImage, setActiveImage] = reactExports.useState(null);
  const isPortuguese = i18n.language.startsWith("pt");
  const currentLang = i18n.language.split("-")[0];
  const shopPath = isPortuguese ? "/pt/loja" : "/shop";
  const placeholderImage = "https://placehold.co/1200x675/0D96FF/FFFFFF?text=DJ+Zen+Eyer";
  const fetchProduct = reactExports.useCallback(async () => {
    if (!slug) {
      setError(t("shop.product_not_found"));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    const apiUrl = `${baseUrl}djzeneyer/v1/products?slug=${encodeURIComponent(slug)}&lang=${currentLang}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`${t("shop.generic_error")}: ${response.status}`);
      const data = await response.json();
      const nextProduct = Array.isArray(data) ? data[0] : null;
      if (!nextProduct) {
        setError(t("shop.product_not_found"));
      } else {
        setProduct(nextProduct);
        setActiveImage(nextProduct.images?.[0]?.src || null);
      }
    } catch (err) {
      const error2 = err;
      console.error("Error fetching product:", error2);
      setError(error2.message || t("shop.generic_error"));
    } finally {
      setLoading(false);
    }
  }, [slug, t, currentLang]);
  reactExports.useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
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
  const formatPrice = reactExports.useCallback((price) => {
    if (!price) return "R$ 0,00";
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? "pt-BR" : "en-US";
    return isNaN(numPrice) ? price : new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" }).format(numPrice);
  }, [isPortuguese]);
  const gallery = reactExports.useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images.filter((img) => img?.src);
  }, [product?.images]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-primary", size: 48 }) });
  }
  if (error || !product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-white p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mx-auto mb-4 text-error", size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: t("shop.product_not_found") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-70", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: shopPath, className: "mt-6 btn btn-primary inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }),
        t("common.checkout.back_shop")
      ] })
    ] }) });
  }
  const mainImageObject = product.images?.[0];
  const optimizedMainImage = mainImageObject?.sizes?.large || mainImageObject?.sizes?.medium_large || mainImageObject?.src;
  const mainImage = activeImage || optimizedMainImage || placeholderImage;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("title", { children: [
        product.name,
        " | ",
        t("common.artist_name")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meta",
        {
          name: "description",
          content: product.short_description || product.description || product.name
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-white pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: shopPath, className: "inline-flex items-center gap-2 text-white/70 hover:text-primary mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }),
        t("common.checkout.back_shop")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden border border-white/10 bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: safeUrl(mainImage),
              alt: product.name || "",
              className: "w-full h-full object-cover"
            }
          ) }),
          gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-4 gap-3", children: gallery.map((img, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveImage(img.src),
              className: `rounded-lg overflow-hidden border ${activeImage === img.src ? "border-primary" : "border-white/10"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: safeUrl(img.sizes?.thumbnail || img.src), alt: img.alt || product.name, className: "w-full h-full object-cover" })
            },
            `${img.src}-${index}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: product.categories?.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80",
              children: category.name
            },
            category.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-5xl font-bold mb-4 font-display", children: product.name }),
          product.short_description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-white/80 text-lg mb-6",
              dangerouslySetInnerHTML: { __html: sanitizeHtml(product.short_description) }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
            product.on_sale && product.regular_price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 line-through text-lg", children: formatPrice(product.regular_price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-primary", children: formatPrice(product.price) })
          ] }),
          product.stock_status === "instock" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: addToCart,
              disabled: addingToCart,
              className: "btn btn-primary btn-lg flex items-center gap-2 mb-6",
              children: [
                addingToCart ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, {}),
                t("shop.buy_now")
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/40 uppercase font-bold border border-white/10 px-3 py-2 rounded", children: t("shop.out_of_stock") }),
          product.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-invert max-w-none mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-4", children: t("shop.product_details") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                dangerouslySetInnerHTML: { __html: sanitizeHtml(product.description) }
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
export {
  ProductPage as default
};
//# sourceMappingURL=ProductPage-Cz3hfvjI.js.map
