import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ARTIST } from '../../data/artistData';

import { trackSelectContent } from '../../lib/analytics';
import { logger } from '../../lib/logger';
import { getPlainTitle } from '../../utils/events';
import type { ZenBitEventListItem } from '../../types/events';

interface AddCalendarMenuProps {
    event: ZenBitEventListItem;
    variant?: 'primary' | 'ghost';
    className?: string;
    eventUrl?: string;
}


const AddCalendarMenu = ({ event, variant = 'primary', className = '', eventUrl }: AddCalendarMenuProps) => {
    const { t } = useTranslation();

    const getDetails = () => {
        try {
            const title = getPlainTitle(event.title) || t('event_default_title');

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

            const fallbackUrl = `${ARTIST.site.baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
            const canonicalEventUrl = eventUrl || event.canonical_url || fallbackUrl;
            const details = `${t('events_view_details')}: ${canonicalEventUrl}`;

            return { title, start, end, location, details };
        } catch (error) {
            logger.error('ADD_CALENDAR_MENU', 'Error processing date', { error: String(error), event });
            return null;
        }
    };

    const details = getDetails();
    if (!details) return null;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(details.title)}&dates=${details.start}/${details.end}&details=${encodeURIComponent(details.details)}&location=${encodeURIComponent(details.location)}`;
    const calendarLabel = `${t('events_add_google')}: ${details.title}`;

    const openCalendar = () => {
        trackSelectContent('event_calendar', event.event_id || details.title, {
            item_name: details.title,
            calendar_provider: 'google',
            ui_variant: variant,
        });
        window.open(googleUrl, '_blank');
    };

    if (variant === 'primary') {
        return (
            <button
                onClick={openCalendar}
                className={`btn btn-outline border-primary/30 text-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm hover:bg-primary/10 transition-all ${className}`}
                title={calendarLabel}
                aria-label={calendarLabel}
            >
                <CalendarPlus size={20} />
                {t('events_add_google')}
            </button>
        );
    }

    return (
        <button
            onClick={openCalendar}
            className={`w-10 h-10 rounded-xl bg-text/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all ${className}`}
            title={calendarLabel}
            aria-label={calendarLabel}
        >
            <CalendarPlus size={16} />
        </button>
    );
};

export default AddCalendarMenu;
