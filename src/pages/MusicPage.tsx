// src/pages/MusicPage.tsx
// ============================================================================
// MUSIC LIBRARY - A EXPERIÊNCIA "SPOTIFY" DO ZEN EYER
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { 
  Download, Play, Pause, Search, Filter, Music2, Tag, Heart, Headphones 
} from 'lucide-react';

// ============================================================================
// TIPOS DE DADOS
// ============================================================================
interface MusicTrack {
  id: number;
  title: { rendered: string };
  audio_url: string; // Link do MP3 (Campo Personalizado)
  category_name: string; // Set ou Remix
  tag_names: string[]; // Tags: Kizomba, BR, Flow
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

// ============================================================================
// COMPONENTE: PLAYER DE ÁUDIO FIXO (RODAPÉ)
// ============================================================================
const StickyPlayer: React.FC<{ 
  track: MusicTrack | null; 
  isPlaying: boolean; 
  onToggle: () => void; 
}> = ({ track, isPlaying, onToggle }) => {
  if (!track) return null;

  return (
    <motion.div 
      initial={{ y: 100 }} 
      animate={{ y: 0 }} 
      className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 p-4 backdrop-blur-lg z-50 shadow-2xl"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Capa Miniatura */}
          <img 
            src={track._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/100x100/333/FFF?text=Music'} 
            alt={track.title.rendered}
            className="w-12 h-12 rounded-md object-cover border border-white/10"
          />
          <div className="hidden md:block">
            <h4 className="text-white font-bold text-sm">{track.title.rendered}</h4>
            <span className="text-white/50 text-xs">{track.category_name}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggle}
            className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* Botão Download */}
        <a 
          href={track.audio_url} 
          download 
          target="_blank"
          className="btn btn-outline btn-sm hidden md:flex items-center gap-2"
        >
          <Download size={16} /> Baixar
        </a>
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const MusicPage: React.FC = () => {
  const { t } = useTranslation();
  const currentPath = '/music';
  
  // Estados
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Busca Músicas do WordPress
  useEffect(() => {
    fetch('https://djzeneyer.com/wp-json/wp/v2/remixes?_embed&per_page=50')
      .then(res => res.json())
      .then(data => {
        setTracks(data);
        setFilteredTracks(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro ao carregar músicas:", err));
  }, []);

  // 2. Extrai Tags Únicas para o Filtro
  const allTags = ['Todos', ...Array.from(new Set(tracks.flatMap(t => t.tag_names || [])))];

  // 3. Filtragem
  const filterByTag = (tag: string) => {
    setActiveTag(tag);
    if (tag === 'Todos') {
      setFilteredTracks(tracks);
    } else {
      setFilteredTracks(tracks.filter(t => t.tag_names?.includes(tag)));
    }
  };

  // 4. Controle do Player
  const playTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id) {
      // Toggle Play/Pause
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      // Nova Música
      setCurrentTrack(track);
      setIsPlaying(true);
      // Pequeno delay para garantir que o elemento de áudio atualizou a src
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  return (
    <>
      <HeadlessSEO 
        title="Biblioteca de Músicas | DJ Zen Eyer" 
        description="Baixe remixes exclusivos, sets e versões estendidas de Zouk Brasileiro."
        url={`https://djzeneyer.com${currentPath}`}
        image="https://djzeneyer.com/images/music-og.jpg"
      />

      {/* Elemento de Áudio Invisível */}
      <audio 
        ref={audioRef} 
        src={currentTrack?.audio_url} 
        onEnded={() => setIsPlaying(false)} 
      />

      <div className="min-h-screen pt-24 pb-32 bg-background">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black font-display mb-4">
              Biblioteca <span className="text-primary">Musical</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Sets mixados, remixes exclusivos e edits para DJs. Filtre pelo estilo que você procura e baixe gratuitamente.
            </p>
          </div>

          {/* Filtros (Tags) */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => filterByTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTag === tag 
                    ? 'bg-primary text-black scale-105' 
                    : 'bg-surface border border-white/10 text-white/70 hover:border-primary/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Grid de Músicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTracks.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-surface/40 border border-white/5 hover:border-primary/30 rounded-xl p-4 transition-all hover:bg-surface/60"
                >
                  <div className="flex items-start gap-4">
                    {/* Capa com Botão Play Overlay */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                      <img 
                        src={track._embedded?.['wp:featuredmedia']?.[0]?.source_url} 
                        alt={track.title.rendered}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <button 
                        onClick={() => playTrack(track)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors group-hover:scale-110 duration-300"
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause size={32} className="text-white drop-shadow-lg" fill="currentColor" />
                        ) : (
                          <Play size={32} className="text-white drop-shadow-lg" fill="currentColor" />
                        )}
                      </button>
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {track.category_name || 'Música'}
                        </span>
                        {/* Ícone de Tipo (Set vs Track) */}
                        {track.category_name === 'Sets' ? <Clock size={14} className="text-white/40" /> : <Music2 size={14} className="text-white/40" />}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white truncate mb-1" title={track.title.rendered}>
                        {track.title.rendered}
                      </h3>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {track.tag_names?.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-white/50">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Botão Download */}
                      <a 
                        href={track.audio_url} 
                        download
                        target="_blank"
                        className="btn btn-outline btn-xs w-full flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all"
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Estado Vazio */}
          {!loading && filteredTracks.length === 0 && (
            <div className="text-center py-20">
              <Music2 size={48} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/50">Nenhuma música encontrada com essa tag.</p>
              <button onClick={() => filterByTag('Todos')} className="text-primary mt-2 hover:underline">
                Limpar filtros
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Player Fixo */}
      <StickyPlayer 
        track={currentTrack} 
        isPlaying={isPlaying} 
        onToggle={() => currentTrack && playTrack(currentTrack)} 
      />
    </>
  );
};

export default MusicPage;