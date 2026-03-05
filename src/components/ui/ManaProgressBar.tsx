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

            {/* ── Progress Track (Original Zen Tribe Style: Simple & Clean) ────────── */}
            <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                {/* ── Fill ───────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    className="h-full bg-primary rounded-full"
                />
            </div>
        </div>
    );
};

export default ManaProgressBar;
