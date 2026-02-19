// src/pages/MusicPage.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Music2, Filter, Youtube, Cloud, Play, ArrowLeft } from 'lucide-react';
import { useTracksQuery, useTrackBySlug } from '../hooks/useQueries';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage } from '../config/routes';

const MusicPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { i18n } = useTranslation();

  // Optimization: Conditionally fetch data
  // If slug is present, fetch only the single track (heavy details)
  // If slug is absent, fetch the list (lightweight)
  const { data: singleTrack, isLoading: singleLoading } = useTrackBySlug(slug);
  const { data: listTracks = [], isLoading: listLoading, error } = useTracksQuery({ enabled: !slug });

  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // --- RENDERIZAÇÃO DA LISTA (Original logic maintained with i18n links) ---
  // MOVED UP to satisfy React Hook rules (must be called unconditionally)
  const tags = useMemo(() => ['Todos', ...new Set(listTracks.flatMap((t: MusicTrack) => t.tag_names || []))], [listTracks]);

  const filteredTracks = useMemo(() => listTracks.filter((track: MusicTrack) => {
    const matchesTag = activeTag === 'Todos' || track.tag_names?.includes(activeTag);
    const matchesSearch = track.title.rendered.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  }), [listTracks, activeTag, searchQuery]);

  // Helper para rotas localizadas
  const getRouteForKey = (key: string): string => {
    const route = ROUTES_CONFIG.find(r => getLocalizedPaths(r, 'en')[0] === key);
    if (!route) return `/${key}`;
    const normalizedLanguage = normalizeLanguage(i18n.language);
    return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
  };

  if (error) {
    console.error('Error fetching tracks:', error);
  }

  // --- RENDERIZAÇÃO DE FAIXA ÚNICA (DETALHE) ---
  if (!singleLoading && slug && singleTrack) {
    return (
      <>
        <HeadlessSEO
          title={`${singleTrack.title?.rendered || 'Music'} | Zen Music`}
          description={singleTrack.excerpt?.rendered || "Ouça as últimas produções de DJ Zen Eyer."}
          url={`https://djzeneyer.com/music/${slug}`}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={getRouteForKey('music')} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold">
              <ArrowLeft size={20} /> VOLTAR PARA MÚSICAS
            </Link>

            <div className="bg-surface/30 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Music2 size={200} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                  <img
                    src={singleTrack.featured_image_src_full || singleTrack.featured_image_src || '/images/hero-background.webp'}
                    className="w-full h-full object-cover"
                    alt={singleTrack.title?.rendered}
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl md:text-6xl font-black font-display mb-4" dangerouslySetInnerHTML={{ __html: singleTrack.title?.rendered }} />
                  <p className="text-primary font-bold mb-8 tracking-widest uppercase">DJ Zen Eyer Original</p>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <button type="button" className="btn btn-primary px-10 py-4 rounded-full flex items-center gap-3 text-lg font-bold">
                      <Play fill="currentColor" size={20} /> OUVIR AGORA
                    </button>
                    {singleTrack.links?.soundcloud && (
                      <a href={singleTrack.links.soundcloud} target="_blank" rel="noopener" className="btn btn-outline px-8 py-4 rounded-full flex items-center gap-2">
                        <Cloud size={20} /> SOUNDCLOUD
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-16 border-t border-white/5 pt-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Filter size={18} className="text-primary" /> SOBRE A FAIXA</h2>
                <div
                  className="prose prose-invert max-w-none text-white/60"
                  dangerouslySetInnerHTML={{ __html: singleTrack.content?.rendered || singleTrack.excerpt?.rendered || "" }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeadlessSEO 
        title="Zen Music | High-Energy Zouk Remixes"
        description="Explore as produções musicais, remixes e sets originais de DJ Zen Eyer."
        url="https://djzeneyer.com/music"
      />
      <div className="min-h-screen bg-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mb-16">
            <h1 className="text-5xl md:text-8xl font-black font-display tracking-tighter mb-6">
              ZEN <span className="text-primary italic">SOUNDS</span>
            </h1>
            <p className="text-xl text-white/60">Remixes oficiais e produções originais para a pista.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                    activeTag === tag ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 hover:border-primary/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                placeholder="Buscar música..." 
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {listLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-white/5 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTracks.map((track: MusicTrack) => (
                <motion.div
                  key={track.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-surface/30 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all group"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={track.featured_image_src || '/images/hero-background.webp'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={track.title.rendered}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Link 
                        to={`${getRouteForKey('music')}/${track.slug}`}
                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform"
                      >
                        <Play fill="currentColor" size={20} />
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display mb-2 truncate" dangerouslySetInnerHTML={{ __html: track.title.rendered }} />
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-white/40 font-mono">ZEN EYER REMIX</span>
                      <div className="flex gap-3">
                        <Youtube size={18} className="text-white/20 hover:text-primary cursor-pointer" />
                        <Cloud size={18} className="text-white/20 hover:text-primary cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicPage;
