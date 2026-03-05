import React from 'react';
import { motion } from 'framer-motion';

interface ManaProgressBarProps {
    progress: number;
    label?: string;
    subLabel?: string;
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

const THEME = {
    fill: '#1d4ed8',
    fillMid: '#3b82f6',
    fillEdge: '#93c5fd',
    glow: 'rgba(59,130,246,0.7)',
    glowSoft: 'rgba(59,130,246,0.2)',
    track: 'rgba(15,23,42,0.9)',
    rune: '#60a5fa',
    label: '#93c5fd',
    shimmer: 'rgba(147,197,253,0.35)',
};

const ManaProgressBar: React.FC<ManaProgressBarProps> = ({
    progress,
    label,
    subLabel,
}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className="w-full max-w-md mx-auto md:mx-0 select-none">
            {/* ── Label row ──────────────────────────────────────────────────── */}
            {(label || progress !== undefined) && (
                <div className="flex justify-between items-end mb-1.5 px-0.5">
                    {label && (
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
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
                            color: THEME.label,
                            textShadow: `0 0 12px ${THEME.glow}`,
                        }}
                    >
                        {clampedProgress}%
                    </span>
                </div>
            )}

            {/* ── Outer frame (Simple and Elegant) ─────────────────────────────── */}
            <div
                className="relative rounded-lg"
                style={{
                    padding: '2px',
                    background: `rgba(255,255,255,0.05)`,
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)`,
                }}
            >
                {/* ── Inner track ──────────────────────────────────────────────── */}
                <div
                    className="relative h-5 rounded-md overflow-hidden"
                    style={{
                        background: THEME.track,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* ── Mana fill ──────────────────────────────────────────────── */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clampedProgress}%` }}
                        transition={{ type: 'spring', stiffness: 45, damping: 18 }}
                        className="absolute inset-y-0 left-0 z-10 overflow-hidden"
                    >
                        {/* Base fill gradient */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(180deg,
                  ${THEME.fillEdge} 0%,
                  ${THEME.fillMid} 35%,
                  ${THEME.fill} 100%
                )`,
                            }}
                        />

                        {/* Animated shimmer sweep */}
                        <motion.div
                            animate={{ x: ['-120%', '220%'] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-y-0 w-24 pointer-events-none"
                            style={{
                                background: `linear-gradient(90deg, transparent 0%, ${THEME.shimmer} 50%, transparent 100%)`,
                                transform: 'skewX(-20deg)',
                            }}
                        />

                        {/* Subtle Bubbles */}
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
                                        background: 'rgba(255,255,255,0.4)',
                                    }}
                                    animate={{ y: [-2, -20], opacity: [0, 0.6, 0] }}
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
                            className="absolute top-0 right-0 h-full w-[2px]"
                            style={{
                                background: `white`,
                                boxShadow: `0 0 10px ${THEME.glow}`,
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ManaProgressBar;
