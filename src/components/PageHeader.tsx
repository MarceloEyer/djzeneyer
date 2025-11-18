// src/components/PageHeader.tsx

import React from 'react';

interface PageHeaderProps {
    /** O título principal da página. Deve ser o H1. */
    title: string;
    /** Subtítulo ou tagline, geralmente renderizado como H2. */
    subtitle?: string;
    /** Estilização customizada (Tailwind) */
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className = '' }) => {
    return (
        <header className={`text-center py-12 ${className}`} role="heading" aria-level={1}>
            {/* H1 ÚNICO E CRÍTICO PARA SEO */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary-light mb-2">
                {title}
            </h1>
            
            {/* H2 para Subtítulo (Hierarquia correta) */}
            {subtitle && (
                <h2 className="text-xl md:text-2xl text-white/70 mt-2">
                    {subtitle}
                </h2>
            )}
        </header>
    );
};