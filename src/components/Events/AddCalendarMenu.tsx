import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddCalendarMenuProps {
    event: {
        title?: string;
        datetime?: string;
        date?: string;
        venue?: {
            name?: string;
            city?: string;
        };
    };
    variant?: 'primary' | 'ghost';
    className?: string;
}

const AddCalendarMenu = ({ event, variant = 'primary', className = '' }: AddCalendarMenuProps) => {
    const { t } = useTranslation();

    const getDetails = () => {
        const title = event.title ? event.title.replace(/<\/?[^>]+(>|$)/g, "") : 'Evento';
        const dateStr = event.datetime || event.date || new Date().toISOString();
        const dateObj = new Date(dateStr);
        const formatICS = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const start = formatICS(dateObj);
        const end = formatICS(new Date(dateObj.getTime() + 4 * 60 * 60 * 1000));

        const location = event.venue ? `${event.venue.name}, ${event.venue.city}` : "TBA";
        const eventUrl = `${window.location.origin}${window.location.pathname}`;
        const details = `${t('events_view_details', 'View details at')}: ${eventUrl}`;

        return { title, start, end, location, details };
    };

    const googleUrl = () => {
        const { title, start, end, location, details } = getDetails();
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    };

    const downloadIcs = () => {
        const { title, start, end, location, details } = getDetails();
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//ZenEyer//DJ Zen Eyer//EN',
            'BEGIN:VEVENT',
            `SUMMARY:${title}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `LOCATION:${location}`,
            `DESCRIPTION:${details}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join("\r\n");

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.ics`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const btnClass = variant === 'primary'
        ? "btn btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-wider"
        : "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all";

    return (
        <div className={`relative flex flex-col gap-2 ${className}`}>
            {variant === 'primary' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => window.open(googleUrl(), '_blank')} className="btn btn-outline border-white/10 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/5 tracking-tighter">Google Calendar</button>
                    <button onClick={downloadIcs} className="btn btn-outline border-white/10 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/5 tracking-tighter">Apple / Outlook</button>
                </div>
            ) : (
                <div className="relative group">
                    <button className={btnClass} title={t('events_add_to_calendar', 'Add to Calendar')}>
                        <CalendarPlus size={16} />
                    </button>
                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex flex-col bg-surface-light border border-white/10 rounded-xl p-2 z-50 shadow-2xl min-w-[160px] animate-in fade-in slide-in-from-bottom-2">
                        <button onClick={() => window.open(googleUrl(), '_blank')} className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 rounded-lg text-xs font-bold uppercase transition-colors text-left">
                            Google
                        </button>
                        <button onClick={downloadIcs} className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 rounded-lg text-xs font-bold uppercase transition-colors text-left">
                            Apple / Outlook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCalendarMenu;
