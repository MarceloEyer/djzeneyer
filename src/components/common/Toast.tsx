import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

// ─── Framer Motion Variants ─────────────────────────────────────────────────────
// ⚡ Bolt: Extracted static Framer Motion variants to module scope to prevent object reallocation on every render.
const TOAST_VARIANTS = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
};

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={TOAST_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface border border-white/10 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md"
        >
          <CheckCircle className="text-primary" size={24} />
          <span className="text-white font-medium">{message}</span>
          <button onClick={onClose} className="ml-4 text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
