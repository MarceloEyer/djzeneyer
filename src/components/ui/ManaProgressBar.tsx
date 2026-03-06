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
    const numericProgress = Number(progress) || 0;
    const clampedProgress = Math.min(100, Math.max(0, numericProgress));

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
                        className="text-lg font-black font-display tabular-nums text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.4)]"
                    >
                        {clampedProgress}%
                    </span>
                </div>
            </div>

            {/* ── Progress Track (MMORPG Style) ────────── */}
            <div className="h-4 w-full bg-[#0a0f16] rounded-full overflow-hidden border border-white/10 relative p-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)]">
                {/* Gloss Overlay for the whole track */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />

                {/* ── Fill Container —————————————————————————————————————— */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ type: 'spring', stiffness: 45, damping: 15 }}
                    className="h-full rounded-full relative group-hover:brightness-125 transition-all duration-700 overflow-hidden bg-primary"
                    style={{
                        boxShadow: 'inset 0 0 8px rgba(255,255,255,0.4), 0 0 15px rgba(var(--color-primary),0.5)'
                    }}
                >
                    {/* 1. AAA Glossy Layer (Upper half lighter) */}
                    <div className="absolute top-0 left-0 right-0 h-[45%] bg-white/20 z-10" />

                    {/* 2. Deep Gradient Body */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

                    {/* 3. Flare Animation (Shine moving across) */}
                    <motion.div
                        initial={{ left: '-100%' }}
                        animate={{ left: '200%' }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                        className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] blur-md z-20"
                    />

                    {/* 4. Electric Edge / Sparkle Tip */}
                    {clampedProgress > 0 && (
                        <div className="absolute top-0 right-0 h-full w-[10px] z-30">
                            <div className="h-full w-full bg-gradient-to-l from-white via-cyan-200 to-transparent blur-[1px]" />
                            <div className="absolute top-1/2 -translate-y-1/2 right-[-2px] w-4 h-6 bg-cyan-300/40 blur-xl rounded-full animate-pulse" />
                        </div>
                    )}

                    {/* 5. Chamber Lines (Micro-segments) */}
                    <div className="absolute inset-0 opacity-[0.1] bg-[repeating-linear-gradient(90deg,transparent,transparent_19px,black_20px)] pointer-events-none" />
                </motion.div>
            </div>
        </div>
    );
};

export default ManaProgressBar;
