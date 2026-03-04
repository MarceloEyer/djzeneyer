import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ZenBitEventListItem } from '../../types/events';

interface AddCalendarMenuProps {
    event: ZenBitEventListItem;
    variant?: 'primary' | 'ghost';
    className?: string;
}

const AddCalendarMenu = ({ event, variant = 'primary', className = '' }: AddCalendarMenuProps) => {
    const { t } = useTranslation();

    const getDetails = () => {
        try {
            const title = event.title ? event.title.replace(/<\/?[^>]+(>|$)/g, "") : 'DJ Zen Eyer Event';

            // Validação de data v2 (starts_at)
            const rawDate = event.starts_at || '';
            const dateObj = new Date(rawDate);

            // Verifica se a data é válida antes de qualquer outra operação
            if (!rawDate || isNaN(dateObj.getTime())) {
                return null;
            }

            // Formato ICS/Google: AAAAMMDDTHHMMSSZ
            const formatICS = (d: Date) => {
                if (isNaN(d.getTime())) throw new Error("Invalid Date");
                return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
            };

            const start = formatICS(dateObj);
            // Fallback: +4 horas se não houver duração
            const endDate = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
            const end = formatICS(endDate);

            // Location v2: objeto plano
            const loc = event.location;
            const location = loc.venue ? `${loc.venue}, ${loc.city}` : (loc.city || "TBA");

            const eventUrl = `${window.location.origin}${window.location.pathname}`;
            const details = `${t('events_view_details')}: ${eventUrl}`;

            return { title, start, end, location, details };
        } catch (error) {
            console.error('[AddCalendarMenu] Error processing date:', error, event);
            return null;
        }
    };

    const details = getDetails();
    if (!details) return null;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.title)}&dates=${details.start}/${details.end}&details=${encodeURIComponent(details.details)}&location=${encodeURIComponent(details.location)}`;

    if (variant === 'primary') {
        return (
            <button
                onClick={() => window.open(googleUrl, '_blank')}
                className={`btn btn-outline border-primary/30 text-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-primary/10 transition-all ${className}`}
            >
                <CalendarPlus size={20} />
                {t('events_add_google')}
            </button>
        );
    }

    return (
        <button
            onClick={() => window.open(googleUrl, '_blank')}
            className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all ${className}`}
            title={t('events_add_google')}
        >
            <CalendarPlus size={16} />
        </button>
    );
};

export default AddCalendarMenu;
