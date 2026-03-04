import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { BandsintownEvent } from '../../types/events';

interface AddCalendarMenuProps {
    event: BandsintownEvent;
    variant?: 'primary' | 'ghost';
    className?: string;
}

const AddCalendarMenu = ({ event, variant = 'primary', className = '' }: AddCalendarMenuProps) => {
    const { t } = useTranslation();

    const getDetails = () => {
        const title = event.title ? event.title.replace(/<\/?[^>]+(>|$)/g, "") : 'DJ Zen Eyer Event';

        // Validação robusta de data conforme feedback CodeRabbit
        const rawDate = event.datetime || '';
        const dateObj = new Date(rawDate);

        if (!rawDate || isNaN(dateObj.getTime())) {
            return null;
        }

        // Formato ICS/Google: AAAAMMDDTHHMMSSZ
        const formatICS = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const start = formatICS(dateObj);
        // Fallback: +4 horas se não houver duração
        const end = formatICS(new Date(dateObj.getTime() + 4 * 60 * 60 * 1000));

        const location = event.venue ? `${event.venue.name}, ${event.venue.city}` : "TBA";
        const eventUrl = `${window.location.origin}${window.location.pathname}`;
        const details = `${t('events_view_details', 'View details at')}: ${eventUrl}`;

        return { title, start, end, location, details };
    };

    const details = getDetails();
    if (!details) return null; // Não renderiza o menu se a data for inválida

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.title)}&dates=${details.start}/${details.end}&details=${encodeURIComponent(details.details)}&location=${encodeURIComponent(details.location)}`;

    if (variant === 'primary') {
        return (
            <button
                onClick={() => window.open(googleUrl(), '_blank')}
                className={`btn btn-outline border-primary/30 text-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-primary/10 transition-all ${className}`}
            >
                <CalendarPlus size={20} />
                {t('events_add_google', 'Add to Google Calendar')}
            </button>
        );
    }

    return (
        <button
            onClick={() => window.open(googleUrl(), '_blank')}
            className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all ${className}`}
            title={t('events_add_google', 'Add to Google Calendar')}
        >
            <CalendarPlus size={16} />
        </button>
    );
};

export default AddCalendarMenu;
