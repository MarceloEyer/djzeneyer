import React from 'react';
import { useTranslation } from 'react-i18next';
import { safeUrl, sanitizeTitleHtml } from '../../utils/sanitize';
import { stripHtml } from '../../utils/text';
import { Music } from 'lucide-react';
import patternSvg from '../../assets/images/pattern.svg';
import { getDateTimeFormatter } from '../../utils/date';

interface EventMediaProps {
    image?: string;
    title: string;
    date?: string;
    venue?: string;
    className?: string;
}

/**
 * EventMedia - Displays event image with ElectricBorder effect.
 * If image is missing, renders a dynamic "Smart Poster" fallback.
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

    const formattedDate = date ? getDateTimeFormatter(lang, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(date)) : '';

    const renderFallback = () => (
        <div className="w-full h-full bg-gradient-to-br from-surface to-background relative flex flex-col items-center justify-center p-8 text-center overflow-hidden border border-white/5 rounded-[2.5rem]">
            {/* Subtle Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url(${patternSvg})`, backgroundSize: '30px' }}
            />

            {/* Poster Content */}
            <div className="relative z-10 w-full space-y-6">
                <div className="w-12 h-1 bg-primary/30 mx-auto rounded-full" />

                <h3
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display text-white leading-[0.85] break-words"
                    style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeTitleHtml(title) }}
                />

                <div className="pt-4 space-y-2 opacity-60">
                    {formattedDate && (
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            {formattedDate}
                        </p>
                    )}
                    {venue && (
                        <p className="text-[10px] uppercase tracking-[0.15em] font-medium max-w-[200px] mx-auto line-clamp-2">
                            {venue}
                        </p>
                    )}
                </div>

                <div className="pt-8">
                     <Music className="w-6 h-6 mx-auto text-white/10" />
                </div>
            </div>

            {/* Edge highlights */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
    );


    return (
        <div className={`aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ${className}`}>
            {image ? (
                <img
                    src={safeUrl(image)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={stripHtml(title)}
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
