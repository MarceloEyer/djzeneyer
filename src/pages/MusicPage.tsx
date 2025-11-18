// src/pages/MusicPage.tsx
// ============================================================================
// MUSIC PAGE - VERSÃO REFATORADA (HEADLESS SEO)
// ============================================================================
// OTIMIZAÇÕES:
// ✅ HeadlessSEO implementado com hrefLang SSOT
// ✅ Constantes movidas para fora do componente
// ✅ TrackCard memoizado
// ✅ Schema MusicPlaylist otimizado
// ✅ Pré-carregamento de áudio otimizado
// ============================================================================

import React, { useState, useRef, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import {
  Play,
  Pause,
  Download,
  Music2,
  Headphones,
  Clock,
  Calendar,
  ExternalLink,
  Heart,
  Share2,
  Volume2,
  VolumeX
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================
interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  releaseDate: string;
  coverArt: string;
  audioUrl: string;
  downloadUrl: string;
  genre: string;
  bpm: number;
  streamUrl?: string;
  description: string;
  mood: string;
  lyrics?: string;
  recordLabel: string;
  isrcCode?: string;
}

// ============================================================================
// CONSTANTES DE DADOS (FORA DO COMPONENTE)
// ============================================================================

/**
 * Catálogo de músicas (Mock Data)
 */
const TRACKS: Track[] = [
  {
    id: 1,
    title: "Noites de Zouk",
    artist: "DJ Zen Eyer",
    duration: "60:00",
    releaseDate: "2024-10-01",
    coverArt: "https://djzeneyer.com/wp-content/uploads/2024/10/noites-de-zouk-cover.jpg",
    audioUrl: "/music/noites-de-zouk-preview.mp3",
    downloadUrl: "/music/noites-de-zouk-full.mp3",
    genre: "Sets",
    bpm: 128,
    streamUrl: "https://soundcloud.com/djzeneyer/noites-de-zouk",
    description: "Uma jornada de 60 minutos pelos ritmos mais cremosos do Zouk Brasileiro. Cada transição foi pensada para criar momentos de conexão profunda entre os dançarinos, como se a música abraçasse cada casal na pista.",
    mood: "Cremoso",
    lyrics: "Instrumental - Cada nota foi composta para evocar emoções de nostalgia e conexão, como um abraço musical que une corpos e almas.",
    recordLabel: "Zen Eyer Productions",
    isrcCode: "BRZEN2400001"
  },
  {
    id: 2,
    title: "Raízes Nacionais",
    artist: "DJ Zen Eyer",
    duration: "5:15",
    releaseDate: "2024-09-15",
    coverArt: "https://djzeneyer.com/wp-content/uploads/2024/09/raizes-nacionais-cover.jpg",
    audioUrl: "/music/raizes-nacionais-preview.mp3",
    downloadUrl: "/music/raizes-nacionais-full.mp3",
    genre: "Nacional",
    bpm: 128,
    streamUrl: "https://soundcloud.com/djzeneyer/raizes-nacionais",
    description: "Uma homenagem às raízes brasileiras que me inspiraram desde criança. Este mix une o Zouk com elementos do samba e MPB, criando um som que celebra nossa cultura e faz qualquer brasileiro se sentir em casa, não importa onde esteja.",
    mood: "Energético",
    lyrics: "Instrumental - Com samples vocais que remetem aos carnavais brasileiros, trazendo a alegria contagiante das ruas do Rio para as pistas de dança do mundo todo.",
    recordLabel: "Zen Eyer Productions",
    isrcCode: "BRZEN2400002"
  }
];

/**
 * Schema.org MusicPlaylist
 */
const MUSIC_PLAYLIST_SCHEMA = {
  "@type": "MusicPlaylist",
  "@id": "https://djzeneyer.com/music#playlist",
  "name": "DJ Zen Eyer - Coleção de Zouk Brasileiro que Conecta Alma e Movimento",
  "description": "Sets e remixes exclusivos de DJ Zen Eyer, bicampeão mundial de Zouk Brasileiro. Cada faixa é uma jornada emocional projetada para criar conexões profundas entre os dançarinos.",
  "numTracks": TRACKS.length,
  "creator": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "track": TRACKS.map(track => ({
    "@type": "MusicRecording",
    "@id": `https://djzeneyer.com/music#track-${track.id}`,
    "name": track.title,
    "description": track.description,
    "duration": `PT${track.duration.replace(':', 'M')}S`,
    "datePublished": track.releaseDate,
    "genre": `Brazilian Zouk - ${track.genre}`,
    "inAlbum": {
      "@type": "MusicAlbum",
      "name": "DJ Zen Eyer - Brazilian Zouk Collection",
      "byArtist": {
        "@id": "https://djzeneyer.com/#artist"
      }
    },
    "byArtist": {
      "@id": "https://djzeneyer.com/#artist"
    },
    "recordingOf": {
      "@type": "MusicComposition",
      "name": track.title,
      "composer": {
        "@id": "https://djzeneyer.com/#artist"
      }
    },
    "audio": {
      "@type": "AudioObject",
      "contentUrl": `https://djzeneyer.com${track.audioUrl}`,
      "encodingFormat": "audio/mpeg",
      "duration": `PT${track.duration.replace(':', 'M')}S`
    },
    "image": {
      "@type": "ImageObject",
      "url": track.coverArt,
      "width": 400,
      "height": 400
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "url": `https://djzeneyer.com${track.downloadUrl}`
    },
    "recordLabel": track.recordLabel,
    "isrcCode": track.isrcCode,
    "sameAs": track.streamUrl ? [track.streamUrl] : []
  }))
};

// ============================================================================
// COMPONENTE TRACKCARD (MEMOIZADO)
// ============================================================================
const TrackCard: React.FC<{
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
}> = memo(({ track, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);

  // Pré-carregamento estratégico do áudio
  useEffect(() => {
    const audio = new Audio();
    audio.src = track.audioUrl;
    audio.preload = "metadata";
  }, [track.audioUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Ouça "${track.title}" por DJ Zen Eyer - ${track.mood}`,
          url: track.streamUrl || window.location.href
        });
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      navigator.clipboard.writeText(track.streamUrl || window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      className="group bg-surface/50 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl hover:shadow-2xl"
      role="article"
      aria-label={`${track.title} por ${track.artist} - ${track.mood}`}
    >
      {/* Cover Art */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.coverArt}
          alt={`${track.title} - ${track.mood}`}
          loading="lazy"
          decoding="async"
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
          <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-bold text-white">
            {track.genre}
          </span>
          <span className="px-3 py-1 bg-accent/90 backdrop-blur-sm rounded-full text-xs font-bold text-white">
            {track.mood}
          </span>
        </div>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
          aria-label={liked ? `Unlike ${track.title}` : `Like ${track.title}`}
          aria-pressed={liked}
        >
          <Heart
            size={20}
            className={liked ? 'text-red-500 fill-red-500' : 'text-white'}
          />
        </motion.button>
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
            aria-label={`Download ${track.title}`}
          >
            <Download size={16} aria-hidden="true" />
            <span>{t('music.track.download') || 'Download'}</span>
          </a>

          {track.streamUrl && (
            <a
              href={track.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm flex items-center justify-center gap-2"
              aria-label={`Ouça ${track.title} no SoundCloud`}
            >
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}

          <button
            className="btn btn-outline btn-sm flex items-center justify-center"
            onClick={handleShare}
            aria-label={`Compartilhar ${track.title}`}
          >
            <Share2 size={16} aria-hidden="true" />
          </button>
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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filtros disponíveis
  const filters = [
    { id: 'all', label: t('music.filters.all') || 'Todos' },
    { id: 'Sets', label: t('music.filters.sets') || 'Sets Completos' },
    { id: 'Nacional', label: t('music.filters.nacional') || 'Nacional' },
    { id: 'Cremoso', label: t('music.filters.cremoso') || 'Cremoso' },
    { id: 'Black', label: t('music.filters.black') || 'Black' },
    { id: 'Tradicional', label: t('music.filters.tradicional') || 'Tradicional' }
  ];

  // Performance: useMemo
  const filteredTracks = useMemo(() =>
    filter === 'all' ? TRACKS : TRACKS.filter(t => t.genre === filter),
    [filter]
  );

  // Controle de áudio otimizado
  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(e => console.error("Erro ao tocar:", e));
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = track.audioUrl;
          audioRef.current.currentTime = 0;
          audioRef.current.volume = volume;
          audioRef.current.play().catch(e => console.error("Erro ao tocar:", e));
        }
      }, 100);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // URLs para hrefLang (SSOT)
  const currentPath = '/music';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

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
      {/* CONTEÚDO DA PÁGINA */}
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

          {/* Player fixo */}
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
                <div className="container mx-auto flex items-center gap-4">
                  <img
                    src={currentTrack.coverArt}
                    alt={`${currentTrack.title} - ${currentTrack.mood}`}
                    className="w-16 h-16 rounded-lg object-cover"
                    width={64}
                    height={64}
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white truncate text-base">
                      {currentTrack.title}
                    </h2>
                    <p className="text-sm text-white/60 truncate">
                      {currentTrack.artist} • {currentTrack.mood}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlayPause(currentTrack)}
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-darker transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause size={20} className="text-white" fill="white" aria-hidden="true" />
                      ) : (
                        <Play size={20} className="text-white ml-0.5" fill="white" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                    >
                      {isMuted ? (
                        <VolumeX size={20} className="text-white/70" aria-hidden="true" />
                      ) : (
                        <Volume2 size={20} className="text-white/70" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
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