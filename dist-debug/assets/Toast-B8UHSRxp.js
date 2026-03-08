import { j as jsxRuntimeExports, A as AnimatePresence, m as motion } from "./motion-CwY3TCXX.js";
import { r as reactExports } from "./vendor-CFCQ-ZJr.js";
import { C as CircleCheckBig } from "./circle-check-big-BWROkmEK.js";
import { X } from "./index-Cac5tBAe.js";
const Toast = ({ message, isVisible, onClose, duration = 3e3 }) => {
  reactExports.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 50, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 20, scale: 0.95 },
      className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface border border-white/10 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "text-primary", size: 24 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "ml-4 text-white/40 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
      ]
    }
  ) });
};
export {
  Toast as T
};
//# sourceMappingURL=Toast-B8UHSRxp.js.map
