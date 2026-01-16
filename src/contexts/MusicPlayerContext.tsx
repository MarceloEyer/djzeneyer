import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import YouTube from 'react-youtube';

// Types
type Track = {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork: string;
  youtubeId: string;
};

type MusicPlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  queue: Track[];
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  playerRef: React.RefObject<YouTube>;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// Sample tracks data with YouTube IDs
const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Crazy Afro Zouk Remix',
    artist: 'Zen Eyer',
    duration: 3600,
    artwork: `https://img.youtube.com/vi/0f5MvgMnprY/hqdefault.jpg`,
    youtubeId: '0f5MvgMnprY',
  },
  {
    id: '2',
    title: 'Birds & Bleeding',
    artist: 'Zen Eyer & Kakah',
    duration: 3000,
    artwork: `https://img.youtube.com/vi/E0IRL1vewhs/hqdefault.jpg`,
    youtubeId: 'E0IRL1vewhs',
  },
  {
    id: '3',
    title: 'Zouk Unity Mix',
    artist: 'DJ Zen Eyer',
    duration: 2700,
    artwork: `https://img.youtube.com/vi/fIoQI4Ko-ak/hqdefault.jpg`,
    youtubeId: 'fIoQI4Ko-ak',
  },
];

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<Track[]>(sampleTracks);
  const playerRef = useRef<YouTube>(null);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const pauseTrack = () => {
    if (playerRef.current?.internalPlayer) {
      playerRef.current.internalPlayer.pauseVideo();
    }
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (playerRef.current?.internalPlayer) {
      playerRef.current.internalPlayer.playVideo();
    }
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  };

  const addToQueue = (track: Track) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(prevQueue => prevQueue.filter(track => track.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (playerRef.current?.internalPlayer) {
      playerRef.current.internalPlayer.setVolume(newVolume * 100);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        setVolume: handleVolumeChange,
        setProgress,
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playerRef,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};