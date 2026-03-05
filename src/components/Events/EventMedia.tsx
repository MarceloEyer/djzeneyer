import React from 'react';
import { useTranslation } from 'react-i18next';
import { safeUrl } from '../../utils/sanitize';
import { Calendar, Music } from 'lucide-react';

interface EventMediaProps {
    image?: string;
    title: string;
    date?: string;
    venue?: string;
    className?: string;
}

/**
 * EventMedia - Displays event image with ElectricBorder effect.
 * If image is missing, renders a dynamic "Poster" fallback.
 */
export const EventMedia: React.FC<EventMediaProps> = ({
    image,
    title,
    date,
    venue,
    className = ''
}) => {
    const { i18n } = useTranslation();
    const lang = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

    const formattedDate = date ? new Date(date).toLocaleDateString(lang, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '';

    const renderFallback = () => (
        <div className="w-full h-full bg-surface relative flex flex-col items-center justify-center p-8 text-center overflow-hidden border border-white/10 rounded-[2.5rem]">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Music className="absolute -right-10 -bottom-10 w-64 h-64 rotate-12 text-primary" />
                <Calendar className="absolute -left-10 -top-10 w-48 h-48 -rotate-12 text-secondary" />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-4 px-6">
                <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full opacity-50" />
                {title && <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display text-white leading-[0.9] break-words drop-shadow-lg" dangerouslySetInnerHTML={{ __html: title }} />}
                <div className="space-y-1">
                    {formattedDate && <p className="text-primary font-bold uppercase tracking-[0.2em] text-sm">{formattedDate}</p>}
                    {venue && <p className="text-white/40 uppercase tracking-widest text-xs">{venue}</p>}
                </div>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>
    );

    return (
        <div className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ${className}`}>
            {image ? (
                <img
                    src={safeUrl(image)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={title}
                    onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement?.classList.add('bg-surface');
                    }}
                />
            ) : (
                renderFallback()
            )}
        </div>
    );
};
