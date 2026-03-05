import React from 'react';

interface ElectricBorderProps {
    children: React.ReactNode;
    active?: boolean;
    className?: string;
    intensity?: number;
}

/**
 * ElectricBorder - Applies a sharp lightning-like SVG filter on a background layer.
 * Isola a distorção para não afetar o conteúdo principal (imagem).
 */
export const ElectricBorder: React.FC<ElectricBorderProps> = ({
    children,
    active = true,
    className = '',
    intensity = 30
}) => {
    const filterId = "lightning-bolt-filter";

    return (
        <div className={`relative group ${className}`}>
            {/* SVG Filter Definition */}
            <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                <defs>
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        {/* High frequency fractal noise for fine lightning details */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" seed="1" result="noise">
                            <animate attributeName="seed" values="1;100" dur="1s" repeatCount="indefinite" />
                        </feTurbulence>

                        {/* Thresholding with ColorMatrix to turn noise into sharp bolts */}
                        <feColorMatrix in="noise" type="matrix" values="
                            0 0 0 0 0
                            0 0 0 0 0
                            0 0 0 0 0
                            18 -10 -10 -5 -1" result="bolts" />

                        {/* Blue-ish Electric Color */}
                        <feFlood floodColor="#3b82f6" floodOpacity="1" result="blue" />
                        <feComposite in="blue" in2="bolts" operator="in" result="coloredBolts" />

                        {/* Glow for the bolts */}
                        <feGaussianBlur in="coloredBolts" stdDeviation="1.5" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="coloredBolts" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            {/* Lightning Layer (Separated to not distort the image) */}
            {active && (
                <div
                    className="absolute -inset-4 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        filter: `url(#${filterId})`,
                    }}
                />
            )}

            {/* Main Content (Image stays sharp) */}
            <div className="relative z-10 transition-all duration-500">
                {children}
            </div>

            {/* Atmospheric Glow layers */}
            {active && (
                <>
                    <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute -inset-1 -z-20 rounded-[2.6rem] bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 blur-lg animate-pulse-slow" />
                </>
            )}
        </div>
    );
};
