import { j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports, R as React, c as useNavigate } from "./vendor-CFCQ-ZJr.js";
import { u as useUser, n as normalizeLanguage, X as X$1, U as User, b as Mail, h as getTurnstileSiteKey, i as getLocalizedRoute } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
import { L as LoaderCircle } from "./loader-circle-DTVp4yA4.js";
import { L as Lock } from "./lock-B39ha62i.js";
import { E as EyeOff } from "./eye-off-DcX1nzYR.js";
import { E as Eye } from "./eye-nq4ae8V4.js";
function useLoadGsiScript(options = {}) {
  const { nonce, locale, onScriptLoadSuccess, onScriptLoadError } = options;
  const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = reactExports.useState(false);
  const onScriptLoadSuccessRef = reactExports.useRef(onScriptLoadSuccess);
  onScriptLoadSuccessRef.current = onScriptLoadSuccess;
  const onScriptLoadErrorRef = reactExports.useRef(onScriptLoadError);
  onScriptLoadErrorRef.current = onScriptLoadError;
  reactExports.useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://accounts.google.com/gsi/client";
    if (locale)
      scriptTag.src += `?hl=${locale}`;
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.nonce = nonce;
    scriptTag.onload = () => {
      var _a;
      setScriptLoadedSuccessfully(true);
      (_a = onScriptLoadSuccessRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadSuccessRef);
    };
    scriptTag.onerror = () => {
      var _a;
      setScriptLoadedSuccessfully(false);
      (_a = onScriptLoadErrorRef.current) === null || _a === void 0 ? void 0 : _a.call(onScriptLoadErrorRef);
    };
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [nonce]);
  return scriptLoadedSuccessfully;
}
const GoogleOAuthContext = reactExports.createContext(null);
function GoogleOAuthProvider({ clientId, nonce, locale, onScriptLoadSuccess, onScriptLoadError, children }) {
  const scriptLoadedSuccessfully = useLoadGsiScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError,
    locale
  });
  const contextValue = reactExports.useMemo(() => ({
    locale,
    clientId,
    scriptLoadedSuccessfully
  }), [clientId, scriptLoadedSuccessfully]);
  return React.createElement(GoogleOAuthContext.Provider, { value: contextValue }, children);
}
function useGoogleOAuth() {
  const context = reactExports.useContext(GoogleOAuthContext);
  if (!context) {
    throw new Error("Google OAuth components must be used within GoogleOAuthProvider");
  }
  return context;
}
function extractClientId(credentialResponse) {
  var _a;
  const clientId = (_a = credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.clientId) !== null && _a !== void 0 ? _a : credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.client_id;
  return clientId;
}
const containerHeightMap = { large: 40, medium: 32, small: 20 };
function GoogleLogin({ onSuccess, onError, useOneTap, promptMomentNotification, type = "standard", theme = "outline", size = "large", text, shape, logo_alignment, width, click_listener, state, containerProps, ...props }) {
  const btnContainerRef = reactExports.useRef(null);
  const { clientId, locale, scriptLoadedSuccessfully } = useGoogleOAuth();
  const onSuccessRef = reactExports.useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = reactExports.useRef(onError);
  onErrorRef.current = onError;
  const promptMomentNotificationRef = reactExports.useRef(promptMomentNotification);
  promptMomentNotificationRef.current = promptMomentNotification;
  reactExports.useEffect(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!scriptLoadedSuccessfully)
      return;
    (_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.initialize({
      client_id: clientId,
      callback: (credentialResponse) => {
        var _a2;
        if (!(credentialResponse === null || credentialResponse === void 0 ? void 0 : credentialResponse.credential)) {
          return (_a2 = onErrorRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(onErrorRef);
        }
        const { credential, select_by } = credentialResponse;
        onSuccessRef.current({
          credential,
          clientId: extractClientId(credentialResponse),
          select_by
        });
      },
      ...props
    });
    (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.google) === null || _d === void 0 ? void 0 : _d.accounts) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.renderButton(btnContainerRef.current, {
      type,
      theme,
      size,
      text,
      shape,
      logo_alignment,
      width,
      locale,
      click_listener,
      state
    });
    if (useOneTap)
      (_j = (_h = (_g = window === null || window === void 0 ? void 0 : window.google) === null || _g === void 0 ? void 0 : _g.accounts) === null || _h === void 0 ? void 0 : _h.id) === null || _j === void 0 ? void 0 : _j.prompt(promptMomentNotificationRef.current);
    return () => {
      var _a2, _b2, _c2;
      if (useOneTap)
        (_c2 = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.google) === null || _a2 === void 0 ? void 0 : _a2.accounts) === null || _b2 === void 0 ? void 0 : _b2.id) === null || _c2 === void 0 ? void 0 : _c2.cancel();
    };
  }, [
    clientId,
    scriptLoadedSuccessfully,
    useOneTap,
    type,
    theme,
    size,
    text,
    shape,
    logo_alignment,
    width,
    locale
  ]);
  return React.createElement("div", { ...containerProps, ref: btnContainerRef, style: { height: containerHeightMap[size], ...containerProps === null || containerProps === void 0 ? void 0 : containerProps.style } });
}
var ue = ({ as: n = "div", ...a }, s) => jsxRuntimeExports.jsx(n, { ...a, ref: s }), J = reactExports.forwardRef(ue);
var K = "https://challenges.cloudflare.com/turnstile/v0/api.js", I = "cf-turnstile-script", z = "cf-turnstile", _ = "onloadTurnstileCallback", W = (n) => !!document.getElementById(n), X = ({ render: n = "explicit", onLoadCallbackName: a = _, scriptOptions: { nonce: s = "", defer: e = true, async: m = true, id: S = "", appendTo: g, onError: T, crossOrigin: w = "" } = {} }) => {
  let E = S || I;
  if (W(E)) return;
  let i = document.createElement("script");
  if (i.id = E, i.src = `${K}?onload=${a}&render=${n}`, document.querySelector(`script[src="${i.src}"]`)) return;
  i.defer = !!e, i.async = !!m, s && (i.nonce = s), w && (i.crossOrigin = w), T && (i.onerror = T, delete window[a]), (g === "body" ? document.body : document.getElementsByTagName("head")[0]).appendChild(i);
}, f = { normal: { width: 300, height: 65 }, compact: { width: 150, height: 140 }, invisible: { width: 0, height: 0, overflow: "hidden" }, flexible: { minWidth: 300, width: "100%", height: 65 }, interactionOnly: { width: "fit-content", height: "auto", display: "flex" } };
function G(n) {
  if (n !== "invisible" && n !== "interactionOnly") return n;
}
function $(n = I) {
  let [a, s] = reactExports.useState(false);
  return reactExports.useEffect(() => {
    let e = () => {
      W(n) && s(true);
    }, m = new MutationObserver(e);
    return m.observe(document, { childList: true, subtree: true }), e(), () => {
      m.disconnect();
    };
  }, [n]), a;
}
var k = "unloaded", te, we = new Promise((n, a) => {
  te = { resolve: n, reject: a }, k === "ready" && n(void 0);
}), ee = (n = _) => (k === "unloaded" && (k = "loading", window[n] = () => {
  te.resolve(), k = "ready", delete window[n];
}), we), Ee = reactExports.forwardRef((n, a) => {
  let { scriptOptions: s, options: e = {}, siteKey: m, onWidgetLoad: S, onSuccess: g, onExpire: T, onError: w, onBeforeInteractive: E, onAfterInteractive: i, onUnsupported: b, onTimeout: A, onLoadScript: j, id: re, style: ne, as: oe = "div", injectScript: B = true, rerenderOnCallbackChange: o = false, ...ie } = n, c = e.size, H = reactExports.useCallback(() => typeof c > "u" ? {} : e.execution === "execute" ? f.invisible : e.appearance === "interaction-only" ? f.interactionOnly : f[c], [e.execution, c, e.appearance]), [se, R] = reactExports.useState(H()), u = reactExports.useRef(null), [x, F] = reactExports.useState(false), r = reactExports.useRef(void 0), L = reactExports.useRef(false), V = re || z, d = reactExports.useRef({ onSuccess: g, onError: w, onExpire: T, onBeforeInteractive: E, onAfterInteractive: i, onUnsupported: b, onTimeout: A });
  reactExports.useEffect(() => {
    o || (d.current = { onSuccess: g, onError: w, onExpire: T, onBeforeInteractive: E, onAfterInteractive: i, onUnsupported: b, onTimeout: A });
  });
  let N = s?.id || I, D = $(N), C = s?.onLoadCallbackName || _, ce = e.appearance || "always", P = reactExports.useMemo(() => ({ sitekey: m, action: e.action, cData: e.cData, theme: e.theme || "auto", language: e.language || "auto", tabindex: e.tabIndex, "response-field": e.responseField, "response-field-name": e.responseFieldName, size: G(c), retry: e.retry || "auto", "retry-interval": e.retryInterval || 8e3, "refresh-expired": e.refreshExpired || "auto", "refresh-timeout": e.refreshTimeout || "auto", execution: e.execution || "render", appearance: e.appearance || "always", "feedback-enabled": e.feedbackEnabled ?? true, callback: (t) => {
    L.current = true, o ? g?.(t) : d.current.onSuccess?.(t);
  }, "error-callback": o ? w : (...t) => d.current.onError?.(...t), "expired-callback": o ? T : (...t) => d.current.onExpire?.(...t), "before-interactive-callback": o ? E : (...t) => d.current.onBeforeInteractive?.(...t), "after-interactive-callback": o ? i : (...t) => d.current.onAfterInteractive?.(...t), "unsupported-callback": o ? b : (...t) => d.current.onUnsupported?.(...t), "timeout-callback": o ? A : (...t) => d.current.onTimeout?.(...t) }), [e.action, e.appearance, e.cData, e.execution, e.language, e.refreshExpired, e.responseField, e.responseFieldName, e.retry, e.retryInterval, e.tabIndex, e.theme, e.feedbackEnabled, e.refreshTimeout, m, c, o, o ? g : null, o ? w : null, o ? T : null, o ? E : null, o ? i : null, o ? b : null, o ? A : null]), y = reactExports.useCallback(() => typeof window < "u" && !!window.turnstile, []);
  return reactExports.useEffect(function() {
    B && !x && (ee(C), X({ onLoadCallbackName: C, scriptOptions: { ...s, id: N } }));
  }, [B, x, s, N, C]), reactExports.useEffect(function() {
    k !== "ready" && ee(C).then(() => F(true)).catch(console.error);
  }, [C]), reactExports.useEffect(function() {
    if (!u.current || !x) return;
    let l = false;
    return (async () => {
      if (l || !u.current) return;
      let U = window.turnstile.render(u.current, P);
      r.current = U, r.current && S?.(r.current);
    })(), () => {
      l = true, r.current && (window.turnstile.remove(r.current), L.current = false);
    };
  }, [V, x, P]), reactExports.useImperativeHandle(a, () => {
    let { turnstile: t } = window;
    return { getResponse() {
      if (!t?.getResponse || !r.current || !y()) {
        console.warn("Turnstile has not been loaded");
        return;
      }
      return t.getResponse(r.current);
    }, async getResponsePromise(l = 3e4, Y = 100) {
      return new Promise((U, M) => {
        let p, q = async () => {
          if (L.current && window.turnstile && r.current) try {
            let v = window.turnstile.getResponse(r.current);
            return p && clearTimeout(p), v ? U(v) : M(new Error("No response received"));
          } catch (v) {
            return p && clearTimeout(p), console.warn("Failed to get response", v), M(new Error("Failed to get response"));
          }
          p || (p = setTimeout(() => {
            p && clearTimeout(p), M(new Error("Timeout"));
          }, l)), await new Promise((v) => setTimeout(v, Y)), await q();
        };
        q();
      });
    }, reset() {
      if (!t?.reset || !r.current || !y()) {
        console.warn("Turnstile has not been loaded");
        return;
      }
      e.execution === "execute" && R(f.invisible);
      try {
        L.current = false, t.reset(r.current);
      } catch (l) {
        console.warn(`Failed to reset Turnstile widget ${r}`, l);
      }
    }, remove() {
      if (!t?.remove || !r.current || !y()) {
        console.warn("Turnstile has not been loaded");
        return;
      }
      R(f.invisible), L.current = false, t.remove(r.current), r.current = null;
    }, render() {
      if (!t?.render || !u.current || !y() || r.current) {
        console.warn("Turnstile has not been loaded or container not found");
        return;
      }
      let l = t.render(u.current, P);
      return r.current = l, r.current && S?.(r.current), e.execution !== "execute" && R(c ? f[c] : {}), l;
    }, execute() {
      if (e.execution !== "execute") {
        console.warn('Execution mode is not set to "execute"');
        return;
      }
      if (!t?.execute || !u.current || !r.current || !y()) {
        console.warn("Turnstile has not been loaded or container not found");
        return;
      }
      t.execute(u.current, P), R(c ? f[c] : {});
    }, isExpired() {
      return !t?.isExpired || !r.current || !y() ? (console.warn("Turnstile has not been loaded"), false) : t.isExpired(r.current);
    } };
  }, [r, e.execution, c, P, u, y, x, S]), reactExports.useEffect(() => {
    if (x || !D) return;
    if (window.turnstile) {
      F(true);
      return;
    }
    let t = setInterval(() => {
      window.turnstile && (F(true), clearInterval(t));
    }, 50);
    return () => {
      clearInterval(t);
    };
  }, [x, D]), reactExports.useEffect(() => {
    R(H());
  }, [e.execution, c, ce]), reactExports.useEffect(() => {
    !D || typeof j != "function" || j();
  }, [D]), jsxRuntimeExports.jsx(J, { ref: u, as: oe, id: V, style: { ...se, ...ne }, ...ie });
});
Ee.displayName = "Turnstile";
const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, register, googleLogin, googleClientId } = useUser();
  const currentLang = reactExports.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const [mode, setMode] = reactExports.useState("login");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [turnstileToken, setTurnstileToken] = reactExports.useState("");
  const [honeypot, setHoneypot] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [formErrors, setFormErrors] = reactExports.useState({});
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = t("auth.errors.email_required");
    } else if (!emailRegex.test(email)) {
      errors.email = t("auth.errors.email_invalid");
    }
    if (!password) {
      errors.password = t("auth.errors.password_required");
    } else {
      if (password.length < 6) {
        errors.password = t("auth.errors.password_min");
      }
    }
    if (mode === "register" && !username.trim()) {
      errors.username = t("auth.errors.name_required");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (honeypot) {
      onClose();
      return;
    }
    if (!validateForm()) return;
    if (mode === "register" && !turnstileToken) {
      setError(t("auth.errors.security_check"));
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username.trim(), email, password, turnstileToken);
      }
      if (onSuccess) onSuccess();
      onClose();
      navigate(getLocalizedRoute("dashboard", currentLang));
    } catch (err) {
      const error2 = err;
      console.error("❌ [AuthModal] Erro:", error2);
      setTurnstileToken("");
      setError(error2.message || t("auth.errors.auth_generic_error"));
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError(t("auth.errors.google_no_credential"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await googleLogin(credentialResponse.credential);
      if (onSuccess) onSuccess();
      onClose();
      navigate(getLocalizedRoute("dashboard", currentLang));
    } catch (err) {
      console.error("❌ [AuthModal] Erro no Google Login:", err);
      setError(t("auth.errors.google_auth_failed"));
    } finally {
      setLoading(false);
    }
  };
  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setFormErrors({});
    setTurnstileToken("");
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleForgotPassword = () => {
    onClose();
    navigate(getLocalizedRoute("reset-password", currentLang));
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      onClick: handleOverlayClick,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "absolute inset-0 bg-black/80 backdrop-blur-sm"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 20 },
            transition: { type: "spring", duration: 0.5, bounce: 0.3 },
            className: "relative w-full max-w-md",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-3xl blur-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white/60 hover:text-white",
                    "aria-label": t("common.close"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { size: 20 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-10 pb-6 px-8 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-white mb-2 font-display tracking-tight", children: mode === "login" ? t("auth.login.title") : t("auth.register.title") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm", children: mode === "login" ? t("auth.login.subtitle") : t("auth.register.subtitle") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 pb-8", children: [
                  error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      className: "mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18, className: "flex-shrink-0 mt-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
                      ]
                    }
                  ),
                  googleClientId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleOAuthProvider, { clientId: googleClientId, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    GoogleLogin,
                    {
                      onSuccess: handleGoogleSuccess,
                      onError: () => setError(t("auth.errors.google_connect_error")),
                      theme: "filled_black",
                      size: "large",
                      text: mode === "login" ? "signin_with" : "signup_with",
                      width: 368,
                      logo_alignment: "center"
                    }
                  ) }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 h-12 bg-white/5 animate-pulse rounded-lg flex items-center justify-center border border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin text-white/40" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-white/10" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase tracking-wider font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 bg-[#1a1a1a] text-white/40", children: t("auth.or_continue_with_email") }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }, "aria-hidden": "true", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "user_website_trap", children: t("auth.labels.honeypot") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          id: "user_website_trap",
                          name: "user_website_trap",
                          tabIndex: -1,
                          autoComplete: "off",
                          value: honeypot,
                          onChange: (e) => setHoneypot(e.target.value)
                        }
                      )
                    ] }),
                    mode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "auth_username", className: "block text-xs font-bold uppercase text-white/50 mb-1.5 ml-1", children: t("auth.labels.name") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors", size: 18 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            id: "auth_username",
                            name: "username",
                            value: username,
                            onChange: (e) => {
                              setUsername(e.target.value);
                              if (formErrors.username) setFormErrors({ ...formErrors, username: void 0 });
                            },
                            className: `w-full bg-black/40 text-white border ${formErrors.username ? "border-red-500/50" : "border-white/10 group-focus-within:border-primary/50"} rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-white/20`,
                            placeholder: t("auth.placeholders.name"),
                            disabled: loading,
                            autoComplete: "username"
                          }
                        )
                      ] }),
                      formErrors.username && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-400 ml-1", children: formErrors.username })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "auth_email", className: "block text-xs font-bold uppercase text-white/50 mb-1.5 ml-1", children: t("auth.labels.email") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors", size: 18 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "email",
                            id: "auth_email",
                            name: "email",
                            value: email,
                            onChange: (e) => {
                              setEmail(e.target.value);
                              if (formErrors.email) setFormErrors({ ...formErrors, email: void 0 });
                            },
                            className: `w-full bg-black/40 text-white border ${formErrors.email ? "border-red-500/50" : "border-white/10 group-focus-within:border-primary/50"} rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-white/20`,
                            placeholder: t("auth.placeholders.email"),
                            disabled: loading,
                            autoComplete: "email"
                          }
                        )
                      ] }),
                      formErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-400 ml-1", children: formErrors.email })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1.5 ml-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "auth_password", className: "text-xs font-bold uppercase text-white/50", children: t("auth.labels.password") }),
                        mode === "login" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleForgotPassword,
                            className: "text-xs text-primary hover:text-primary/80 transition-colors",
                            children: t("auth.login.forgot_password")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors", size: 18 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: showPassword ? "text" : "password",
                            id: "auth_password",
                            name: "password",
                            value: password,
                            onChange: (e) => {
                              setPassword(e.target.value);
                              if (formErrors.password) setFormErrors({ ...formErrors, password: void 0 });
                            },
                            className: `w-full bg-black/40 text-white border ${formErrors.password ? "border-red-500/50" : "border-white/10 group-focus-within:border-primary/50"} rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-white/20`,
                            placeholder: t("auth.placeholders.password"),
                            disabled: loading,
                            autoComplete: mode === "login" ? "current-password" : "new-password"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setShowPassword(!showPassword),
                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none",
                            "aria-label": showPassword ? t("auth.aria.hide_password") : t("auth.aria.show_password"),
                            children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 })
                          }
                        )
                      ] }),
                      formErrors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-red-400 ml-1", children: formErrors.password })
                    ] }),
                    mode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Ee,
                      {
                        siteKey: getTurnstileSiteKey(),
                        onSuccess: (token) => setTurnstileToken(token),
                        options: { theme: "dark" }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: loading,
                        className: "w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 mt-2",
                        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("auth.processing") })
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: mode === "login" ? t("auth.login.submit") : t("auth.register.submit") })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center pt-4 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/50 text-sm", children: [
                    mode === "login" ? t("auth.login.no_account") : t("auth.register.has_account"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: switchMode,
                        disabled: loading,
                        className: "text-primary font-bold hover:text-white transition-colors disabled:opacity-50 ml-1",
                        children: mode === "login" ? t("auth.login.create_now") : t("auth.register.login_now")
                      }
                    )
                  ] }) })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  ) });
};
export {
  AuthModal as default
};
//# sourceMappingURL=AuthModal-DqcC0Gd6.js.map
