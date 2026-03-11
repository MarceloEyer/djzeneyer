import React from 'react';
import { m } from 'framer-motion';;

interface ManaProgressBarProps {
  progress: number;
  label?: string;
  subLabel?: string;
}

const toPercent = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return value > 0 && value <= 1 ? value * 100 : value;
};

const ManaProgressBar: React.FC<ManaProgressBarProps> = ({
  progress,
  label,
  subLabel,
}) => {
  const parsedProgress = parseFloat(String(progress));
  const clampedProgress = Math.min(100, Math.max(0, toPercent(parsedProgress)));

  return (
    <div className="w-full select-none group">
      <div className="mb-3 flex items-end justify-between px-0.5">
        {(label || subLabel) && (
          <div className="flex flex-col">
            {label && (
              <span className="font-display text-[10px] font-black uppercase tracking-[0.25em] text-white/30 transition-colors group-hover:text-primary/60">
                {label}
              </span>
            )}
            {subLabel && (
              <span className="mt-0.5 font-display text-sm font-bold tracking-tight text-white/90 transition-colors group-hover:text-white">
                {subLabel}
              </span>
            )}
          </div>
        )}

        <span className="font-display text-lg font-black tabular-nums text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.4)]">
          {Math.round(clampedProgress)}%
        </span>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full border border-white/10 bg-[#0a0f16] p-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/10 to-transparent" />

        <m.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ type: 'spring', stiffness: 70, damping: 20 }}
          className="relative h-full overflow-hidden rounded-full bg-primary transition-all duration-700 group-hover:brightness-125"
          style={{
            boxShadow: 'inset 0 0 8px rgba(255,255,255,0.4), 0 0 15px rgba(var(--color-primary),0.5)',
          }}
        >
          <div className="absolute inset-x-0 top-0 z-10 h-[45%] bg-white/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

          {clampedProgress > 0 && (
            <m.div
              initial={{ left: '-100%' }}
              animate={{ left: '200%' }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
              className="absolute top-0 bottom-0 z-20 w-32 skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md"
            />
          )}

          {clampedProgress > 0 && (
            <div className="absolute right-0 top-0 z-30 h-full w-[10px]">
              <div className="h-full w-full bg-gradient-to-l from-white via-cyan-200 to-transparent blur-[1px]" />
              <div className="absolute right-[-2px] top-1/2 h-6 w-4 -translate-y-1/2 animate-pulse rounded-full bg-cyan-300/40 blur-xl" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background:repeating-linear-gradient(90deg,transparent,transparent_19px,black_20px)]" />
        </m.div>
      </div>
    </div>
  );
};

export default ManaProgressBar;
