import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ManaProgressBarProps {
    progress: number;
    label?: string;
    subLabel?: string;
    color?: 'blue' | 'purple' | 'green' | 'gold';
}

/** Fixed positions for bubbles — stable across re-renders */
const BUBBLE_CONFIG = [
    { x: 8, delay: 0.0, dur: 2.4, size: 3 },
    { x: 23, delay: 0.9, dur: 1.9, size: 2 },
    { x: 41, delay: 0.4, dur: 2.8, size: 2 },
    { x: 62, delay: 1.5, dur: 2.1, size: 3 },
    { x: 78, delay: 0.7, dur: 1.7, size: 2 },
    { x: 90, delay: 1.2, dur: 2.5, size: 2 },
];

const COLOR_THEMES = {
    blue: {
        fill: '#1d4ed8',
        fillMid: '#3b82f6',
        fillEdge: '#93c5fd',
        glow: 'rgba(59,130,246,0.7)',
        glowSoft: 'rgba(59,130,246,0.2)',
        track: 'rgba(15,23,42,0.9)',
        rune: '#60a5fa',
        label: '#93c5fd',
        shimmer: 'rgba(147,197,253,0.35)',
    },
    purple: {
        fill: '#6d28d9',
        fillMid: '#8b5cf6',
        fillEdge: '#c4b5fd',
        glow: 'rgba(139,92,246,0.7)',
        glowSoft: 'rgba(139,92,246,0.2)',
        track: 'rgba(15,10,30,0.9)',
        rune: '#a78bfa',
        label: '#c4b5fd',
        shimmer: 'rgba(196,181,253,0.35)',
    },
    green: {
        fill: '#065f46',
        fillMid: '#10b981',
        fillEdge: '#6ee7b7',
        glow: 'rgba(16,185,129,0.7)',
        glowSoft: 'rgba(16,185,129,0.2)',
        track: 'rgba(5,20,15,0.9)',
        rune: '#34d399',
        label: '#6ee7b7',
        shimmer: 'rgba(110,231,183,0.35)',
    },
    gold: {
        fill: '#92400e',
        fillMid: '#f59e0b',
        fillEdge: '#fde68a',
        glow: 'rgba(245,158,11,0.7)',
        glowSoft: 'rgba(245,158,11,0.2)',
        track: 'rgba(20,14,0,0.9)',
        rune: '#fbbf24',
        label: '#fde68a',
        shimmer: 'rgba(253,230,138,0.35)',
    },
};

const ManaProgressBar: React.FC<ManaProgressBarProps> = ({
    progress,
    label,
    subLabel,
    color = 'blue',
}) => {
    const t = COLOR_THEMES[color];
    const clampedProgress = Math.min(100, Math.max(0, progress));

    // Rune tick marks — purely decorative
    const ticks = useMemo(
        () => [20, 40, 60, 80].map((pct) => ({ pct, active: clampedProgress >= pct })),
        [clampedProgress]
    );

    return (
        <div className="w-full max-w-md mx-auto md:mx-0 select-none">
            {/* ── Label row ──────────────────────────────────────────────────── */}
            {(label || progress !== undefined) && (
                <div className="flex justify-between items-end mb-1.5 px-0.5">
                    {label && (
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: t.rune, opacity: 0.7 }}>
                            {label}
                            {subLabel && (
                                <span className="ml-1 normal-case tracking-normal font-bold text-white/80">
                                    {subLabel}
                                </span>
                            )}
                        </span>
                    )}
                    <span
                        className="text-base font-black tabular-nums"
                        style={{
                            color: t.label,
                            textShadow: `0 0 12px ${t.glow}, 0 0 24px ${t.glowSoft}`,
                        }}
                    >
                        {clampedProgress}%
                    </span>
                </div>
            )}

            {/* ── Outer frame (jewel-set border) ─────────────────────────────── */}
            <div
                className="relative rounded-sm"
                style={{
                    padding: '2px',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.4) 100%)`,
                    boxShadow: `0 0 0 1px rgba(0,0,0,0.8), 0 0 16px ${t.glowSoft}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
            >
                {/* Corner jewels */}
                {['-top-[3px] -left-[3px]', '-top-[3px] -right-[3px]', '-bottom-[3px] -left-[3px]', '-bottom-[3px] -right-[3px]'].map((pos, i) => (
                    <div
                        key={i}
                        className={`absolute ${pos} w-[6px] h-[6px] rounded-full z-30`}
                        style={{
                            background: t.fillEdge,
                            boxShadow: `0 0 4px ${t.glow}, 0 0 8px ${t.glow}`,
                        }}
                    />
                ))}

                {/* ── Inner track ──────────────────────────────────────────────── */}
                <div
                    className="relative h-6 rounded-[1px] overflow-hidden"
                    style={{
                        background: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, ${t.track} 30%, ${t.track} 70%, rgba(0,0,0,0.5) 100%)`,
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), inset 0 -1px 2px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Scanline texture overlay */}
                    <div
                        className="absolute inset-0 z-20 pointer-events-none opacity-[0.07]"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.5) 1px, rgba(255,255,255,0.5) 2px)',
                            backgroundSize: '100% 2px',
                        }}
                    />

                    {/* ── Mana fill ──────────────────────────────────────────────── */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clampedProgress}%` }}
                        transition={{ type: 'spring', stiffness: 45, damping: 18, mass: 1 }}
                        className="absolute inset-y-0 left-0 z-10 overflow-hidden"
                        style={{ minWidth: clampedProgress > 0 ? '4px' : 0 }}
                    >
                        {/* Base fill gradient */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(180deg,
                  ${t.fillEdge} 0%,
                  ${t.fillMid} 25%,
                  ${t.fill} 60%,
                  rgba(0,0,0,0.3) 100%
                )`,
                            }}
                        />

                        {/* Inner top shine */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[35%]"
                            style={{
                                background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
                            }}
                        />

                        {/* Animated shimmer sweep */}
                        <motion.div
                            animate={{ x: ['-120%', '220%'] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                            className="absolute inset-y-0 w-16 pointer-events-none"
                            style={{
                                background: `linear-gradient(105deg, transparent 0%, ${t.shimmer} 50%, transparent 100%)`,
                                transform: 'skewX(-20deg)',
                            }}
                        />

                        {/* Bubbles (stable positions, no Math.random in render) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {BUBBLE_CONFIG.map((b, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        width: b.size,
                                        height: b.size,
                                        left: `${b.x}%`,
                                        bottom: 0,
                                        background: 'rgba(255,255,255,0.85)',
                                        boxShadow: `0 0 3px rgba(255,255,255,0.5)`,
                                    }}
                                    animate={{ y: [-2, -24], opacity: [0, 0.9, 0] }}
                                    transition={{
                                        duration: b.dur,
                                        repeat: Infinity,
                                        delay: b.delay,
                                        ease: 'easeOut',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Leading edge glow */}
                        <div
                            className="absolute top-0 right-0 h-full w-[3px]"
                            style={{
                                background: `linear-gradient(180deg, white 0%, ${t.fillEdge} 100%)`,
                                boxShadow: `0 0 8px 2px ${t.glow}, 0 0 20px ${t.glow}`,
                            }}
                        />
                    </motion.div>

                    {/* ── Rune tick marks ────────────────────────────────────────── */}
                    {ticks.map(({ pct, active }) => (
                        <div
                            key={pct}
                            className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
                            style={{
                                left: `${pct}%`,
                                background: active
                                    ? `linear-gradient(180deg, transparent, ${t.rune}, transparent)`
                                    : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)',
                                opacity: active ? 0.6 : 0.3,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Floor glow reflection ───────────────────────────────────────── */}
            <div
                className="h-px mx-2 mt-0.5 rounded-full"
                style={{
                    background: `linear-gradient(90deg, transparent, ${t.glow}, transparent)`,
                    opacity: clampedProgress / 100,
                    filter: 'blur(2px)',
                }}
            />
        </div>
    );
};

export default ManaProgressBar;
