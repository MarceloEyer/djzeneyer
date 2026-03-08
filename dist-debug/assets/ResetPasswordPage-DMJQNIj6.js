import { j as jsxRuntimeExports, m as motion, A as AnimatePresence } from "./motion-CwY3TCXX.js";
import { i as useSearchParams, c as useNavigate, r as reactExports, L as Link } from "./vendor-CFCQ-ZJr.js";
import { $ as useAuth, H as HeadlessSEO, b as Mail } from "./index-Cac5tBAe.js";
import { u as useTranslation } from "./i18n-ti7dkFnK.js";
import { C as CircleCheckBig } from "./circle-check-big-BWROkmEK.js";
import { A as ArrowLeft } from "./arrow-left-Bbmrj-yL.js";
import { C as CircleAlert } from "./circle-alert-C7BuYnBJ.js";
import { L as LoaderCircle } from "./loader-circle-DTVp4yA4.js";
import { L as Lock } from "./lock-B39ha62i.js";
import { E as EyeOff } from "./eye-off-DcX1nzYR.js";
import { E as Eye } from "./eye-nq4ae8V4.js";
const ResetPasswordPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword, loading, error, clearError } = useAuth();
  const key = searchParams.get("key");
  const login = searchParams.get("login");
  const isSettingNewPassword = !!(key && login);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [fieldError, setFieldError] = reactExports.useState("");
  reactExports.useEffect(() => {
    clearError();
  }, [clearError]);
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setFieldError("");
    if (!email) {
      setFieldError(t("auth.reset_password.error_email_required"));
      return;
    }
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch {
    }
  };
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setFieldError("");
    if (password.length < 6) {
      setFieldError(t("auth.reset_password.error_password_length"));
      return;
    }
    if (password !== confirmPassword) {
      setFieldError(t("auth.reset_password.error_password_mismatch"));
      return;
    }
    try {
      await resetPassword(key, login, password);
      setSuccess(true);
      const homePath = i18n.language.startsWith("pt") ? "/pt/" : "/";
      setTimeout(() => navigate(homePath), 5e3);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadlessSEO,
      {
        title: `${isSettingNewPassword ? t("auth.reset_password.title_set") : t("auth.reset_password.title_request")} | DJ Zen Eyer`,
        noindex: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "w-full max-w-md relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: i18n.language.startsWith("pt") ? "/pt/" : "/", className: "inline-block mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-black tracking-tighter text-white uppercase italic", children: [
              "Zen",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary italic", children: "Eyer" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-white mb-2 font-display tracking-tight", children: isSettingNewPassword ? t("auth.reset_password.title_set") : t("auth.reset_password.title_request") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm", children: isSettingNewPassword ? t("auth.reset_password.subtitle_set") : t("auth.reset_password.subtitle_request") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "text-center py-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "text-green-500", size: 32 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-3", children: t("auth.reset_password.success_title") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mb-6 underline-offset-4 decoration-primary/50", children: isSettingNewPassword ? t("auth.reset_password.success_set") : t("auth.reset_password.success_request") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: i18n.language.startsWith("pt") ? "/pt/" : "/",
                    className: "inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }),
                      t("auth.reset_password.back_home")
                    ]
                  }
                )
              ]
            },
            "success"
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { exit: { opacity: 0, x: -20 }, children: [
            (error || fieldError) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18, className: "flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fieldError || error })
            ] }),
            !isSettingNewPassword ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRequestReset, className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reset_email", className: "block text-xs font-bold uppercase text-white/50 mb-2 ml-1", children: t("auth.reset_password.email_label") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors", size: 18 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "email",
                      id: "reset_email",
                      name: "email",
                      required: true,
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      placeholder: t("auth.reset_password.email_placeholder"),
                      className: "w-full bg-black/40 text-white border border-white/10 group-focus-within:border-primary/50 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all",
                      autoComplete: "email"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading,
                  className: "w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50",
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 20 }) : t("auth.reset_password.submit_request")
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSetPassword, className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reset_password", className: "block text-xs font-bold uppercase text-white/50 mb-2 ml-1", children: t("auth.reset_password.password_label") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors", size: 18 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: showPassword ? "text" : "password",
                      id: "reset_password",
                      name: "password",
                      required: true,
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      placeholder: t("auth.reset_password.password_placeholder"),
                      className: "w-full bg-black/40 text-white border border-white/10 group-focus-within:border-primary/50 rounded-xl py-3.5 pl-10 pr-12 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all",
                      autoComplete: "new-password"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors",
                      "aria-label": showPassword ? t("auth.aria.hide_password") : t("auth.aria.show_password"),
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "confirm_password", className: "block text-xs font-bold uppercase text-white/50 mb-2 ml-1", children: t("auth.reset_password.confirm_label") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors", size: 18 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: showPassword ? "text" : "password",
                      id: "confirm_password",
                      name: "confirm_password",
                      required: true,
                      value: confirmPassword,
                      onChange: (e) => setConfirmPassword(e.target.value),
                      placeholder: t("auth.reset_password.confirm_placeholder"),
                      className: "w-full bg-black/40 text-white border border-white/10 group-focus-within:border-primary/50 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all",
                      autoComplete: "new-password"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading,
                  className: "w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50",
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin", size: 20 }) : t("auth.reset_password.submit_set")
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center pt-6 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: i18n.language.startsWith("pt") ? "/pt/" : "/", className: "text-white/40 hover:text-white transition-colors text-sm font-medium", children: t("auth.reset_password.back_login") }) })
          ] }, "form") }) })
        ]
      }
    )
  ] });
};
export {
  ResetPasswordPage as default
};
//# sourceMappingURL=ResetPasswordPage-DMJQNIj6.js.map
