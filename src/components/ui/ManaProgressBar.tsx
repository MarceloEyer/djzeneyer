import React from 'react';
import { motion } from 'framer-motion';

interface ManaProgressBarProps {
    progress: number;
    label?: string;
    subLabel?: string;
}

/**
 * MMORPG Style Power Bar
 * Aligned with Dashboard_CONTEXT.md rules:
 * - Fluid Capsule Shape (rounded-full)
 * - Flare Animation (moving brightness)
 * - Electric Tip (bright sparkle at the end)
 * - Primary Color base (#0D96FF)
 */
const ManaProgressBar: React.FC<ManaProgressBarProps> = ({
    progress,
    label,
    subLabel,
}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className="w-full select-none group">
            {/* ── Label Row ─────────────────────────────────────────────────── */}
            <div className="flex justify-between items-end mb-2.5 px-0.5">
                {(label || subLabel) && (
                    <div className="flex flex-col">
                        {label && (
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 font-display transition-colors group-hover:text-primary/50">
                                {label}
                            </span>
                        )}
                        {subLabel && (
                            <span className="text-sm font-bold text-white/90 font-display mt-0.5 tracking-tight group-hover:text-white transition-colors">
                                {subLabel}
                            </span>
                        )}
                    </div>
                )}
                <div className="text-right">
                    <span
                        className="text-lg font-black font-display tabular-nums bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(var(--color-primary),0.4)]"
                    >
                        {clampedProgress}%
                    </span>
                </div>
            </div>

            {/* ── Progress Track (MMORPG Style) ────────── */}
            <div className="h-3.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative p-[1px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">

                {/* ── Fill Container —————————————————————————————————————— */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ type: 'spring', stiffness: 45, damping: 15 }}
                    className="h-full bg-primary rounded-full relative group-hover:brightness-110 transition-all duration-500 overflow-hidden"
                    style={{
                        boxShadow: '0 0 15px rgba(var(--color-primary), 0.4)'
                    }}
                >
                    {/* 1. Dynamic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary/30 to-primary/80" />

                    {/* 2. Flare Animation (Shine moving across) */}
                    <motion.div
                        initial={{ left: '-100%' }}
                        animate={{ left: '200%' }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                        className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] blur-sm"
                    />

                    {/* 3. Electric Edge / Sparkle Tip */}
                    {clampedProgress > 0 && (
                        <div className="absolute top-0 right-0 h-full">
                            <div className="h-full w-[4px] bg-white blur-[1px] shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-full bg-white/20 blur-md rounded-full animate-pulse" />
                        </div>
                    )}

                    {/* 4. Scanning lines (Micro-detail) */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,white_2px,white_4px)] pointer-events-none" />
                </motion.div>
            </div>
        </div>
    );
};

export default ManaProgressBar;
