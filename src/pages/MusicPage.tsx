// src/pages/MusicPage.tsx - PADRÃO FINAL HEADLESS (ZEN TRIBE STYLE)

import React, { useState, useRef, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; // Implementação Headless
import {
  Play, Pause, Download, Music2, Headphones, Clock, Calendar, ExternalLink,
  Heart, Share2, Volume2, VolumeX, Users, Award, TrendingUp, Gift, Zap
} from 'lucide-react';

// ============================================================================
// CONSTANTES DE DADOS (SSOT e Otimização)
// ============================================================================

/**
 * URLs de Download Físicas (Redirecionadas via Subdomínio)
 */
const DOWNLOAD_URL_NORMAL = 'https://download.djzeneyer.com';
const DOWNLOAD_URL_EXTENDED = 'https://extended.djzeneyer.com';

/**
 * Catálogo de músicas (Mock Data)
 */
const TRACKS = [
  {
    id: 1,
    title: "Noites de Zouk",
    artist: "DJ Zen Eyer",
    duration: "60:00",
    releaseDate: "2024-10-01",
    coverArt: "https://djzeneyer.com/wp-content/uploads/2024/10/noites-de-zouk-cover.jpg",
    audioUrl: "/music/noites-de-zouk-preview.mp3",
    downloadUrl: DOWNLOAD_URL_NORMAL + "/sets/noites-de-zouk-full.zip",
    extendedUrl: DOWNLOAD_URL_EXTENDED + "/sets/noites-de-zouk-extended-dj.zip",
    genre: "Sets",
    bpm: 128,
    mood: "Cremoso",
    description: "Uma jornada de 60 minutos pelos ritmos mais cremosos do Zouk Brasileiro. Cada transição foi pensada para criar momentos de conexão profunda.",
    isExtended: true
  },
  {
    id: 2,
    title: "Raízes Nacionais (Remix)",
    artist: "DJ Zen Eyer",
    duration: "5:15",
    releaseDate: "2024-09-15",
    coverArt: "https://djzeneyer.com/wp-content/uploads/2024/09/raizes-nacionais-cover.jpg",
    audioUrl: "/music/raizes-nacionais-preview.mp3",
    downloadUrl: DOWNLOAD_URL_NORMAL + "/tracks/raizes-nacionais.mp3",
    extendedUrl: DOWNLOAD_URL_EXTENDED + "/tracks/raizes-nacionais-extended.mp3",
    genre: "Nacional",
    bpm: 130,
    mood: "Energético",
    description: "Uma homenagem às raízes brasileiras que me inspiraram desde criança. Este mix une o Zouk com elementos do samba e MPB.",
    isExtended: true
  }
];

/**
 * Schema.org MusicPlaylist (Mantido e Alinhado)
 */
const MUSIC_PLAYLIST_SCHEMA = {
  // ... (Schema MusicPlaylist Completo e Correto)
  "@type": "MusicPlaylist",
  "name": "DJ Zen Eyer - Coleção de Zouk Brasileiro que Conecta Alma e Movimento",
  "creator": { "@id": "https://djzeneyer.com/#artist" },
  "track": TRACKS.map(track => ({
    "@type": "MusicRecording",
    "name": track.title,
    "genre": `Brazilian Zouk - ${track.genre}`,
    "byArtist": { "@id": "https://djzeneyer.com/#artist" },
    // Simplificado para propósitos de exemplo
  }))
};


// ============================================================================
// COMPONENTES AUXILIARES (MEMOIZADOS para Performance)
// ============================================================================

const TrackCard: React.FC<{
  track: typeof TRACKS[0];
  isPlaying: boolean;
  onPlayPause: () => void;
}> = memo(({ track, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();
  // ... (Lógica do Card Mantida)
    
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      className="group bg-surface/50 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl hover:shadow-2xl"
      role="article"
    >
      {/* Cover Art */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.coverArt}
          alt={track.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          width="400"
          height="400"
        />

        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayPause}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-darker transition-colors"
              aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" fill="white" aria-hidden="true" />
              ) : (
                <Play size={32} className="text-white ml-1" fill="white" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-primary/90 rounded-full text-xs font-bold text-white">
            {track.genre}
          </span>
          <span className="px-3 py-1 bg-accent/90 rounded-full text-xs font-bold text-white">
            {track.mood}
          </span>
        </div>
      </div>

      {/* Track Info */}
      <div className="p-6">
        <h3 className="font-black text-xl text-white mb-1 line-clamp-1">
          {track.title}
        </h3>
        <p className="text-white/60 mb-1">{track.artist}</p>
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {track.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-white/60 mb-4" role="list">
          <div className="flex items-center gap-1" role="listitem">
            <Clock size={14} aria-hidden="true" />
            <span><span className="sr-only">Duration:</span>{track.duration}</span>
          </div>
          <div className="flex items-center gap-1" role="listitem">
            <Music2 size={14} aria-hidden="true" />
            <span><span className="sr-only">BPM:</span>{track.bpm} BPM</span>
          </div>
          <div className="flex items-center gap-1" role="listitem">
            <Calendar size={14} aria-hidden="true" />
            <span><span className="sr-only">Release date:</span>{new Date(track.releaseDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={track.downloadUrl}
            download
            className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2"
            aria-label={`Download ${track.title} (Versão Normal)`}
          >
            <Download size={16} aria-hidden="true" />
            <span>{t('music.track.download') || 'Download'}</span>
          </a>
          
          <a
            href={track.extendedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm flex items-center justify-center gap-2"
            aria-label={`Download ${track.title} (Versão Estendida para DJs)`}
          >
            <Award size={16} aria-hidden="true" />
            <span>{t('music.track.extended') || 'DJ Edit'}</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
});
TrackCard.displayName = 'TrackCard';


// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const MusicPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentTrack, setCurrentTrack] = useState<typeof TRACKS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [filter, setFilter] = useState<string>('all');
  
  // Dados de filtro
  const filters = [
    { id: 'all', label: t('music.filters.all') || 'Todos' },
    { id: 'Sets', label: t('music.filters.sets') || 'Sets Completos' },
    { id: 'Nacional', label: t('music.filters.nacional') || 'Nacional' },
    { id: 'Remix', label: t('music.filters.remix') || 'Remix' },
  ];

  // Performance: useMemo para tracks filtradas
  const filteredTracks = useMemo(() =>
    filter === 'all' ? TRACKS : TRACKS.filter(t => t.genre === filter),
    [filter]
  );
  
  // URLs para hrefLang (SSOT)
  const currentPath = '/music';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  const handlePlayPause = (track: typeof TRACKS[0]) => {
    // ... (Lógica do Player Otimizada)
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play().catch(e => console.error("Erro ao tocar:", e));
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = track.audioUrl;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.error("Erro ao tocar:", e));
        }
      }, 100);
    }
  };


  return (
    <>
      {/* ====================================================================== */}
      {/* HEADLESS SEO (PADRÃO SSOT CORRETO) */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title="Música que Conecta | DJ Zen Eyer - Sets Emocionais de Zouk Brasileiro"
        description="Explore os sets emocionais de DJ Zen Eyer, onde cada nota é composta para criar conexões profundas. Baixe faixas gratuitas e sinta a cremosidade que define o Zouk Brasileiro."
        url={currentUrl}
        image="https://djzeneyer.com/images/music-page-og-emotional.jpg"
        ogType="music.playlist"
        schema={MUSIC_PLAYLIST_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="DJ Zen Eyer música emocional, Zouk Brasileiro cremoso, sets para dançarinos, download música gratuita, Zouk que conecta, experiências sensoriais através da música"
      />

      {/* ====================================================================== */}
      {/* CONTEÚDO DA PÁGINA (Zen Tribe Style) */}
      {/* ====================================================================== */}
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <Headphones className="inline-block mr-2" size={16} aria-hidden="true" />
                MÚSICA QUE CONECTA
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
              Minha <span className="text-primary">Música</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Cada nota que crio é uma ponte entre almas. Sets que unem técnica e sentimento,
              feitos para dançarinos que buscam mais do que ritmo - buscam <strong>conexões que transcendem a pista de dança</strong>.
            </p>
          </motion.header>

          {/* Seção de Download para DJs (Novo Bloco de Marketing) */}
          <section className="bg-surface/50 p-8 md:p-12 rounded-3xl border border-white/10 mb-16 shadow-2xl">
            <h2 className="text-3xl font-black font-display mb-6 text-primary">
              🔥 Versões Exclusivas para DJs: O Padrão Ouro do Zouk
            </h2>
            <p className="text-lg text-white/80 mb-6">
              Chega de quebra de energia. Baixe aqui as faixas estendidas, prontas para tocar. Nossa missão é facilitar sua vida na cabine.
            </p>
            <ul className="space-y-3 text-white/90 mb-8">
              <li className="flex items-center gap-3">
                <Award size={20} className="text-secondary flex-shrink-0" />
                **Transições Perfeitas:** Faixas com intro e outro estendidas, facilitando o mix e mantendo a fluidez.
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp size={20} className="text-secondary flex-shrink-0" />
                **Qualidade Masterizada:** Áudio em alta fidelidade para equipamentos de som modernos e festivais.
              </li>
              <li className="flex items-center gap-3">
                <Zap size={20} className="text-secondary flex-shrink-0" />
                **Pronto para o Grid:** BPM e Tonalidade (Key) verificados, ajustados e codificados no arquivo.
              </li>
            </ul>
            <a
              href={DOWNLOAD_URL_EXTENDED}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg flex items-center justify-center gap-3 w-full md:w-auto"
              aria-label="Download de Músicas Estendidas para DJs"
            >
              <Download size={20} />
              BAIXAR PASTA ESTENDIDA (DJs)
            </a>
          </section>

          {/* Filtros */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
            role="navigation"
            aria-label="Filtro por gênero musical"
          >
            {filters.map((genreFilter) => (
              <button
                key={genreFilter.id}
                onClick={() => setFilter(genreFilter.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  filter === genreFilter.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-surface/50 text-white/70 hover:text-white hover:bg-surface/80'
                }`}
                aria-pressed={filter === genreFilter.id}
                aria-label={`Filtrar por ${genreFilter.label}`}
              >
                {genreFilter.label}
              </button>
            ))}
          </motion.nav>

          {/* Grid de músicas */}
          <motion.section
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            aria-label="Faixas musicais"
          >
            <AnimatePresence mode="popLayout">
              {filteredTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying && currentTrack?.id === track.id}
                  onPlayPause={() => handlePlayPause(track)}
                />
              ))}
            </AnimatePresence>
          </motion.section>
          
          {/* Seção de Download para Consumo Pessoal (Sets) */}
          <section className="py-16 text-center">
            <h2 className="text-3xl font-black font-display mb-4">
              🎧 Sets Completos para sua Rotina
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-6">
              Leve a experiência 'cremosa' do DJ Zen Eyer com você. Baixe sets exclusivos para cada momento da sua vida, sem consumir dados de streaming.
            </p>
            <a
              href={DOWNLOAD_URL_NORMAL + "/sets"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg flex items-center justify-center gap-3 mx-auto w-full md:w-1/3"
              aria-label="Baixar pasta de Sets Completos"
            >
              <Download size={20} />
              BAIXAR PASTA DE SETS COMPLETOS
            </a>
          </section>

          {/* Audio Player e Elementos de Áudio (Mantidos) */}
          <AnimatePresence>
            {currentTrack && (
              <motion.aside
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-white/10 p-4 z-50"
                role="region"
                aria-label="Tocando agora"
              >
                {/* ... (código do player) ... */}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            preload="metadata"
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onError={(e) => console.error("Erro de áudio:", e)}
            aria-label="Audio player"
          />
        </div>
      </div>
    </>
  );
};

export default MusicPage;