import React, { useId } from 'react';

interface ElectricBorderProps {
    children: React.ReactNode;
    active?: boolean;
    className?: string;
    intensity?: number;
    color?: string;
}

/**
 * ElectricBorder — distorts a luminous gradient border, not the content.
 * Updated to use the official DJ Zen Eyer Electric Blue (#0D96FF)
 * Optimized for performance with reduced octaves and will-change hints.
 */
export const ElectricBorder: React.FC<ElectricBorderProps> = ({
    children,
    active = true,
    className = '',
    intensity = 6,
    color = '#0D96FF', // Official DJ Zen Eyer Electric Blue
}) => {
    const uid = useId().replace(/:/g, '');
    const filterId = `eb-filter-${uid}`;
    const glowId = `eb-glow-${uid}`;

    return (
        <div className={`relative group ${className}`} style={{ isolation: 'isolate' }}>
            {/* ── SVG filter definitions ───────────────────────────────────────── */}
            <svg
                className="absolute w-0 h-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    {/* Electric displacement filter — applied ONLY to the border layer */}
                    <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.035 0.06"
                            numOctaves="3" // Optimized for better performance
                            seed="3"
                            result="noise"
                        >
                            <animate
                                attributeName="seed"
                                values="3;17;5;29;11;3"
                                dur="0.4s"
                                repeatCount="indefinite"
                            />
                        </feTurbulence>

                        <feColorMatrix
                            in="noise"
                            type="matrix"
                            values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 30 -12"
                            result="sharpNoise"
                        />

                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="sharpNoise"
                            scale={intensity}
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="displaced"
                        />

                        <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
                        <feMerge>
                            <feMergeNode in="blurred" />
                            <feMergeNode in="displaced" />
                        </feMerge>
                    </filter>

                    <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>

            {/* ── Electric border layer (distorted, behind content) ───────────── */}
            {active && (
                <div
                    aria-hidden="true"
                    className="
            absolute -inset-[3px] rounded-[inherit]
            pointer-events-none
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            will-change-[filter,opacity]
          "
                    style={{ filter: `url(#${filterId})` }}
                >
                    <div
                        className="absolute inset-0 rounded-[inherit]"
                        style={{
                            background: `conic-gradient(
                from 0deg,
                transparent 0%,
                ${color} 15%,
                #ffffff 22%,
                ${color} 30%,
                transparent 45%,
                ${color}bb 60%,
                #ffffff 65%,
                ${color} 72%,
                transparent 88%,
                ${color}88 95%,
                transparent 100%
              )`,
                            padding: '2px',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                        }}
                    />
                </div>
            )}

            {/* ── Atmospheric bloom (soft, no distortion) ─────────────────────── */}
            {active && (
                <div
                    aria-hidden="true"
                    className="
            absolute -inset-6 rounded-[inherit]
            pointer-events-none
            opacity-0 group-hover:opacity-70
            transition-all duration-500
          "
                    style={{
                        background: `radial-gradient(ellipse at center, ${color}33 0%, transparent 70%)`,
                        filter: 'blur(8px)',
                    }}
                />
            )}

            {/* ── Actual content — untouched by any filter ─────────────────────── */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};
