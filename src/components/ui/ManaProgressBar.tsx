import React from 'react';
import { motion } from 'framer-motion';

interface ManaProgressBarProps {
    progress: number;
    label?: string;
    subLabel?: string;
}

const ManaProgressBar: React.FC<ManaProgressBarProps> = ({ progress, label, subLabel }) => {
    return (
        <div className="w-full max-w-md mx-auto md:mx-0">
            {(label || progress !== undefined) && (
                <div className="flex justify-between items-end mb-2 px-1">
                    {label && (
                        <span className="text-sm font-bold text-white/50">
                            {label}: <span className="text-white">{subLabel}</span>
                        </span>
                    )}
                    <span className="text-blue-400 font-black text-lg drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                        {progress}%
                    </span>
                </div>
            )}

            {/* Ornate RPG Container (Dual Frame) - SOLID COLORS */}
            <div className="relative h-7 p-[2px] bg-black rounded-lg border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Inner Frame Overlay (Simulating Metallic Edge) */}
                <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none z-20" />

                {/* Background Track (Solid Dark Deep Blue) */}
                <div className="h-full w-full bg-blue-950/60 rounded-[6px] relative overflow-hidden">

                    {/* Depth Shadow Layer (Inside the track) */}
                    <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] pointer-events-none rounded-[6px] z-10" />

                    {/* Progress Fill (Liquid Mana) - BASE LAYER (Solid Blue) */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                        className="h-full bg-blue-600 relative rounded-r-[4px] shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    >
                        {/* Liquid Surface Shine (Solid White with Low Opacity) */}
                        <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20 rounded-t-lg z-0" />

                        {/* Plasma/Liquid Texture Effect (Overlay pattern) */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />

                        {/* Animated Solid Highlights (Moving blocks instead of gradients) */}
                        <motion.div
                            animate={{
                                x: ['-100%', '300%'],
                                opacity: [0, 0.4, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-y-0 w-24 bg-white/30 skew-x-[-25deg]"
                        />

                        {/* Micro-bubbles/Sparkles (Small solid circles) */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, x: Math.random() * 100 + '%', opacity: 0 }}
                                    animate={{
                                        y: -10,
                                        opacity: [0, 1, 0],
                                        x: (Math.random() * 20 - 10) + '%'
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: i * 0.7
                                    }}
                                    className="absolute bottom-0 w-1 h-1 bg-white rounded-full"
                                />
                            ))}
                        </div>

                        {/* Glowing Front Edge (Solid White Line) */}
                        <div className="absolute top-0 right-0 h-full w-[2px] bg-white shadow-[0_0_10px_white] z-20" />

                        {/* Side Reflection (Solid color blocks) */}
                        <div className="absolute top-0 right-0 h-full w-2 bg-blue-400 opacity-30 z-10" />
                    </motion.div>
                </div>
            </div>

            {/* Subtle Bottom Glow (Solid color with blur/opacity) */}
            <div className="h-1 mx-4 bg-blue-500/5 blur-xl mt-[-4px]" />
        </div>
    );
};

export default ManaProgressBar;
