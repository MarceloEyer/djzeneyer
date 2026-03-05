import React from 'react';
import { motion } from 'framer-motion';

interface ManaProgressBarProps {
    progress: number;
    label?: string;
    subLabel?: string;
}

const THEME = {
    fillStart: '#6366f1', // primary
    fillEnd: '#a855f7',   // secondary
    glow: 'rgba(99, 102, 241, 0.4)',
    track: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.05)',
};

const ManaProgressBar: React.FC<ManaProgressBarProps> = ({
    progress,
    label,
    subLabel,
}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className="w-full select-none">
            {/* ── Label Row ─────────────────────────────────────────────────── */}
            <div className="flex justify-between items-end mb-2 px-1">
                {(label || subLabel) && (
                    <div className="flex flex-col">
                        {label && (
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-display">
                                {label}
                            </span>
                        )}
                        {subLabel && (
                            <span className="text-sm font-bold text-white/90 font-display mt-0.5">
                                {subLabel}
                            </span>
                        )}
                    </div>
                )}
                <div className="text-right">
                    <span
                        className="text-lg font-black font-display tabular-nums bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        style={{ filter: `drop-shadow(0 0 8px ${THEME.glow})` }}
                    >
                        {clampedProgress}%
                    </span>
                </div>
            </div>

            {/* ── Progress Track (The Zen Way: Thin & Glowing) ────────────────── */}
            <div
                className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"
                style={{ background: THEME.track }}
            >
                {/* ── Fill ───────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${THEME.fillStart}, ${THEME.fillEnd})`,
                        boxShadow: `0 0 10px ${THEME.glow}`,
                    }}
                >
                    {/* Subtle Shimmer Overlay */}
                    <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default ManaProgressBar;
