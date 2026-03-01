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
        const title = event.title || 'Evento';
        const dateStr = event.datetime || event.date || new Date().toISOString();
        const start = new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(new Date(dateStr).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const location = event.venue ? `${event.venue.name}, ${event.venue.city} ` : "TBA";
        const details = `${t('events_view_more_details', 'View details at djzeneyer.com')} `;
        return { title, start, end, location, details };
    };

    const googleUrl = () => {
        const { title, start, end, location, details } = getDetails();
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    };

    const downloadIcs = () => {
        const { title, start, end, location, details } = getDetails();
        const ics = [`BEGIN:VCALENDAR`, `VERSION:2.0`, `BEGIN:VEVENT`, `SUMMARY:${title}`, `DTSTART:${start}`, `DTEND:${end}`, `LOCATION:${location}`, `DESCRIPTION:${details}`, `END:VEVENT`, `END:VCALENDAR`].join("\r\n");
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.ics`;
        a.click();
    };

    const btnClass = variant === 'primary'
        ? "btn btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-wider"
        : "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all";

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {variant === 'primary' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => window.open(googleUrl(), '_blank')} className="btn btn-outline border-white/10 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/5 tracking-tighter">Google Calendar</button>
                    <button onClick={downloadIcs} className="btn btn-outline border-white/10 py-3 rounded-xl text-xs font-bold uppercase hover:bg-white/5 tracking-tighter">Apple / iCal</button>
                </div>
            ) : (
                <div className="flex gap-1">
                    <button onClick={() => window.open(googleUrl(), '_blank')} className={btnClass} title="Google Calendar"><CalendarPlus size={16} /></button>
                    <button onClick={downloadIcs} className={btnClass} title="Apple Calendar"><CalendarPlus size={16} /></button>
                </div>
            )}
        </div>
    );
};

export default AddCalendarMenu;
