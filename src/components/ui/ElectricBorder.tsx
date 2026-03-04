import React from 'react';

interface ElectricBorderProps {
    children: React.ReactNode;
    active?: boolean;
    className?: string;
    intensity?: number;
}

/**
 * ElectricBorder - Applies a turbulent displacement SVG filter to create an "Electric" effect.
 * Optimized for performance by using fewer octaves and CSS animations.
 */
export const ElectricBorder: React.FC<ElectricBorderProps> = ({
    children,
    active = true,
    className = '',
    intensity = 30
}) => {
    const filterId = "electric-turbo-filter";

    return (
        <div className={`relative group ${className}`}>
            {/* SVG Filter Definition */}
            <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                <defs>
                    <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
                        {/* Turbulence for the "lightning" noise */}
                        <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="noise1" seed="1" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                            <animate attributeName="dy" values="300; 0" dur="4s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" result="noise2" seed="2" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                            <animate attributeName="dx" values="0; -300" dur="5s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feComposite in="offsetNoise1" in2="offsetNoise2" operator="arithmetic" k1="0" k2="0.5" k3="0.5" k4="0" result="combinedNoise" />

                        {/* The Displacement Map that creates the "Electric" shake on the borders */}
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="combinedNoise"
                            scale={active ? intensity : 0}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Main Content with Filter Applied */}
            <div
                className="relative z-10 transition-all duration-500"
                style={{
                    filter: active ? `url(#${filterId})` : 'none',
                }}
            >
                {children}
            </div>

            {/* Glow layers to enhance the electric feel */}
            {active && (
                <>
                    <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -inset-1 -z-20 rounded-[2.6rem] bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-30 blur-lg animate-pulse-slow" />
                </>
            )}
        </div>
    );
};
