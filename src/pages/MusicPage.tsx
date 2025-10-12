// src/pages/MusicPage.tsx - REDESENHADA

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
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
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Zouk Nights",
    artist: "DJ Zen Eyer",
    duration: "4:32",
    releaseDate: "2024-10-01",
    coverArt: "https://placehold.co/400x400/0D96FF/FFFFFF?text=Zouk+Nights&font=orbitron",
    audioUrl: "/music/zouk-nights-preview.mp3",
    downloadUrl: "/music/zouk-nights-full.mp3",
    genre: "Brazilian Zouk",
    bpm: 128,
    streamUrl: "https://soundcloud.com/djzeneyer/zouk-nights"
  },
  {
    id: 2,
    title: "Electric Dreams",
    artist: "DJ Zen Eyer",
    duration: "5:15",
    releaseDate: "2024-09-15",
    coverArt: "https://placehold.co/400x400/9D4EDD/FFFFFF?text=Electric+Dreams&font=orbitron",
    audioUrl: "/music/electric-dreams-preview.mp3",
    downloadUrl: "/music/electric-dreams-full.mp3",
    genre: "Electronic",
    bpm: 132,
    streamUrl: "https://soundcloud.com/djzeneyer/electric-dreams"
  },
  {
    id: 3,
    title: "Sunset Vibes",
    artist: "DJ Zen Eyer",
    duration: "6:20",
    releaseDate: "2024-08-20",
    coverArt: "https://placehold.co/400x400/EC4899/FFFFFF?text=Sunset+Vibes&font=orbitron",
    audioUrl: "/music/sunset-vibes-preview.mp3",
    downloadUrl: "/music/sunset-vibes-full.mp3",
    genre: "Chill House",
    bpm: 120,
    streamUrl: "https://soundcloud.com/djzeneyer/sunset-vibes"
  },
  {
    id: 4,
    title: "Midnight Groove",
    artist: "DJ Zen Eyer",
    duration: "4:45",
    releaseDate: "2024-07-10",
    coverArt: "https://placehold.co/400x400/10B981/FFFFFF?text=Midnight+Groove&font=orbitron",
    audioUrl: "/music/midnight-groove-preview.mp3",
    downloadUrl: "/music/midnight-groove-full.mp3",
    genre: "Deep House",
    bpm: 124
  },
  {
    id: 5,
    title: "Tropical Paradise",
    artist: "DJ Zen Eyer",
    duration: "5:30",
    releaseDate: "2024-06-05",
    coverArt: "https://placehold.co/400x400/F59E0B/FFFFFF?text=Tropical+Paradise&font=orbitron",
    audioUrl: "/music/tropical-paradise-preview.mp3",
    downloadUrl: "/music/tropical-paradise-full.mp3",
    genre: "Tropical House",
    bpm: 115
  },
  {
    id: 6,
    title: "Urban Pulse",
    artist: "DJ Zen Eyer",
    duration: "4:50",
    releaseDate: "2024-05-15",
    coverArt: "https://placehold.co/400x400/EF4444/FFFFFF?text=Urban+Pulse&font=orbitron",
    audioUrl: "/music/urban-pulse-preview.mp3",
    downloadUrl: "/music/urban-pulse-full.mp3",
    genre: "Tech House",
    bpm: 128
  }
];

const TrackCard: React.FC<{
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
}> = ({ track, isPlaying, onPlayPause }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      className="group bg-surface/50 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl hover:shadow-2xl"
    >
      {/* Cover Art */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={track.coverArt} 
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayPause}
              className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-darker transition-colors"
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" fill="white" />
              ) : (
                <Play size={32} className="text-white ml-1" fill="white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Genre Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-bold text-white">
            {track.genre}
          </span>
        </div>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart 
            size={20} 
            className={liked ? 'text-red-500 fill-red-500' : 'text-white'} 
          />
        </motion.button>
      </div>

      {/* Track Info */}
      <div className="p-6">
        <h3 className="font-black text-xl text-white mb-2 line-clamp-1">
          {track.title}
        </h3>
        <p className="text-white/60 mb-4">{track.artist}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{track.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Music2 size={14} />
            <span>{track.bpm} BPM</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(track.releaseDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={track.downloadUrl}
            download
            className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2"
          >
            <Download size={16} />
            <span>Download</span>
          </a>
          
          {track.streamUrl && (
            <a
              href={track.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
            </a>
          )}
          
          <button className="btn btn-outline btn-sm flex items-center justify-center">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MusicPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const audioRef = useRef<HTMLAudioElement>(null);

  const genres = ['all', ...Array.from(new Set(tracks.map(t => t.genre)))];

  const filteredTracks = filter === 'all' 
    ? tracks 
    : tracks.filter(t => t.genre === filter);

  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <Helmet>
        <title>Music | DJ Zen Eyer - Brazilian Zouk & Electronic Music</title>
        <meta name="description" content="Listen and download exclusive tracks, remixes, and sets by DJ Zen Eyer. Brazilian Zouk, Electronic, and House music." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <Headphones className="inline-block mr-2" size={16} />
                Original Productions & Remixes
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
              My <span className="text-primary">Music</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore my latest tracks, exclusive remixes, and downloadable content.
              <br />
              <span className="text-primary font-semibold">Free downloads for the Zen Tribe!</span>
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setFilter(genre)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  filter === genre
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-surface/50 text-white/70 hover:text-white hover:bg-surface/80'
                }`}
              >
                {genre === 'all' ? 'All Tracks' : genre}
              </button>
            ))}
          </motion.div>

          {/* Tracks Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
          </motion.div>

          {/* Current Track Player (Fixed Bottom) */}
          <AnimatePresence>
            {currentTrack && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-white/10 p-4 z-50"
              >
                <div className="container mx-auto flex items-center gap-4">
                  <img 
                    src={currentTrack.coverArt} 
                    alt={currentTrack.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{currentTrack.title}</h4>
                    <p className="text-sm text-white/60 truncate">{currentTrack.artist}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlayPause(currentTrack)}
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-darker transition-colors"
                    >
                      {isPlaying ? (
                        <Pause size={20} className="text-white" fill="white" />
                      ) : (
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX size={20} className="text-white/70" />
                      ) : (
                        <Volume2 size={20} className="text-white/70" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentTrack?.audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        </div>
      </div>
    </>
  );
};

export default MusicPage;
