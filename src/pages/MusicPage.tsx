// src/pages/MusicPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { Download, Music2, Clock, Filter, ExternalLink, Youtube, Cloud } from 'lucide-react';
import { useTracksQuery, MusicTrack } from '../hooks/useQueries';

const MusicPage: React.FC = () => {
  const { t } = useTranslation();
  const currentPath = '/music';
  
  // React Query: cache automático + deduplicação
  const { data: tracks = [], isLoading: loading, error } = useTracksQuery();
  
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>([]);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Log de erro
  if (error) {
    console.error('Error fetching tracks:', error);
  }

  const allTags = ['Todos', ...Array.from(new Set(tracks.flatMap(t => t.tag_names || [])))].filter(Boolean);

  useEffect(() => {
    let result = tracks;
    if (activeTag !== 'Todos') {
      result = result.filter(t => t.tag_names && t.tag_names.includes(activeTag));
    }
    if (searchQuery) {
      result = result.filter(t => t.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredTracks(result);
  }, [activeTag, searchQuery, tracks]);

  return (
    <>
      <HeadlessSEO 
        title="Downloads & Sets | DJ Zen Eyer" 
        description="Baixe remixes exclusivos e sets de Zouk Brasileiro. Ouça no SoundCloud e YouTube."
        url={`https://djzeneyer.com${currentPath}`}
        image="https://djzeneyer.com/images/music-og.jpg"
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
      />

      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black font-display mb-4">
              Music <span className="text-primary">Hub</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Baixe meus sets e remixes para tocar ou ouvir. 
              <br/>Conecte-se nas plataformas de streaming.
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-12 space-y-6">
            <div className="max-w-md mx-auto relative">
              <label htmlFor="music-search" className="sr-only">Buscar música</label>
              <input
                id="music-search"
                name="music-search"
                type="text"
                placeholder="Buscar música..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-full py-3 px-12 text-white focus:border-primary outline-none transition-all"
              />
              <Filter className="absolute left-4 top-3.5 text-white/40" size={20} />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTag === tag 
                      ? 'bg-primary text-black scale-105' 
                      : 'bg-surface border border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredTracks.map((track) => {
                  const media = track._embedded?.['wp:featuredmedia']?.[0];
                  // OPTIMIZATION: Use medium_large image instead of full size to improve performance
                  const coverUrl = media?.media_details?.sizes?.medium_large?.source_url || media?.source_url;
                  
                  return (
                    <motion.div
                      layout
                      key={track.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-surface/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all hover:bg-surface/60 group"
                    >
                      {/* Capa */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                        {coverUrl ? (
                          <img src={coverUrl} alt={track.title.rendered} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Music2 size={48} className="text-white/20" /></div>
                        )}
                        <div className="absolute top-3 left-3">
                           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${track.category_name === 'Sets' ? 'bg-secondary text-black' : 'bg-primary text-black'}`}>
                              {track.category_name || 'TRACK'}
                           </span>
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1" title={track.title.rendered}>
                          {track.title.rendered}
                        </h3>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-6">
                          {track.tag_names?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/10 rounded text-white/60">#{tag}</span>
                          ))}
                        </div>

                        {/* Botões de Ação */}
                        <div className="space-y-3">
                          {/* Download Principal */}
                          {track.links.download && (
                            <a 
                              href={track.links.download} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-primary w-full flex items-center justify-center gap-2"
                            >
                              <Download size={18} /> Download Grátis
                            </a>
                          )}

                          {/* Links Secundários */}
                          <div className="flex gap-2">
                            {track.links.soundcloud && (
                              <a 
                                href={track.links.soundcloud} target="_blank" rel="noopener noreferrer"
                                className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-2 hover:bg-[#ff5500] hover:border-[#ff5500] hover:text-white"
                                title="Ouvir no SoundCloud"
                              >
                                <Cloud size={16} /> SoundCloud
                              </a>
                            )}
                            {track.links.youtube && (
                              <a 
                                href={track.links.youtube} target="_blank" rel="noopener noreferrer"
                                className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-2 hover:bg-[#ff0000] hover:border-[#ff0000] hover:text-white"
                                title="Ver no YouTube"
                              >
                                <Youtube size={16} /> YouTube
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicPage;