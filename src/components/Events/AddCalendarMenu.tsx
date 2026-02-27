import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, Calendar, Mail, ExternalLink, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { stripHtml } from '../../utils/text';

interface EventData {
    id: number | string;
    title: { rendered: string } | string;
    date?: string;
    datetime?: string;
    venue?: {
        name: string;
        city: string;
        country: string;
    };
    content?: { rendered: string } | string;
}

interface AddCalendarMenuProps {
    event: EventData;
    className?: string;
    variant?: 'primary' | 'outline' | 'ghost';
    showLabel?: boolean;
}

// --- UTILS ---
const getEventDetails = (event: EventData) => {
    const title = typeof event.title === 'string' ? event.title : event.title?.rendered || 'Evento';
    const start = new Date(event.date || event.datetime || new Date()).toISOString().replace(/-|:|\.\d\d\d/g, "");
    // Padronizar duração para 4 horas caso não venha da API
    const end = new Date(new Date(event.date || event.datetime || new Date()).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const location = event.venue ? `${event.venue.name}, ${event.venue.city}, ${event.venue.country}` : "TBA";
    const content = typeof event.content === 'string' ? event.content : event.content?.rendered || "";
    const details = stripHtml(content).substring(0, 500);

    return { title, start, end, location, details };
};

const getGoogleCalendarUrl = (event: EventData) => {
    const { title, start, end, location, details } = getEventDetails(event);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
};

const getOutlookUrl = (event: EventData) => {
    const { title, start, end, location, details } = getEventDetails(event);
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
};

const downloadICS = (event: EventData) => {
    const { title, start, end, location, details } = getEventDetails(event);

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//DJ Zen Eyer//Events//PT",
        "BEGIN:VEVENT",
        `UID:${event.id}@djzeneyer.com`,
        `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${details}`,
        `LOCATION:${location}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    link.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
};

// --- ICONS ---
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M45 12V36C45 38.2091 43.2091 40 41 40H7C4.79086 40 3 38.2091 3 36V12C3 9.79086 4.79086 8 7 8H41C43.2091 8 45 9.79086 45 12Z" />
        <path fill="#FBBC05" d="M9 13H15V19H9V13Z" />
        <path fill="#34A853" d="M17 13H23V19H17V13Z" />
        <path fill="#EA4335" d="M25 13H31V19H25V13Z" />
        <path fill="#4285F4" d="M33 13H39V19H33V13Z" />
        <path fill="white" d="M31 24H17V33H31V24Z" />
        <path fill="#4285F4" d="M26 26H22V31H26V26Z" />
    </svg>
);

const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 1.72-1.16 0-1.54-.71-2.91-.71-1.39 0-1.8.71-2.91.71-1.18 0-2.31-.83-3.29-1.8C2.71 18.23 1.35 15.11 1.35 12.11c0-3.07 1.94-4.7 3.84-4.7 1 0 1.86.64 2.64.64.75 0 1.75-.7 2.89-.7 1.48 0 2.58.74 3.19 1.63-3.07 1.83-2.58 5.76.5 7-.65 1.58-1.5 3.32-2.36 4.3zM12.03 7.25c-.02-2.31 1.83-4.21 4.14-4.25.04 2.29-1.89 4.29-4.14 4.25z" />
    </svg>
);

const OutlookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H21C22.1046 19 23 18.1046 23 17V7C23 5.89543 22.1046 5 21 5Z" fill="#0078D4" />
        <path d="M12 11.5L23 5V17C23 18.1046 22.1046 19 21 19H12V11.5Z" fill="#005A9E" />
        <path d="M1 7V17C1 18.1046 1.89543 19 3 19H12V11.5L1 5V7Z" fill="#50E6FF" />
        <path d="M21 5H3C2.35 5 1.75 5.23 1.3 5.61L12 12.5L22.7 5.61C22.25 5.23 21.65 5 21 5Z" fill="#FFF" />
    </svg>
);

const AddCalendarMenu: React.FC<AddCalendarMenuProps> = ({
    event,
    className = "",
    variant = "outline",
    showLabel = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const variants = {
        primary: "btn btn-primary shadow-xl shadow-primary/20",
        outline: "btn btn-outline border-white/10 hover:bg-white/5",
        ghost: "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
    };

    const menuItems = [
        {
            label: 'Google Calendar',
            icon: <GoogleIcon />,
            onClick: () => window.open(getGoogleCalendarUrl(event), '_blank')
        },
        {
            label: 'Apple / iCal',
            icon: <AppleIcon />,
            onClick: () => downloadICS(event)
        },
        {
            label: 'Outlook.com',
            icon: <OutlookIcon />,
            onClick: () => window.open(getOutlookUrl(event), '_blank')
        }
    ];

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`${variants[variant]} flex items-center gap-2 group`}
                title={t('events_add_to_calendar', 'Add to Calendar')}
            >
                <CalendarPlus size={variant === 'ghost' ? 18 : 20} className={variant === 'ghost' ? '' : 'text-primary'} />
                {showLabel && (
                    <>
                        <span className="font-bold uppercase tracking-wider text-sm">
                            {t('events_add_to_calendar', 'Add to Calendar')}
                        </span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="absolute right-0 bottom-full mb-4 w-64 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-2 space-y-1">
                            {menuItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        item.onClick();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3 text-left text-sm font-medium hover:bg-white/5 rounded-xl transition-colors group"
                                >
                                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span className="flex-1 text-white/80 group-hover:text-white">{item.label}</span>
                                    <ExternalLink size={14} className="text-white/20 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddCalendarMenu;
