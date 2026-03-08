import { j as jsxRuntimeExports, m as motion } from "./motion-CwY3TCXX.js";
import { R as React, r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { B as useCart, n as normalizeLanguage, i as getLocalizedRoute, H as HeadlessSEO, s as sanitizeHtml, W as buildApiUrl, Z as getAuthHeaders, _ as safeRedirect } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { C as CircleCheckBig } from "./circle-check-big-BWROkmEK.js";
import { L as Lock } from "./lock-B39ha62i.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, getCart, clearCart } = useCart();
  const currentLang = React.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const isPortuguese = i18n.language.startsWith("pt");
  const [paymentMethods, setPaymentMethods] = reactExports.useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = reactExports.useState("");
  const [formData, setFormData] = reactExports.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [orderSuccess, setOrderSuccess] = reactExports.useState(false);
  React.useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const url = buildApiUrl("wc/store/v1/checkout");
        const headers = getAuthHeaders();
        const response = await fetch(url, {
          method: "GET",
          headers
        });
        if (response.ok) {
          const data = await response.json();
          if (data.payment_methods) {
            setPaymentMethods(data.payment_methods);
            if (data.payment_methods.length > 0) {
              setSelectedPaymentMethod(data.payment_methods[0].id);
            }
          }
          if (data.billing_address) {
            setFormData((prev) => ({
              ...prev,
              firstName: data.billing_address.first_name || "",
              lastName: data.billing_address.last_name || "",
              email: data.billing_address.email || "",
              phone: data.billing_address.phone || "",
              address: data.billing_address.address_1 || "",
              city: data.billing_address.city || "",
              state: data.billing_address.state || "",
              zip: data.billing_address.postcode || "",
              country: data.billing_address.country || ""
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch checkout data", error);
      }
    };
    fetchCheckoutData();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      alert(t("common.checkout.select_payment"));
      return;
    }
    setIsProcessing(true);
    try {
      const url = buildApiUrl("wc/store/v1/checkout");
      const headers = getAuthHeaders();
      const payload = {
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: formData.country
        },
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: formData.country
        },
        payment_method: selectedPaymentMethod
      };
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || t("common.checkout.error_failed"));
      }
      await getCart();
      if (data.payment_result?.redirect_url) {
        window.location.href = safeRedirect(data.payment_result.redirect_url, getLocalizedRoute("shop", currentLang));
      } else {
        await clearCart();
        setOrderSuccess(true);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error instanceof Error ? error.message : t("common.checkout.generic_error"));
    } finally {
      setIsProcessing(false);
    }
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
  if (orderSuccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white flex flex-col items-center justify-center text-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        className: "bg-surface p-8 rounded-2xl border border-primary/20 max-w-md w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 40, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-4 font-display", children: t("common.checkout.success_title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 mb-8", children: t("common.checkout.success_desc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: getLocalizedRoute("shop", currentLang), className: "btn btn-primary w-full", children: t("common.checkout.back_shop") }),
          "        "
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: t("common.checkout.title"),
        description: t("common.checkout.description"),
        isHomepage: false
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen pt-24 pb-12 bg-background text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-8 font-display", children: t("common.checkout.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "bg-surface p-6 md:p-8 rounded-xl border border-white/10 mb-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm", children: "1" }),
                  t("common.checkout.billing")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "checkout-form", onSubmit: handleSubmit, className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-first-name", className: "block text-sm text-white/60 mb-1", children: t("common.form.first_name") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "checkout-first-name",
                          name: "firstName",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.firstName,
                          onChange: handleInputChange,
                          autoComplete: "given-name"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-last-name", className: "block text-sm text-white/60 mb-1", children: t("common.form.last_name") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "checkout-last-name",
                          name: "lastName",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.lastName,
                          onChange: handleInputChange,
                          autoComplete: "family-name"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-email", className: "block text-sm text-white/60 mb-1", children: t("common.form.email") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "email",
                          id: "checkout-email",
                          name: "email",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.email,
                          onChange: handleInputChange,
                          autoComplete: "email"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-phone", className: "block text-sm text-white/60 mb-1", children: t("common.form.phone") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "tel",
                          id: "checkout-phone",
                          name: "phone",
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.phone,
                          onChange: handleInputChange,
                          autoComplete: "tel"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-address", className: "block text-sm text-white/60 mb-1", children: t("common.form.address") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        id: "checkout-address",
                        name: "address",
                        required: true,
                        className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                        value: formData.address,
                        onChange: handleInputChange,
                        autoComplete: "street-address"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-city", className: "block text-sm text-white/60 mb-1", children: t("common.form.city") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "checkout-city",
                          name: "city",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.city,
                          onChange: handleInputChange,
                          autoComplete: "address-level2"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-state", className: "block text-sm text-white/60 mb-1", children: t("common.form.state") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "checkout-state",
                          name: "state",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.state,
                          onChange: handleInputChange,
                          autoComplete: "address-level1"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-zip", className: "block text-sm text-white/60 mb-1", children: t("common.form.zip") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "checkout-zip",
                          name: "zip",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.zip,
                          onChange: handleInputChange,
                          autoComplete: "postal-code"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "checkout-country", className: "block text-sm text-white/60 mb-1", children: t("common.form.country") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "checkout-country",
                          name: "country",
                          required: true,
                          className: "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors",
                          value: formData.country,
                          onChange: handleInputChange,
                          autoComplete: "country"
                        }
                      )
                    ] })
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
              transition: { delay: 0.1 },
              className: "bg-surface p-6 md:p-8 rounded-xl border border-white/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-6 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm", children: "2" }),
                  t("common.checkout.payment")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: paymentMethods.length > 0 ? paymentMethods.map((method) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    className: `p-4 rounded-lg border flex items-start gap-4 cursor-pointer transition-colors ${selectedPaymentMethod === method.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/30 bg-black/20"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "radio",
                          id: `payment-method-${method.id}`,
                          name: "paymentMethod",
                          value: method.id,
                          checked: selectedPaymentMethod === method.id,
                          onChange: () => setSelectedPaymentMethod(method.id),
                          className: "mt-1"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: method.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/60 mt-1", dangerouslySetInnerHTML: { __html: sanitizeHtml(method.description) } })
                      ] })
                    ]
                  },
                  method.id
                )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 italic", children: t("common.checkout.no_payments") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 text-sm text-white/60", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }),
                  t("common.checkout.secure_msg")
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.2 },
            className: "bg-surface p-6 rounded-xl border border-white/10 sticky top-24",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-4 border-b border-white/10 pb-4", children: t("common.checkout.summary") }),
              cart?.items && cart.items.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mb-6", children: cart.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/80 line-clamp-2 pr-4", children: [
                  item.quantity,
                  "x ",
                  item.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-white/60", children: formatPrice(item.totals?.line_total || item.price) })
              ] }, item.key || item.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 mb-4 text-white/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mx-auto mb-2" }),
                t("common.cart.empty")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-6 text-sm border-t border-white/10 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-white/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.cart.subtotal") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(cart?.totals?.total_price || "0") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-white/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("common.cart.total") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold text-lg", children: formatPrice(cart?.totals?.total_price || "0") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  form: "checkout-form",
                  disabled: isProcessing || !cart?.items?.length,
                  className: "btn btn-primary w-full py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                  children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" }) : t("common.checkout.place_order")
                }
              )
            ]
          }
        ) })
      ] })
    ] }) })
  ] });
};
export {
  CheckoutPage as default
};
//# sourceMappingURL=CheckoutPage-XTrNL3k1.js.map
