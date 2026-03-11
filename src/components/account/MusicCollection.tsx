/**
 * MusicCollection - User's Music Catalog summary
 * Displays a list of tracks with quick links
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';;
import { Music, Play, Download, ExternalLink } from 'lucide-react';
import { useTracksQuery } from '../../hooks/useQueries';
import { safeUrl } from '../../utils/sanitize';

export const MusicCollection: React.FC = () => {
    const { t } = useTranslation();
    const { data: tracks, isLoading } = useTracksQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Music className="text-white/10 mb-4" size={48} />
                <p className="text-white/30 font-black uppercase tracking-[0.3em] text-xs font-display">{t('loading')}</p>
            </div>
        );
    }

    // Limit to first 6 tracks for the "Collection" view in account
    const displayTracks = tracks?.slice(0, 6) || [];

    if (displayTracks.length === 0) {
        return (
            <div className="text-center py-20 bg-black/20 rounded-[2rem] border border-white/5 shadow-inner">
                <Music className="mx-auto mb-4 text-white/10" size={64} />
                <h3 className="text-2xl font-black font-display mb-3 tracking-tighter">{t('account.music.empty_title')}</h3>
                <p className="text-white/40 mb-8 max-w-sm mx-auto font-medium">
                    {t('account.music.empty_desc')}
                </p>
                <button className="btn btn-primary px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs">
                    {t('account.music.explore')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayTracks.map((track) => (
                    <m.div
                        key={track.id}
                        whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all shadow-lg overflow-hidden relative"
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/10">
                            {track.featured_image_src ? (
                                <img src={safeUrl(track.featured_image_src)} alt={track.title.rendered} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-surface-dark flex items-center justify-center"><Music className="text-white/20" /></div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-black font-display text-white truncate text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">
                                {track.title.rendered}
                            </h4>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate">
                                    {track.category_name || 'Remix'}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                {track.links.download && (
                                    <button className="p-2.5 rounded-lg bg-white/5 hover:bg-primary/20 text-white/40 hover:text-primary transition-all border border-white/5" title="Download">
                                        <Download size={16} />
                                    </button>
                                )}
                                <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5" title="View Hub">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    </m.div>
                ))}
            </div>

            <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-black font-display mb-2 tracking-tight">Expand Your Library</h3>
                    <p className="text-white/40 text-sm font-medium">Discover hundreds of non-stop remixes and high-fidelity sets.</p>
                </div>
                <button className="btn btn-primary px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl">
                    Full Steam Hub
                </button>
            </div>
        </div>
    );
};
